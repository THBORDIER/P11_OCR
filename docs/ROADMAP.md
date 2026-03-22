# Roadmap — Outil de Suivi de Projets Dev

> Dernière mise à jour : 22 mars 2026 (Sprint 2)

## Vision

Un outil de suivi de projets de développement permettant de piloter le cycle complet :
questionnaire client → analyse → backlog → sprints → recettage → livraison,
avec un auto-pilotage progressif via GitHub, IA locale et mailing automatique.

---

## Phase 0 — Workflow manuel ✅ TERMINÉ

Toute la boucle de gestion de projet est fonctionnelle à la main.

### Pages fonctionnelles

| Page | Fonctionnalités | CRUD | Export |
|---|---|---|---|
| **Accueil** | Liste projets, badge DÉMO, bouton créer | — | — |
| **Nouveau projet** | Wizard 3 étapes (projet, SIRET, GitHub) | Créer | — |
| **Dashboard** | KPIs, stack, méthodologie, phases, livrables, compétences | ✅ | — |
| **Questionnaire** | Sections, questions, auto-save, lien public, envoi email | ✅ | PDF, MD |
| **Analyse** | Personas, template d'exemple | ✅ | — |
| **Roadmap** | Phases avec timeline dynamique | ✅ | — |
| **Product Backlog** | User stories, filtres epic/priorité/sprint, validation PO | ✅ | — |
| **Sprint Backlog** | Sprints, tâches, cycle de statut | ✅ | — |
| **Recettage** | Cas de test, cycle de statut, filtre sprint | ✅ | — |
| **Veille** | Catégories, thèmes, sources | ✅ | PDF |
| **GitHub** | Commits, issues, PRs (lecture seule) | — | — |
| **Communication** | Stakeholders, rituels | ✅ | — |
| **Paramètres** | Infos projet, email, GitHub, suppression | ✅ | — |
| **Questionnaire public** | `/q/[projectId]` — auto-save réponses en BDD | — | — |

### Infrastructure en place

- **BDD** : PostgreSQL (Neon) via Prisma ORM
- **Auth** : NextAuth.js (GitHub provider préconfiguré, clés à renseigner)
- **Email** : Resend (envoi questionnaire + notifications)
- **IA** : Ollama (génération user stories, personas, phases, test cases, questionnaire)
- **SIRET** : API INSEE OAuth2 + fallback recherche-entreprises.api.gouv.fr
- **GitHub** : Lecture commits/issues/PRs via API publique

### Workflow manuel complet

```
1. Créer le projet        → /new-project (wizard 3 étapes)
2. Envoyer questionnaire  → Copier lien /q/projectId ou envoyer par email
3. Client remplit          → Auto-save en BDD, notification possible
4. Analyser les retours    → /analyse — ajouter personas
5. Planifier               → /roadmap — créer les phases
6. Écrire les US           → /product-backlog — créer, prioriser, estimer
7. Découper en sprints     → /sprint-backlog — sprints + tâches
8. Tester                  → /recettage — cas de test + cycle de statut
9. Communiquer             → /communication — stakeholders + rituels
10. Configurer             → /settings — emails, GitHub, suppression
```

---

## Phase 1 — Webhook GitHub → Sprints (PROCHAINE)

**Objectif** : Les commits et PRs mettent à jour automatiquement l'état des tâches et sprints.

### Fonctionnalités

- [ ] **Webhook endpoint** : `POST /api/webhooks/github`
  - Reçoit les événements `push`, `pull_request`, `issues`
  - Vérifie le secret HMAC pour sécuriser
  - Identifie le projet via le champ `githubRepo`

- [ ] **Parsing des commits** : convention de nommage
  - `feat(US-003): ajouter le formulaire` → tâche liée à US-003 marquée "En cours"
  - `fix(US-003): corriger validation` → même US, tâche mise à jour
  - `close(US-003): formulaire terminé` → US-003 marquée comme terminée
  - `test(R-005): test de validation OK` → cas de test R-005 mis à jour

- [ ] **PRs mergées** : ferment automatiquement les tâches du sprint
  - Parse le corps de la PR pour les références `US-XXX`
  - Marque les tâches associées comme "Terminé"

- [ ] **Log d'activité** : nouveau modèle `ActivityLog` en BDD
  - Stocke chaque événement GitHub traité
  - Visible dans le dashboard du projet

### Schéma BDD

```prisma
model ActivityLog {
  id        Int      @id @default(autoincrement())
  type      String   // "commit", "pr_merged", "issue_opened"
  source    String   // "github", "manual", "email"
  message   String
  metadata  Json?    // commit SHA, PR number, etc.
  projectId String   @map("project_id")
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("activity_logs")
}
```

### Configuration

```env
GITHUB_WEBHOOK_SECRET="votre-secret-webhook"
```

---

## Phase 2 — Emails automatiques d'avancement ✅ PARTIELLEMENT

**Objectif** : Envoyer automatiquement des rapports d'avancement au client.

### Fonctionnalités

- [x] **Rapport d'avancement** (trigger manuel via page Rapports)
  - Progression sprint : X/Y tâches terminées, Z points livrés
  - User stories validées cette semaine
  - Derniers commits du repo GitHub (résumé)
  - Prochaines étapes (tâches à venir)
  - Template HTML responsive via Resend

