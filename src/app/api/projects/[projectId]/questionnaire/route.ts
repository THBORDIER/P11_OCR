import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireResponses, saveQuestionnaireResponse, getRespondents, createRespondent } from "@/lib/data";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const url = new URL(request.url);
  const respondentId = url.searchParams.get("respondentId");

  if (respondentId) {
    const responses = await getQuestionnaireResponses(projectId, respondentId);
    const map: Record<string, string> = {};
    for (const r of responses) {
      map[r.questionId] = r.value;
    }
    return NextResponse.json(map);
  }

  // Return all responses grouped + respondents list
  const [responses, respondents] = await Promise.all([
    getQuestionnaireResponses(projectId),
    getRespondents(projectId),
  ]);

  return NextResponse.json({ responses, respondents });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { questionId, value, respondentId } = await request.json();

  if (!respondentId) {
    return NextResponse.json({ error: "respondentId requis" }, { status: 400 });
  }

  const saved = await saveQuestionnaireResponse(projectId, questionId, value, respondentId);
  return NextResponse.json(saved);
}

// Create a new respondent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // Rate limit: 10 respondent creations per minute per IP
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`respondent:${ip}`, 10)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const { name, email, role } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }

  const respondent = await createRespondent(projectId, name.trim(), email?.trim(), role?.trim());
  return NextResponse.json(respondent, { status: 201 });
}

// Create a section with questions (from AI generation)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { title, description, questions } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  }

  // Get current max order
  const maxSection = await prisma.questionnaireSection.findFirst({
    where: { projectId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = (maxSection?.order ?? -1) + 1;

  const section = await prisma.questionnaireSection.create({
    data: {
      title,
      description: description || "",
      pourquoi: "",
      order: nextOrder,
      projectId,
      questions: {
        create: (questions || []).map((q: { label: string; type?: string; options?: string[]; required?: boolean }, i: number) => ({
          id: `${projectId}:ai_${nextOrder}_${i}`,
          label: q.label,
          type: q.type || "textarea",
          options: q.options || [],
          required: q.required ?? false,
          order: i,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json(section, { status: 201 });
}
