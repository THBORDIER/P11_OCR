import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { updateTestCaseStatus, resetTestCaseStatuses } from "@/lib/data";
import { pick, ALLOWED_FIELDS } from "@/lib/sanitize";

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

  const raw = await request.json();
  const data = pick(raw, [...ALLOWED_FIELDS.testCase]);
  const item = await prisma.testCase.create({
    data: { ...data, projectId } as Parameters<typeof prisma.testCase.create>[0]["data"],
  });
  return NextResponse.json(item, { status: 201 });
}

const VALID_TEST_STATUSES = ["A tester", "En cours", "OK", "KO", "A retester"];

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

  const { id, statut } = await request.json();
  if (typeof id !== "string" || !VALID_TEST_STATUSES.includes(statut)) {
    return NextResponse.json(
      { error: `id (string) et statut requis. Statuts valides : ${VALID_TEST_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }
  const updated = await updateTestCaseStatus(`${projectId}:${id}`, statut);
  return NextResponse.json(updated);
}

export async function DELETE(
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

  await resetTestCaseStatuses(projectId);
  return NextResponse.json({ ok: true });
}
