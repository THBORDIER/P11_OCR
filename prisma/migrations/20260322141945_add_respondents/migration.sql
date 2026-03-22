-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,
    "github_repo" TEXT,
    "client_email" TEXT,
    "notification_emails" TEXT[],
    "context_summary" TEXT NOT NULL,
    "methodology_framework" TEXT NOT NULL,
    "methodology_framework_desc" TEXT NOT NULL,
    "methodology_prioritization" TEXT NOT NULL,
    "methodology_prioritization_desc" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_kpis" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "project_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "tag_color_bg" TEXT NOT NULL,
    "tag_color_text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "stack_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phases" (
    "id" SERIAL NOT NULL,
    "phase" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    "fonctionnalites" TEXT[],
    "hors_perimetre" TEXT[],
    "utilisateurs" TEXT[],
    "dependances" TEXT[],
    "ressources" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverables" (
    "id" SERIAL NOT NULL,
    "href" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_items" (
    "id" SERIAL NOT NULL,
    "href" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "nav_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stories" (
    "id" TEXT NOT NULL,
    "epic" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "en_tant_que" TEXT NOT NULL,
    "je_souhaite" TEXT NOT NULL,
    "afin_de" TEXT NOT NULL,
    "criteres" TEXT[],
    "details_metier" TEXT[],
    "contraintes" TEXT[],
    "dependances_tech" TEXT[],
    "estimation" INTEGER NOT NULL,
    "priorite" TEXT NOT NULL,
    "sprint" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "validated_at" TIMESTAMP(3),
    "project_id" TEXT NOT NULL,

    CONSTRAINT "user_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprints" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    "objectif_court" TEXT NOT NULL,
    "debut" TEXT NOT NULL,
    "fin" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "velocite" TEXT NOT NULL,
    "user_stories_ids" TEXT[],
    "project_id" TEXT NOT NULL,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "user_story" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "estimation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'A faire',
    "assignee" TEXT NOT NULL,
    "sprint_id" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_sections" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pourquoi" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "questionnaire_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT[],
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_responses" (
    "id" SERIAL NOT NULL,
    "question_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "respondent_id" TEXT NOT NULL,

    CONSTRAINT "questionnaire_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respondents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas" (
    "id" SERIAL NOT NULL,
    "initials" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "contexte" TEXT NOT NULL,
    "besoin_principal" TEXT NOT NULL,
    "frustration" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "implication" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rituals" (
    "id" SERIAL NOT NULL,
    "rituel" TEXT NOT NULL,
    "frequence" TEXT NOT NULL,
    "participants" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "livrable" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "rituals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_watch_categories" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "mise_a_jour" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "tech_watch_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_watch_themes" (
    "id" SERIAL NOT NULL,
    "theme" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avantages" TEXT NOT NULL,
    "consultation" TEXT NOT NULL,
    "utilise_dans_projet" BOOLEAN NOT NULL DEFAULT false,
    "apprentissage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "tech_watch_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_watch_sources" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "theme_id" INTEGER NOT NULL,

    CONSTRAINT "tech_watch_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_cases" (
    "id" TEXT NOT NULL,
    "us" TEXT NOT NULL,
    "sprint" TEXT NOT NULL,
    "etape" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "attendu" TEXT NOT NULL,
    "obtenu" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'A tester',
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_responses_respondent_id_question_id_key" ON "questionnaire_responses"("respondent_id", "question_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_kpis" ADD CONSTRAINT "project_kpis_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_items" ADD CONSTRAINT "stack_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phases" ADD CONSTRAINT "phases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nav_items" ADD CONSTRAINT "nav_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stories" ADD CONSTRAINT "user_stories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_sections" ADD CONSTRAINT "questionnaire_sections_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "questionnaire_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_respondent_id_fkey" FOREIGN KEY ("respondent_id") REFERENCES "respondents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondents" ADD CONSTRAINT "respondents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personas" ADD CONSTRAINT "personas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rituals" ADD CONSTRAINT "rituals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_watch_categories" ADD CONSTRAINT "tech_watch_categories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_watch_themes" ADD CONSTRAINT "tech_watch_themes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tech_watch_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_watch_sources" ADD CONSTRAINT "tech_watch_sources_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "tech_watch_themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
