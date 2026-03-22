"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Commit {
  sha: string;
  message: string;
  author: string;
  avatar: string | null;
  date: string;
  url: string;
}

interface Issue {
  number: number;
  title: string;
  state: string;
  url: string;
  createdAt: string;
  author: string;
  avatar: string | null;
  labels: Array<{ name: string; color: string }>;
}

interface RepoInfo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  defaultBranch: string;
  lastPush: string;
  createdAt: string;
}

interface GitHubData {
  repo: RepoInfo;
  commits: Commit[];
  issues: Issue[];
  pullRequests: Issue[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}

export default function GitHubClient({
  projectId,
  githubRepo,
  isOwner,
}: {
  projectId: string;
  githubRepo: string | null;
  isOwner: boolean;
}) {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"commits" | "issues" | "prs">("commits");

  useEffect(() => {
    if (!githubRepo) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/projects/${projectId}/github`);
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Erreur");
          return;
        }
        setData(await res.json());
      } catch {
        setError("Impossible de charger les données GitHub");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId, githubRepo]);

  // No repo linked
  if (!githubRepo) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-6">GitHub</h1>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
          <div className="text-5xl mb-4">
            <svg className="w-16 h-16 mx-auto text-[#94a3b8]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <p className="text-[#64748b] text-lg mb-2">Aucun dépôt GitHub lié</p>
          <p className="text-[#94a3b8] text-sm mb-4">
            {isOwner
              ? "Liez un dépôt GitHub dans les paramètres pour voir l'activité ici."
              : "Le propriétaire n'a pas encore lié de dépôt GitHub."}
          </p>
          {isOwner && (
            <Link
              href={`/${projectId}/settings`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white text-sm font-medium rounded-lg hover:bg-[#334155] transition-colors"
            >
              Paramètres
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-6">GitHub</h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e293b]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-6">GitHub</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Vérifiez que le dépôt <span className="font-mono">{githubRepo}</span> existe et est accessible.
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { repo, commits, issues, pullRequests } = data;
  const openIssues = issues.filter((i) => i.state === "open");
  const openPRs = pullRequests.filter((pr) => pr.state === "open");

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">GitHub</h1>
          <p className="text-[#64748b] mt-1">
            Activité du dépôt{" "}
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:underline font-mono text-sm"
            >
              {repo.name}
            </a>
          </p>
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white text-sm font-medium rounded-lg hover:bg-[#334155] transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Ouvrir sur GitHub
        </a>
      </div>

      {/* Repo stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1e293b]">{commits.length}</p>
          <p className="text-xs text-[#64748b] mt-1">Derniers commits</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#f59e0b]">{openIssues.length}</p>
          <p className="text-xs text-[#64748b] mt-1">Issues ouvertes</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#8b5cf6]">{openPRs.length}</p>
          <p className="text-xs text-[#64748b] mt-1">PRs ouvertes</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#3b82f6]">{repo.stars}</p>
          <p className="text-xs text-[#64748b] mt-1">Stars</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-lg font-bold text-[#22c55e]">{repo.language || "—"}</p>
          <p className="text-xs text-[#64748b] mt-1">Langage principal</p>
        </div>
      </div>

      {/* Repo info */}
      {repo.description && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
          <p className="text-sm text-[#475569]">{repo.description}</p>
          <p className="text-xs text-[#94a3b8] mt-2">
            Branche : <span className="font-mono">{repo.defaultBranch}</span> · Dernier push : {timeAgo(repo.lastPush)}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1 mb-6 w-fit">
        {[
          { key: "commits" as const, label: "Commits", count: commits.length },
          { key: "issues" as const, label: "Issues", count: issues.length },
          { key: "prs" as const, label: "Pull Requests", count: pullRequests.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-white text-[#1e293b] shadow-sm"
                : "text-[#64748b] hover:text-[#334155]"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? "bg-[#f1f5f9] text-[#475569]" : "bg-[#e2e8f0] text-[#94a3b8]"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
        {activeTab === "commits" && (
          <div className="divide-y divide-[#f1f5f9]">
            {commits.length === 0 ? (
              <div className="p-8 text-center text-[#94a3b8]">Aucun commit récent</div>
            ) : (
              commits.map((commit) => (
                <a
                  key={commit.sha}
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors"
                >
                  {commit.avatar ? (
                    <img src={commit.avatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#e2e8f0] flex items-center justify-center text-xs text-[#64748b]">
                      {commit.author[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1e293b] font-medium truncate">{commit.message}</p>
                    <p className="text-xs text-[#94a3b8]">
                      {commit.author} · {timeAgo(commit.date)}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#3b82f6] bg-[#eff6ff] px-2 py-1 rounded">
                    {commit.sha}
                  </span>
                </a>
              ))
            )}
          </div>
        )}

        {activeTab === "issues" && (
          <div className="divide-y divide-[#f1f5f9]">
            {issues.length === 0 ? (
              <div className="p-8 text-center text-[#94a3b8]">Aucune issue</div>
            ) : (
              issues.map((issue) => (
                <a
                  key={issue.number}
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors"
                >
                  <span className={`w-4 h-4 rounded-full ${
                    issue.state === "open" ? "bg-[#22c55e]" : "bg-[#8b5cf6]"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-[#1e293b] font-medium">{issue.title}</p>
                      {issue.labels.map((l) => (
                        <span
                          key={l.name}
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `#${l.color}20`,
                            color: `#${l.color}`,
                            border: `1px solid #${l.color}40`,
                          }}
                        >
                          {l.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[#94a3b8]">
                      #{issue.number} · {issue.author} · {timeAgo(issue.createdAt)}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        )}

        {activeTab === "prs" && (
          <div className="divide-y divide-[#f1f5f9]">
            {pullRequests.length === 0 ? (
              <div className="p-8 text-center text-[#94a3b8]">Aucune Pull Request</div>
            ) : (
              pullRequests.map((pr) => (
                <a
                  key={pr.number}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors"
                >
                  <span className={`w-4 h-4 rounded-full ${
                    pr.state === "open" ? "bg-[#22c55e]" : "bg-[#8b5cf6]"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-[#1e293b] font-medium">{pr.title}</p>
                      {pr.labels.map((l) => (
                        <span
                          key={l.name}
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `#${l.color}20`,
                            color: `#${l.color}`,
                            border: `1px solid #${l.color}40`,
                          }}
                        >
                          {l.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[#94a3b8]">
                      #{pr.number} · {pr.author} · {timeAgo(pr.createdAt)}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
