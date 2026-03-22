import { NextRequest, NextResponse } from "next/server";
import { updateTaskStatus } from "@/lib/data";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { id, status } = await request.json();
  const fullId = `${projectId}:${id}`;
  const updated = await updateTaskStatus(fullId, status);
  return NextResponse.json(updated);
}
