import type { AtlasData, RecordItem } from './types';
const data = JSON.parse(
  document.getElementById('atlas-public-data')!.textContent!,
) as AtlasData;
type Collection = 'refs' | 'blocks' | 'papers' | 'researchWatch';
type NodeItem = RecordItem & { collection: Collection };
const collections: Collection[] = ['refs', 'blocks', 'papers', 'researchWatch'];
const all: NodeItem[] = collections.flatMap((c) =>
  data[c].map((r) => ({ ...r, collection: c })),
);
const labels: Record<string, string> = {
  refs: 'Sources',
  blocks: 'Méthodes',
  papers: 'Articles',
  researchWatch: 'Veille',
};
const fields: Record<string, string> = {
  year: 'Année',
  authors: 'Auteurs',
  question: 'Question de recherche',
  innovation: 'Contribution revendiquée',
  existing: 'Travaux proches',
  test: 'Validation prévue',
  risk: 'Limites',
  basis: 'Fondement',
  status: 'État déclaré',
  stage: 'Étape',
  integration: 'Intégration',
  inputs: 'Entrées',
  outputs: 'Sorties',
  process: 'Démarche',
  example: 'Exemple',
  equation: 'Formulation',
  note: 'Précision',
  scope: 'Portée',
  limit: 'Limites',
  kind: 'Type',
  verified: 'Vérification déclarée',
  reuse: 'Apport potentiel',
  novelty: 'Différence à examiner',
  action: 'Prochaine action',
  priority: 'Priorité déclarée',
  checked: 'Date de vérification',
  depends: 'Dépendances nécessaires',
  optional: 'Dépendances optionnelles',
  refs: 'Références',
  ref: 'Référence',
  blocks: 'Blocs',
  modules: 'Blocs',
  papers: 'Articles liés',
  upstream: 'En amont',
  downstream: 'En aval',
};
const relationTarget: Record<string, Collection> = {
  depends: 'papers',
  optional: 'papers',
  refs: 'refs',
  ref: 'refs',
  blocks: 'blocks',
  modules: 'blocks',
  papers: 'papers',
  upstream: 'blocks',
  downstream: 'blocks',
};
const title = (r: RecordItem) =>
  `${r.id} — ${r.title || r.name || 'Intitulé non renseigné'}`;
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  cls?: string,
) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) {
    if (/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/.test(text)) {
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
      for (const part of parts) {
        if (!part) continue;
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const s = document.createElement('strong');
          s.textContent = part.slice(2, -2);
          n.append(s);
        } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          const em = document.createElement('em');
          em.textContent = part.slice(1, -1);
          n.append(em);
        } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const code = document.createElement('code');
          code.textContent = part.slice(1, -1);
          n.append(code);
        } else {
          n.append(document.createTextNode(part));
        }
      }
    } else {
      n.textContent = text;
    }
  }
  return n;
}
const view = document.getElementById('atlas-view')!,
  detail = document.getElementById('atlas-detail')!,
  search = document.getElementById('atlas-search') as HTMLInputElement,
  year = document.getElementById('atlas-year') as HTMLSelectElement;
let selected = '';
const years = [
  ...new Set(
    all
      .map((r) => Number(r.year))
      .filter((y) => Number.isInteger(y) && y > 1900 && y < 2200),
  ),
].sort((a, b) => a - b);
for (const y of years) {
  const o = el('option', String(y));
  o.value = String(y);
  year.append(o);
}
function lookup(key: string, id: unknown) {
  return all.find(
    (r) =>
      r.collection === relationTarget[key] &&
      (r.id === id || (r.collection === 'blocks' && r.num === id)),
  );
}

function updateGraphSpotlight(focusId: string) {
  const canvas = view.querySelector<HTMLElement>('.timeline-graph');
  if (!canvas) return;
  const nodes = canvas.querySelectorAll<HTMLButtonElement>('.timeline-node');
  const edges = canvas.querySelectorAll<SVGPathElement>('path[data-from]');
  if (!focusId) {
    canvas.removeAttribute('data-has-focus');
    nodes.forEach((n) => {
      n.removeAttribute('data-spotlight');
    });
    edges.forEach((e) => {
      e.removeAttribute('data-spotlight');
    });
    return;
  }
  canvas.setAttribute('data-has-focus', 'true');
  const connected = new Set<string>([focusId]);
  edges.forEach((edge) => {
    const f = edge.getAttribute('data-from') || '';
    const t = edge.getAttribute('data-to') || '';
    if (f === focusId || t === focusId) {
      edge.setAttribute('data-spotlight', 'active');
      connected.add(f);
      connected.add(t);
    } else {
      edge.setAttribute('data-spotlight', 'dim');
    }
  });
  nodes.forEach((node) => {
    const id = node.dataset.id || '';
    if (id === focusId) {
      node.setAttribute('data-spotlight', 'primary');
    } else if (connected.has(id)) {
      node.setAttribute('data-spotlight', 'neighbor');
    } else {
      node.setAttribute('data-spotlight', 'dim');
    }
  });
}

