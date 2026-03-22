import { getProject } from "@/lib/data";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function ProjectDashboard({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const session = await auth();
  const isOwner = project?.userId === session?.user?.id;

  return <DashboardClient initialProject={project} isOwner={isOwner} />;
}
