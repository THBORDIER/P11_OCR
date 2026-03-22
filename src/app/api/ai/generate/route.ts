import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWithOllama, isOllamaAvailable } from "@/lib/ollama";

const PROMPTS: Record<string, (ctx: string) => string> = {
  "user-stories": (ctx) => `Tu es un Product Owner expert. Génère 5 User Stories au format JSON pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "epic": "...", "titre": "...", "enTantQue": "...", "jeSouhaite": "...", "afinDe": "...", "criteres": ["..."], "estimation": 5, "priorite": "Must", "sprint": "Sprint 1", "valeur": "Haute" }] }`,

  questionnaire: (ctx) => `Tu es un consultant en cadrage de projets. Génère un questionnaire client structuré en 3-4 sections avec 3-5 questions par section pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "sectionTitle": "Contexte et objectifs", "sectionDescription": "Comprendre le contexte business", "questions": [{ "label": "Décrivez votre activité", "type": "textarea", "required": true }, { "label": "Budget estimé ?", "type": "select", "options": ["< 5k", "5-15k", "15-50k", "> 50k"], "required": false }] }] }
Types possibles : "textarea", "text", "select" (avec options[]), "checkbox" (avec options[])`,

  sprints: (ctx) => `Tu es un Scrum Master expert. Génère 3-4 sprints avec des tâches pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "name": "Sprint 1", "goal": "MVP — fonctionnalités de base", "startDate": "2026-04-01", "endDate": "2026-04-14", "tasks": [{ "title": "Tâche 1", "status": "A faire", "userStory": "" }] }] }`,

  "test-cases": (ctx) => `Tu es un QA engineer. Génère 5 cas de test pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "us": "...", "sprint": "Sprint 1", "etape": "...", "action": "...", "attendu": "...", "obtenu": "", "statut": "A tester" }] }`,

  personas: (ctx) => `Tu es un UX researcher. Génère 3 personas utilisateurs pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "initials": "AB", "nom": "...", "age": 35, "role": "...", "contexte": "...", "besoinPrincipal": "...", "frustration": "...", "objectif": "..." }] }`,

  phases: (ctx) => `Tu es un chef de projet Agile. Génère 4-6 phases/sprints pour ce projet :
${ctx}
Retourne un JSON : { "items": [{ "phase": "Phase 0", "title": "...", "objectif": "...", "fonctionnalites": ["..."], "horsPerimetre": ["..."], "utilisateurs": ["..."], "dependances": ["..."], "ressources": "...", "periode": "Semaine 1-2", "budget": "...", "color": "border-l-[#3b82f6]", "bg": "bg-[#eff6ff]" }] }`,

  analyse: (ctx) => `Tu es un consultant UX/Product senior. Analyse les retours du questionnaire ci-dessous et génère des personas utilisateurs réalistes.
${ctx}
Retourne un JSON : { "items": [{ "initials": "AB", "nom": "Prénom Nom", "age": 35, "role": "...", "contexte": "...", "besoinPrincipal": "...", "frustration": "...", "objectif": "..." }] }`,
};

export async function POST(request: NextRequest) {
  const { type, projectId, model, getPromptOnly } = await request.json();

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

  let context = `Projet : ${project.name}
Description : ${project.description}
Stack : ${project.methodologyFramework}
Contexte : ${project.contextSummary}
User Stories existantes : ${project.userStories.map((us) => us.titre).join(", ") || "Aucune"}
Phases existantes : ${project.phases.map((p) => p.title).join(", ") || "Aucune"}`;

  // For "analyse" type, add all questionnaire responses
  if (type === "analyse") {
    const responses = await prisma.questionnaireResponse.findMany({
      where: { projectId },
      include: {
        respondent: { select: { name: true, role: true } },
      },
    });
    const sections = await prisma.questionnaireSection.findMany({
      where: { projectId },
      include: { questions: true },
    });
    const questionMap = new Map<string, string>();
    for (const s of sections) {
      for (const q of s.questions) {
        questionMap.set(q.id, q.label);
      }
    }

    // Group by respondent
    const byRespondent = new Map<string, { name: string; role: string | null; answers: string[] }>();
    for (const r of responses) {
      const key = r.respondent.name;
      if (!byRespondent.has(key)) {
        byRespondent.set(key, { name: r.respondent.name, role: r.respondent.role, answers: [] });
      }
      const qLabel = questionMap.get(r.questionId) || r.questionId;
      byRespondent.get(key)!.answers.push(`- Q: "${qLabel}" → "${r.value}"`);
    }

    if (byRespondent.size > 0) {
      context += "\n\nRéponses du questionnaire :";
      for (const [, respondent] of byRespondent) {
        context += `\n\nRépondant "${respondent.name}" (${respondent.role || "non précisé"}) :`;
        context += "\n" + respondent.answers.join("\n");
      }
    }
  }

  const fullPrompt = PROMPTS[type](context);

  // Return prompt only (for manual copy-paste fallback)
  if (getPromptOnly) {
    return NextResponse.json({ prompt: fullPrompt });
  }

  try {
    const raw = await generateWithOllama(fullPrompt, model || "llama3.2");
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur de génération : " + (e instanceof Error ? e.message : "inconnue") },
      { status: 500 }
    );
  }
}
