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
- **IA** : Ollama (local, llama3.2) avec fallback copier/coller prompt
- **SIRET** : API INSEE Sirene v3.11 (OAuth2)
- **PDF** : jsPDF (client-side)
- **Déploiement** : Vercel (p11-ocr.vercel.app)

## Architecture

```
spartcrm-project/
├── prisma/           # Schema + migrations
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── page.tsx              # Homepage (liste projets)
│   │   ├── new-project/          # Wizard création projet
│   │   ├── q/[projectId]/        # Questionnaire PUBLIC (client)
│   │   ├── [projectId]/          # Layout projet + pages
│   │   │   ├── onboarding/       # Wizard cadrage post-création
│   │   │   ├── questionnaire/    # Questionnaire interne + réponses
│   │   │   ├── analyse/          # Personas + analyse IA
│   │   │   ├── product-backlog/  # User Stories
│   │   │   ├── sprint-backlog/   # Sprints + tâches
│   │   │   ├── recettage/        # Cas de test
│   │   │   ├── roadmap/          # Phases du projet
│   │   │   ├── github/           # Activité GitHub
│   │   │   ├── rapports/         # Rapports d'avancement
│   │   │   ├── communication/    # Stakeholders + rituels
│   │   │   ├── settings/         # Paramètres projet
│   │   │   └── veille/           # Veille technologique
│   │   └── api/                  # API Routes
│   ├── components/   # Composants réutilisables
│   ├── lib/          # Prisma client, auth, resend, ollama, data helpers
│   └── hooks/        # Custom hooks
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

## IA — Mode copier/coller

Quand Ollama n'est pas disponible, le composant `AiGenerateButton` :
1. Appelle l'API qui retourne le prompt dans la réponse 503
2. Affiche un modal "IA non disponible — Mode manuel"
3. L'utilisateur copie le prompt, le colle dans ChatGPT/Claude
4. Colle le JSON retour dans la zone de texte
5. Le JSON est parsé et prévisualisé avant insertion

L'API supporte un flag `getPromptOnly: true` pour récupérer le prompt sans appeler Ollama.

## Projets spéciaux

- `p11-spartcrm` : Projet démo avec données complètes (seed). Badge "DÉMO" sur la homepage.
- `template` : Projet template masqué de la homepage (filtré par `id !== "template"`).

## Conventions

- `isPublic: true` sur tous les projets (visibilité homepage)
- Les IDs projet sont des slugs générés depuis le nom : `mon-projet`
- Les IDs d'entités sont préfixés : `projectId:US-001`, `projectId:T-001`
- Pas de middleware (supprimé — était vide et causait un warning Vercel)
- `cursor: pointer` appliqué globalement via globals.css sur a, button, select, label
