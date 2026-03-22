import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { pick, ALLOWED_FIELDS } from "@/lib/sanitize";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { searchParams } = new URL(req.url);
  const sprintId = searchParams.get("sprintId");

  const items = await prisma.task.findMany({
    where: {
      sprint: { projectId },
      ...(sprintId ? { sprintId } : {}),
    },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(
  req: NextRequest,
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

  const raw = await req.json();
  const data = pick(raw, [...ALLOWED_FIELDS.task]);
  // Tasks belong to a Sprint, not directly to Project.
  // sprintId must be provided in the request body.
  const item = await prisma.task.create({
    data: data as Parameters<typeof prisma.task.create>[0]["data"],
  });
  return NextResponse.json(item, { status: 201 });
}
