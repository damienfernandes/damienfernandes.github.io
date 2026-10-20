---
title: "cloud-scanner (Fork & Contributions Boavizta)"
section: "repositories"
description: "Outil d'inventaire et d'évaluation d'impacts environnementaux d'infrastructures Cloud (AWS / Kubernetes) utilisé pour l'écoconception durant les tests end-to-end des releases produits."
date: 2025-12-07
repoVisibility: "public"
platform: "GitHub"
license: "AGPL-3.0 license"
url: "https://github.com/damienfernandes/cloud-scanner"
public: true
---

Contributions et adaptations sur **cloud-scanner** (initialement issu de l'écosystème open-source [Boavizta](https://github.com/Boavizta/cloud-scanner)) déployées pour instrumenter et auditer l'écoconception logicielle lors des campagnes de **tests end-to-end des releases produits** sur infrastructures Cloud et Kubernetes.

### Contributions et fonctionnalités principales

- **Écoconception & Tests End-to-End de Releases :** Évaluation automatisée de l'empreinte matérielle et énergétique des environnements de test lors de la validation des releases produits, afin de détecter les dérives de consommation entre versions.
- **Paramétrage de la durée d'évaluation (`usage_time`) :** Ajout du paramètre de fenêtre temporelle des métriques et compensation d'un défaut amont de BoaviztAPI (v1.3.11) qui ignorait la durée d'usage lors du calcul des impacts.
- **Collecte Cloud & Kubernetes :** Extensions CLI Python pour l'extraction automatisée d'inventaires AWS (instances EC2, volumes EBS, clusters EKS) et la collecte de métriques pods/nœuds Kubernetes.
- **Sécurité & Conteneurisation :** Durcissement de l'image Docker, fiabilisation des dépendances et reproductibilité des campagnes de scan automatisées.

### Articulation avec la thèse

- **Filiation technique :** Les travaux menés sur `cloud-scanner` ont permis d'éprouver l'interfaçage avec **BoaviztAPI** sur des parcs réels avant d'isoler l'évaluation à grande échelle de la facturation AWS (`CUR 2.0` + `BoaviztAPI`) au sein du projet autonome **GreenOps** (qui alimente l'article **P0**).

### Liens

- **Fork GitHub :** [https://github.com/damienfernandes/cloud-scanner](https://github.com/damienfernandes/cloud-scanner)
- **Dépôt amont Boavizta :** [https://github.com/Boavizta/cloud-scanner](https://github.com/Boavizta/cloud-scanner)