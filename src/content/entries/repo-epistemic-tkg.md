---
title: "epistemic-tkg-engine & banking adapters"
section: "repositories"
description: "Moteur de graphes de connaissances temporels (TKG), adaptateurs d'inventaires GreenOps/CLEMIS et cas d'usage métiers bancaires pour l'ACV conséquentielle."
date: 2026-02-24
repoVisibility: "internal"
platform: "GitLab 74Software / SBS"
license: "74Software license"
public: true
---

Ensemble de trois dépôts modulaires assurant la représentation formelle des connaissances temporelles et le pont entre la télémétrie d'infrastructure et la génération de scénarios conséquentiels dans **Envira**.

### Architecture des trois dépôts

- **`epistemic-tkg-engine` :** Moteur de graphe de connaissances temporel gérant la qualification épistémique des paramètres (mesuré, estimé, borné, inconnu), les règles de propagation temporelle et le module de raisonnement `BancAIa`.
- **`epistemic-tkg-adapter-greenops-clemis` :** Adaptateur logiciel convertissant les inventaires physiques et financiers issus de **GreenOps** et **CLEMIS** en événements horodatés normalisés injectables dans le graphe causal.
- **`epistemic-tkg-banking-usecases` :** Modélisation des processus de services métiers bancaires (notamment l'analyse automatisée de conformité des *covenants ESG* sur contrats de prêts — *Loans* — comparant le processus de référence humain `S0` aux architectures augmentées par IA `S1`/`S2`).

### Rattachement méthodologique (Atlas)

- **Articles alimentés :** **P2** (génération de scénarios par TKG) et **P5** (application au domaine bancaire).
- **Blocs méthodologiques :** **Bloc B3** (*Contrefactuel B0 & Équivalence fonctionnelle*), **Bloc B4** (*Graphe Événementiel, Temps & Tirages*).