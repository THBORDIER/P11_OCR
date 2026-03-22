import { getQuestionnaireSections } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QuestionnaireClient from "./QuestionnaireClient";

export default async function QuestionnairePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const sections = await getQuestionnaireSections(projectId);

  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true, name: true } });
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  // Serialize for client component
  const serializedSections = JSON.parse(JSON.stringify(sections));
  return <QuestionnaireClient sections={serializedSections} projectId={projectId} projectName={project?.name ?? projectId} isOwner={isOwner} />;
}
