import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';
import { root, walk } from './lib/files.mjs';
import { assert } from './lib/atlas.mjs';
const target = JSON.parse(
    fs.readFileSync(path.join(root, 'config/target.json'), 'utf8'),
  ),
  base = process.env.SITE_BASE || target.base;
const routes = [
  '',
  'blog',
  'publications',
  'projects',
  'projects/atlas',
  'projects/recherche',
  'repositories',
  'cv',
  'teaching',
  'people',
  'books',
  'news',
  'atlas',
  'credits',
];
for (const route of routes)
  assert(
    fs.existsSync(path.join(root, 'dist', route, 'index.html')),
    `Route absente : ${route}`,
  );
assert(
  !fs.existsSync(path.join(root, 'dist/style-guide/index.html')),
  'Style guide présent dans la sortie publique',
);
assert(
  !fs.existsSync(path.join(root, 'dist/review/index.html')),
  'Review studio présent dans la sortie publique',
);
for (const file of walk(path.join(root, 'dist')).filter((p) =>
  p.endsWith('.html'),
)) {
  const doc = parse(fs.readFileSync(file, 'utf8'));
  function visit(n) {
    for (const a of n.attrs || []) {
      if (
        !['href', 'src'].includes(a.name) ||
        !a.value.startsWith('/') ||
        a.value.startsWith('//')
      )
        continue;
      const url = new URL(a.value, 'https://local.invalid');
      assert(
        url.pathname.startsWith(base),
        'Lien incompatible avec base : ' + url.pathname,
      );
      const local = path.join(
        root,
        'dist',
        decodeURIComponent(url.pathname.slice(base.length)),
      );
      assert(local.startsWith(path.join(root, 'dist')), 'Lien hors build');
      assert(fs.existsSync(local), 'Lien local absent : ' + url.pathname);
    }
    for (const child of n.childNodes || []) visit(child);
  }
  visit(doc);
}
console.log(`Routes et liens internes vérifiés (base ${base}).`);
