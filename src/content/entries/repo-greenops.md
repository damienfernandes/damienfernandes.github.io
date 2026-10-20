---
title: "greenops"
section: "repositories"
description: "Plateforme d'évaluation environnementale Cloud (AWS CUR 2.0, BoaviztAPI, télémétrie CPU) et d'estimation de l'empreinte des services d'IA managés."
date: 2026-09-01
repoVisibility: "upon-publication"
platform: "GitLab 74Software / SBS"
license: "74Software (upon publication)"
public: true
order: 1
---

Plateforme d'ingénierie et d'évaluation environnementale devenue autonome en janvier 2026 pour instrumenter l'empreinte multicritère des infrastructures Cloud et des services d'IA managés à l'échelle d'un portefeuille d'entreprise. Ce dépôt constitue le socle expérimental des articles **P0** (Axe A) et **P7** (Axe C).

### Architecture et fonctionnalités principales

- **Couplage Facturation Cloud & Modèles d'Impacts (Socle de P0) :** Ingestion des exports de facturation **AWS CUR 2.0** (140 comptes, plus de 130 000 lignes d'inventaire) couplée à **BoaviztAPI** (impacts opérationnels et *embodied*) et aux métriques de charge CPU réelle issues de **Dynatrace** (corrigeant le biais des taux d'utilisation par défaut à 50 %).
- **Analyse du découplage FinOps / GreenOps :** Calcul de l'erreur d'inversion de rang (*Rank Inversion Rate* — RIR), de l'indice de découplage (DI) et réplications sur corpus publics externes (`FOCUS`, `UFCG`, `Azure V2`) ainsi que comparaison avec AWS CCFT.
- **Évaluation des services d'IA managés (Socle de P7) :** Pipeline d'estimation bornée de la consommation énergétique et carbone (`greenops/scripts/ai_usage/`) à partir des données de facturation et de consommation de tokens (AWS Bedrock, Anthropic Claude, GitHub Copilot, Azure Foundry) en distinguant les opérations de lecture/écriture du cache (`cache_read` / `cache_write`).
- **Jumeau Numérique & Solveur de Trajectoire :** Module de simulation de trajectoires environnementales et d'évaluation de scénarios de réduction d'empreinte à l'échelle d'un portefeuille de services.

### Rattachement méthodologique (Atlas)

- **Articles alimentés :** **P0** (*When Cloud Cost Fails as a Carbon Proxy*), **P7** (*Estimating the Environmental Footprint of Managed AI Services*), **P6** (module `greenops.lca.agentic_llm_impact`).
- **Blocs méthodologiques :** **Bloc B1** (*Contrat à 3 Unités UO/UF/UD*), **Bloc B2** (*Frontières, CUR, Cycles & Seuils*), **Bloc B11** (*Portefeuille : Volume, Mix & Intensité*).