# Contenus et rigueur scientifique

Les fichiers Markdown sont chargés par une collection Astro validée. Exemple à créer dans `src/content/entries/mon-billet.md` après revue :

```md
---
title: Un titre réel
description: Une description validée.
section: blog
public: true
date: 2026-10-19
---

Texte public validé, avec ses sources.
```

Sections possibles : `blog`, `news`, `teaching`, `people`, `books`, `repositories`, `cv`. Le nom du fichier donne le slug. Les chemins imbriqués sont acceptés. **Tout fichier situé dans ce projet est candidat au dépôt public**, même avec `public:false`. Ce booléen contrôle seulement la route ; il ne protège jamais un brouillon privé. Ne pas stocker de brouillons confidentiels ici.

Les fiches de recherche sont issues de la projection Atlas, sur `/publications/` et `/atlas/#papers`. Elles conservent leur état déclaré. Ne pas assimiler « projet », « en préparation », « prépublication », « soumis », « accepté » et « publié ». Une revendication d’innovation n’est pas une preuve de nouveauté. Vérifier chaque DOI, titre, auteur, année auprès de la source primaire avant approbation.

Aucune priorité P0–P7 / ATL-N n’est inventée. Le graphe présente les relations explicitement documentées et une chronologie des années renseignées. Il ne transforme pas ces liens en ordonnanceur ni en causalité. Le détail d’un article résout chaque code public en un titre lisible.

Le renderer traite le contenu des fiches comme texte : aucune injection HTML/Markdown exécutée côté client. Pour un article rédigé en Markdown, les fichiers sont des contenus de confiance à relire, comme les composants Astro. Ne jamais y coller du HTML source privé complet.

La route Atlas expose cinq vues : graphe temporel, méthodes, articles, sources, veille. L’export JSON porte sur l’ensemble du modèle public, pas seulement les filtres visuels. Un export HTML autonome n’est pas inclus, car il était optionnel dans la spécification.

Le style guide n’est pas généré en production. `/plugins/` n’est pas transposé : c’est une rubrique propre au thème al-folio, sans usage dans cette implémentation Astro.
