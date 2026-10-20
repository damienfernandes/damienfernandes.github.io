import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, assert } from './atlas.mjs';
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
export function outside(p) {
  const abs = fs.realpathSync(p);
  assert(
    abs !== root && !abs.startsWith(root + path.sep),
    'Les sources privées et rapports doivent rester hors du projet',
  );
  return abs;
}
export function externalDir(p) {
  assert(p, 'ATLAS_REVIEW_DIR est requis');
  const abs = path.resolve(p);
  assert(
    abs !== root && !abs.startsWith(root + path.sep),
    'Le dossier de revue doit être externe',
  );
  fs.mkdirSync(abs, { recursive: true, mode: 0o700 });
  return outside(abs);
}
export function writeJSON(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}
export function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => {
      const p = path.join(dir, e.name);
      assert(!e.isSymbolicLink(), 'Lien symbolique interdit dans le lot');
      return e.isDirectory() ? walk(p) : [p];
    });
}
export const allowedRoots = [
  'src',
  'public',
  'generated',
  'scripts',
  'config',
  'tests',
  'docs',
  '.github',
];
export const allowedFiles = [
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'tsconfig.json',
  '.nvmrc',
  '.gitignore',
  '.env.example',
  'README.md',
  'LICENSE',
  'THIRD_PARTY.md',
  '.prettierrc.json',
  '.prettierignore',
];
export function candidateFiles() {
  const known = new Set([
    ...allowedRoots,
    ...allowedFiles,
    'node_modules',
    'dist',
    '.astro',
    '.git',
  ]);
  for (const entry of fs.readdirSync(root)) {
    assert(known.has(entry), `Fichier racine non prévu : ${entry}`);
  }
  return [
    ...allowedFiles
      .filter((f) => fs.existsSync(path.join(root, f)))
      .map((f) => path.join(root, f)),
    ...allowedRoots.flatMap((d) => walk(path.join(root, d))),
  ].sort();
}
export function inventory(files) {
  return files.map((p) => ({
    file: path.relative(root, p).split(path.sep).join('/'),
    sha256: sha256(fs.readFileSync(p)),
  }));
}
export function fingerprint(list) {
  return sha256(JSON.stringify(list));
}
export function sourceBindings() {
  const paths = [process.env.ATLAS_SOURCE, process.env.ATLAS_POLICY];
  assert(paths.every(Boolean), 'ATLAS_SOURCE et ATLAS_POLICY sont requis');
  return paths.map((p) => sha256(fs.readFileSync(outside(p))));
}
