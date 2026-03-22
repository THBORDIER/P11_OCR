import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const items = await prisma.userStory.findMany({
    where: { projectId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const data = await req.json();

  // Generate ID if not provided
  const count = await prisma.userStory.count({ where: { projectId } });
  const id = data.id || `${projectId}:US-${String(count + 1).padStart(3, "0")}`;

  try {
    const item = await prisma.userStory.create({
      data: {
        id,
        projectId,
        epic: data.epic || "",
        titre: data.titre || data.title || "",
        enTantQue: data.enTantQue || "",
        jeSouhaite: data.jeSouhaite || "",
        afinDe: data.afinDe || "",
        criteres: data.criteres || data.criteria || [],
        estimation: data.estimation || 0,
        priorite: data.priorite || data.priority || "Should",
        sprint: data.sprint || "",
        valeur: data.valeur || data.value || "Moyenne",
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur création US : " + (e instanceof Error ? e.message : "inconnue") },
      { status: 500 }
    );
  }
}
