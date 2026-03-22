import { getPhases } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoadmapClient from "./RoadmapClient";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const phases = await getPhases(projectId);

  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true } });
  const isOwner = !!session?.user?.id && project?.userId === session.user.id;

  const serializedPhases = JSON.parse(JSON.stringify(phases));

  return <RoadmapClient phases={serializedPhases} isOwner={isOwner} />;
}
