import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner } from "@/lib/auth-helpers";

// POST: Create a GitHub issue from a User Story
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

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubRepo: true },
  });

  if (!project?.githubRepo) {
    return NextResponse.json(
      { error: "Aucun dépôt GitHub lié. Configurez-le dans les paramètres." },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN non configuré. Ajoutez-le dans le .env pour créer des issues." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { title, description, labels } = body;

  if (!title) {
    return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${project.githubRepo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DevTracker/1.0",
        },
        body: JSON.stringify({
          title,
          body: description || "",
          labels: labels || [],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message || "Erreur GitHub" },
        { status: res.status }
      );
    }

    const issue = await res.json();

    // Log the creation
    await prisma.activityLog.create({
      data: {
        type: "issue_created",
        source: "manual",
        title: `Issue #${issue.number}: ${title}`,
        message: `Issue créée sur GitHub depuis le backlog`,
        metadata: { issueNumber: issue.number, url: issue.html_url },
        projectId,
      },
    });

    return NextResponse.json({
      number: issue.number,
      url: issue.html_url,
      title: issue.title,
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de contacter l'API GitHub" },
      { status: 502 }
    );
  }
}
