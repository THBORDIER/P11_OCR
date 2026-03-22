import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  html_url: string;
  author?: { login: string; avatar_url: string } | null;
}

interface GitHubIssue {
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user?: { login: string; avatar_url: string } | null;
  labels: Array<{ name: string; color: string }>;
  pull_request?: unknown;
}

interface GitHubRepo {
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  pushed_at: string;
  created_at: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubRepo: true },
  });

  if (!project?.githubRepo) {
    return NextResponse.json(
      { error: "Aucun dépôt GitHub lié à ce projet" },
      { status: 404 }
    );
  }

  const repo = project.githubRepo;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DevTracker/1.0",
  };

  // Use GitHub token if available for higher rate limits
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Fetch repo info, commits, and issues in parallel
    const [repoRes, commitsRes, issuesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${repo}/commits?per_page=15`, { headers }),
      fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=20&sort=updated`, { headers }),
    ]);

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: `Dépôt GitHub introuvable : ${repo}` },
        { status: 404 }
      );
    }

    const repoData: GitHubRepo = await repoRes.json();

    const commits: GitHubCommit[] = commitsRes.ok ? await commitsRes.json() : [];
    const allIssues: GitHubIssue[] = issuesRes.ok ? await issuesRes.json() : [];

    // Separate issues and PRs
    const issues = allIssues.filter((i) => !i.pull_request);
    const pullRequests = allIssues.filter((i) => i.pull_request);

    return NextResponse.json({
      repo: {
        name: repoData.full_name,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        defaultBranch: repoData.default_branch,
        lastPush: repoData.pushed_at,
        createdAt: repoData.created_at,
      },
      commits: commits.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0], // First line only
        author: c.author?.login || c.commit.author.name,
        avatar: c.author?.avatar_url || null,
        date: c.commit.author.date,
        url: c.html_url,
      })),
      issues: issues.map((i) => ({
        number: i.number,
        title: i.title,
        state: i.state,
        url: i.html_url,
        createdAt: i.created_at,
        author: i.user?.login || "unknown",
        avatar: i.user?.avatar_url || null,
        labels: i.labels.map((l) => ({ name: l.name, color: l.color })),
      })),
      pullRequests: pullRequests.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        url: pr.html_url,
        createdAt: pr.created_at,
        author: pr.user?.login || "unknown",
        avatar: pr.user?.avatar_url || null,
        labels: pr.labels.map((l) => ({ name: l.name, color: l.color })),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de contacter l'API GitHub" },
      { status: 502 }
    );
  }
}
