# Installation, intégration et maintenance

1. Installer Node 24.19.0 (`nvm use` si nvm est disponible), Git et npm.
2. Décompresser le projet dans un dossier propre ; ne pas y placer l’Atlas privé.
3. `npm ci`, puis `npm run dev`.
4. Personnaliser les contenus publics et le profil ; examiner `docs/reference-audit.md` pour la recette visuelle.
5. Préparer le manifeste public à partir de votre source externe ; ne pas considérer l’exemple comme une approbation.
6. `npm run verify` puis revue locale.
7. Publier uniquement après l’accord explicite sur le lot final.

Commandes :

| Commande                     | Effet                                                         |
| ---------------------------- | ------------------------------------------------------------- |
| npm run dev                  | serveur local de développement                                |
| npm run check                | diagnostic TypeScript/Astro                                   |
| npm test                     | tests de l’extracteur, du garde de publication et du renderer |
| npm run build                | validation de diffusion puis build statique                   |
| npm run verify               | tests + types + build + liens                                 |
| npm run preview              | aperçu du build                                               |
| npm run atlas:manifest       | manifeste vide et candidats, hors dépôt                       |
| npm run atlas:extract        | extraction explicitement autorisée                            |
| npm run publish -- --prepare | lot, diff, empreinte ; aucun accès GitHub                     |
| npm run publish -- --deploy  | demande interactive puis GitHub/Pages                         |

Avant une mise à jour des dépendances, travailler dans une branche locale, conserver le lockfile, relancer `npm run verify` et la recette visuelle, puis préparer un nouveau lot. Mettre à jour les SHAs d’actions depuis leurs dépôts officiels, jamais à partir d’une valeur devinée.

Pour une base de projet, mettre à jour la cible puis `SITE_BASE=/site-vitrine/ npm run build` et `SITE_BASE=/site-vitrine/ node scripts/check-build.mjs`. L’ensemble des liens internes passe par `href()` et les assets par la base Astro.

Le scan public refuse les fichiers racine inconnus et les symlinks. Ajouter un nouveau dossier à l’allowlist seulement après revue de sa vocation publique. `.gitignore` ne retire pas les secrets déjà committés. Ne pousser aucun historique de recherche privé.
