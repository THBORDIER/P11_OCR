import { getPersonas } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AnalyseClient from "./AnalyseClient";

export default async function AnalysePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const personas = await getPersonas(projectId);

  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true, name: true } });
  const isOwner = !!session?.user?.id && project?.userId === session.user.id;

  const serializedPersonas = JSON.parse(JSON.stringify(personas));

  return <AnalyseClient personas={serializedPersonas} isOwner={isOwner} projectName={project?.name ?? projectId} />;
}
