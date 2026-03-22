import { NextRequest, NextResponse } from "next/server";
import { requireProjectOwner } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/resend";

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

  const { subject, message } = await request.json();
  if (!subject || !message) {
    return NextResponse.json({ error: "Sujet et message requis" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true, notificationEmails: true, clientEmail: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const recipients = [
    ...project.notificationEmails,
    ...(project.clientEmail ? [project.clientEmail] : []),
  ].filter(Boolean);

  if (!recipients.length) {
    return NextResponse.json(
      { error: "Aucun destinataire configuré. Ajoutez des emails dans les paramètres du projet." },
      { status: 400 }
    );
  }

  try {
    await sendNotificationEmail(recipients, project.name, subject, message);
    return NextResponse.json({ ok: true, sent: recipients.length });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur d'envoi : " + (e instanceof Error ? e.message : "inconnue") },
      { status: 500 }
    );
  }
}
