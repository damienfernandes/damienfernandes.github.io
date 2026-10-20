import fs from 'node:fs';
import path from 'node:path';
import { readSource, sha256 } from './lib/atlas.mjs';
import { outside, externalDir, writeJSON } from './lib/files.mjs';
try {
  const source = fs.readFileSync(
    outside(process.env.ATLAS_SOURCE || ''),
    'utf8',
  );
  const data = readSource(source);
  const dir = externalDir(process.env.ATLAS_REVIEW_DIR);
  const file = path.join(dir, 'public-policy.json');
  if (fs.existsSync(file))
    throw new Error('Un manifeste existe déjà : ne sera pas écrasé');
  writeJSON(file, {
    schemaVersion: 1,
    adapter: 'atlas-legacy-v10',
    sourceSha256: sha256(source),
    defaultVisibility: 'private',
    records: [],
    assets: [],
  });
  writeJSON(path.join(dir, 'candidates-private.json'), data);
  console.log(
    'Manifeste vide créé hors dépôt. Examinez les candidats et autorisez explicitement objets ET champs.',
  );
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
