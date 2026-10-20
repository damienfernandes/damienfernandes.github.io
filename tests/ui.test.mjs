import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
const data = {
  schemaVersion: 1,
  prepared: true,
  refs: [
    {
      id: 'R_TEST',
      title: 'Source synthétique',
      year: 2024,
      authors: 'Auteur de test',
      url: 'https://example.org',
    },
  ],
  blocks: [
    { id: 'B_TEST', title: 'Méthode de test', year: 2025, refs: ['R_TEST'] },
  ],
  papers: [
    { id: 'P_TEST', title: 'Article de test', year: 2026, refs: ['R_TEST'] },
  ],
  researchWatch: [],
};
function setup() {
  const doc = new JSDOM(
    `<nav class="atlas-tabs"><a href="#knowledge">Graphe</a><a href="#papers">Articles</a></nav><input id="atlas-search"><select id="atlas-year"><option value="all">Toutes</option></select><button id="atlas-export">Exporter</button><p id="atlas-count"></p><section id="atlas-view"></section><aside id="atlas-detail" tabindex="-1"></aside><script id="atlas-public-data" type="application/json">${JSON.stringify(data)}</script>`,
    { url: 'https://example.org/atlas/#knowledge', runScripts: 'outside-only' },
  );
  doc.window.matchMedia = () => ({ matches: true });
  doc.window.HTMLElement.prototype.scrollIntoView = () => {};
  const code = ts
    .transpileModule(
      fs.readFileSync(new URL('../src/atlas/app.ts', import.meta.url), 'utf8'),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      },
    )
    .outputText.replace(/export\s*\{\s*\};?/g, '');
  doc.window.eval(code);
  return doc;
}
test('Graphe temporel, sélection et références avec intitulés', () => {
  const dom = setup(),
    d = dom.window.document;
  assert.equal(d.querySelectorAll('.timeline-node').length, 3);
  d.querySelector('[data-id="P_TEST"]').click();
  assert.match(
    d.querySelector('#atlas-detail').textContent,
    /P_TEST — Article de test/,
  );
  assert.match(
    d.querySelector('#atlas-detail').textContent,
    /R_TEST — Source synthétique/,
  );
  d.querySelector('.detail-link').click();
  assert.match(
    d.querySelector('#atlas-detail h2').textContent,
    /Source synthétique/,
  );
  dom.window.close();
});
test('Recherche et filtre temporel recalculent les compteurs publics', () => {
  const dom = setup(),
    d = dom.window.document,
    input = d.querySelector('#atlas-search');
  input.value = 'Méthode';
  input.dispatchEvent(new dom.window.Event('input'));
  assert.equal(d.querySelectorAll('.timeline-node').length, 1);
  assert.match(d.querySelector('#atlas-count').textContent, /1 élément/);
  input.value = '';
  input.dispatchEvent(new dom.window.Event('input'));
  const year = d.querySelector('#atlas-year');
  year.value = '2024';
  year.dispatchEvent(new dom.window.Event('change'));
  assert.equal(d.querySelectorAll('.timeline-node').length, 1);
  assert.match(
    d.querySelector('.timeline-node').textContent,
    /Source synthétique/,
  );
  dom.window.close();
});
test('Hash direct et vue vide sont explicites', () => {
  const dom = setup(),
    d = dom.window.document;
  dom.window.location.hash = '#watch';
  dom.window.dispatchEvent(new dom.window.Event('hashchange'));
  assert.match(d.querySelector('#atlas-view').textContent, /Aucun élément/);
  dom.window.location.hash = '#papers';
  dom.window.dispatchEvent(new dom.window.Event('hashchange'));
  assert.equal(d.querySelectorAll('.atlas-card').length, 1);
  dom.window.close();
});
