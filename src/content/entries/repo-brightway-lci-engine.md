---
title: "brightway-lci-engine"
section: "repositories"
description: "Moteur de calcul d'inventaire de cycle de vie (ICV) basé sur Brightway, triangulation de bases ouvertes et hybridation Process–MRIO (EXIOBASE 3)."
date: 2026-06-17
repoVisibility: "internal"
platform: "GitLab 74Software / SBS"
license: "74Software license"
public: true
---

Moteur de calcul ACV programmatique construit autour de l'écosystème **Brightway**, conçu pour exécuter des inventaires du cycle de vie reproductibles et multicritères tout en palliant les restrictions de licence des bases propriétaires par la triangulation de bases ouvertes et l'hybridation entrées-sorties.

### Fonctionnalités principales

- **Triangulation de bases d'ICV libres :** Intégration et harmonisation des bases publiques **EXIOBASE 3** (`IOT_2022_ixi`), **USEEIO**, **USLCI**, **AGRIBALYSE** et **ELCD** pour couvrir les chaînes d'approvisionnement matérielles et énergétiques.
- **Hybridation Processus / MRIO (Socle de P1) :** Couplage entre les données d'inventaire physique de niveau *Tier 1* des accélérateurs IA (GPU/TPU) et les matrices multirégionales entrées-sorties pour quantifier l'erreur de troncature amont et comparer l'allocation physique face à l'allocation économique.
- **Identification des fournisseurs marginaux :** Implémentation algorithmique de la procédure de Weidema en 5 étapes pour les marchés électriques et matériels.
- **Propagation d'incertitude :** Simulation Monte-Carlo double mode et échantillonnage par hypercube latin (*Latin Hypercube Sampling* — LHS) avec conservation des covariances.

### Rattachement méthodologique (Atlas)

- **Articles alimentés :** **P1** (*How Much Do Process-Based Estimates Miss? Hybrid IO-LCA of AI Accelerator Supply Chains*) et **P3** (analyse de sensibilité globale).
- **Blocs méthodologiques :** **Bloc B5** (*Réponse Électrique & Cloud*), **Bloc B8** (*Caractérisation multicritère*), **Bloc B9** (*Substitution Matérielle & Retour*).