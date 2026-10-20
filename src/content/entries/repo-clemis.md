---
title: "clemis"
section: "repositories"
description: "Moteur d'ingestion, d'allocation et de traçabilité des indicateurs environnementaux d'infrastructures numériques pour le reporting extra-financier (CSRD)."
date: 2026-03-20
repoVisibility: "internal"
platform: "GitLab 74Software / SBS"
license: "74Software license"
public: true
---

Application et moteur de calcul développés pour automatiser l'ingestion des flux d'activité d'infrastructure, la répartition des impacts environnementaux par ligne de service métier et la production de pistes d'audit vérifiables.

### Fonctionnalités principales

- **Ingestion & Persistance :** Collecte automatisée des exports d'infrastructure Cloud et des métriques d'orchestration Kubernetes, stockés dans un modèle relationnel **PostgreSQL** historisé.
- **Moteur de règles d'allocation :** Répartition des consommations partagées (environnements mutualisés, stockage, réseau, résilience) entre produits et processus métiers avec traçabilité complète des clés de répartition.
- **Intégration des garde-fous méthodologiques :** Prise en compte des limites entre comptabilité attributionnelle (reporting réglementaire **CSRD / ESRS E1**) et modélisation conséquentielle d'aide à la décision d'architecture.

### Rattachement méthodologique (Atlas)

- **Blocs méthodologiques :** **Bloc B1** (*Distinction entre Unité Organisationnelle UO et Unité de Décision UD*) et **Bloc B2** (*Réconciliation des totaux fournisseurs et allocation des ressources partagées*).