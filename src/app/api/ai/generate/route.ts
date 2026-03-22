import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWithOllama, isOllamaAvailable } from "@/lib/ollama";

const PROMPTS: Record<string, (ctx: string) => string> = {
  "user-stories": (ctx) => `Tu es un Product Owner expert. Génère 5 User Stories au format JSON pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "epic": "...", "titre": "...", "enTantQue": "...", "jeSouhaite": "...", "afinDe": "...", "criteres": ["..."], "estimation": 5, "priorite": "Must", "sprint": "Sprint 1", "valeur": "Haute" }] }`,

  questionnaire: (ctx) => `Tu es un consultant en cadrage de projets. Génère 8 questions de cadrage pertinentes pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "label": "...", "type": "textarea", "required": true }] }`,

  "test-cases": (ctx) => `Tu es un QA engineer. Génère 5 cas de test pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "us": "...", "sprint": "Sprint 1", "etape": "...", "action": "...", "attendu": "...", "obtenu": "", "statut": "A tester" }] }`,

  personas: (ctx) => `Tu es un UX researcher. Génère 3 personas utilisateurs pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "initials": "AB", "nom": "...", "age": 35, "role": "...", "contexte": "...", "besoinPrincipal": "...", "frustration": "...", "objectif": "..." }] }`,

  phases: (ctx) => `Tu es un chef de projet Agile. Génère 4-6 phases/sprints pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "phase": "Phase 0", "title": "...", "objectif": "...", "fonctionnalites": ["..."], "horsPerimetre": ["..."], "utilisateurs": ["..."], "dependances": ["..."], "ressources": "...", "periode": "Semaine 1-2", "budget": "...", "color": "border-l-[#3b82f6]", "bg": "bg-[#eff6ff]" }] }`,
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { type, projectId, model } = await request.json();

  if (!PROMPTS[type]) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const available = await isOllamaAvailable();
  if (!available) {
    return NextResponse.json(
      { error: "Ollama n'est pas disponible. Vérifiez qu'il est lancé sur " + (process.env.OLLAMA_URL || "http://localhost:11434") },
      { status: 503 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { userStories: { take: 5 }, phases: { take: 5 } },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const context = `Projet : ${project.name}
Description : ${project.description}
Stack : ${project.methodologyFramework}
Contexte : ${project.contextSummary}
User Stories existantes : ${project.userStories.map((us) => us.titre).join(", ") || "Aucune"}
Phases existantes : ${project.phases.map((p) => p.title).join(", ") || "Aucune"}`;

  try {
    const raw = await generateWithOllama(PROMPTS[type](context), model || "llama3.2");
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur de génération : " + (e instanceof Error ? e.message : "inconnue") },
      { status: 500 }
    );
  }
}
