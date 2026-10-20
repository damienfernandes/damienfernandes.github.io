# Décisions d’architecture

- Astro 7.4.0, sortie statique et composants Astro. Version résolue depuis le registre npm lors du développement ; dependencies exactes et lockfile fourni.
- JavaScript d’interface uniquement pour navigation et Atlas ; aucune dépendance React ni GSAP nécessaire aux effets retenus.
- parse5 pour lire le bloc Atlas sans exécuter le document. DOM textContent pour afficher les données publiques.
- Tests Node et jsdom : tests fonctionnels sans navigateur, sans téléchargement de navigateur ni capture simulée.
- Polices système et SVG originaux pour éviter les dépendances à des assets tiers non autorisés.
- Markdown + collections Astro, sans CMS payant ni backend. Les fichiers Markdown sont des sources de confiance.
- Pas de requête distante au build pour récupérer des publications, profils ou statistiques. Pas de métrique académique fictive.
- Arborescence publique propre, export Git indépendant du workspace privé ; toutes les versions poussées par le script proviennent de snapshots revus.
- Refus des formats documentaires non audités. Extension à PDF/vidéo à réaliser seulement avec une politique et des tests adaptés.
- L’Atlas public est construit à neuf. L’Atlas complet, ses notes CSI, son journal et ses documents restent à leur emplacement privé.
- Footer millésimé 2026 : aucune date courante injectée dans le build, pour faciliter la reproductibilité.
- npm comme gestionnaire avec package-lock. Le nom du script publish est maintenu conformément à la spécification, mais il ne faut jamais appeler la publication native npm.
