import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);
  if (error)
    return NextResponse.json(
      { error },
      { status: error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403 }
    );

  const logs = await prisma.activityLog.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(logs);
}
