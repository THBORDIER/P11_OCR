import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GitHubClient from "./GitHubClient";

export default async function GitHubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const session = await auth();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true, githubRepo: true, name: true },
  });

  const isOwner = !!session?.user?.id && project?.userId === session.user.id;

  return (
    <GitHubClient
      projectId={projectId}
      githubRepo={project?.githubRepo || null}
      isOwner={isOwner}
    />
  );
}
