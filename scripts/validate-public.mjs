import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { validatePublic, assert } from './lib/atlas.mjs';
import { root, walk, candidateFiles } from './lib/files.mjs';
export function scanFiles(files) {
  for (const file of files) {
    const rel = path.relative(root, file);
    assert(
      !/\.(?:map|zip|pdf|docx|xlsx|sqlite|pem|key|env)$/i.test(file),
      'Format public non audité : ' + rel,
    );
    const bytes = fs.readFileSync(file);
    const text = bytes.toString('utf8');
    assert(
      !/(?:AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(
        text,
      ),
      'Secret potentiel : ' + rel,
    );
    assert(
      !/(?:^|[\s\"\'(])(?:\/workspace\/[\w-]+\/|\/Users\/[\w-]+\/|\/home\/[\w-]+\/)/.test(
        text,
      ),
      'Chemin privé potentiel : ' + rel,
    );
    if (process.env.PUBLIC_FORBIDDEN_FILE) {
      const phrases = JSON.parse(
        fs.readFileSync(process.env.PUBLIC_FORBIDDEN_FILE, 'utf8'),
      );
      assert(Array.isArray(phrases), 'Liste de sentinelles invalide');
      for (const phrase of phrases)
        assert(
          typeof phrase === 'string' &&
            phrase.length > 0 &&
            !text.includes(phrase),
          'Texte interdit détecté : ' + rel,
        );
    }
  }
}
export function validate() {
  const data = JSON.parse(
    fs.readFileSync(path.join(root, 'generated/public/atlas.json'), 'utf8'),
  );
  validatePublic(data);
  scanFiles([...candidateFiles(), ...walk(path.join(root, 'dist'))]);
  console.log(
    'Schéma public et scan des fichiers : OK. Le scan ne remplace pas la revue humaine.',
  );
  return data;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  try {
    validate();
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
