import { getTestCases } from "@/lib/data";
import { auth } from "@/lib/auth";
import RecettageClient from "./RecettageClient";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function RecettagePage({ params }: PageProps) {
  const { projectId } = await params;
  const testCases = await getTestCases(projectId);
  const session = await auth();
  const isOwner = !!session?.user?.id;

  // Serialize to plain objects (handles Date objects)
  const serializedRows = JSON.parse(JSON.stringify(testCases));

  return <RecettageClient initialRows={serializedRows} projectId={projectId} isOwner={isOwner} />;
}
