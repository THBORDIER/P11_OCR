import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeCliBackground, detectProviders, isLocalEnvironment } from "@/lib/cli-exec";
import { createJob, getRunningJob, appendOutput, finishJob, getJob } from "@/lib/job-store";

export async function POST(request: NextRequest) {
  if (!isLocalEnvironment()) {
    return NextResponse.json(
      { error: "Exécution CLI non disponible en serverless. Lancez l'app en local." },
      { status: 400 }
    );
  }

  const { projectId, sprintId, provider } = await request.json();

  if (!projectId || !sprintId || !provider) {
    return NextResponse.json({ error: "projectId, sprintId et provider requis" }, { status: 400 });
  }

  // Check provider
  const available = await detectProviders();
  if (!available.includes(provider)) {
    return NextResponse.json(
      { error: `Provider "${provider}" non installé. Disponibles: ${available.join(", ") || "aucun"}` },
      { status: 400 }
    );
  }

  // Prevent double-launch
  const running = getRunningJob(projectId, "sprint");
  if (running) {
    return NextResponse.json(
      { error: "Un sprint est déjà en cours d'exécution", jobId: running.id },
      { status: 409 }
    );
  }

  // Load sprint + tasks + project context
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: { tasks: true },
  });

  if (!sprint) {
    return NextResponse.json({ error: "Sprint introuvable" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { stackItems: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const todoTasks = sprint.tasks.filter((t) => t.status === "A faire" || t.status === "En cours");
  if (todoTasks.length === 0) {
    return NextResponse.json({ error: "Aucune tâche à faire dans ce sprint" }, { status: 400 });
  }

  // Build coding prompt
  const stack = project.stackItems.map((s) => s.name).join(", ") || "Non spécifiée";
  const taskList = todoTasks
    .map((t) => `- [${t.id.split(":").pop()}] ${t.titre} (${t.type}, estimation: ${t.estimation})\n  ${t.description || "Pas de description supplémentaire"}${t.userStory ? `\n  User Story: ${t.userStory}` : ""}`)
    .join("\n");

  const prompt = `Tu es un développeur expérimenté travaillant sur le projet "${project.name}".
Stack technique: ${stack}
Description: ${project.description || "Pas de description"}

Tu travailles dans le répertoire courant. Initialise le projet si nécessaire (npm init, git init, etc.).

== Sprint: ${sprint.nom} ==
Objectif: ${sprint.objectif}

== Tâches à implémenter ==
${taskList}

Instructions:
1. Implémente chaque tâche dans l'ordre indiqué
2. Écris du code propre, fonctionnel et bien structuré
3. Fais un git commit après chaque tâche terminée avec le message: "[ID] Titre de la tâche"
4. Si une tâche n'est pas claire, fais au mieux avec le contexte disponible
5. Quand tout est terminé, affiche sur la dernière ligne EXACTEMENT ce JSON:
   {"completed": [${todoTasks.map((t) => `"${t.id.split(":").pop()}"`).join(", ")}], "status": "done"}
6. Si certaines tâches échouent, indique:
   {"completed": ["T-xxx"], "failed": ["T-yyy"], "status": "partial"}
`;

  // Mark tasks as "En cours"
  const taskIds = todoTasks.map((t) => t.id);
  await prisma.task.updateMany({
    where: { id: { in: taskIds } },
    data: { status: "En cours" },
  });

  // Create job
  const jobId = createJob("sprint", projectId, {
    sprintId,
    provider,
    taskIds,
    sprintName: sprint.nom,
  });

  // Launch background process
  const child = executeCliBackground(
    provider,
    prompt,
    projectId,
    (line) => {
      appendOutput(jobId, line);
    },
    async (code, stderr) => {
      finishJob(jobId, code, stderr || undefined);

      // Parse final JSON to determine completed tasks
      const job = getJob(jobId);
      if (!job) return;

      const fullOutput = job.output.join("\n");
      const jsonMatch = fullOutput.match(/\{"completed":\s*\[[\s\S]*?\][\s\S]*?"status":\s*"[^"]*"\}/);

      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          const completedIds = (result.completed || []).map((id: string) =>
            id.includes(":") ? id : `${projectId}:${id}`
          );
          const failedIds = (result.failed || []).map((id: string) =>
            id.includes(":") ? id : `${projectId}:${id}`
          );

          if (completedIds.length > 0) {
            await prisma.task.updateMany({
              where: { id: { in: completedIds } },
              data: { status: "Termine" },
            });
          }
          if (failedIds.length > 0) {
            await prisma.task.updateMany({
              where: { id: { in: failedIds } },
              data: { status: "En review" },
            });
          }
        } catch {
          // JSON parse failed — fallback
        }
      } else if (code === 0) {
        // No JSON but success — mark all as Termine
        await prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: { status: "Termine" },
        });
      }
      // If error, tasks stay "En cours"
    }
  );

  // Store process reference for kill
  const job = getJob(jobId);
  if (job) job.process = child;

  return NextResponse.json({ jobId, taskCount: todoTasks.length }, { status: 202 });
}
