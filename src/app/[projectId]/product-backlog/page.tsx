import { getUserStories } from "@/lib/data";
import { auth } from "@/lib/auth";
import BacklogClient from "./BacklogClient";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProductBacklogPage({ params }: PageProps) {
  const { projectId } = await params;
  const stories = await getUserStories(projectId);
  const session = await auth();
  const isOwner = !!session?.user?.id;

  // Serialize to plain objects (handles Date -> string for validatedAt)
  const serializedStories = JSON.parse(JSON.stringify(stories));

  return <BacklogClient initialStories={serializedStories} projectId={projectId} isOwner={isOwner} />;
}
