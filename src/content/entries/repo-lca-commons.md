---
title: "lca-commons"
section: "repositories"
description: "Bibliothèque Python partagée définissant les contrats d'unités typées (UO/UF/UD), les schémas d'indicateurs multicritères et les validateurs d'invariants."
date: 2026-02-24
repoVisibility: "internal"
platform: "GitLab 74Software / SBS"
license: "74Software license"
public: true
---

Bibliothèque socle (`v0.1.0+`) partagée entre **Envira**, **GreenOps**, **CLEMIS** et **brightway-lci-engine** afin de garantir l'interopérabilité sémantique et d'interdire par construction les erreurs d'unités ou les recombinaisons incohérentes de scénarios.

### Fonctionnalités principales

- **Typage fort des unités ACV :** Implémentation informatique de la signature obligatoire (`estimand_type`, `fu_id`, `population_id`, `period`, `world`, `quality_gate`, `indicator`, `unit`) empêchant d'additionner ou de diviser une unité fonctionnelle de service (`UF`), un compte organisationnel (`UO`) et un contraste décisionnel (`UD`).
- **Vecteurs multicritères indivisibles :** Structures de données standardisées pour les 4 indicateurs cibles (**GWP**, **WU / AWARE**, **ADPe**, **PE**) intégrant la *Porte Anti-Mosaïque* (interdiction de combiner les meilleurs scores issus de scénarios physiques incompatibles).
- **Qualification épistémique :** Propagation explicite des statuts de donnée (`M` mesuré, `E` estimé, `B` borné, `X` inconnu) pour éviter qu'une valeur manquante ne soit silencieusement convertie en zéro physique.

### Rattachement méthodologique (Atlas)

- **Blocs méthodologiques :** **Bloc B1** (*Contrat à 3 Unités & Typage*), **Bloc B8** (*Caractérisation & Porte Anti-Mosaïque*), **Bloc B12** (*Invariants de structure A0*).