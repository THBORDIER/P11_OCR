import { NextRequest, NextResponse } from "next/server";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sendQuestionnaireEmail } from "@/lib/resend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { error } = await requireProjectOwner(projectId);
  if (error) {
    return NextResponse.json(
      { error },
      { status: error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403 }
    );
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const questionnaireUrl = `${baseUrl}/q/${projectId}`;

  try {
    await sendQuestionnaireEmail(email, project.name, questionnaireUrl);
    // Save client email on project
    await prisma.project.update({
      where: { id: projectId },
      data: { clientEmail: email },
    });
    return NextResponse.json({ ok: true, url: questionnaireUrl });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur d'envoi : " + (e instanceof Error ? e.message : "inconnue") },
      { status: 500 }
    );
  }
}
