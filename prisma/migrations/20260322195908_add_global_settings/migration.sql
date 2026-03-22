-- CreateTable
CREATE TABLE "global_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "ollama_url" TEXT NOT NULL DEFAULT 'http://localhost:11434',
    "ollama_model" TEXT NOT NULL DEFAULT 'llama3.2',
    "cli_bridge_enabled" BOOLEAN NOT NULL DEFAULT false,
    "cli_providers" JSONB NOT NULL DEFAULT '[]',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);
