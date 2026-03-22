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

  const { projectId, sprintId, provider, mode, taskId, taskTitle, taskType, taskEstimation, taskUserStory } = await request.json();

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
      { error: "Un job est déjà en cours d'exécution", jobId: running.id },
      { status: 409 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { stackItems: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const stack = project.stackItems.map((s) => s.name).join(", ") || "Non spécifiée";

  // ===== MODE: Single task =====
  if (mode === "task" && taskId) {
    const prompt = `Tu es un développeur expérimenté travaillant sur le projet "${project.name}".
Stack technique: ${stack}
Description: ${project.description || "Pas de description"}

Tu travailles dans le répertoire courant. Le projet est peut-être déjà initialisé.
Si le projet n'existe pas encore, initialise-le (npm init, git init, créer les fichiers de base).
Si le projet existe, continue le développement.

== Tâche à implémenter ==
- Titre: ${taskTitle}
- Type: ${taskType || "Dev"}
- Estimation: ${taskEstimation || "Non estimée"}
${taskUserStory ? `- User Story: ${taskUserStory}` : ""}

Instructions:
1. AVANT de coder, vérifie si cette tâche est déjà implémentée (regarde les fichiers existants, le code source). Si c'est déjà fait, affiche EXACTEMENT: TASK_ALREADY_DONE et ne modifie rien.
2. Implémente UNIQUEMENT cette tâche
3. Écris du code propre, fonctionnel et bien structuré
4. Fais un git commit avec le message: "${taskTitle}"
5. NE TOUCHE PAS aux fichiers node_modules/, .next/, .git/
6. Si tu lances un serveur de dev, utilise le port 3001 (pas 3000 qui est déjà pris)
7. NE LIS PAS package-lock.json ou les fichiers dans node_modules/
8. Quand c'est terminé, affiche EXACTEMENT: TASK_DONE
`;

    // Mark task as "En cours"
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "En cours" },
    });

    const jobId = createJob("sprint", projectId, {
      sprintId,
      provider,
      taskIds: [taskId],
      mode: "task",
      taskTitle,
    });

    const child = executeCliBackground(
      provider,
      prompt,
      projectId,
      (line) => appendOutput(jobId, line),
      async (code, stderr) => {
        finishJob(jobId, code, stderr || undefined);

        const job = getJob(jobId);
        const fullOutput = job ? job.output.join("\n") : "";

        if (fullOutput.includes("TASK_ALREADY_DONE") || fullOutput.includes("TASK_DONE") || code === 0) {
          await prisma.task.update({
            where: { id: taskId },
            data: { status: "Termine" },
          });
        } else {
          // Error — put back to "A faire"
          await prisma.task.update({
            where: { id: taskId },
            data: { status: "A faire" },
          });
        }
      }
    );

    const job = getJob(jobId);
    if (job) job.process = child;

    return NextResponse.json({ jobId, taskCount: 1 }, { status: 202 });
  }

  // ===== MODE: Full sprint =====
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: { tasks: true },
  });

  if (!sprint) {
    return NextResponse.json({ error: "Sprint introuvable" }, { status: 404 });
  }

  const todoTasks = sprint.tasks.filter((t) => t.status === "A faire" || t.status === "En cours");
  if (todoTasks.length === 0) {
    return NextResponse.json({ error: "Aucune tâche à faire dans ce sprint" }, { status: 400 });
  }

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
4. NE TOUCHE PAS aux fichiers node_modules/, .next/, .git/
5. Si tu lances un serveur de dev, utilise le port 3001 (pas 3000 qui est déjà pris)
6. NE LIS PAS package-lock.json ou les fichiers dans node_modules/
7. Si une tâche n'est pas claire, fais au mieux avec le contexte disponible
6. Quand tout est terminé, affiche sur la dernière ligne EXACTEMENT ce JSON:
   {"completed": [${todoTasks.map((t) => `"${t.id.split(":").pop()}"`).join(", ")}], "status": "done"}
7. Si certaines tâches échouent, indique:
   {"completed": ["T-xxx"], "failed": ["T-yyy"], "status": "partial"}
`;

  // Mark tasks as "En cours"
  const taskIds = todoTasks.map((t) => t.id);
  await prisma.task.updateMany({
    where: { id: { in: taskIds } },
    data: { status: "En cours" },
  });

  const jobId = createJob("sprint", projectId, {
    sprintId,
    provider,
    taskIds,
    sprintName: sprint.nom,
  });

  const child = executeCliBackground(
    provider,
    prompt,
    projectId,
    (line) => appendOutput(jobId, line),
    async (code, stderr) => {
      finishJob(jobId, code, stderr || undefined);

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
          // JSON parse failed
        }
      } else if (code === 0) {
        await prisma.task.updateMany({
          where: { id: { in: taskIds } },
          data: { status: "Termine" },
        });
      }
    }
  );

  const job = getJob(jobId);
  if (job) job.process = child;

  return NextResponse.json({ jobId, taskCount: todoTasks.length }, { status: 202 });
}
