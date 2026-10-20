import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { project, sha256, assert } from './lib/atlas.mjs';
import { root, outside, externalDir, writeJSON } from './lib/files.mjs';
// PNG only: ancillary chunks (text, EXIF, timestamps, profiles) are removed.
export function cleanPNG(buf) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert(
    buf.subarray(0, 8).equals(signature),
    'Seuls les PNG sont pris en charge',
  );
  let at = 8;
  const chunks = [signature];
  let end = false;
  while (at < buf.length) {
    assert(at + 12 <= buf.length, 'PNG tronqué');
    const size = buf.readUInt32BE(at),
      type = buf.toString('ascii', at + 4, at + 8);
    assert(at + 12 + size <= buf.length, 'Chunk PNG invalide');
    if (['IHDR', 'PLTE', 'IDAT', 'IEND', 'tRNS'].includes(type))
      chunks.push(buf.subarray(at, at + 12 + size));
    at += 12 + size;
    if (type === 'IEND') {
      end = true;
      break;
    }
  }
  assert(end, 'PNG sans fin');
  return Buffer.concat(chunks);
}
export async function extract() {
  const source = outside(process.env.ATLAS_SOURCE || ''),
    policyPath = outside(process.env.ATLAS_POLICY || '');
  const review = externalDir(process.env.ATLAS_REVIEW_DIR);
  const html = fs.readFileSync(source, 'utf8'),
    policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  const { data, report } = project(html, policy);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-public-'));
  try {
    writeJSON(path.join(temp, 'atlas.json'), data);
    fs.mkdirSync(path.join(temp, 'assets'));
    for (const asset of policy.assets) {
      assert(
        Object.keys(asset).every((k) =>
          ['source', 'name', 'sha256', 'metadataReviewed'].includes(k),
        ),
        'Champ asset inconnu',
      );
      assert(
        asset.metadataReviewed === true &&
          /^[a-z0-9][a-z0-9_-]*\.png$/.test(asset.name),
        'Asset non approuvé ou nom invalide',
      );
      assert(
        !path.isAbsolute(asset.source) &&
          !asset.source.split(/[\\/]/).includes('..'),
        'Traversée asset interdite',
      );
      const assetRoot = outside(process.env.ATLAS_ASSET_ROOT || '');
      const file = fs.realpathSync(path.join(assetRoot, asset.source));
      assert(file.startsWith(assetRoot + path.sep), 'Asset hors racine');
      let cursor = assetRoot;
      for (const part of asset.source.split(/[\\/]/)) {
        cursor = path.join(cursor, part);
        assert(
          !fs.lstatSync(cursor).isSymbolicLink(),
          'Lien symbolique asset interdit',
        );
      }
      const bytes = fs.readFileSync(file);
      assert(sha256(bytes) === asset.sha256, 'Empreinte asset divergente');
      const output = path.join(temp, 'assets', asset.name);
      assert(!fs.existsSync(output), 'Nom asset dupliqué');
      fs.writeFileSync(output, cleanPNG(bytes));
    }
    const previousFile = path.join(root, 'generated/public/atlas.json');
    const previous = fs.existsSync(previousFile)
      ? JSON.parse(fs.readFileSync(previousFile, 'utf8'))
      : null;
    writeJSON(path.join(review, 'extraction-report.json'), {
      ...report,
      sourceSha256: sha256(html),
      previousPublic: previous,
      nextPublic: data,
      assets: policy.assets.map((a) => a.name),
    });
    fs.mkdirSync(path.dirname(previousFile), { recursive: true });
    fs.copyFileSync(path.join(temp, 'atlas.json'), previousFile);
    const assets = path.join(root, 'public/atlas-assets');
    fs.rmSync(assets, { recursive: true, force: true });
    fs.cpSync(path.join(temp, 'assets'), assets, { recursive: true });
    console.log(
      'Projection publique produite. Rapport conservé dans le dossier de revue externe.',
    );
    return data;
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  extract().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
