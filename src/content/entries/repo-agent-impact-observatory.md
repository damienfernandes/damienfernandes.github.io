---
title: "agent-impact-observatory"
section: "repositories"
description: "Plateforme expérimentale de mesure et d'observabilité pour l'évaluation de l'impact environnemental des workflows d'IA agentiques."
date: 2026-10-07
platform: "GitLab 74Software / SBS"
license: "74Software license"
public: true
---

Plateforme expérimentale locale dédiée à l'instrumentation, à la collecte de traces d'exécution et à l'évaluation environnementale des **workflows de LLM agentiques** (sessions multi-étapes avec appels d'outils, boucles de correction et réutilisation de contexte en cache).

### Fonctionnalités principales

- **Collecte de traces d'activité agentique :** Enregistrement structuré des sessions d'agents (nombre de tours, tokens d'entrée/sortie, lectures et écritures dans le cache KV, latences et appels d'outils externes) aligné sur les conventions sémantiques **OpenTelemetry GenAI**.
- **Analyse d'identifiabilité sous observabilité contrainte :** Cartographie des grandeurs physiques réellement identifiables à partir de télémétrie partielle et quantification des étendues d'ignorance (*non-probabilistic ignorance bounds*) lorsque l'infrastructure sous-jacente reste opaque.
- **Couplage Qualité / Impact :** Mesure conjointe du taux de succès fonctionnel, des itérations de reprise et du coût énergétique par workflow complet plutôt que par requête isolée.

### Rattachement méthodologique (Atlas)

- **Articles alimentés :** **P6** (*Proxy-Based Environmental Impact Assessment of Agentic LLM Workflows*) et **P7** (calibration du signal énergétique du cache).
- **Blocs méthodologiques :** **Bloc B3** (*Équivalence fonctionnelle et reprises*), **Bloc B10** (*Budget Métrologique Apparié*), **Bloc B12** (*Portes d'assurance*).