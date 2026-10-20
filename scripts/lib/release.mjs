import fs from 'node:fs';
import path from 'node:path';
import { assert, sha256 } from './atlas.mjs';
import {
  candidateFiles,
  inventory,
  fingerprint,
  sourceBindings,
  walk,
  root,
} from './files.mjs';
export function validateTarget(t) {
  assert(t.owner === 'damienfernandes', 'Compte cible inattendu');
  assert(
    /^[A-Za-z0-9_.-]+$/.test(t.repo) && t.visibility === 'public',
    'Cible invalide',
  );
  assert(t.site === 'https://damienfernandes.github.io', 'Site cible invalide');
  const expected = t.repo === 'damienfernandes.github.io' ? '/' : `/${t.repo}/`;
  assert(t.base === expected, 'Le base ne correspond pas au dépôt');
  return t;
}
export function currentDigest() {
  return fingerprint(inventory(candidateFiles()));
}
export function snapshotDigest(dir) {
  return fingerprint(
    walk(dir)
      .map((p) => ({
        file: path.relative(dir, p).split(path.sep).join('/'),
        sha256: sha256(fs.readFileSync(p)),
      }))
      .sort((a, b) => a.file.localeCompare(b.file)),
  );
}
export function verifyPrepared(receipt, snapshot) {
  assert(receipt.version === 1, 'Reçu de préparation invalide');
  assert(
    receipt.sourceDigest === currentDigest(),
    'Le code a changé : relancer --prepare',
  );
  assert(
    JSON.stringify(receipt.bindings) === JSON.stringify(sourceBindings()),
    'La source ou la politique a changé',
  );
  assert(
    receipt.snapshotDigest === snapshotDigest(snapshot),
    'Le lot préparé a changé',
  );
  assert(
    JSON.stringify(receipt.target) ===
      JSON.stringify(
        validateTarget(
          JSON.parse(
            fs.readFileSync(path.join(root, 'config/target.json'), 'utf8'),
          ),
        ),
      ),
    'La cible a changé',
  );
  assert(
    !process.env.SITE_BASE || process.env.SITE_BASE === receipt.target.base,
    'SITE_BASE divergent',
  );
  return true;
}
