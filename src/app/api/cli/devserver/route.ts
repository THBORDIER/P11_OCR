import { NextRequest, NextResponse } from "next/server";
import { isLocalEnvironment, ensureProjectDirPublic } from "@/lib/cli-exec";
import { createJob, getRunningJob, appendOutput, finishJob, getJob, killJob, serializeJob } from "@/lib/job-store";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { platform } from "node:os";

export async function POST(request: NextRequest) {
  if (!isLocalEnvironment()) {
    return NextResponse.json({ error: "Non disponible en serverless." }, { status: 400 });
  }

  const { projectId } = await request.json();
  if (!projectId) {
    return NextResponse.json({ error: "projectId requis" }, { status: 400 });
  }

  const running = getRunningJob(projectId, "devserver");
  if (running) {
    return NextResponse.json({ message: "Serveur déjà lancé", jobId: running.id, ...serializeJob(running) }, { status: 409 });
  }

  const projectDir = ensureProjectDirPublic(projectId);
  const pkgPath = join(projectDir, "package.json");

  if (!existsSync(pkgPath)) {
    return NextResponse.json({ error: `Pas de package.json dans ~/DevTracker/${projectId}/` }, { status: 400 });
  }

  let startScript = "start";
  let port = 3001;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (pkg.scripts?.dev) startScript = "dev";
    else if (pkg.scripts?.start) startScript = "start";
    // Try to detect port from scripts
    const scriptCmd = pkg.scripts?.[startScript] || "";
    const portMatch = scriptCmd.match(/--port\s+(\d+)|-p\s+(\d+)/);
    if (portMatch) port = parseInt(portMatch[1] || portMatch[2]);
  } catch { /* ignore */ }

  const jobId = createJob("devserver", projectId, { port, script: startScript });

  const child = spawn("npm", ["run", startScript], {
    cwd: projectDir,
    stdio: ["pipe", "pipe", "pipe"],
    shell: platform() === "win32",
    detached: false,
  });

  child.stdout.on("data", (data: Buffer) => {
    const lines = data.toString().split("\n").filter(Boolean);
    for (const line of lines) {
      appendOutput(jobId, line);
      // Try to detect actual port from output
      const portMatch = line.match(/localhost:(\d+)|port\s+(\d+)/i);
      if (portMatch) {
        const detected = parseInt(portMatch[1] || portMatch[2]);
        if (detected) {
          const job = getJob(jobId);
          if (job) job.meta.port = detected;
        }
      }
    }
  });
  child.stderr.on("data", (data: Buffer) => {
    data.toString().split("\n").filter(Boolean).forEach((l) => appendOutput(jobId, `[stderr] ${l}`));
  });
  child.on("close", (code) => {
    finishJob(jobId, code);
  });
  child.on("error", (err) => {
    finishJob(jobId, null, err.message);
  });

  const job = getJob(jobId);
  if (job) job.process = child;

  return NextResponse.json({ jobId, port }, { status: 202 });
}

export async function DELETE(request: NextRequest) {
  const { projectId } = await request.json();
  const running = getRunningJob(projectId, "devserver");
  if (!running) {
    return NextResponse.json({ error: "Aucun serveur en cours" }, { status: 404 });
  }
  killJob(running.id);
  return NextResponse.json({ ok: true });
}
