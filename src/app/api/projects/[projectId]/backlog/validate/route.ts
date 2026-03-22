import { NextRequest, NextResponse } from "next/server";
import { validateUserStory, unvalidateUserStory } from "@/lib/data";
import { requireProjectOwner } from "@/lib/auth-helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);
  if (error)
    return NextResponse.json(
      { error },
      { status: error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403 }
    );

  const { id, validated } = await request.json();
  if (typeof id !== "string" || typeof validated !== "boolean") {
    return NextResponse.json({ error: "id (string) et validated (boolean) requis" }, { status: 400 });
  }
  const fullId = `${projectId}:${id}`;
  const updated = validated
    ? await validateUserStory(fullId)
    : await unvalidateUserStory(fullId);
  return NextResponse.json(updated);
}
