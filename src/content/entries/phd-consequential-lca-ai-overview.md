---
title: "Pourquoi une ACV conséquentielle multicritères pour l’intégration de l’IA dans les services métiers ?"
section: "blog"
description: "Methodological reflection on defining the functional unit and system boundaries when evaluating AI integration inside banking and enterprise workflows."
date: 2026-01-20
public: true
---

Dans le cadre de ma thèse doctorale au laboratoire **LISTIC** (Université Savoie Mont Blanc) menée en parallèle de mon activité d’Architecte Solutions chez **SBS**, j’étudie l’évaluation environnementale de l’intégration de l’IA dans un processus de services métiers.

### 1. Dépasser le périmètre du modèle seul

La littérature actuelle sur l’impact environnemental de l’IA se concentre majoritairement sur le coût énergétique d’entraînement ou d’inférence d’un modèle. Or, en architecture d’entreprise, l’IA n’est jamais déployée dans le vide : elle modifie un **processus de service métier** existant (pré-traitement, validation humaine, stockage, appels réseaux, modification du volume de demandes).

### 2. L’apport de l’ACV conséquentielle (cLCA)

Contrairement à l’ACV attributionnelle qui photographie une part statique des flux, l’**ACV conséquentielle** modélise les conséquences physiques et systémiques d’une décision d’architecture :

1. **Unité fonctionnelle orientée service métier** (ex. le traitement complet d’un flux métier bancaire de bout en bout).
2. **Évaluation multicritères** : GWP (climat), AFP/ADP (ressources et acidification), eau et énergie.
3. **Effets rebond et substitutions** : prise en compte des transformations du processus et des comportements utilisateurs.
