---
title: "greenops-data, greenops-data-tools & greenops-data-fair"
section: "repositories"
description: "Suite d'outillage pour le conditionnement FAIR, l'anonymisation, la vérification d'intégrité et la diffusion contrôlée des jeux de données empiriques GreenOps."
date: 2026-10-11
repoVisibility: "upon-publication"
platform: "GitLab 74Software / SBS"
license: "74Software (upon publication)"
public: true
---

Ensemble de trois dépôts complémentaires dédiés à la gouvernance des données de recherche, à la reproductibilité scientifique et à la préparation d'artefacts conformes aux principes **FAIR** (*Findable, Accessible, Interoperable, Reusable*) pour les études empiriques menées sur infrastructures Cloud et services d'IA (**P0** et **P7**).

### Structure des trois dépôts

- **`greenops-data-tools` :** Outillage d'empaquetage FAIR, verrouillage strict des dépendances, validation de schémas et application des politiques de publication sur les enregistrements d'exécution et les agrégats statistiques.
- **`greenops-data` :** Stockage structuré et versionné des jeux de données figés (*frozen datasets*), tables de périmètres harmonisées (EC2, EC2+EBS) et résultats de campagnes de réplication.
- **`greenops-data-fair` :** Génération des paquets de reproductibilité destinés à la revue par les pairs, séparant strictement les métadonnées et distributions publiques des données industrielles soumises au secret des affaires.

### Rattachement méthodologique (Atlas)

- **Articles alimentés :** **P0** et **P7** (préparation des jeux figés exigés pour l'auditabilité des résultats).
- **Blocs méthodologiques :** **Bloc B12** (*Assurance A0–A3 & Génération des paquets de reproductibilité Public et Protégé*).