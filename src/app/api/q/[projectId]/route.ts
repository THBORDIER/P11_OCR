import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — no auth required (for client questionnaire access)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      name: true,
      questionnaireSections: {
        orderBy: { order: "asc" },
        include: {
          questions: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    projectName: project.name,
    sections: project.questionnaireSections,
  });
}