- [ ] **Notifications événementielles**
  - Sprint terminé → email client + stakeholders
  - Questionnaire rempli → notification au développeur
  - Toutes les US d'un sprint validées PO → alerte
  - Nouveau commentaire/issue GitHub → résumé

- [x] **Page "Rapports"** dans le dashboard (`/[projectId]/rapports`)
  - Barres de progression US / Tâches / Tests
  - Stats globales (phases, sprints, US, tâches)
  - Activité récente (depuis ActivityLog)
  - Bouton "Envoyer le rapport" (→ Resend)
  - [ ] Historique des rapports envoyés
  - [ ] Personnalisation du template
  - [ ] Prévisualisation HTML avant envoi

### API

```
POST /api/projects/[projectId]/reports/send
GET  /api/projects/[projectId]/reports
POST /api/projects/[projectId]/reports/preview
```

---

## Phase 3 — IA intégrée (Ollama)

**Objectif** : L'IA génère du contenu à partir des données du projet.

### Fonctionnalités existantes (API prête, UI à brancher)

- [x] API `/api/ai/generate` avec types : `user-stories`, `questionnaire`, `test-cases`, `personas`, `phases`
- [x] Composant `AiGenerateButton.tsx` prêt (preview + accept all)
- [x] **Bouton IA branché** sur 4 pages CRUD :
  - ✅ Analyse → "Générer des personas"
  - ✅ Backlog → "Générer des user stories"
  - ✅ Roadmap → "Générer des phases"
  - ✅ Recettage → "Générer des cas de test"
  - [ ] Questionnaire → "Générer des questions"

### Fonctionnalités futures

- [ ] **Auto-analyse** : quand le client soumet le questionnaire
  - Ollama analyse les réponses
  - Génère automatiquement : personas, US initiales, phases suggérées
  - Le propriétaire reçoit une notification "Analyse IA disponible"

- [ ] **Résumé de commits** : Ollama lit les messages de commit
  - Génère un résumé client-friendly pour les rapports hebdo
  - "Cette semaine : le formulaire de contact a été ajouté, le bug de connexion corrigé"

- [ ] **Rédaction d'emails** : Ollama génère le brouillon du rapport
  - À partir des métriques du sprint + commits
  - Le développeur valide avant envoi

- [ ] **Connexion Ollama distante** : supporter une URL externe
  - Permettre de pointer vers un serveur Ollama distant (cloud, VPS)
  - Fallback sur API OpenAI/Anthropic si Ollama indisponible

---

## Phase 4 — Dashboard analytics

**Objectif** : Métriques visuelles pour piloter le projet.

### Fonctionnalités

- [ ] **Burndown chart** par sprint
  - Points restants vs temps
  - Ligne idéale vs réalité
  - Bibliothèque : Recharts ou Chart.js

- [ ] **Vélocité historique**
  - Points livrés par sprint (bar chart)
  - Moyenne glissante
  - Prédiction de fin de projet

- [ ] **KPIs automatiques** calculés en temps réel
  - Taux de complétion backlog
  - % tests OK / KO / à tester
  - Temps moyen entre création US et validation PO
  - Nombre de commits par sprint

- [ ] **Vue portfolio** (page d'accueil améliorée)
  - Tous les projets avec leur santé (vert/orange/rouge)
  - Progression globale par projet
  - Alertes (sprint en retard, tests KO, etc.)

---

## Phase 5 — Intégrations avancées

### GitHub avancé
- [ ] Créer des issues GitHub depuis les US du backlog
- [ ] Synchroniser les labels GitHub ↔ priorités MoSCoW
- [ ] Afficher le statut des GitHub Actions dans le sprint

### Figma
- [ ] Lier des maquettes Figma aux user stories (via MCP Figma)
- [ ] Prévisualisation inline des maquettes dans le backlog

### Calendar
- [ ] Rituels → invitations Google Calendar / Outlook
- [ ] Dates de sprint → événements automatiques

### Communication
- [ ] Webhook Slack/Discord pour notifications temps réel
- [ ] Bot qui poste le résumé de sprint dans un channel

---

## Phase 6 — Multi-utilisateurs et collaboration

- [ ] **Auth GitHub fonctionnelle** (configurer GITHUB_ID/SECRET)
- [ ] **Rôles** : Owner, Contributeur, Lecteur
- [ ] **Invitations** par email
- [ ] **Commentaires** sur les user stories et tâches
- [ ] **Historique de modifications** (audit trail)
- [ ] **Notifications in-app** (cloche avec badge)

---

## Bugs connus / dette technique

- [x] ~~AnalyseClient.tsx : template CRM~~ → Remplacé par un guide d'analyse générique (310 lignes vs 631)
- [x] ~~Recettage localStorage~~ → Statuts persistés en BDD via PATCH API
- [x] ~~Validations PO localStorage~~ → Persistées en BDD via /backlog/validate
- [ ] Commentaire "p11-spartcrm:R-001" encore présent dans 3 fichiers (cosmétique)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| BDD | PostgreSQL (Neon, hébergé EU) |
| Auth | NextAuth.js (GitHub provider) |
| Email | Resend API |
| IA | Ollama (local, llama3.2) |
| SIRET | API INSEE Sirene v3.11 (OAuth2) |
| GitHub | API REST v3 (lecture) |
| PDF | jsPDF (client-side) |
| Déploiement | À configurer (Vercel recommandé) |
