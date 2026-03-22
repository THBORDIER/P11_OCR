import { getTechWatchCategories } from "@/lib/data";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VeilleClient from "./VeilleClient";

export default async function VeillePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const dbCategories = await getTechWatchCategories(projectId);

  const session = await auth();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true, name: true } });
  const isOwner = !project?.userId || (!!session?.user?.id && project.userId === session.user.id);

  const categories = dbCategories.map((cat) => ({
    id: cat.id,
    titre: cat.titre,
    miseAJour: cat.miseAJour,
    items: cat.themes.map((t) => ({
      id: t.id,
      theme: t.theme,
      description: t.description,
      sources: t.sources.map((s) => ({ nom: s.nom, url: s.url })),
      avantages: t.avantages,
      consultation: t.consultation,
      utiliseDansProjet: t.utiliseDansProjet ?? false,
      apprentissage: t.apprentissage ?? undefined,
      categoryId: t.categoryId,
    })),
  }));

  return <VeilleClient categories={categories} isOwner={isOwner} projectName={project?.name ?? projectId} />;
}
