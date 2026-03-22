import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendQuestionnaireEmail } from "@/lib/resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // Rate limit: 5 emails per minute per IP
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`email:${ip}`, 5)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const body = await request.json();
  const email = body.email || body.to;
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

  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
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
