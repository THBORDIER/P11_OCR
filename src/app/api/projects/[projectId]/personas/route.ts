import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { pick, ALLOWED_FIELDS } from "@/lib/sanitize";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const items = await prisma.persona.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
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
  const data = pick(raw, [...ALLOWED_FIELDS.persona]);
  const item = await prisma.persona.create({
    data: { ...data, projectId } as Parameters<typeof prisma.persona.create>[0]["data"],
  });
  return NextResponse.json(item, { status: 201 });
}
