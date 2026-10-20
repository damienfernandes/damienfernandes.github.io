# Damien Fernandes — Astro + Atlas

Projet importable : vitrine Astro, application Atlas publique, extracteur à autorisation explicite, préparation locale et publication GitHub Pages avec confirmation humaine. Aucun compte distant n’a été modifié lors de sa création.

## Démarrer

Node **24.19.0** (voir `.nvmrc`), npm 11+, Git. GitHub CLI `gh` uniquement pour la publication.

```sh
npm ci
npm run dev
```

Ouvrir l’URL affichée, généralement `http://localhost:4321`. La route `/style-guide/` n’existe qu’en développement.

```sh
npm run verify
npm run preview
```

Le site fonctionne immédiatement. L’Atlas affiche « non préparé » tant qu’aucun contenu n’a été explicitement approuvé. Le projet ne contient pas votre HTML de recherche privé. Les données synthétiques des tests ne constituent pas des publications réelles et ne sont pas livrées dans le site.

## Importer dans un projet existant

Décompresser dans un dossier neuf. Comparer d’abord `package.json`, `astro.config.mjs`, `src/` et les workflows avec votre projet. Ne pas écraser vos fichiers existants sans examiner le diff. Copier les composants nécessaires ou utiliser cette arborescence comme base. Exécuter `npm ci` dans ce dossier, pas dans son parent. Le lockfile fourni fait autorité ; ne pas copier `node_modules`.

## Configurer les contenus

- `src/config/site.ts` : identité, description, contact public facultatif, GitHub.
- `src/config/navigation.ts` : menus al-folio.
- `src/content/entries/*.md` : blog, CV, enseignement, livres, actualités, collaborations et dépôts sélectionnés. Voir `docs/content.md`.
- `src/styles/tokens.css` : couleurs, typographie et espacements.
- `config/target.json` : dépôt proposé et base GitHub Pages.
- `generated/public/atlas.json` : sortie de l’extracteur, jamais source privée.

Les textes de cadrage de l’accueil sont proposés pour revue. Aucune affiliation détaillée, biographie, photographie, adresse e-mail ni liste de publications non confirmée n’a été ajoutée.

## Préparer l’Atlas public

Lire **`docs/extraction.md`** avant d’utiliser une source réelle. Conserver l’HTML privé, le manifeste d’autorisation et les rapports **hors du projet**.

Exemple Bash/macOS/Linux (adapter les chemins) :

```sh
export ATLAS_SOURCE="/absolute/external/atlas.html"
export ATLAS_REVIEW_DIR="/absolute/external/site-review"
npm run atlas:manifest
export ATLAS_POLICY="$ATLAS_REVIEW_DIR/public-policy.json"
```

Le manifeste créé est volontairement vide. Examiner les candidats dans le dossier de revue, puis sélectionner chaque objet et chaque champ autorisés. Le manifeste est lié à l’empreinte de votre source. Ensuite :

```sh
npm run atlas:extract
npm run verify
npm run preview
```

Windows PowerShell : utiliser `$env:ATLAS_SOURCE = 'D:\external\atlas.html'` et la même forme pour les autres variables. Utiliser Node/Git/gh dans WSL est également possible.

## Publication : deux phases séparées

```sh
npm run publish -- --prepare
# Vérifier l’aperçu, le snapshot et les rapports hors dépôt.
npm run publish -- --deploy
```

**Ne pas exécuter `npm publish` ni `pnpm publish`.** Le projet est marqué `private:true` et `publish` est un script local. Avec pnpm : `pnpm run publish --prepare` / `pnpm run publish --deploy`, mais conserver npm comme gestionnaire de dépendances pour le lockfile fourni.

La préparation n’appelle ni GitHub ni un hébergeur. La publication exige un terminal interactif, la saisie de la cible et de l’empreinte intégrale du lot. Pas de `--yes`, pas de confirmation par un agent. Toute modification des entrées exige une nouvelle préparation.

Cible proposée : `damienfernandes/damienfernandes.github.io`. Un dépôt existant non géré par ce script provoque un arrêt sans remplacement. Lire `docs/publication.md`.

## Vérification et limites

Voir `docs/verification.md`. Build statique, contrôles de types, tests de projection et tests DOM automatisés. La comparaison visuelle dans un vrai navigateur et la publication GitHub restent à effectuer sur votre machine. La direction visuelle transpose les tokens et principes de Victor Berbel ; il ne s’agit pas d’une copie Webflow pixel par pixel. Polices système, illustrations SVG originales, aucun tracker.

Les formats d’assets importés sont volontairement limités aux PNG validés avec métadonnées retirées. Les PDF, archives et sources maps sont bloqués dans le lot public tant qu’un audit adapté n’est pas ajouté. Le CV peut être rédigé en Markdown dès maintenant.
