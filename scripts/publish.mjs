import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { extract } from './extract-atlas.mjs';
import { validate, scanFiles } from './validate-public.mjs';
import { assert } from './lib/atlas.mjs';
import {
  root,
  externalDir,
  candidateFiles,
  inventory,
  sourceBindings,
  writeJSON,
  walk,
} from './lib/files.mjs';
import {
  validateTarget,
  currentDigest,
  snapshotDigest,
  verifyPrepared,
} from './lib/release.mjs';
const mode = process.argv[2] || '--prepare';
function run(cmd, args, options = {}) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', ...options });
  if (r.status !== 0)
    throw new Error(
      `Échec ${cmd} ${args[0] || ''} : ${(r.stderr || r.stdout || r.error?.message || '').slice(0, 2000)}`,
    );
  return (r.stdout || '').trim();
}
function git(args, cwd) {
  return run('git', args, { cwd });
}
function gh(args) {
  return run('gh', args);
}
function reportDiff(prev, next) {
  const a = new Map((prev || []).map((x) => [x.file, x.sha256])),
    b = new Map(next.map((x) => [x.file, x.sha256]));
  return {
    added: [...b.keys()].filter((k) => !a.has(k)),
    removed: [...a.keys()].filter((k) => !b.has(k)),
    changed: [...b.keys()].filter((k) => a.has(k) && a.get(k) !== b.get(k)),
  };
}
async function main() {
  assert(
    ['--prepare', '--deploy'].includes(mode) && process.argv.length <= 3,
    'Utiliser --prepare ou --deploy uniquement. Aucun --yes accepté.',
  );
  if (mode === '--deploy')
    assert(
      process.stdin.isTTY && process.stdout.isTTY,
      'La publication exige un terminal humain interactif. Aucun accord automatisé accepté.',
    );
  const review = externalDir(process.env.ATLAS_REVIEW_DIR),
    preparedFile = path.join(review, 'prepared.json'),
    snapshot = path.join(review, 'snapshot'),
    target = validateTarget(
      JSON.parse(
        fs.readFileSync(path.join(root, 'config/target.json'), 'utf8'),
      ),
    );
  assert(
    !process.env.SITE_BASE || process.env.SITE_BASE === target.base,
    'SITE_BASE doit correspondre à config/target.json pour publier',
  );
  if (mode === '--prepare') {
    const previous = fs.existsSync(preparedFile)
      ? JSON.parse(fs.readFileSync(preparedFile, 'utf8'))
      : null;
    await extract();
    fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'verify'], {
      stdio: 'inherit',
    });
    const data = validate();
    assert(
      data.prepared &&
        Object.values(data).some((v) => Array.isArray(v) && v.length),
      'Atlas public vide : publication bloquée',
    );
    const files = candidateFiles(),
      items = inventory(files);
    const next = path.join(review, 'snapshot-next');
    fs.rmSync(next, { recursive: true, force: true });
    fs.mkdirSync(next, { recursive: true });
    for (const file of files) {
      const dest = path.join(next, 'source', path.relative(root, file));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(file, dest);
    }
    fs.cpSync(path.join(root, 'dist'), path.join(next, 'dist'), {
      recursive: true,
    });
    scanFiles(walk(next));
    if (fs.existsSync(snapshot)) {
      const diff = spawnSync(
        'git',
        [
          'diff',
          '--no-index',
          '--',
          path.join(snapshot, 'source'),
          path.join(next, 'source'),
        ],
        { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
      );
      assert(
        [0, 1].includes(diff.status),
        'Impossible de produire le diff : Git est requis',
      );
      fs.writeFileSync(path.join(review, 'public-diff.patch'), diff.stdout);
    } else
      fs.writeFileSync(
        path.join(review, 'public-diff.patch'),
        'Première préparation : tous les fichiers de source sont nouveaux. Voir file-inventory.json.\n',
      );
    fs.rmSync(snapshot, { recursive: true, force: true });
    fs.renameSync(next, snapshot);
    const receipt = {
      version: 1,
      created: new Date().toISOString(),
      target,
      sourceDigest: currentDigest(),
      snapshotDigest: snapshotDigest(snapshot),
      bindings: sourceBindings(),
      files: items,
      diff: reportDiff(previous?.files, items),
    };
    writeJSON(preparedFile, receipt);
    writeJSON(path.join(review, 'file-inventory.json'), items);
    console.log(
      `\nPRÉPARATION TERMINÉE — aucune opération distante.\nLot : ${receipt.snapshotDigest}\nCible : ${target.owner}/${target.repo} (public)\nExaminez le snapshot, public-diff.patch et extraction-report.json dans le dossier de revue.\nAperçu : npm run preview -- --host 127.0.0.1\nPuis, uniquement après vérification : npm run publish -- --deploy`,
    );
    return;
  }
  assert(fs.existsSync(preparedFile), 'Aucun lot préparé');
  const receipt = JSON.parse(fs.readFileSync(preparedFile, 'utf8'));
  verifyPrepared(receipt, snapshot);
  const full = `${target.owner}/${target.repo}`,
    url = target.site + target.base;
  const phrase = `PUBLIER ${full} ${receipt.snapshotDigest}`;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let answer;
  try {
    answer = await rl.question(
      `\nConfirmez-vous avoir vérifié l’aperçu local, le diff et le rapport ?\nAutorisez-vous la création/mise à jour du dépôt PUBLIC ${full}, le push du lot ${receipt.snapshotDigest}, la configuration Pages et sa mise en ligne à ${url} ?\nSaisissez exactement « ${phrase} » ; toute autre réponse annule.\n> `,
    );
  } finally {
    rl.close();
  }
  assert(answer === phrase, 'Publication annulée. Aucune mutation distante.');
  verifyPrepared(receipt, snapshot);
  const identity = gh(['api', 'user', '--jq', '.login']);
  assert(
    identity === target.owner,
    'Le compte GitHub authentifié ne correspond pas à Damien',
  );
  const lastFile = path.join(review, 'last-published.json'),
    last = fs.existsSync(lastFile)
      ? JSON.parse(fs.readFileSync(lastFile, 'utf8'))
      : null;
  const probe = spawnSync('gh', ['api', `repos/${full}`], { encoding: 'utf8' });
  let exists = probe.status === 0,
    repo;
  if (exists) {
    repo = JSON.parse(probe.stdout);
    assert(
      repo.private === false,
      'Le dépôt existant n’est pas public : aucun changement de visibilité automatique',
    );
    assert(
      last?.target === full,
      'Dépôt existant non géré : arrêt sans remplacement. Préparer une intégration manuelle.',
    );
    const remote = gh([
      'api',
      `repos/${full}/git/ref/heads/main`,
      '--jq',
      '.object.sha',
    ]);
    assert(
      remote === last.commit,
      'Le dépôt distant a évolué : réconciliation manuelle requise',
    );
  } else
    assert(
      /HTTP 404/.test(probe.stderr || ''),
      'Impossible de déterminer si le dépôt existe : arrêt',
    );
  const exportDir = path.join(review, 'git-export');
  assert(
    !fs.existsSync(exportDir),
    'git-export existe déjà. Conservez-le pour diagnostic, puis déplacez-le avant un nouvel essai.',
  );
  if (exists) {
    gh(['repo', 'clone', full, exportDir, '--', '--branch', 'main']);
    assert(
      git(['rev-parse', 'HEAD'], exportDir) === last.commit,
      'Clone divergent',
    );
    const tracked = git(['ls-files', '-z'], exportDir)
      .split('\0')
      .filter(Boolean);
    assert(
      JSON.stringify(tracked.sort()) ===
        JSON.stringify(last.files.slice().sort()),
      'Fichiers distants inattendus',
    );
    for (const f of tracked)
      fs.rmSync(path.join(exportDir, f), { force: true });
  } else {
    fs.mkdirSync(exportDir, { recursive: true });
    git(['init', '-b', 'main'], exportDir);
  }
  for (const file of walk(path.join(snapshot, 'source'))) {
    const dest = path.join(
      exportDir,
      path.relative(path.join(snapshot, 'source'), file),
    );
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
  }
  scanFiles(
    walk(exportDir).filter((p) => !p.includes(path.sep + '.git' + path.sep)),
  );
  git(['config', 'user.name', 'Damien Fernandes'], exportDir);
  git(
    ['config', 'user.email', `${target.owner}@users.noreply.github.com`],
    exportDir,
  );
  git(['add', '--all'], exportDir);
  const changes = git(['status', '--porcelain'], exportDir);
  if (changes)
    git(
      [
        'commit',
        '-m',
        `Publish reviewed site ${receipt.snapshotDigest.slice(0, 12)}`,
      ],
      exportDir,
    );
  const commit = git(['rev-parse', 'HEAD'], exportDir);
  writeJSON(path.join(review, 'approval.json'), {
    approvedAt: new Date().toISOString(),
    target: full,
    snapshotDigest: receipt.snapshotDigest,
    commit,
    operations: [
      'create-or-update-public-repository',
      'push-main',
      'configure-pages',
      'dispatch-pages',
    ],
    note: 'Trace locale de confirmation interactive, pas signature cryptographique.',
  });
  if (!exists) {
    gh(['repo', 'create', full, '--public']);
    git(
      ['remote', 'add', 'origin', `https://github.com/${full}.git`],
      exportDir,
    );
  }
  // Configure Git credential helper for this export only; do not modify global credentials.
  git(
    [
      'config',
      'credential.https://github.com.helper',
      '!gh auth git-credential',
    ],
    exportDir,
  );
  git(['push', 'origin', 'HEAD:main'], exportDir);
  writeJSON(lastFile, {
    target: full,
    commit,
    files: receipt.files.map((f) => f.file),
  });
  const pages = spawnSync('gh', ['api', `repos/${full}/pages`], {
    encoding: 'utf8',
  });
  if (pages.status === 0)
    gh([
      'api',
      '--method',
      'PUT',
      `repos/${full}/pages`,
      '-f',
      'build_type=workflow',
    ]);
  else {
    assert(/HTTP 404/.test(pages.stderr || ''), 'Lecture Pages impossible');
    gh([
      'api',
      '--method',
      'POST',
      `repos/${full}/pages`,
      '-f',
      'build_type=workflow',
    ]);
  }
  gh([
    'workflow',
    'run',
    'pages.yml',
    '--repo',
    full,
    '--ref',
    'main',
    '-f',
    `approved_sha=${commit}`,
  ]);
  let runs = [];
  for (let i = 0; i < 12; i++) {
    runs = JSON.parse(
      gh([
        'run',
        'list',
        '--repo',
        full,
        '--workflow',
        'pages.yml',
        '--commit',
        commit,
        '--event',
        'workflow_dispatch',
        '--json',
        'databaseId,headSha',
        '--limit',
        '1',
      ]),
    );
    if (runs.length) break;
    await new Promise((r) => setTimeout(r, 5000));
  }
  assert(
    runs.length,
    'Workflow déclenché ; vérifier son exécution dans GitHub Actions',
  );
  gh([
    'run',
    'watch',
    String(runs[0].databaseId),
    '--repo',
    full,
    '--exit-status',
  ]);
  for (const p of ['', 'atlas/', 'publications/']) {
    const response = await fetch(url + p);
    assert(response.ok, `Page à vérifier : ${url + p} (${response.status})`);
  }
  console.log(
    `Publication vérifiée : ${url}\nCommit : ${commit}\nDéplacez git-export hors du dossier de revue avant la prochaine publication.`,
  );
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
