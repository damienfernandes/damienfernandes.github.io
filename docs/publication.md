# Publication contrôlée sur GitHub Pages

## Avant de publier

Installer Git et GitHub CLI. S’authentifier avec `gh auth login` en tant que `damienfernandes` sur sa propre machine. Ne mettre aucun token dans le dépôt ou un fichier de configuration. Le script vérifie l’identité, sans changer le compte utilisé.

La cible proposée est publique. Pour un dépôt de projet, modifier ensemble `repo` et `base` dans `config/target.json`, par exemple `site-vitrine` et `/site-vitrine/`. Le champ `site` reste `https://damienfernandes.github.io`.

## Préparation

Définir les trois variables externes de l’extraction, puis `npm run publish -- --prepare`.

Cette phase :

1. vérifie la source et la politique ; reconstruit données et images approuvées ;
2. exécute les tests, `astro check`, le build et le contrôle des routes ;
3. scanne les fichiers candidats et le build ;
4. copie uniquement les fichiers permis dans un snapshot externe neuf ;
5. produit `prepared.json`, `file-inventory.json`, `public-diff.patch` et le rapport d’extraction ;
6. affiche les instructions d’aperçu et s’arrête sans opération distante.

`npm run preview -- --host 127.0.0.1` sert le build local. Pour prévisualiser exactement le snapshot, servir son dossier `dist` avec un serveur statique local. Ne pas employer un hébergement externe avant accord. Avec une base de projet, ouvrir l’URL avec le préfixe correspondant lors de la prévisualisation Astro.

## Confirmation et déploiement

`npm run publish -- --deploy` exige un TTY réel et la phrase : `PUBLIER owner/repo empreinte-intégrale`. L’agent Kiro doit s’arrêter et laisser Damien examiner le résultat puis exécuter cette action. Un reçu existant n’autorise pas une publication suivante. Pas d’option `--yes`.

Le code, la configuration, les dépendances et les workflows sont liés par l’empreinte du lot. Le HTML source et le manifeste sont liés par des empreintes séparées. Les fichiers du snapshot sont vérifiés avant et après la confirmation. Tout changement exige une nouvelle préparation.

Après accord seulement : vérification d’identité, détection du dépôt, export Git propre, commit, push sans force, configuration Pages et déclenchement manuel du workflow sur le SHA exact. Le script attend le workflow et vérifie les URL accueil, Atlas, publications. Les opérations distantes réelles n’ont pas été exécutées pendant le développement : les permissions de votre compte et la disponibilité Pages seront vérifiées à l’exécution.

## Dépôt existant

Un dépôt existant non enregistré dans le fichier externe `last-published.json` est refusé. Le script ne remplace pas silencieusement un site existant. Dans ce cas, préparer une branche et faire examiner l’intégration, ou choisir un autre dépôt de projet. Ne pas fabriquer un reçu pour contourner cette protection.

Pour une mise à jour gérée, la tête distante doit correspondre au dernier commit publié et la liste des fichiers suivis au dernier inventaire. Le clone ne réutilise jamais l’historique du workspace privé : seules les versions publiques précédemment créées par ce parcours sont prolongées. Toute modification distante non prévue bloque la suite.

Un dossier `git-export` est gardé hors dépôt pour diagnostic. Le déplacer après un succès avant de relancer un déploiement. Si une étape échoue après le push, le dépôt peut déjà avoir été mis à jour ; examiner GitHub et les rapports avant toute reprise. Le déploiement n’est pas une transaction atomique réversible.

## Workflow

- Déclenchement `workflow_dispatch` uniquement.
- Paramètre `approved_sha` égal à `github.sha` obligatoire.
- `npm ci`, tests, contrôle de types et build sans accès à l’Atlas privé.
- Atlas préparé et non vide obligatoire.
- Seul `dist/` devient l’artefact Pages.
- Permissions `contents:read`, puis `pages:write` et `id-token:write` au job de déploiement.
- Concurrence Pages avec annulation des anciens runs.
- Actions épinglées par SHA vérifiés dans les dépôts officiels.

La vérification du SHA dans le workflow est un garde technique, pas une preuve de consentement humain. Un administrateur GitHub conserve la capacité de modifier le workflow : appliquer les protections de branche/environnement adaptées si plusieurs personnes administrent le dépôt.

## Commandes npm

Toujours **`npm run publish -- --prepare`** ou **`npm run publish -- --deploy`**. Jamais `npm publish`. Ce projet ne publie aucun paquet sur npm.
