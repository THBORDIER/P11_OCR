import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RapportsClient from "./RapportsClient";

export default async function RapportsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true, name: true, clientEmail: true, notificationEmails: true },
  });

  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  return (
    <RapportsClient
      projectId={projectId}
      isOwner={isOwner}
      projectName={project?.name || projectId}
      hasRecipients={!!(project?.clientEmail || (project?.notificationEmails?.length ?? 0) > 0)}
    />
  );
}
