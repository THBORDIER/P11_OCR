import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { sendNotificationEmail } from "@/lib/resend";

// ─── Build report data from project ───
async function buildReportData(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      name: true,
      subtitle: true,
      clientEmail: true,
      notificationEmails: true,
      githubRepo: true,
    },
  });

  if (!project) return null;

  // Count entities
  const [
    totalUS,
    validatedUS,
    totalTasks,
    doneTasks,
    totalTests,
    okTests,
    koTests,
    sprintsCount,
    phasesCount,
    recentLogs,
  ] = await Promise.all([
    prisma.userStory.count({ where: { projectId } }),
    prisma.userStory.count({ where: { projectId, validatedAt: { not: null } } }),
    prisma.task.count({ where: { sprint: { projectId } } }),
    prisma.task.count({ where: { sprint: { projectId }, status: "Termine" } }),
    prisma.testCase.count({ where: { projectId } }),
    prisma.testCase.count({ where: { projectId, statut: "OK" } }),
    prisma.testCase.count({ where: { projectId, statut: "KO" } }),
    prisma.sprint.count({ where: { projectId } }),
    prisma.phase.count({ where: { projectId } }),
    prisma.activityLog.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { type: true, title: true, createdAt: true },
    }),
  ]);

  const inProgressTasks = await prisma.task.count({
    where: { sprint: { projectId }, status: "En cours" },
  });

  return {
    project,
    stats: {
      userStories: { total: totalUS, validated: validatedUS },
      tasks: { total: totalTasks, done: doneTasks, inProgress: inProgressTasks },
      tests: { total: totalTests, ok: okTests, ko: koTests },
      sprints: sprintsCount,
      phases: phasesCount,
    },
    recentActivity: recentLogs,
  };
}

// ─── GET: preview report data ───
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);
  if (error)
    return NextResponse.json(
      { error },
      { status: error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403 }
    );

  const data = await buildReportData(projectId);
  if (!data) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }
  return NextResponse.json(data);
}

// ─── POST: send report by email ───
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);
  if (error) {
    return NextResponse.json(
      { error },
      { status: error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403 }
    );
  }

  const data = await buildReportData(projectId);
  if (!data) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const { project, stats } = data;

  // Build email recipient list
  const recipients: string[] = [];
  if (project.clientEmail) recipients.push(project.clientEmail);
  if (project.notificationEmails?.length) recipients.push(...project.notificationEmails);

  const body = await request.json().catch(() => ({}));
  if (body.to) recipients.push(body.to);

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "Aucun destinataire configuré. Ajoutez un email client dans les paramètres." },
      { status: 400 }
    );
  }

  // Build email content
  const taskPct = stats.tasks.total > 0 ? Math.round((stats.tasks.done / stats.tasks.total) * 100) : 0;
  const testPct = stats.tests.total > 0 ? Math.round((stats.tests.ok / stats.tests.total) * 100) : 0;
  const usPct = stats.userStories.total > 0 ? Math.round((stats.userStories.validated / stats.userStories.total) * 100) : 0;

  const subject = `Rapport d'avancement — ${project.name}`;
  const message = [
    `📊 Rapport d'avancement du projet ${project.name}`,
    "",
    `📋 User Stories : ${stats.userStories.validated}/${stats.userStories.total} validées (${usPct}%)`,
    `✅ Tâches : ${stats.tasks.done}/${stats.tasks.total} terminées (${taskPct}%) — ${stats.tasks.inProgress} en cours`,
    `🧪 Tests : ${stats.tests.ok}/${stats.tests.total} OK (${testPct}%) — ${stats.tests.ko} KO`,
    `🗺️ ${stats.phases} phases · ${stats.sprints} sprints`,
    "",
    `Activité récente :`,
    ...data.recentActivity.slice(0, 5).map(
      (log) => `  • ${log.title}`
    ),
    "",
    `---`,
    `Rapport généré automatiquement le ${new Date().toLocaleDateString("fr-FR")}`,
  ].join("\n");

  try {
    await sendNotificationEmail(recipients, project.name, subject, message);

    // Log the report send
    await prisma.activityLog.create({
      data: {
        type: "email_sent",
        source: "system",
        title: `Rapport d'avancement envoyé`,
        message: `Envoyé à ${recipients.join(", ")}`,
        metadata: { recipients, stats },
        projectId,
      },
    });

    return NextResponse.json({ ok: true, sentTo: recipients });
  } catch (err) {
    return NextResponse.json(
      { error: `Erreur d'envoi : ${err instanceof Error ? err.message : "inconnu"}` },
      { status: 500 }
    );
  }
}
