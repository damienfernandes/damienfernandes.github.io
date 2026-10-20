import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  project,
  sha256,
  readSource,
  validatePublic,
  safeText,
  safeURL,
} from '../scripts/lib/atlas.mjs';
import {
  outside,
  root,
  writeJSON,
  candidateFiles,
  sourceBindings,
} from '../scripts/lib/files.mjs';
import { cleanPNG } from '../scripts/extract-atlas.mjs';
import {
  validateTarget,
  currentDigest,
  snapshotDigest,
  verifyPrepared,
} from '../scripts/lib/release.mjs';
import { scanFiles } from '../scripts/validate-public.mjs';
const privateValue = [
  'PRIVATE',
  'SENTINEL',
  Math.random().toString(36).slice(2),
].join('_');
function fixture() {
  return {
    refs: [
      {
        id: 'REF_DEMO',
        title: 'Référence synthétique de test',
        year: 2024,
        authors: 'Fixture de test',
        url: 'https://example.org/reference',
        scope: privateValue,
      },
    ],
    blocks: [
      {
        id: 'B_DEMO',
        num: 1,
        title: 'Méthode synthétique',
        year: 2025,
        refs: ['REF_DEMO'],
        upstream: [],
        downstream: [],
      },
    ],
    papers: [
      {
        id: 'P_DEMO',
        title: 'Article synthétique, non réel',
        year: 2026,
        question: 'Question de test',
        depends: ['P_HIDDEN'],
        refs: ['REF_DEMO'],
        blocks: [1],
      },
      { id: 'P_HIDDEN', title: privateValue },
    ],
    researchWatch: [],
    journal: [{ text: privateValue }],
  };
}
function html(d = fixture()) {
  return `<!doctype html><!--${privateValue}--><p data-private="${privateValue}">${privateValue}</p><script>throw new Error('${privateValue}')</script><script id="atlas-data" type="application/json">${JSON.stringify(d)}</script>`;
}
function policy(h = html()) {
  return {
    schemaVersion: 1,
    adapter: 'atlas-legacy-v10',
    sourceSha256: sha256(h),
    defaultVisibility: 'private',
    records: [
      {
        collection: 'refs',
        id: 'REF_DEMO',
        visibility: 'public',
        fields: ['id', 'title', 'authors', 'url', 'year'],
      },
      {
        collection: 'blocks',
        id: 'B_DEMO',
        visibility: 'public',
        fields: ['id', 'num', 'title', 'year', 'refs'],
      },
      {
        collection: 'papers',
        id: 'P_DEMO',
        visibility: 'public',
        fields: [
          'id',
          'title',
          'year',
          'question',
          'depends',
          'refs',
          'blocks',
        ],
      },
    ],
    assets: [],
  };
}
function temp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-test-'));
}
function cli(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
}
test('Projection par objet ET champ, sans HTML source ni données privées', () => {
  const { data, report } = project(html(), policy());
  assert.equal(data.refs.length, 1);
  assert.equal(data.papers.length, 1);
  assert(!JSON.stringify(data).includes(privateValue));
  assert.equal(data.refs[0].scope, undefined);
  assert(report.excluded.length > 0);
  assert.deepEqual(data.papers[0].depends, []);
  assert.equal(validatePublic(data), true);
});
test('Empreinte source divergente bloquée', () =>
  assert.throws(() => project(html() + ' ', policy()), /source a changé/));
