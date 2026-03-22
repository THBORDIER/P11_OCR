import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeCliBackground, detectProviders, isLocalEnvironment, ensureProjectDirPublic } from "@/lib/cli-exec";
import { createJob, getRunningJob, appendOutput, finishJob, getJob } from "@/lib/job-store";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { platform } from "node:os";

export async function POST(request: NextRequest) {
  if (!isLocalEnvironment()) {
    return NextResponse.json(
      { error: "Non disponible en serverless." },
      { status: 400 }
    );
  }

  const { projectId, provider } = await request.json();

  if (!projectId) {
    return NextResponse.json({ error: "projectId requis" }, { status: 400 });
  }

  const running = getRunningJob(projectId, "test");
  if (running) {
    return NextResponse.json(
      { error: "Des tests sont déjà en cours", jobId: running.id },
      { status: 409 }
    );
  }

  const testCases = await prisma.testCase.findMany({
    where: { projectId, statut: { in: ["A tester", "A retester"] } },
  });

  if (testCases.length === 0) {
    return NextResponse.json({ error: "Aucun cas de test à exécuter" }, { status: 400 });
  }

  const projectDir = ensureProjectDirPublic(projectId);
  const pkgPath = join(projectDir, "package.json");
  const hasTestScript = existsSync(pkgPath) && (() => {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return !!pkg.scripts?.test;
    } catch { return false; }
  })();

  const jobId = createJob("test", projectId, {
    provider: provider || "npm",
    testCount: testCases.length,
    testIds: testCases.map((t) => t.id),
  });

  if (hasTestScript && !provider) {
    // Run npm test directly
    const child = spawn("npm", ["test"], {
      cwd: projectDir,
      stdio: ["pipe", "pipe", "pipe"],
      shell: platform() === "win32",
      timeout: 10 * 60 * 1000,
    });

    child.stdout.on("data", (data: Buffer) => {
      data.toString().split("\n").filter(Boolean).forEach((l) => appendOutput(jobId, l));
    });
    child.stderr.on("data", (data: Buffer) => {
      data.toString().split("\n").filter(Boolean).forEach((l) => appendOutput(jobId, `[stderr] ${l}`));
    });
    child.on("close", async (code) => {
      finishJob(jobId, code);
      // Mark all as OK if tests pass, KO if fail
      const status = code === 0 ? "OK" : "KO";
      for (const tc of testCases) {
        await prisma.testCase.update({
          where: { id: tc.id },
          data: { statut: status, obtenu: code === 0 ? "Tests passés" : "Échec des tests" },
        });
      }
    });
    child.on("error", (err) => {
      finishJob(jobId, null, err.message);
    });

    const job = getJob(jobId);
    if (job) job.process = child;
  } else {
    // Use CLI provider to verify test cases
    const available = await detectProviders();
    const prov = provider || available[0];
    if (!prov || !available.includes(prov)) {
      finishJob(jobId, null, "Aucun provider CLI disponible");
      return NextResponse.json({ error: "Aucun provider disponible" }, { status: 400 });
    }

    const testList = testCases
      .map((tc) => `- [${tc.id.split(":").pop()}] Action: "${tc.action}" → Attendu: "${tc.attendu}"`)
      .join("\n");

    const prompt = `Tu es un testeur QA. Vérifie les cas de test suivants dans le répertoire de travail courant.

Cas de test à vérifier:
${testList}

Instructions:
1. Lance l'application si nécessaire
2. Exécute chaque cas de test
3. Compare le résultat obtenu avec le résultat attendu
4. À la fin, affiche EXACTEMENT ce JSON:
{"results":[${testCases.map((tc) => `{"id":"${tc.id.split(":").pop()}","statut":"OK ou KO","obtenu":"description du résultat"}`).join(",")}]}
`;

    const child = executeCliBackground(
      prov,
      prompt,
      projectId,
      (line) => appendOutput(jobId, line),
      async (code, stderr) => {
        finishJob(jobId, code, stderr || undefined);

        const job = getJob(jobId);
        if (!job) return;

        const fullOutput = job.output.join("\n");
        const jsonMatch = fullOutput.match(/\{"results":\s*\[[\s\S]*?\]\}/);

        if (jsonMatch) {
          try {
            const { results } = JSON.parse(jsonMatch[0]);
            for (const r of results) {
              const fullId = r.id.includes(":") ? r.id : `${projectId}:${r.id}`;
              await prisma.testCase.update({
                where: { id: fullId },
                data: {
                  statut: r.statut === "OK" ? "OK" : "KO",
                  obtenu: r.obtenu || "",
                },
              });
            }
          } catch { /* parse error */ }
        } else if (code === 0) {
          for (const tc of testCases) {
            await prisma.testCase.update({
              where: { id: tc.id },
              data: { statut: "OK", obtenu: "Vérifié par l'agent IA" },
            });
          }
        }
      }
    );

    const job = getJob(jobId);
    if (job) job.process = child;
  }

  return NextResponse.json({ jobId, testCount: testCases.length }, { status: 202 });
}
