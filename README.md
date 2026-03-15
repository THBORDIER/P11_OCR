# Template de Cadrage Projet

Template Next.js réutilisable pour structurer et présenter le cadrage de n'importe quel projet de développement. Basé sur la méthodologie Agile/Scrum avec priorisation MoSCoW.

## Pages incluses

| Page | Description |
|------|-------------|
| **Accueil** | Dashboard avec contexte, stack, méthodologie, phases et livrables |
| **Questionnaire** | Formulaire interactif de recueil de besoins client (avec sauvegarde localStorage) |
| **Analyse** | Synthèse des retours client avec indicateurs, verbatims et matrice impact/effort |
| **Roadmap** | Plan de construction phase par phase avec MVP et plan de contingence |
| **Product Backlog** | Backlog complet avec User Stories, critères d'acceptation, filtres par epic/priorité |
| **Sprint Backlog** | Vue Kanban multi-sprint avec progression et statuts cliquables |
| **Recettage** | Grille de recette interactive avec cycle de statuts et filtres par sprint |
| **Veille** | Tableau de veille technologique et métier organisé par catégories |
| **Communication** | Plan de communication avec parties prenantes, cérémonies et escalade |

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## Personnalisation

### 1. Configuration centrale

Modifiez le fichier `src/config/project.config.ts` pour personnaliser :

- **Identité** : nom du projet, auteur, organisation
- **Contexte** : description, KPIs, stack technique
- **Méthodologie** : framework (Scrum, Kanban...), priorisation
- **Phases** : planning du projet avec couleurs
- **Livrables** : liste et descriptions des livrables
- **Navigation** : items du menu latéral
- **Compétences** : objectifs pédagogiques visés

### 2. Contenu des pages

Chaque page contient ses données directement dans le fichier, marquées par un commentaire :

```
// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ vos données ci-dessous                       ║
// ╚══════════════════════════════════════════════════════════════╝
```

Remplacez les données d'exemple par les vôtres :

- **Questionnaire** (`src/app/questionnaire/page.tsx`) : sections et questions
- **Analyse** (`src/app/analyse/page.tsx`) : stats, verbatims, décisions
- **Roadmap** (`src/app/roadmap/page.tsx`) : phases, MVP, risques
- **Product Backlog** (`src/app/product-backlog/page.tsx`) : User Stories
- **Sprint Backlog** (`src/app/sprint-backlog/page.tsx`) : sprints et tâches
- **Recettage** (`src/app/recettage/page.tsx`) : lignes de test
- **Veille** (`src/app/veille/page.tsx`) : catégories et sources
- **Communication** (`src/app/communication/page.tsx`) : parties prenantes, cérémonies

### 3. Thème visuel

Modifiez les variables CSS dans `src/app/globals.css` :

```css
:root {
  --primary: #3b82f6;    /* Couleur principale */
  --accent: #f59e0b;     /* Couleur d'accent */
  --success: #22c55e;    /* Couleur succès */
  --danger: #ef4444;     /* Couleur erreur */
}
```

## Stack technique

- **Next.js 16** + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** pour le styling
- **ESLint 9** pour la qualité de code
- Pas de base de données — données en localStorage pour la persistance côté client

## Fonctionnalités interactives

- **Questionnaire** : sauvegarde automatique des réponses en localStorage
- **Recettage** : clic sur les statuts pour les faire cycler (À tester → En cours → OK → KO → À retester)
- **Sprint Backlog** : vue Kanban avec statuts cliquables et progression
- **Product Backlog** : filtres par epic et priorité, détail extensible des US

## Déploiement

Compatible avec Vercel, Netlify, ou tout hébergeur supportant Next.js :

```bash
npm run build
npm start
```
