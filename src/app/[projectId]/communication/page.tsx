import { getStakeholders, getRituals } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CommunicationClient from "./CommunicationClient";

export default async function CommunicationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [stakeholders, rituals] = await Promise.all([
    getStakeholders(projectId),
    getRituals(projectId),
  ]);

  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true, name: true } });
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  const serializedStakeholders = JSON.parse(JSON.stringify(stakeholders));
  const serializedRituals = JSON.parse(JSON.stringify(rituals));

  return (
    <CommunicationClient
      stakeholders={serializedStakeholders}
      rituals={serializedRituals}
      isOwner={isOwner}
      projectName={project?.name ?? projectId}
    />
  );
}
