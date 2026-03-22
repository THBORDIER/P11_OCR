import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// ─── Verify GitHub webhook signature ───
function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// ─── Parse US/task references from commit message ───
// Conventions: feat(US-003), fix(US-003), close(US-003), test(R-005)
function parseReferences(message: string): { userStories: string[]; testCases: string[] } {
  const usMatches = message.match(/(?:feat|fix|close|ref|wip)\(?(US-\d+)\)?/gi) || [];
  const tcMatches = message.match(/(?:test|fix)\(?(R-\d+)\)?/gi) || [];

  const userStories = [...new Set(usMatches.map((m) => {
    const match = m.match(/US-\d+/i);
    return match ? match[0].toUpperCase() : "";
  }).filter(Boolean))];

  const testCases = [...new Set(tcMatches.map((m) => {
    const match = m.match(/R-\d+/i);
    return match ? match[0].toUpperCase() : "";
  }).filter(Boolean))];

  return { userStories, testCases };
}

// ─── Determine action from commit message ───
function getAction(message: string): "progress" | "close" | "test" | "none" {
  const lower = message.toLowerCase();
  if (lower.startsWith("close") || lower.includes("closes ") || lower.includes("fixed ")) return "close";
  if (lower.startsWith("test")) return "test";
  if (lower.startsWith("feat") || lower.startsWith("fix") || lower.startsWith("wip")) return "progress";
  return "none";
}

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const body = await request.text();
  const event = request.headers.get("x-github-event");
  const signature = request.headers.get("x-hub-signature-256");

  // Verify signature if secret is configured
  if (secret && !verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  // Find project by repo name
  const repoFullName = payload.repository?.full_name;
  if (!repoFullName) {
    return NextResponse.json({ error: "No repository in payload" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { githubRepo: repoFullName },
  });

  if (!project) {
    return NextResponse.json({ error: `No project linked to ${repoFullName}` }, { status: 404 });
  }

  const projectId = project.id;

  // ─── Handle push events (commits) ───
  if (event === "push") {
    const commits = payload.commits || [];
    const branch = (payload.ref || "").replace("refs/heads/", "");
    let tasksUpdated = 0;

    for (const commit of commits) {
      const message: string = commit.message || "";
      const firstLine = message.split("\n")[0];
      const { userStories, testCases } = parseReferences(firstLine);
      const action = getAction(firstLine);

      // Log the commit
      await prisma.activityLog.create({
        data: {
          type: "commit",
          source: "github",
          title: firstLine.slice(0, 200),
          message: `${commit.author?.name || "unknown"} pushed to ${branch}`,
          metadata: {
            sha: commit.id?.slice(0, 7),
            fullSha: commit.id,
            branch,
            author: commit.author?.name,
            url: commit.url,
            refs: { userStories, testCases },
          },
          projectId,
        },
      });

      // Update tasks linked to referenced user stories
      if (action !== "none" && userStories.length > 0) {
        for (const usRef of userStories) {
          const fullUsId = `${projectId}:${usRef}`;

          // Find tasks linked to this US
          const tasks = await prisma.task.findMany({
            where: {
              userStory: fullUsId,
              sprint: { projectId },
            },
          });

          for (const task of tasks) {
            let newStatus = task.status;
            if (action === "close") {
              newStatus = "Termine";
            } else if (action === "progress" && task.status === "A faire") {
              newStatus = "En cours";
            }

            if (newStatus !== task.status) {
              await prisma.task.update({
                where: { id: task.id },
                data: { status: newStatus },
              });
              tasksUpdated++;
            }
          }

          // If close action, also validate the US
          if (action === "close") {
            await prisma.userStory.update({
              where: { id: fullUsId },
              data: { validatedAt: new Date() },
            }).catch(() => {/* US might not exist */});
          }
        }
      }

      // Update test cases
      if (action === "test" && testCases.length > 0) {
        for (const tcRef of testCases) {
          const fullTcId = `${projectId}:${tcRef}`;
          await prisma.testCase.update({
            where: { id: fullTcId },
            data: { statut: "OK" },
          }).catch(() => {/* Test case might not exist */});
        }
      }
    }

    return NextResponse.json({
      ok: true,
      project: projectId,
      commitsProcessed: commits.length,
      tasksUpdated,
    });
  }

  // ─── Handle pull_request events ───
  if (event === "pull_request") {
    const pr = payload.pull_request;
    const action = payload.action; // opened, closed, merged

    // Log PR activity
    await prisma.activityLog.create({
      data: {
        type: action === "closed" && pr.merged ? "pr_merged" : `pr_${action}`,
        source: "github",
        title: `PR #${pr.number}: ${(pr.title || "").slice(0, 200)}`,
        message: `${pr.user?.login || "unknown"} ${action} PR`,
        metadata: {
          prNumber: pr.number,
          branch: pr.head?.ref,
          baseBranch: pr.base?.ref,
          url: pr.html_url,
          merged: pr.merged || false,
          author: pr.user?.login,
        },
        projectId,
      },
    });

    // When PR is merged, parse body for US references and close tasks
    if (action === "closed" && pr.merged) {
      const prBody = `${pr.title} ${pr.body || ""}`;
      const { userStories } = parseReferences(prBody);

      for (const usRef of userStories) {
        const fullUsId = `${projectId}:${usRef}`;

        // Close all tasks for this US
        const tasks = await prisma.task.findMany({
          where: {
            userStory: fullUsId,
            sprint: { projectId },
          },
        });

        for (const task of tasks) {
          if (task.status !== "Termine") {
            await prisma.task.update({
              where: { id: task.id },
              data: { status: "Termine" },
            });
          }
        }

        // Validate the US
        await prisma.userStory.update({
          where: { id: fullUsId },
          data: { validatedAt: new Date() },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ ok: true, project: projectId, event: `pr_${action}` });
  }

  // ─── Handle issues events ───
  if (event === "issues") {
    const issue = payload.issue;

    await prisma.activityLog.create({
      data: {
        type: `issue_${payload.action}`,
        source: "github",
        title: `Issue #${issue.number}: ${(issue.title || "").slice(0, 200)}`,
        message: `${issue.user?.login || "unknown"} ${payload.action} issue`,
        metadata: {
          issueNumber: issue.number,
          url: issue.html_url,
          state: issue.state,
          labels: issue.labels?.map((l: { name: string }) => l.name) || [],
          author: issue.user?.login,
        },
        projectId,
      },
    });

    return NextResponse.json({ ok: true, project: projectId, event: `issue_${payload.action}` });
  }

  // Other events — just acknowledge
  return NextResponse.json({ ok: true, event, ignored: true });
}
