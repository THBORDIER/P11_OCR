import { NextRequest, NextResponse } from "next/server";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);

  if (error === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (error === "NOT_FOUND") {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }
  if (error === "FORBIDDEN") {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  const body = await request.json();

  // Only allow updating specific fields
  const allowedFields = [
    "name",
    "subtitle",
    "description",
    "color",
    "author",
    "organization",
    "isPublic",
    "contextSummary",
    "methodologyFramework",
    "methodologyFrameworkDescription",
    "methodologyPrioritization",
    "methodologyPrioritizationDescription",
    "clientEmail",
    "notificationEmails",
    "githubRepo",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);

  if (error === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (error === "NOT_FOUND") {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }
  if (error === "FORBIDDEN") {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id: projectId } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
