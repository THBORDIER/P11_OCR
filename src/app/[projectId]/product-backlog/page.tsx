import { getUserStories } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BacklogClient from "./BacklogClient";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProductBacklogPage({ params }: PageProps) {
  const { projectId } = await params;
  const stories = await getUserStories(projectId);
  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true } });
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  // Serialize to plain objects (handles Date -> string for validatedAt)
  const serializedStories = JSON.parse(JSON.stringify(stories));

  return <BacklogClient initialStories={serializedStories} projectId={projectId} isOwner={isOwner} />;
}
