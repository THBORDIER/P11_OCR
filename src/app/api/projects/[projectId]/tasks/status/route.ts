import { NextRequest, NextResponse } from "next/server";
import { updateTaskStatus } from "@/lib/data";
import { requireProjectOwner } from "@/lib/auth-helpers";

const VALID_STATUSES = ["A faire", "En cours", "En review", "Termine"];

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

  const { id, status } = await request.json();
  if (typeof id !== "string" || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `id (string) et status requis. Statuts valides : ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }
  const fullId = `${projectId}:${id}`;
  const updated = await updateTaskStatus(fullId, status);
  return NextResponse.json(updated);
}
