import type { ChildProcess } from "node:child_process";

export interface Job {
  id: string;
  type: "sprint" | "test" | "devserver";
  projectId: string;
  status: "running" | "done" | "error";
  output: string[];
  error?: string;
  exitCode?: number | null;
  meta: Record<string, unknown>;
  process?: ChildProcess;
  startedAt: Date;
  finishedAt?: Date;
}

const MAX_OUTPUT_LINES = 300;
const AUTO_EXPIRE_MS = 60 * 60 * 1000; // 1 hour

const jobs = new Map<string, Job>();

export function createJob(
  type: Job["type"],
  projectId: string,
  meta: Record<string, unknown> = {}
): string {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  jobs.set(id, {
    id,
    type,
    projectId,
    status: "running",
    output: [],
    meta,
    startedAt: new Date(),
  });

  // Auto-expire old jobs
  setTimeout(() => {
    const job = jobs.get(id);
    if (job && job.status !== "running") {
      jobs.delete(id);
    }
  }, AUTO_EXPIRE_MS);

  return id;
}

export function getJob(jobId: string): Job | undefined {
  return jobs.get(jobId);
}

export function appendOutput(jobId: string, line: string) {
  const job = jobs.get(jobId);
  if (!job) return;
  job.output.push(line);
  if (job.output.length > MAX_OUTPUT_LINES) {
    job.output.splice(0, job.output.length - MAX_OUTPUT_LINES);
  }
}

export function finishJob(jobId: string, exitCode: number | null, error?: string) {
  const job = jobs.get(jobId);
  if (!job) return;
  job.status = exitCode === 0 ? "done" : "error";
  job.exitCode = exitCode;
  job.error = error;
  job.finishedAt = new Date();
  job.process = undefined; // Release process reference
}

export function killJob(jobId: string): boolean {
  const job = jobs.get(jobId);
  if (!job || !job.process) return false;
  try {
    job.process.kill("SIGTERM");
    finishJob(jobId, null, "Annulé par l'utilisateur");
    return true;
  } catch {
    return false;
  }
}

export function getRunningJob(projectId: string, type: Job["type"]): Job | undefined {
  for (const job of jobs.values()) {
    if (job.projectId === projectId && job.type === type && job.status === "running") {
      return job;
    }
  }
  return undefined;
}

export function listJobs(projectId: string): Job[] {
  const result: Job[] = [];
  for (const job of jobs.values()) {
    if (job.projectId === projectId) {
      result.push(job);
    }
  }
  return result.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
}

/** Serialize job for API response (exclude process reference) */
export function serializeJob(job: Job) {
  return {
    id: job.id,
    type: job.type,
    projectId: job.projectId,
    status: job.status,
    output: job.output,
    error: job.error,
    exitCode: job.exitCode,
    meta: job.meta,
    startedAt: job.startedAt.toISOString(),
    finishedAt: job.finishedAt?.toISOString() || null,
    elapsedMs: Date.now() - job.startedAt.getTime(),
  };
}