test('Veille avec titre bibliographique : projection explicite, liens conservés', () => {
  const source = fixture();
  source.researchWatch = [
    {
      id: 'W_TEST',
      title: 'Veille synthétique',
      authors: 'Test',
      year: 2026,
      url: 'https://example.org/watch',
      blocks: [1],
      ref: 'REF_DEMO',
    },
  ];
  const h = html(source),
    p = policy(h);
  p.records.push({
    collection: 'researchWatch',
    id: 'W_TEST',
    visibility: 'public',
    fields: Object.keys(source.researchWatch[0]),
  });
  const { data } = project(h, p);
  assert.deepEqual(data.researchWatch, source.researchWatch);
  data.researchWatch[0].ref = 'MISSING';
  assert.throws(
    () => validatePublic(data),
    /researchWatch.W_TEST.ref → MISSING/,
  );
});
test('Métadonnées de veille exclues par défaut et sélectionnées explicitement', () => {
  const source = fixture();
  source.scientificWatch = {
    updatedAt: '2026-10-20',
    sourceFile: 'references.bib',
    metrics: { totalBibEntries: 2 },
    openQuestionsMatrix: [
      {
        id: 'Q_TEST',
        question: 'Question',
        papers: ['P_DEMO'],
        readings: ['external_bib_key'],
        extract: 'Texte',
        deliverable: 'Note',
      },
    ],
  };
  const h = html(source),
    p = policy(h);
  assert.equal(project(h, p).data.scientificWatch, undefined);
  p.scientificWatch = Object.keys(source.scientificWatch);
  const { data, report } = project(h, p);
  assert.deepEqual(data.scientificWatch, source.scientificWatch);
  assert.deepEqual(report.scientificWatch, p.scientificWatch);
  data.scientificWatch.openQuestionsMatrix[0].papers = ['MISSING'];
  assert.throws(() => validatePublic(data), /scientificWatch.Q_TEST.papers/);
});
test('Veille structurée : champs inconnus, HTML actif et compteurs invalides refusés', () => {
  for (const watch of [
    { privateJournal: privateValue },
    { metrics: { totalBibEntries: -1 } },
    { metrics: { privateMetric: 1 } },
    {
      openQuestionsMatrix: [
        {
          id: 'Q',
          question: '<script>secret</script>',
          papers: [],
          readings: [],
        },
      ],
    },
    {
      openQuestionsMatrix: [
        {
          id: 'Q',
          question: 'Test',
          papers: [],
          readings: [],
          privateField: privateValue,
        },
      ],
    },
    { sourceFile: '../private.bib' },
  ]) {
    const source = fixture();
    source.scientificWatch = watch;
    assert.throws(() => readSource(html(source)));
  }
});
test('Identifiants dupliqués bloqués même pour des objets privés', () => {
  const d = fixture();
  d.refs.push({ ...d.refs[0] });
  assert.throws(() => readSource(html(d)), /dupliqué/);
});
test('Schéma inconnu bloqué', () => {
  const d = fixture();
  d.unknown = [];
  assert.throws(() => readSource(html(d)), /inconnu/);
  delete d.unknown;
  d.refs[0].unexpected = 'no';
  assert.throws(() => readSource(html(d)), /inconnu/);
});
test('Règles ambiguës et champs inconnus bloqués', () => {
  const p = policy();
  p.records.push(p.records[0]);
  assert.throws(() => project(html(), p), /dupliquée/);
  p.records.pop();
  p.records[0].fields.push('unknown');
  assert.throws(() => project(html(), p), /inconnu/);
});
test('Politique vide bloquée, données absentes jamais changées en zéro', () => {
  const p = policy();
  p.records = [];
  assert.throws(() => project(html(), p), /Aucun objet/);
  const { data } = project(html(), policy());
  assert.equal(data.papers[0].innovation, undefined);
});
test('HTML supprimé et protocoles dangereux refusés', () => {
  assert.equal(safeText('<b>Texte</b><script>alert(1)</script>'), 'Texte');
  assert.throws(() => safeURL('javascript:alert(1)'));
  assert.throws(() => safeURL('https://localhost/test'));
  assert.throws(() => safeText('file:' + '//secret'));
});
test('Script Atlas unique obligatoire', () => {
  assert.throws(() => readSource(html() + html()), /Un seul/);
  assert.throws(() => readSource('<p>Absent</p>'), /Un seul/);
});
test('Relations orphelines refusées dans le schéma public', () => {
  const { data } = project(html(), policy());
  data.papers[0].depends = ['hidden'];
  assert.throws(() => validatePublic(data), /orpheline/);
});
test('Les sources privées dans le projet sont refusées', () =>
  assert.throws(
    () => outside(path.join(root, 'package.json')),
    /hors du projet/,
  ));
