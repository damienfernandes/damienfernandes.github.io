# Rapport de vérification — 19 octobre 2026

## Résultats obtenus

| Vérification                                     | Résultat                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Tests Node + DOM                                 | 22 réussis, 0 échec                                                                              |
| Astro / TypeScript                               | 0 erreur, 0 avertissement, 0 indication                                                          |
| Build statique                                   | 15 pages générées                                                                                |
| Routes / liens internes à la racine              | validés                                                                                          |
| Build et liens sous `/site-vitrine/`             | validés                                                                                          |
| Adaptateur sur la structure Atlas v10 disponible | lecture réussie ; aucun enregistrement réel exporté                                              |
| Préparation complète avec source synthétique     | snapshot source + dist, inventaire, diff et empreinte produits                                   |
| Accès GitHub pendant la préparation              | aucun ; commande `gh` remplacée par un garde bloquant pendant la recette                         |
| Déploiement sans terminal humain                 | refusé avant tout accès distant                                                                  |
| Assets                                           | traversée, symlink et empreinte divergente refusés ; métadonnées PNG retirées                    |
| Confidentialité                                  | sentinelles dans HTML, attributs, scripts et données absentes du build et des fichiers candidats |

Les tests de projection contrôlent aussi : autorisation par objet ET champ, hash de source, IDs dupliqués, schéma inconnu, politique vide, assainissement, relations orphelines et invalidation de reçu. Les tests DOM contrôlent le graphe, les fiches et intitulés, la recherche, les années et les vues par hash.

Les fixtures sont synthétiques. Après la recette, le jeu de données livré a été réinitialisé à l’état « Atlas public non préparé ». Les journaux de tests contenant des chemins de l’environnement de génération ne sont pas embarqués.

## Vérifications restant à réaliser

- Comparaison visuelle avec Victor Berbel dans un navigateur réel : non réalisée dans cet environnement. Voir `reference-audit.md`.
- Clavier et lecteur d’écran en navigateur, Safari/Firefox/Chromium, mobile réel et mesure Lighthouse : recette manuelle à effectuer ; aucun score n’est annoncé.
- Publication réelle : non exécutée. L’identité GitHub, les permissions Pages, le dépôt éventuel et le workflow distant seront vérifiés après confirmation explicite de Damien.
- Contenus académiques : le code vérifie leur structure, pas leur vérité. La sélection, les droits de diffusion et les références restent soumis à revue.

## Couverture des critères de la spécification

- AC-01 / AC-04 : routes, navigation et hashes implémentés ; liens vérifiés.
- AC-02 : tokens observés et adaptation documentés ; validation visuelle complète restante.
- AC-03 : aucun témoignage, résultat, publication acceptée ou biographie détaillée fictifs.
- AC-05 à AC-09 : projection, sentinelles, schéma, filtres et relations testés.
- AC-10 / AC-11 : préparation sans mutation distante, non-TTY et empreintes testés.
- AC-12 : branche d’annulation implémentée avant toute mutation ; confirmation terminal réelle à tester manuellement.
- AC-13 : transfert depuis un export Git propre, jamais l’historique privé ; mises à jour limitées au dernier état connu. Test distant non réalisé.
- Accessibilité / performance : sémantique, focus, réduction des mouvements et chargement limité implémentés ; mesures et recette réelles restantes.

La recette ne certifie ni fidélité pixel par pixel, ni absence universelle de toute donnée sensible dans de futurs contenus ajoutés au projet.
