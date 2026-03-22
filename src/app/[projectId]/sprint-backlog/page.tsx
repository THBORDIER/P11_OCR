import { getSprints, getUserStories } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SprintClient from "./SprintClient";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function SprintBacklogPage({ params }: PageProps) {
  const { projectId } = await params;
  const [sprints, stories] = await Promise.all([
    getSprints(projectId),
    getUserStories(projectId),
  ]);

  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true } });
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  // Build US id -> titre mapping
  const usDescriptions: Record<string, string> = {};
  stories.forEach((us) => {
    usDescriptions[us.id] = us.titre;
  });

  // Serialize to plain objects (handles Date objects)
  const serializedSprints = JSON.parse(JSON.stringify(sprints));

  return (
    <SprintClient
      sprints={serializedSprints}
      projectId={projectId}
      usDescriptions={usDescriptions}
      isOwner={isOwner}
    />
  );
}
