# CLAUDE.md — DevTracker

## Projet

Outil de suivi de projets de développement : backlog, sprints, roadmap, questionnaire client, recettage.
SpartCRM (p11-spartcrm) est le projet de **démonstration** en dur issu du projet d'étude P11 OpenClassrooms.

## Stack

- **Frontend** : Next.js 16, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM v7
- **BDD** : PostgreSQL (Neon, hébergé EU)
- **Auth** : NextAuth.js / Auth.js (GitHub OAuth provider)
- **Email** : Resend (expéditeur : DevTracker@devnews.fac6.fr)
- **IA** : Ollama (local, llama3.2) + CLI providers (Claude/Gemini/Codex) + fallback copier/coller
- **SIRET** : API INSEE Sirene v3.11 (OAuth2)
- **PDF** : jsPDF (client-side)
- **Déploiement** : Vercel (p11-ocr.vercel.app)

## Architecture

```
spartcrm-project/
├── prisma/           # Schema + migrations + seed
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── page.tsx              # Homepage (liste projets, stats globales)
│   │   ├── new-project/          # Wizard création projet (3 étapes)
│   │   ├── q/[projectId]/        # Questionnaire PUBLIC (client)
│   │   ├── settings/             # Paramètres globaux (Ollama, CLI)
│   │   ├── [projectId]/          # Layout projet + pages
│   │   │   ├── page.tsx          # Dashboard (checklist, stats auto, bouton "Tout générer")
│   │   │   ├── onboarding/       # Wizard cadrage post-création (contexte, contraintes, stack)
│   │   │   ├── questionnaire/    # Questionnaire interne + réponses clients
│   │   │   ├── analyse/          # Personas + analyse IA des retours
│   │   │   ├── product-backlog/  # User Stories (MoSCoW, estimation, sprint)
│   │   │   ├── sprint-backlog/   # Sprints + tâches (kanban, progression)
│   │   │   ├── recettage/        # Cas de test (statuts cliquables)
│   │   │   ├── roadmap/          # Phases du projet
│   │   │   ├── github/           # Activité GitHub
│   │   │   ├── rapports/         # Rapports d'avancement (PDF)
│   │   │   ├── communication/    # Stakeholders + rituels
│   │   │   ├── settings/         # Paramètres projet
│   │   │   └── veille/           # Veille technologique
│   │   └── api/                  # API Routes
│   │       ├── ai/generate/      # Génération IA (Ollama + prompt enrichi)
│   │       ├── cli/              # CLI Bridge (execute + providers detection)
│   │       ├── projects/[id]/    # CRUD complet par entité
│   │       │   └── send-page/    # Envoi par email du contenu de chaque page
│   │       ├── settings/         # Paramètres globaux + test Ollama
│   │       ├── siret/            # Recherche SIRET (INSEE OAuth2)
│   │       └── webhooks/github/  # Webhook GitHub pour auto-update
│   ├── components/
│   │   ├── AiGenerateButton.tsx  # Bouton IA avec selectbox provider + preview + import
│   │   ├── GenerateAllButton.tsx # "Tout générer" — chaîne 5 étapes automatiquement
│   │   ├── SendPageButton.tsx    # Envoi par email avec modal destinataire
│   │   ├── CrudModal.tsx         # Modal CRUD générique
│   │   ├── DeleteConfirmDialog.tsx
│   │   ├── AuthHeader.tsx        # Bouton connexion/déconnexion GitHub
│   │   └── Providers.tsx         # SessionProvider NextAuth
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── auth.ts               # NextAuth config (GitHub OAuth)
│   │   ├── auth-helpers.ts       # requireProjectOwner helper
│   │   ├── data.ts               # getProject, getProjects, helpers DB
│   │   ├── resend.ts             # Envoi email (questionnaire, notifications)
│   │   ├── ollama.ts             # Client Ollama (health check + generate)
│   │   ├── cli-exec.ts           # CLI Bridge (detect providers, execute, save exchanges)
│   │   ├── settings.ts           # GlobalSettings (Ollama URL, CLI providers)
│   │   ├── crud-route.ts         # Helper factorisation CRUD routes
│   │   ├── sanitize.ts           # pick() + ALLOWED_FIELDS par entité
│   │   ├── rate-limit.ts         # Rate limiting en mémoire
│   │   └── questionnaire-pdf.ts  # Génération PDF questionnaire
│   └── hooks/
│       └── useIsProjectOwner.ts
├── .env              # Variables d'environnement (GITIGNORED)
├── vercel.json       # Config Vercel
└── .nvmrc            # Node 20
```

