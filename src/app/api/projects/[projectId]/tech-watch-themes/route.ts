import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";

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

  const data = await req.json();
  const { sources, ...themeData } = data;
  const item = await prisma.techWatchTheme.create({
    data: {
      ...themeData,
      sources: sources
        ? {
            create: (sources as { nom: string; url: string }[]).map(
              (s: { nom: string; url: string }, i: number) => ({
                nom: s.nom,
                url: s.url,
                order: i,
              })
            ),
          }
        : undefined,
    },
    include: { sources: true },
  });
  return NextResponse.json(item, { status: 201 });
}
