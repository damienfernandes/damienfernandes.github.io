# Référence visuelle et audit d’implémentation

Référence : https://www.victorberbel.work/ — consultation technique le 19 octobre 2026.
Technologies de la référence : Webflow ; GSAP, ScrollTrigger et SplitText identifiés dans ses ressources publiques. Réalisation livrée : Astro, CSS, TypeScript et IntersectionObserver ; aucun export Webflow ni script de suivi réutilisé.

## Valeurs observées dans le CSS public

Fichier consulté : `victor-berbel-portfolio.webflow.shared.6f1ccbae8.min.css`, domaine `cdn.prod.website-files.com`.

| Token               | Valeur dans la feuille de référence | Adaptation                                   |
| ------------------- | ----------------------------------- | -------------------------------------------- |
| fond                | white                               | #fff                                         |
| couleur sombre      | #111                                | #111                                         |
| texte               | #3d3d3d                             | #3d3d3d                                      |
| fond discret        | #f3f3f3                             | #f3f3f3                                      |
| marque              | #c6fb50                             | #c6fb50                                      |
| vert sombre         | #193440                             | #193440                                      |
| menthe              | #a8e6cf                             | #a8e6cf                                      |
| titre h1            | 7.75rem                             | maximum 7.75rem, clamp responsive            |
| titre h2            | 6.125rem                            | maximum 6.125rem, clamp responsive           |
| rayon principal     | 1rem                                | 1rem                                         |
| conteneur principal | 1400px                              | 1400px hors gouttières                       |
| famille principale  | PP Neue Montreal                    | Arial/Helvetica système, licence non fournie |

Ces valeurs sont des tokens CSS déclarés, pas un relevé de styles calculés à tous les viewports. Gouttières, breakpoints, animations et composition détaillée sont des adaptations ; ne pas les présenter comme mesures du site original.

## Correspondances

| Rôle                        | Implémentation                       | Vérification disponible                    |
| --------------------------- | ------------------------------------ | ------------------------------------------ |
| Navigation et identité      | SiteHeader, DesktopNav, MobileNav    | structure, routes et handlers              |
| Grand manifeste d’accueil   | HeroIntro                            | build ; QA visuelle restante               |
| Grille de travaux           | ProjectGrid, ProjectCard, MediaFrame | build ; illustrations originales           |
| Axes / services numérotés   | ResearchAxes                         | contenu et structure                       |
| Étude de cas                | CaseStudyLayout                      | routes et build                            |
| Appel à échange             | ContactBlock                         | liens internes/externes                    |
| Bibliographie académique    | PublicationCard                      | projection publique, aucun exemple inventé |
| Application dédiée          | AtlasPreview, app.ts                 | tests DOM, filtres, graphe, fiches         |
| Liens, boutons, intertitres | InlineLink, Button, SectionHeading   | CSS responsive et focus                    |
| Pied de page                | SiteFooter                           | liens vérifiés au build                    |

## Limites et recette manuelle

Aucun navigateur interactif de contrôle disponible dans l’environnement de génération. Pas de captures comparatives produites ; fidélité « pixel perfect », contraste mesuré, score Lighthouse et accessibilité exhaustive non revendiqués.

À vérifier sur votre machine à 390, 768, 1440 et 1920 px : accueil, projets, étude de cas, menu fermé/ouvert, Atlas rempli, fiche sélectionnée, clavier et réduction des mouvements. Comparer avec les pages effectivement accessibles de la référence. Les interactions observées uniquement dans le code doivent rester marquées non vérifiées visuellement.

Les polices sont le principal écart assumé. Si vous possédez une licence web adaptée pour une autre police, ajouter les fichiers autorisés, les déclarations `@font-face`, puis refaire la comparaison. Les visuels sont des diagrammes SVG originaux, pas les images de Victor Berbel.