test('PNG : métadonnées textuelles supprimées', () => {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  function chunk(type, text = '') {
    const d = Buffer.from(text),
      b = Buffer.alloc(d.length + 12);
    b.writeUInt32BE(d.length);
    b.write(type, 4);
    d.copy(b, 8);
    return b;
  }
  const input = Buffer.concat([
    sig,
    chunk('IHDR'),
    chunk('tEXt', privateValue),
    chunk('IDAT'),
    chunk('IEND'),
  ]);
  const output = cleanPNG(input);
  assert(!output.includes(privateValue));
  assert(output.includes('IDAT'));
  assert.throws(() => cleanPNG(Buffer.from('invalid')));
});
test('Cible GitHub et base cohérentes obligatoires', () => {
  assert.throws(() => validateTarget({ owner: 'other' }));
  assert.throws(() =>
    validateTarget({
      owner: 'damienfernandes',
      repo: 'demo',
      visibility: 'public',
      site: 'https://damienfernandes.github.io',
      base: '/',
    }),
  );
});
test('Deploy non interactif refusé avant tout accès distant', () => {
  const r = cli(['scripts/publish.mjs', '--deploy']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /terminal humain/);
});
test('Aucun --yes ni argument inconnu accepté', () => {
  const r = cli(['scripts/publish.mjs', '--yes']);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /--prepare ou --deploy/);
});
test('Scan de diffusion bloque une sentinelle externe', () => {
  const dir = temp(),
    file = path.join(dir, 'candidate.txt'),
    list = path.join(dir, 'phrases.json');
  fs.writeFileSync(file, privateValue);
  writeJSON(list, [privateValue]);
  const old = process.env.PUBLIC_FORBIDDEN_FILE;
  process.env.PUBLIC_FORBIDDEN_FILE = list;
  try {
    assert.throws(() => scanFiles([file]), /interdit/);
  } finally {
    if (old) process.env.PUBLIC_FORBIDDEN_FILE = old;
    else delete process.env.PUBLIC_FORBIDDEN_FILE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test('Empreintes de préparation : modification source, lot ou cible invalidante', () => {
  const dir = temp(),
    source = path.join(dir, 'source.html'),
    p = path.join(dir, 'policy.json'),
    snap = path.join(dir, 'snapshot');
  fs.writeFileSync(source, html());
  writeJSON(p, policy());
  fs.mkdirSync(snap);
  fs.writeFileSync(path.join(snap, 'public.txt'), 'approved');
  const old = { ...process.env };
  Object.assign(process.env, { ATLAS_SOURCE: source, ATLAS_POLICY: p });
  try {
    const target = JSON.parse(
      fs.readFileSync(path.join(root, 'config/target.json')),
    );
    const receipt = {
      version: 1,
      target,
      bindings: sourceBindings(),
      sourceDigest: currentDigest(),
      snapshotDigest: snapshotDigest(snap),
    };
    assert(verifyPrepared(receipt, snap));
    fs.writeFileSync(source, 'changed');
    assert.throws(
      () => verifyPrepared(receipt, snap),
      /source ou la politique/,
    );
    fs.writeFileSync(source, html());
    fs.writeFileSync(path.join(snap, 'public.txt'), 'changed');
    assert.throws(() => verifyPrepared(receipt, snap), /lot préparé/);
    fs.writeFileSync(path.join(snap, 'public.txt'), 'approved');
    receipt.target = { ...target, repo: 'changed' };
    assert.throws(() => verifyPrepared(receipt, snap), /cible a changé/);
  } finally {
    process.env = old;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test('Préparation sans argument : aucune commande gh, sortie bloquée avec manifeste vide', () => {
  const dir = temp();
  fs.writeFileSync(path.join(dir, 'source.html'), html());
  const p = policy();
  p.records = [];
  writeJSON(path.join(dir, 'policy.json'), p);
  const r = cli(['scripts/publish.mjs'], {
    ATLAS_SOURCE: path.join(dir, 'source.html'),
    ATLAS_POLICY: path.join(dir, 'policy.json'),
    ATLAS_REVIEW_DIR: path.join(dir, 'review'),
  });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Aucun objet/);
  assert(!fs.existsSync(path.join(dir, 'review', 'git-export')));
  fs.rmSync(dir, { recursive: true, force: true });
});
test('Intégration : extracteur + build public, aucune sentinelle dans le build ni le lot Git', () => {
  const dir = temp(),
    source = path.join(dir, 'source.html'),
    p = path.join(dir, 'policy.json');
  fs.writeFileSync(source, html());
  writeJSON(p, policy());
  const generated = path.join(root, 'generated/public/atlas.json'),
    old = fs.readFileSync(generated),
    assets = path.join(root, 'public/atlas-assets'),
    backup = path.join(dir, 'assets');
  if (fs.existsSync(assets)) fs.cpSync(assets, backup, { recursive: true });
  try {
    const r = cli(['scripts/extract-atlas.mjs'], {
      ATLAS_SOURCE: source,
      ATLAS_POLICY: p,
      ATLAS_REVIEW_DIR: path.join(dir, 'review'),
    });
    assert.equal(r.status, 0, r.stderr);
    const b = cli(['node_modules/astro/bin/astro.mjs', 'build']);
    assert.equal(b.status, 0, b.stderr);
    function walk(d) {
      return fs
        .readdirSync(d, { withFileTypes: true })
        .flatMap((e) =>
          e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
        );
    }
    for (const f of [...walk(path.join(root, 'dist')), ...candidateFiles()])
      assert(!fs.readFileSync(f).includes(privateValue), f);
    assert.match(
      fs.readFileSync(path.join(root, 'dist/atlas/index.html'), 'utf8'),
      /Référence synthétique/,
    );
  } finally {
    fs.writeFileSync(generated, old);
    fs.rmSync(assets, { recursive: true, force: true });
    if (fs.existsSync(backup)) fs.cpSync(backup, assets, { recursive: true });
    fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('Assets : traversée, symlink et empreinte divergente bloqués avant copie', () => {
  const dir = temp(),
    source = path.join(dir, 'source.html'),
    manifest = path.join(dir, 'policy.json'),
    assets = path.join(dir, 'assets');
  fs.mkdirSync(assets);
  fs.writeFileSync(source, html());
  fs.writeFileSync(path.join(assets, 'image.png'), 'not-png');
  fs.symlinkSync(
    path.join(assets, 'image.png'),
    path.join(assets, 'linked.png'),
  );
  try {
    for (const [asset, pattern] of [
      [
        {
          source: '../image.png',
          name: 'approved.png',
          sha256: 'wrong',
          metadataReviewed: true,
        },
        /Traversée/,
      ],
      [
        {
          source: 'linked.png',
          name: 'approved.png',
          sha256: 'wrong',
          metadataReviewed: true,
        },
        /symbolique/,
      ],
      [
        {
          source: 'image.png',
          name: 'approved.png',
          sha256: 'wrong',
          metadataReviewed: true,
        },
        /Empreinte/,
      ],
    ]) {
      const p = policy();
      p.assets = [asset];
      writeJSON(manifest, p);
      const r = cli(['scripts/extract-atlas.mjs'], {
        ATLAS_SOURCE: source,
        ATLAS_POLICY: manifest,
        ATLAS_ASSET_ROOT: assets,
        ATLAS_REVIEW_DIR: path.join(dir, 'review'),
      });
      assert.notEqual(r.status, 0);
      assert.match(r.stderr, pattern);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