function pick(r: NodeItem) {
  selected = r.id;
  detail.replaceChildren(
    el('p', `${labels[r.collection]}${r.year ? ' · ' + r.year : ''}`, 'eyebrow'),
    el('h2', title(r)),
  );
  const clearBtn = el('button', 'Réinitialiser la mise en évidence du graphe', 'detail-reset-btn');
  clearBtn.type = 'button';
  clearBtn.addEventListener('click', () => {
    selected = '';
    for (const b of view.querySelectorAll<HTMLButtonElement>('[data-id]'))
      b.setAttribute('aria-pressed', 'false');
    updateGraphSpotlight('');
  });
  detail.append(clearBtn);

  for (const [key, value] of Object.entries(r)) {
    if (
      ['id', 'title', 'name', 'collection', 'num', 'url'].includes(key) ||
      value === undefined ||
      value === ''
    )
      continue;
    const heading = el('h3', fields[key] || key);
    detail.append(heading);
    if (relationTarget[key]) {
      const list = el('ul');
      for (const id of Array.isArray(value) ? value : [value]) {
        const linked = lookup(key, id);
        if (!linked) continue;
        const li = el('li'),
          b = el('button', title(linked), 'detail-link');
        b.type = 'button';
        b.addEventListener('click', () => pick(linked));
        li.append(b);
        list.append(li);
      }
      detail.append(
        list.childNodes.length ? list : el('p', 'Aucun lien public documenté.'),
      );
    } else
      detail.append(
        el('p', Array.isArray(value) ? value.join(' · ') : String(value)),
      );
  }
  if (typeof r.url === 'string') {
    try {
      const u = new URL(r.url);
      if (['https:', 'http:'].includes(u.protocol)) {
        const a = el('a', 'Consulter la source ↗', 'text-link');
        a.href = u.href;
        a.rel = 'noopener noreferrer';
        detail.append(a);
      }
    } catch {}
  }
  for (const b of view.querySelectorAll<HTMLButtonElement>('[data-id]'))
    b.setAttribute('aria-pressed', String(b.dataset.id === r.id));
  updateGraphSpotlight(r.id);
  detail.focus({ preventScroll: true });
  if (window.innerWidth < 1000)
    detail.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
}
function button(r: NodeItem, cls: string) {
  const b = el('button', undefined, cls);
  b.type = 'button';
  b.dataset.id = r.id;
  b.dataset.kind = r.collection;
  b.setAttribute('aria-pressed', String(selected === r.id));
  b.setAttribute('aria-label', title(r));
  b.addEventListener('click', () => pick(r));
  b.addEventListener('mouseenter', () => {
    if (!selected) updateGraphSpotlight(r.id);
  });
  b.addEventListener('mouseleave', () => {
    if (!selected) updateGraphSpotlight('');
  });
  return b;
}
function list(items: NodeItem[]) {
  for (const r of items) {
    const b = button(r, 'atlas-card');
    b.append(
      el(
        'span',
        `${labels[r.collection]}${r.year ? ' · ' + r.year : ''}`,
        'muted',
      ),
      el('h3', title(r)),
    );
    if (r.question || r.scope) b.append(el('p', String(r.question || r.scope)));
    view.append(b);
  }
}

