import { NextRequest, NextResponse } from "next/server";
import { getQuestionnaireResponses, saveQuestionnaireResponse, getRespondents, createRespondent } from "@/lib/data";

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
  const { name, email, role } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
  }

  const respondent = await createRespondent(projectId, name.trim(), email?.trim(), role?.trim());
  return NextResponse.json(respondent, { status: 201 });
}
