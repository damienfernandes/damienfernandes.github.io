# Extraction de l’Atlas et limites de diffusion

## Adaptateur

`atlas-legacy-v10` parse le HTML avec parse5 et lit exactement un `script#atlas-data`, sans exécuter le JavaScript. Il accepte les collections `refs`, `blocks`, `papers`, `researchWatch` et les métadonnées privées connues du format v10. Les champs exportables sont explicités dans `scripts/lib/atlas.mjs`. Tout changement de structure inconnu provoque un arrêt : adapter et tester le schéma, jamais copier le HTML en secours.

La version d’adaptateur n’est pas l’affirmation que toute future version de votre Atlas aura ce format. Le fichier exact à utiliser doit être identifié dans votre propre workspace. Le JSON généré contient la sélection publique ; le HTML d’origine reste hors du dépôt du site.

Les fiches `researchWatch` acceptent soit `name`, soit `title`, ainsi que les métadonnées bibliographiques `authors`, `year`, `url` et les relations `blocks`. Les relations `ref` doivent toujours cibler une référence publique existante. Ajouter une notice depuis une bibliographie locale ne constitue pas une revérification de la référence ou des affirmations associées.

L’objet facultatif `scientificWatch` accepte uniquement `updatedAt`, `sourceFile`, `metrics` et `openQuestionsMatrix`, avec validation des champs imbriqués, des compteurs et des textes. Il reste exclu par défaut. Pour le sélectionner, ajouter au manifeste une liste `scientificWatch` contenant les noms exacts des champs autorisés. Cette sélection est inscrite dans le rapport d’extraction. Les `papers` de la matrice ciblent des articles publics ; ses `readings` sont des clés de la bibliographie externe, sans lien Atlas implicite. Les compteurs existants sont déclaratifs et ne prouvent pas une vérification des sources.

## Autorisation

`npm run atlas:manifest` crée hors dépôt :

- `public-policy.json` : hash exact de la source, aucun objet autorisé ;
- `candidates-private.json` : données pour revue locale, **privées**.

Après lecture des valeurs, ajouter des règles comme celle-ci, avec un identifiant réellement présent :

```json
{
  "schemaVersion": 1,
  "adapter": "atlas-legacy-v10",
  "sourceSha256": "empreinte exacte créée par le script",
  "defaultVisibility": "private",
  "records": [
    {
      "collection": "refs",
      "id": "IDENTIFIANT_REEL",
      "visibility": "public",
      "fields": ["id", "title", "authors", "year", "url"]
    }
  ],
  "assets": []
}
```

L’identifiant et le titre (`name` pour la veille) sont obligatoires. N’autoriser que des champs réellement présents et relus. `title`, `question`, `risk` ou `summary` ne sont pas publics par nature. Les statuts et vérifications proviennent de la source et ne sont pas certifiés par le logiciel.

Les objets sont reconstruits champ par champ. Les relations vers objets exclus sont retirées. Les compteurs, graphes, recherches et exports ne connaissent que cette projection. Les années manquantes restent manquantes. Le journal, les notes CSI, les avis d’encadrement et les fiches détaillées privées ne font pas partie du schéma public actuel. Publier une synthèse requiert une entrée distincte autorisée et une évolution testée du schéma, pas l’ajout du journal brut.

Les textes sont rendus comme texte, sans HTML actif. Les liens HTTP(S) publics sont autorisés, les protocoles locaux et actifs refusés. Les fragments HTML sont réduits à leur texte ; pour une équation contenant des chevrons, employer les entités HTML correspondantes dans la source ou revoir le résultat de la projection. La lecture des champs libres par Damien reste indispensable.

## Images

Pour importer un PNG, définir `ATLAS_ASSET_ROOT` sur un dossier externe puis ajouter une entrée `assets` :

```json
{
  "source": "images/schema.png",
  "name": "schema-public.png",
  "sha256": "empreinte SHA-256 exacte du fichier",
  "metadataReviewed": true
}
```

Les chemins absolus, traversées `..`, liens symboliques et noms dupliqués sont refusés. Le fichier est vérifié par empreinte. Les chunks auxiliaires PNG (texte, EXIF, profils, date…) sont retirés ; le contenu visuel doit être relu indépendamment. Le résultat est copié vers `public/atlas-assets/`. L’extracteur remplace intégralement ce dossier généré à chaque extraction. Le renderer ne déduit pas automatiquement l’association image/article : insérer le média autorisé dans une page Astro si souhaité.

Formats non pris en charge : PDF, JPEG, archives, documents Office. Ils sont à convertir/auditer avant d’étendre la politique et les tests. Aucune promesse de neutralisation générique de documents binaires n’est faite.

## Revue et sentinelles

`extraction-report.json` contient les champs inclus/exclus et les projections avant/après. Il reste hors dépôt. Une politique vide bloque la publication, tout en laissant la vitrine prévisualisable.

Option : `PUBLIC_FORBIDDEN_FILE` pointe vers un JSON externe de chaînes qu’il est interdit de diffuser. Le scan couvre le futur lot source et `dist`. Il ne prouve pas à lui seul la confidentialité : toutes les valeurs autorisées et tous les fichiers publics doivent être relus.

L’extraction et les tests remplacent temporairement des fichiers générés : ne pas lancer deux préparations/tests en parallèle dans un même checkout.
