import { getTestCases } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RecettageClient from "./RecettageClient";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function RecettagePage({ params }: PageProps) {
  const { projectId } = await params;
  const testCases = await getTestCases(projectId);
  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true } });
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  // Serialize to plain objects (handles Date objects)
  const serializedRows = JSON.parse(JSON.stringify(testCases));

  return <RecettageClient initialRows={serializedRows} projectId={projectId} isOwner={isOwner} />;
}
