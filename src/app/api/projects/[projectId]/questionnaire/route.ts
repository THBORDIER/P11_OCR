import { NextRequest, NextResponse } from "next/server";
import { saveQuestionnaireResponse, getQuestionnaireResponses } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const responses = await getQuestionnaireResponses(projectId);
  const map: Record<string, string> = {};
  for (const r of responses) {
    map[r.questionId] = r.value;
  }
  return NextResponse.json(map);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { questionId, value } = await request.json();
  const saved = await saveQuestionnaireResponse(projectId, questionId, value);
  return NextResponse.json(saved);
}
