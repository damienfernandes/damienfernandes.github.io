---
title: "envira"
section: "repositories"
description: "Cadre logiciel d'ACV conséquentielle (cLCA) orienté décision : compilateur de scénarios causaux, exploration d'incertitude et couplage multi-indicateurs."
date: 2026-06-18
repoVisibility: "internal"
platform: "GitLab 74Software / SBS"
license: "74Software license"
public: true
---

Environnement logiciel central de la thèse implémentant le pipeline en 7 couches pour l'Analyse de Cycle de Vie conséquentielle (cLCA) multicritère des systèmes numériques et de l'intégration de l'IA dans les processus métiers bancaires.

### Modules et fonctionnalités principales

- **`envira.compiler` (~2 950 LOC) :** Compilation déterministe (*byte-identical*) de scénarios conséquentiels par fenêtres temporelles à partir d'événements de graphes de connaissances temporels (TKG).
- **`envira.explore` (~2 850 LOC) :** Énumération de chemins contraints à travers les branches conséquentielles (inférence, entraînement, décommissionnement du *legacy*, effets rebonds) et validation structurelle sous contraintes **SHACL**.
- **`envira.causal` (~2 700 LOC) :** Formalisme de graphe causal, détection algorithmique des boucles de rétroaction (`detect_feedback_loops`), analyse de polarité et modélisation des délais temporels.
- **`envira.packs` (~1 350 LOC) :** Gestion de *scenario packs* auto-contenus adressés par leur condensat cryptographique (*content-addressed manifests*) avec traçabilité **W3C PROV-O** (incluant les cas d'étude `ai-covenants-full` et `cloud-migration-clca`, validés par plus de 190 tests unitaires et d'intégration).

### Rattachement méthodologique (Atlas)

- **Articles alimentés :** **P2** (*Automated Scenario Generation for cLCA via Temporal Knowledge Graphs*), **P4** (*Rebound Effects and Market Mechanisms*), **P5** (*Decision-Centric cLCA Framework*) et **P3** (*Uncertainty & Sensitivity*).
- **Blocs méthodologiques :** **Blocs B3 à B8** (Contrefactuel B0, Graphe événementiel, Substitution réelle, Rebond, Caractérisation anti-mosaïque).