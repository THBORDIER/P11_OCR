import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { updateTestCaseStatus, resetTestCaseStatuses } from "@/lib/data";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);
  if (error)
    return NextResponse.json(
      { error },
      {
        status:
          error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403,
      }
    );

  const data = await request.json();
  const item = await prisma.testCase.create({
    data: { ...data, projectId },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { id, statut } = await request.json();
  const updated = await updateTestCaseStatus(`${projectId}:${id}`, statut);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  await resetTestCaseStatuses(projectId);
  return NextResponse.json({ ok: true });
}