## Auth — BYPASS IMPORTANT

L'authentification GitHub OAuth est configurée mais **bypassée** pour les projets anonymes :

### Logique `isOwner`
Toutes les pages (12 fichiers `page.tsx`) utilisent cette logique :
```ts
const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);
```
- Si le projet n'a **pas de userId** (projet anonyme/créé sans auth) → `isOwner = true` pour tout le monde
- Si le projet a un userId → seul le propriétaire authentifié est owner

### APIs sans auth gate
Ces API routes ont été déverrouillées pour fonctionner sans session :
- `POST /api/projects` — création de projet (anonyme OK)
- `PUT /api/projects/[id]/questionnaire` — création sections IA
- `POST /api/projects/[id]/questionnaire/send` — envoi email questionnaire
- `POST /api/ai/generate` — génération IA
- `POST /api/projects/[id]/questionnaire` (POST) — création répondant

### Conséquence
En l'état, **tout le monde peut éditer n'importe quel projet anonyme**. C'est voulu pour le développement. En production avec auth GitHub configurée, les projets créés par un user authentifié seront protégés.

### Settings page
`settings/page.tsx` a `const isOwner = true` en dur — à corriger quand l'auth sera obligatoire.

### OAuth Apps GitHub
- **Production (Vercel)** : OAuth App avec callback `https://p11-ocr.vercel.app/api/auth/callback/github`
- **Dev (localhost)** : OAuth App séparée avec callback `http://localhost:3000/api/auth/callback/github`
- Les deux apps pointent vers le **même compte GitHub** → même User en BDD

## Variables d'environnement

```env
# PostgreSQL (Neon)
DATABASE_URL="..."          # Pooled connection
DIRECT_URL="..."            # Direct connection (migrations)

# Auth
AUTH_SECRET="..."            # Random string for session signing
GITHUB_ID="..."              # GitHub OAuth App Client ID
GITHUB_SECRET="..."          # GitHub OAuth App Client Secret
NEXTAUTH_URL="..."           # App URL

# Services
RESEND_API_KEY="..."         # Resend email API key
RESEND_FROM_EMAIL="..."      # Sender email address
OLLAMA_URL="..."             # Ollama server (default: http://localhost:11434)
GITHUB_WEBHOOK_SECRET="..."  # GitHub webhook HMAC secret

# INSEE SIRET
SIRENE_CLIENT_ID="..."
SIRENE_CLIENT_SECRET="..."
```

## Prisma

- **Config** : `prisma.config.ts` (pas dans schema.prisma — Prisma 7 requirement)
- **URL/directUrl** : dans prisma.config.ts, pas dans le datasource block
- **Adapter** : `@prisma/adapter-pg` avec pool `pg`
- **Migration** : `npx prisma migrate dev --name <name>`
- **Generate** : `npx prisma generate` (après chaque changement de schema)
- **Seed** : `npx tsx prisma/seed.ts`
- **Reset** : `npx prisma migrate reset --force` (DÉTRUIT TOUTES LES DONNÉES)

## IA — Providers et chaîne de génération

