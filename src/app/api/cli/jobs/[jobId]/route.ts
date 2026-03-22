import { NextRequest, NextResponse } from "next/server";
import { getJob, killJob, serializeJob } from "@/lib/job-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job introuvable" }, { status: 404 });
  }
  return NextResponse.json(serializeJob(job));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const killed = killJob(jobId);
  if (!killed) {
    return NextResponse.json({ error: "Impossible d'arrêter le job" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
