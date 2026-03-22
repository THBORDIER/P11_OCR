import { getProject } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function ProjectDashboard({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const session = await auth();
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  // Auto-calculate stats for dashboard
  const [totalUS, validatedUS, totalTasks, doneTasks, totalTests, okTests] = await Promise.all([
    prisma.userStory.count({ where: { projectId } }),
    prisma.userStory.count({ where: { projectId, validatedAt: { not: null } } }),
    prisma.task.count({ where: { sprint: { projectId } } }),
    prisma.task.count({ where: { sprint: { projectId }, status: "Termine" } }),
    prisma.testCase.count({ where: { projectId } }),
    prisma.testCase.count({ where: { projectId, statut: "OK" } }),
  ]);

  const autoStats = {
    userStories: { total: totalUS, validated: validatedUS },
    tasks: { total: totalTasks, done: doneTasks },
    tests: { total: totalTests, ok: okTests },
  };

  return <DashboardClient initialProject={project} isOwner={isOwner} autoStats={autoStats} />;
}