### Providers (selectbox sur chaque page)
Le composant `AiGenerateButton` détecte et propose les providers disponibles :
1. **Ollama** (si serveur local tourne sur localhost:11434)
2. **Claude CLI** / **Gemini CLI** / **Codex CLI** (si installés, détectés via `where`/`which`)
3. **Copier/Coller** (toujours disponible — mode manuel)

Auto-sélection du meilleur provider disponible. CLI providers exécutés via `spawn` avec `--print` (Claude) ou `--quiet` (Codex).

### Prompts enrichis
Chaque type de génération récupère le contexte des étapes précédentes :
- **Questionnaire** → contexte projet seul
- **Analyse (personas)** → contexte + réponses questionnaire
- **Backlog (US)** → contexte + réponses + personas
- **Roadmap (phases)** → contexte + personas + US
- **Sprints** → contexte + personas + US (avec répartition MoSCoW) + phases
- **Tests** → contexte + US + sprints

### "Tout générer" (GenerateAllButton)
Bouton rouge sur le dashboard quand le questionnaire a des répondants.
Chaîne automatiquement : Personas → US → Phases → Sprints → Tests.
Modal plein écran avec progression step-by-step. Skipe les étapes déjà faites.

### Ajouter / Remplacer
Quand on regénère du contenu existant, le modal de preview affiche :
- **"+ Ajouter aux existants"** — conserve l'existant
- **"Remplacer tout"** (rouge) — supprime tout avant d'insérer

### CLI Bridge
- Exécution via `src/lib/cli-exec.ts`
- Répertoire de travail : `~/DevTracker/<projectSlug>/`
- Échanges sauvegardés en Markdown dans `~/DevTracker/<projectSlug>/documentation/`
- `isLocalEnvironment()` bloque l'exécution CLI sur Vercel (serverless)

## Email (Resend)

### Emails envoyés
- **Questionnaire client** : invitation avec lien, design soigné (gradient header, étapes, CTA)
- **Envoi par page** : bouton "Envoyer par mail" sur Analyse, Backlog, Roadmap, Sprints, Recettage
  - Templates HTML formatés spécifiques à chaque page
  - Supporte plusieurs destinataires (virgule-séparés)
  - API : `POST /api/projects/[id]/send-page` avec `{ to, pageType }`

## Projets spéciaux

- `p11-spartcrm` : Projet démo avec données complètes (seed). Badge "DÉMO" sur la homepage.
- `template` : Projet template masqué de la homepage (filtré par `id !== "template"`).

## Navigation — Indicateurs de progression

La sidebar affiche des pastilles colorées sur chaque page :
- 🟢 **Vert** : étape terminée (données présentes)
- 🟠 **Orange (pulse)** : prochaine étape à faire
- 🔴 **Rouge** : bloquée (dépendance non remplie)

Pipeline : Questionnaire → Analyse → Backlog → Roadmap → Sprints → Recettage

## Conventions

- `isPublic: true` sur tous les projets (visibilité homepage)
- Les IDs projet sont des slugs générés depuis le nom : `mon-projet`
- Les IDs d'entités sont préfixés : `projectId:US-001`, `projectId:T-001`, `projectId:TC-xxx`
- Pas de middleware (supprimé — causait warning Vercel)
- `cursor: pointer` appliqué globalement via globals.css sur a, button, select, label
- `window.location.reload()` après insertion IA (pas `router.refresh()` qui ne sync pas le useState)
- Citation de Samuel Bordier (3 ans) en footer sidebar : premier "commit" accidentel sur le clavier

## Documentation projet

Fichier `docs/ROADMAP.md` contient le plan d'évolution en 6 phases :
1. GitHub Webhooks → auto-update sprints depuis commits
2. Mailing automatique (rapports d'avancement périodiques)
3. IA intégrée (Ollama/CLI) pour génération à chaque étape
4. Dashboard auto-piloté (progression calculée, pas de saisie manuelle)
5. GitHub bidirectionnel (créer issues depuis US, sync statuts)
6. Questionnaire intelligent (adaptatif selon réponses)
