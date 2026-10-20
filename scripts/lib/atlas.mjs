import { parse, parseFragment } from 'parse5';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
export const sha256 = (value) =>
  createHash('sha256').update(value).digest('hex');
export const fields = {
  refs: [
    'id',
    'year',
    'authors',
    'title',
    'url',
    'scope',
    'limit',
    'blocks',
    'kind',
    'verified',
  ],
  blocks: [
    'id',
    'num',
    'title',
    'question',
    'inputs',
    'outputs',
    'process',
    'example',
    'equation',
    'note',
    'refs',
    'upstream',
    'downstream',
    'status',
    'year',
  ],
  papers: [
    'id',
    'title',
    'status',
    'basis',
    'question',
    'innovation',
    'existing',
    'test',
    'risk',
    'blocks',
    'depends',
    'optional',
    'stage',
    'integration',
    'refs',
    'year',
  ],
  researchWatch: [
    'id',
    'name',
    'title',
    'authors',
    'year',
    'url',
    'blocks',
    'ref',
    'papers',
    'modules',
    'priority',
    'question',
    'reuse',
    'limit',
    'novelty',
    'action',
    'status',
    'checked',
  ],
};
const sourceKeys = new Set([
  ...Object.keys(fields),
  'scenarios',
  'review',
  'fiches',
  'documentaryNote',
  'journal',
  'journalReference',
  'journalArchiveV4',
  'journalIdMapping',
  'parcoursCSI',
  'codeGlossary',
  'revision',
  'schemaVersion',
  'scientificWatch',
]);
const arrayFields = new Set([
  'blocks',
  'refs',
  'upstream',
  'downstream',
  'depends',
  'optional',
  'papers',
  'modules',
]);
const forbidden =
  /(?:javascript:|file:|sandbox:|data:|\/workspace\/|\/Users\/|\/home\/|[A-Z]:\\|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/i;
export function assert(condition, message) {
  if (!condition) throw new Error(message);
}
const watchFields = [
  'updatedAt',
  'sourceFile',
  'metrics',
  'openQuestionsMatrix',
];
function validateScientificWatch(watch) {
  const object = (value, allowed) => {
    assert(
      value && typeof value === 'object' && !Array.isArray(value),
      'Objet de veille attendu',
    );
    assert(
      Object.keys(value).every((key) => allowed.includes(key)),
      'Champ de veille inconnu',
    );
  };
  const text = (value) =>
    assert(
      typeof value === 'string' && safeText(value) === value,
      'Texte de veille non assaini',
    );
  object(watch, watchFields);
  if (watch.updatedAt !== undefined) {
    text(watch.updatedAt);
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(watch.updatedAt),
      'Date de veille invalide',
    );
  }
  if (watch.sourceFile !== undefined) {
    text(watch.sourceFile);
    assert(
      /^[A-Za-z0-9_.-]+$/.test(watch.sourceFile),
      'Nom de bibliographie invalide',
    );
  }
  if (watch.metrics !== undefined) {
    object(watch.metrics, [
      'totalBibEntries',
      'verifiedPrimaryNotices',
      'priorityDossiers',
      'openQuestions',
    ]);
    for (const value of Object.values(watch.metrics))
      assert(
        Number.isSafeInteger(value) && value >= 0,
        'Compteur de veille invalide',
      );
  }
  if (watch.openQuestionsMatrix !== undefined) {
    assert(
      Array.isArray(watch.openQuestionsMatrix),
      'Matrice de veille attendue',
    );
    const ids = new Set();
    for (const row of watch.openQuestionsMatrix) {
      object(row, [
        'id',
        'question',
        'papers',
        'readings',
        'extract',
        'deliverable',
      ]);
      assert(
        typeof row.id === 'string' &&
          /^[A-Za-z0-9_-]+$/.test(row.id) &&
          !ids.has(row.id),
        'ID de question invalide',
      );
      ids.add(row.id);
      text(row.question);
      for (const key of ['extract', 'deliverable'])
        if (row[key] !== undefined) text(row[key]);
      for (const key of ['papers', 'readings']) {
        assert(Array.isArray(row[key]), 'Liste de veille attendue');
        row[key].forEach(text);
      }
    }
  }
}
export function safeText(value) {
  assert(typeof value === 'string', 'Texte attendu');
  assert(
    !forbidden.test(value),
    'Texte contenant une URL, un chemin ou un secret interdit',
  );
  const frag = parseFragment(value);
  let out = '';
  function walk(n) {
    if (
      ['script', 'style', 'iframe', 'object', 'template', 'noscript'].includes(
        n.nodeName,
      )
    )
      return;
    if (n.nodeName === '#text') out += n.value;
    for (const c of n.childNodes || []) walk(c);
  }
  walk(frag);
  return out
    .normalize('NFC')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim();
}
export function safeURL(value) {
  try {
    const u = new URL(value);
    assert(
      ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password,
      'URL non publique',
    );
    assert(
      !isIP(u.hostname.replace(/^\[|\]$/g, '')),
      'Adresse IP non autorisée',
    );
    assert(
      !/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[|.*\.local$)/i.test(
        u.hostname,
      ),
      'URL locale',
    );
    return u.href;
  } catch {
    throw new Error('URL invalide ou non publique');
  }
}
export function readSource(html) {
  const doc = parse(html),
    nodes = [];
  function walk(n) {
    if (
      n.nodeName === 'script' &&
      n.attrs?.some((a) => a.name === 'id' && a.value === 'atlas-data')
    )
      nodes.push(n);
    for (const c of n.childNodes || []) walk(c);
  }
  walk(doc);
  assert(nodes.length === 1, 'Un seul script#atlas-data est requis');
  const source = JSON.parse(
    nodes[0].childNodes.map((n) => n.value || '').join(''),
  );
  assert(
    source && typeof source === 'object' && !Array.isArray(source),
    'Objet Atlas attendu',
  );
  for (const k of Object.keys(source))
    assert(
      sourceKeys.has(k),
      'Schéma source inconnu : adapter explicitement avant extraction',
    );
  assert(
    source.schemaVersion === undefined || source.schemaVersion === 1,
    'Version source inconnue',
  );
  const globalIds = new Set();
  if (source.researchWatch === undefined) source.researchWatch = [];
  if (source.scientificWatch !== undefined)
    validateScientificWatch(source.scientificWatch);
  for (const c of Object.keys(fields)) {
    assert(Array.isArray(source[c]), `Collection ${c} requise`);
    for (const r of source[c]) {
      assert(
        r &&
          typeof r === 'object' &&
          typeof r.id === 'string' &&
          /^[A-Za-z0-9_-]+$/.test(r.id),
        'Identifiant invalide',
      );
      assert(!globalIds.has(r.id), 'Identifiant dupliqué');
      globalIds.add(r.id);
      for (const k of Object.keys(r))
        assert(
          fields[c].includes(k),
          `Champ source inconnu dans ${c} : adapter explicitement`,
        );
    }
  }
  return source;
}
export function project(html, policy) {
  assert(
    policy.schemaVersion === 1 &&
      policy.adapter === 'atlas-legacy-v10' &&
      policy.defaultVisibility === 'private',
    'Politique ou adaptateur non supporté',
  );
  assert(
    policy.sourceSha256 === sha256(html),
    'La source a changé : nouvelle revue requise',
  );
  assert(
    Object.keys(policy).every((k) =>
      [
        'schemaVersion',
        'adapter',
        'sourceSha256',
        'defaultVisibility',
        'records',
        'assets',
        'scientificWatch',
      ].includes(k),
    ),
    'Champ de politique inconnu',
  );
  assert(
    Array.isArray(policy.records) && Array.isArray(policy.assets),
    'Listes records/assets requises',
  );
  const source = readSource(html),
    out = {
      schemaVersion: 1,
      prepared: true,
      refs: [],
      blocks: [],
      papers: [],
      researchWatch: [],
    },
    seen = new Set();
  for (const rule of policy.records) {
    assert(
      Object.keys(rule).every((k) =>
        ['collection', 'id', 'visibility', 'fields'].includes(k),
      ),
      'Règle inconnue',
    );
    assert(
      Object.hasOwn(fields, rule.collection) && rule.visibility === 'public',
      'Règle publique invalide',
    );
    assert(!seen.has(rule.id), 'Règle dupliquée');
    seen.add(rule.id);
    assert(
      Array.isArray(rule.fields) &&
        rule.fields.includes('id') &&
        new Set(rule.fields).size === rule.fields.length,
      'Champs invalides',
    );
    assert(
      rule.fields.includes('title') ||
        (rule.collection === 'researchWatch' && rule.fields.includes('name')),
      'Le titre public est obligatoire',
    );
    const row = source[rule.collection].find((x) => x.id === rule.id);
    assert(row, 'Objet approuvé absent');
    const clean = {};
    for (const key of rule.fields) {
      assert(
        fields[rule.collection].includes(key) && Object.hasOwn(row, key),
        'Champ autorisé inconnu ou absent',
      );
      const v = row[key];
      if (arrayFields.has(key)) {
        assert(Array.isArray(v), 'Liste attendue');
        clean[key] = v.map((x) => (typeof x === 'number' ? x : safeText(x)));
      } else if (key === 'url') clean[key] = safeURL(v);
      else if (typeof v === 'number') {
        assert(Number.isFinite(v), 'Nombre invalide');
        clean[key] = v;
      } else if (typeof v === 'boolean') clean[key] = v;
      else clean[key] = safeText(v);
    }
    out[rule.collection].push(clean);
  }
  assert(
    seen.size > 0,
    'Aucun objet approuvé : prévisualisation locale possible, publication bloquée',
  );
  if (policy.scientificWatch !== undefined) {
    assert(
      Array.isArray(policy.scientificWatch) &&
        new Set(policy.scientificWatch).size === policy.scientificWatch.length,
      'Sélection de veille invalide',
    );
    out.scientificWatch = {};
    for (const key of policy.scientificWatch) {
      assert(
        watchFields.includes(key) &&
          Object.hasOwn(source.scientificWatch || {}, key),
        'Champ de veille autorisé inconnu ou absent',
      );
      out.scientificWatch[key] = structuredClone(source.scientificWatch[key]);
    }
  }
  pruneRelations(out);
  validatePublic(out);
  return {
    data: out,
    report: {
      scientificWatch: policy.scientificWatch || [],
      included: policy.records.map((r) => ({
        collection: r.collection,
        id: r.id,
        fields: r.fields,
      })),
      excluded: Object.keys(fields)
        .flatMap((c) =>
          source[c].map((r) => ({
            collection: c,
            id: r.id,
            fields: Object.keys(r).filter(
              (k) =>
                !policy.records.some(
                  (p) =>
                    p.collection === c && p.id === r.id && p.fields.includes(k),
                ),
            ),
          })),
        )
        .filter((r) => r.fields.length),
    },
  };
}
const targets = {
  refs: 'refs',
  ref: 'refs',
  blocks: 'blocks',
  modules: 'blocks',
  upstream: 'blocks',
  downstream: 'blocks',
  depends: 'papers',
  optional: 'papers',
  papers: 'papers',
};
function matches(out, target, id) {
  return out[target].some(
    (r) => r.id === id || (target === 'blocks' && r.num === id),
  );
}
export function pruneRelations(out) {
  for (const c of Object.keys(fields))
    for (const r of out[c])
      for (const [k, t] of Object.entries(targets)) {
        if (Array.isArray(r[k]))
          r[k] = r[k].filter((id) => matches(out, t, id));
        else if (typeof r[k] === 'string' && !matches(out, t, r[k]))
          delete r[k];
      }
}
export function validatePublic(data) {
  assert(
    data.schemaVersion === 1 && typeof data.prepared === 'boolean',
    'Schéma public invalide',
  );
  assert(
    Object.keys(data).every((k) =>
      [
        'schemaVersion',
        'prepared',
        'scientificWatch',
        ...Object.keys(fields),
      ].includes(k),
    ),
    'Champ public inattendu',
  );
  const seen = new Set();
  if (data.scientificWatch !== undefined) {
    validateScientificWatch(data.scientificWatch);
    for (const row of data.scientificWatch.openQuestionsMatrix || [])
      for (const id of row.papers)
        assert(
          matches(data, 'papers', id),
          `Relation orpheline : scientificWatch.${row.id}.papers → ${id}`,
        );
  }
  for (const c of Object.keys(fields)) {
    assert(Array.isArray(data[c]), 'Collection publique absente');
    for (const r of data[c]) {
      assert(
        r && typeof r === 'object' && !Array.isArray(r),
        'Objet public invalide',
      );
      assert(
        typeof r.id === 'string' &&
          /^[A-Za-z0-9_-]+$/.test(r.id) &&
          !seen.has(r.id),
        'ID public invalide',
      );
      seen.add(r.id);
      assert(
        typeof r.title === 'string' ||
          (c === 'researchWatch' && typeof r.name === 'string'),
        'Titre requis',
      );
      for (const [k, v] of Object.entries(r)) {
        assert(fields[c].includes(k), 'Champ public inconnu');
        if (arrayFields.has(k)) {
          assert(Array.isArray(v), 'Liste publique attendue');
          for (const x of v)
            assert(
              typeof x === 'string' || Number.isFinite(x),
              'Lien invalide',
            );
        } else if (k === 'url') assert(safeURL(v) === v, 'URL non normalisée');
        else if (typeof v === 'string')
          assert(safeText(v) === v, 'Texte non assaini');
        else
          assert(
            typeof v === 'boolean' || Number.isFinite(v),
            'Valeur non scalaire',
          );
        if (targets[k]) {
          const ids = Array.isArray(v) ? v : [v];
          for (const id of ids)
            assert(
              matches(data, targets[k], id),
              `Relation orpheline : ${c}.${r.id}.${k} → ${id}`,
            );
        }
      }
    }
  }
  assert(data.prepared || seen.size === 0, 'Atlas non préparé avec données');
  return true;
}