function graph(items: NodeItem[]) {
  // Tripartite layered architecture:
  // Column 0: Academic & Technical Sources (refs), sorted chronologically
  // Column 1: Methodological Blocks (blocks), sorted by block number (B1..B12)
  // Column 2: Research Papers & Tracks (papers + researchWatch), sorted by year then ID
  const colRefs = items
    .filter((r) => r.collection === 'refs')
    .sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0) || a.id.localeCompare(b.id));
  const colBlocks = items
    .filter((r) => r.collection === 'blocks')
    .sort((a, b) => (Number(a.num) || 99) - (Number(b.num) || 99) || a.id.localeCompare(b.id));
  const colPapers = items
    .filter((r) => r.collection === 'papers' || r.collection === 'researchWatch')
    .sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0) || a.id.localeCompare(b.id));

  const columns: { title: string; subtitle: string; x: number; nodes: NodeItem[]; stepY: number }[] = [
    {
      title: '01 · SOURCES (1998–2026)',
      subtitle: `${colRefs.length} source${colRefs.length > 1 ? 's' : ''}`,
      x: 24,
      nodes: colRefs,
      stepY: 88,
    },
    {
      title: '02 · MÉTHODE (BLOCS B1–B12)',
      subtitle: `${colBlocks.length} bloc${colBlocks.length > 1 ? 's' : ''}`,
      x: 370,
      nodes: colBlocks,
      stepY: 142,
    },
    {
      title: '03 · ARTICLES & PISTES (P0–P7 / ATL-N)',
      subtitle: `${colPapers.length} fiche${colPapers.length > 1 ? 's' : ''}`,
      x: 716,
      nodes: colPapers,
      stepY: 132,
    },
  ];

  const NODE_W = 246;
  const NODE_H = 74;
  const TOP_OFFSET = 68;

  const pos = new Map<string, { x: number; y: number; colIdx: number }>();
  let maxHeight = 360;

  columns.forEach((col, colIdx) => {
    const totalColHeight = TOP_OFFSET + col.nodes.length * col.stepY + 40;
    if (totalColHeight > maxHeight) maxHeight = totalColHeight;
    col.nodes.forEach((r, rowIdx) => {
      pos.set(r.id, {
        x: col.x,
        y: TOP_OFFSET + rowIdx * col.stepY,
        colIdx,
      });
    });
  });

  const outer = el('div', undefined, 'graph-viewport');
  outer.tabIndex = 0;
  outer.setAttribute(
    'aria-label',
    'Graphe temporel en trois colonnes (Sources, Méthodes, Articles). Survolez ou cliquez sur un nœud pour isoler ses relations.',
  );

  const canvas = el('div', undefined, 'timeline-graph');
  canvas.style.width = '990px';
  canvas.style.height = `${maxHeight}px`;

  const ns = 'http://www.w3.org/2000/svg',
    svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('aria-hidden', 'true');
  canvas.append(svg);

  const relations: { from: NodeItem; to: NodeItem; kind: string }[] = [];
  const seen = new Set<string>();
  const undirectedPairSeen = new Set<string>();

  for (const r of items) {
    for (const key of [
      'refs',
      'ref',
      'depends',
      'optional',
      'upstream',
      'blocks',
      'modules',
      'papers',
    ]) {
      const val = r[key];
      for (const id of Array.isArray(val) ? val : val ? [val] : []) {
        const t = lookup(key, id);
        if (!t || !pos.has(t.id)) continue;
        const unique = `${t.id}:${r.id}:${key}`;
        if (seen.has(unique)) continue;
        seen.add(unique);
        relations.push({ from: t, to: r, kind: key });

        // Avoid drawing duplicate visual SVG curves for reciprocal links (e.g. R01.blocks=[2] and B2.refs=['R01'])
        const pairKey = [t.id, r.id].sort().join('::');
        if (undirectedPairSeen.has(pairKey)) continue;
        undirectedPairSeen.add(pairKey);

        const pA = pos.get(t.id)!,
          pB = pos.get(r.id)!;

        // Order left-to-right when in different columns
        const left = pA.colIdx <= pB.colIdx ? pA : pB;
        const right = pA.colIdx <= pB.colIdx ? pB : pA;

        const line = document.createElementNS(ns, 'path');
        line.setAttribute('data-from', t.id);
        line.setAttribute('data-to', r.id);
        line.setAttribute('class', 'graph-edge');

        if (left.colIdx !== right.colIdx) {
          // Smooth horizontal S-curve between columns
          const x1 = left.x + NODE_W;
          const y1 = left.y + NODE_H / 2;
          const x2 = right.x;
          const y2 = right.y + NODE_H / 2;
          const dx = (x2 - x1) * 0.52;
          line.setAttribute(
            'd',
            `M${x1} ${y1} C${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
          );
          line.setAttribute(
            'stroke',
            left.colIdx === 0 && right.colIdx === 1
              ? '#4278a9'
              : '#126b56',
          );
        } else {
          // Intra-column arc on the right side (e.g. B1 -> B2 or P1 -> P3)
          const x1 = left.x + NODE_W;
          const y1 = left.y + NODE_H / 2;
          const x2 = right.x + NODE_W;
          const y2 = right.y + NODE_H / 2;
          const span = Math.abs(y2 - y1);
          const arcOffset = Math.min(85, Math.max(28, span * 0.22));
          line.setAttribute(
            'd',
            `M${x1} ${y1} C${x1 + arcOffset} ${y1}, ${x2 + arcOffset} ${y2}, ${x2} ${y2}`,
          );
          line.setAttribute('stroke', '#9a6319');
          line.setAttribute('data-intra', 'true');
        }

        line.setAttribute('fill', 'none');
        line.setAttribute('stroke-width', '1.5');
        if (key === 'optional') line.setAttribute('stroke-dasharray', '4 4');
        svg.append(line);
      }
    }
  }

  columns.forEach((col) => {
    const headerBox = el('div', undefined, 'timeline-col-header');
    headerBox.style.left = `${col.x}px`;
    headerBox.style.width = `${NODE_W}px`;
    headerBox.append(
      el('strong', col.title, 'timeline-year'),
      el('small', col.subtitle, 'timeline-col-sub'),
    );
    canvas.append(headerBox);
  });

  for (const r of items) {
    const p = pos.get(r.id);
    if (!p) continue;
    const b = button(r, 'timeline-node');
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    const metaLabel = r.year ? `${r.id} · ${r.year}` : r.id;
    b.append(el('strong', metaLabel), el('span', String(r.title || r.name)));
    canvas.append(b);
  }

  outer.append(canvas);
  view.append(outer);

  if (selected) {
    updateGraphSpotlight(selected);
  }

  const legend = el('div', undefined, 'graph-legend');
  for (const c of collections) legend.append(el('span', labels[c]));
  legend.append(
    el('span', '💡 Astuce : Survolez ou cliquez sur une carte pour isoler ses liens directs'),
  );
  view.append(
    legend,
    el(
      'p',
      'Architecture en 3 colonnes (Sources → Méthodes → Articles). Survolez ou cliquez sur un élément pour mettre en évidence ses connexions directes et masquer le bruit visuel.',
      'muted',
    ),
  );
  const d = el('details', undefined, 'relation-list');
  d.append(el('summary', `Lire les relations (${relations.length})`));
  const ul = el('ul');
  relations.forEach((r) =>
    ul.append(
      el('li', `${title(r.to)} — ${fields[r.kind]} : ${title(r.from)}`),
    ),
  );
  d.append(ul);
  view.append(d);
}
function render() {
  const section = [
    'knowledge',
    'method',
    'papers',
    'sources',
    'watch',
  ].includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : 'knowledge';
  document.querySelectorAll<HTMLAnchorElement>('.atlas-tabs a').forEach((a) => {
    if (a.hash === `#${section}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const map: Record<string, Collection> = {
    method: 'blocks',
    papers: 'papers',
    sources: 'refs',
    watch: 'researchWatch',
  };
  const query = search.value.toLocaleLowerCase('fr');
  const filtered = all.filter(
    (r) =>
      (section === 'knowledge' || r.collection === map[section]) &&
      JSON.stringify(r).toLocaleLowerCase('fr').includes(query) &&
      (year.value === 'all' || !r.year || Number(r.year) <= Number(year.value)),
  );
  view.replaceChildren();
  document.getElementById('atlas-count')!.textContent =
    `${filtered.length} élément${filtered.length > 1 ? 's' : ''} public${filtered.length > 1 ? 's' : ''} affiché${filtered.length > 1 ? 's' : ''}`;
  if (!filtered.length) {
    const box = el('div', undefined, 'empty');
    box.append(
      el(
        'h3',
        !data.prepared
          ? 'Atlas public non préparé.'
          : 'Aucun élément pour cette vue.',
      ),
      el(
        'p',
        !data.prepared
          ? 'Le code est prêt. Les données apparaîtront après sélection et validation des contenus autorisés. Aucun contenu de l’Atlas privé n’est embarqué.'
          : 'Essayez une autre recherche ou une autre année.',
      ),
    );
    view.append(box);
    return;
  }
  if (section === 'knowledge') graph(filtered);
  else list(filtered);
}
search.addEventListener('input', render);
year.addEventListener('change', render);
window.addEventListener('hashchange', render);
document.getElementById('atlas-export')!.addEventListener('click', () => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const a = el('a');
  a.href = url;
  a.download = 'atlas-public.json';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
// À ajouter tout à la fin de src/atlas/app.ts
render();

// Détection et ciblage direct d'un nœud via l'ancre URL (ex: #method:B1)
if (location.hash.includes(':')) {
  const [sec, targetId] = location.hash.slice(1).split(':');
  const targetItem = all.find(r => r.id === targetId);
  if (targetItem) {
    setTimeout(() => pick(targetItem), 150);
  }
}
