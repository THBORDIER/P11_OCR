import { NextRequest, NextResponse } from "next/server";
import { validateUserStory, unvalidateUserStory } from "@/lib/data";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { id, validated } = await request.json();
  const fullId = `${projectId}:${id}`;
  const updated = validated
    ? await validateUserStory(fullId)
    : await unvalidateUserStory(fullId);
  return NextResponse.json(updated);
}
