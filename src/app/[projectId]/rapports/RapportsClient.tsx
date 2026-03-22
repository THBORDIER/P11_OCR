"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ReportStats {
  userStories: { total: number; validated: number };
  tasks: { total: number; done: number; inProgress: number };
  tests: { total: number; ok: number; ko: number };
  sprints: number;
  phases: number;
}

interface ActivityItem {
  type: string;
  title: string;
  createdAt: string;
}

interface ReportData {
  project: { name: string; clientEmail: string | null; notificationEmails: string[] };
  stats: ReportStats;
  recentActivity: ActivityItem[];
}

function pct(a: number, b: number) {
  return b > 0 ? Math.round((a / b) * 100) : 0;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const p = pct(value, max);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-medium text-[#1e293b] w-12 text-right">{p}%</span>
    </div>
  );
}

export default function RapportsClient({
  projectId,
  isOwner,
  projectName,
  hasRecipients,
}: {
  projectId: string;
  isOwner: boolean;
  projectName: string;
  hasRecipients: boolean;
}) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${projectId}/reports`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const sendReport = async () => {
    setSending(true);
    setError("");
    setSent(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Erreur");
      } else {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      }
    } catch {
      setError("Impossible d'envoyer le rapport");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-6">Rapports</h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b] mb-6">Rapports</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Impossible de charger les données du rapport.</p>
        </div>
      </div>
    );
  }

  const { stats, recentActivity } = data;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Rapports</h1>
          <p className="text-[#64748b] mt-1">
            Vue d&apos;ensemble et envoi de rapports d&apos;avancement
          </p>
        </div>
        {isOwner && (
          <button
            onClick={sendReport}
            disabled={sending || !hasRecipients}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Envoi...
              </>
            ) : (
              <>📧 Envoyer le rapport</>
            )}
          </button>
        )}
      </div>

      {sent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-700">
          ✅ Rapport envoyé avec succès !
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
          {error}
          {!hasRecipients && (
            <p className="mt-1">
              <Link href={`/${projectId}/settings`} className="underline font-medium">
                Configurez un email client dans les paramètres
              </Link>
            </p>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#64748b] uppercase">User Stories</h3>
            <span className="text-2xl font-bold text-[#3b82f6]">
              {stats.userStories.validated}/{stats.userStories.total}
            </span>
          </div>
          <ProgressBar value={stats.userStories.validated} max={stats.userStories.total} color="#3b82f6" />
          <p className="text-xs text-[#94a3b8] mt-2">
            {stats.userStories.validated} validées par le PO
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#64748b] uppercase">Tâches</h3>
            <span className="text-2xl font-bold text-[#22c55e]">
              {stats.tasks.done}/{stats.tasks.total}
            </span>
          </div>
          <ProgressBar value={stats.tasks.done} max={stats.tasks.total} color="#22c55e" />
          <p className="text-xs text-[#94a3b8] mt-2">
            {stats.tasks.inProgress} en cours · {stats.tasks.total - stats.tasks.done - stats.tasks.inProgress} à faire
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#64748b] uppercase">Tests</h3>
            <span className={`text-2xl font-bold ${stats.tests.ko > 0 ? "text-[#ef4444]" : "text-[#22c55e]"}`}>
              {stats.tests.ok}/{stats.tests.total}
            </span>
          </div>
          <ProgressBar
            value={stats.tests.ok}
            max={stats.tests.total}
            color={stats.tests.ko > 0 ? "#ef4444" : "#22c55e"}
          />
          <p className="text-xs text-[#94a3b8] mt-2">
            {stats.tests.ok} OK · {stats.tests.ko} KO · {stats.tests.total - stats.tests.ok - stats.tests.ko} à tester
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1e293b]">{stats.phases}</p>
          <p className="text-xs text-[#64748b]">Phases</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1e293b]">{stats.sprints}</p>
          <p className="text-xs text-[#64748b]">Sprints</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1e293b]">{stats.userStories.total}</p>
          <p className="text-xs text-[#64748b]">User Stories</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1e293b]">{stats.tasks.total}</p>
          <p className="text-xs text-[#64748b]">Tâches</p>
        </div>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
          <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Activité récente</h3>
          <div className="space-y-3">
            {recentActivity.map((log, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-base mt-0.5 shrink-0">
                  {log.type === "commit" ? "🔨" : log.type === "pr_merged" ? "🟣" : log.type === "email_sent" ? "📧" : "📌"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1e293b] truncate">{log.title}</p>
                  <p className="text-xs text-[#94a3b8]">
                    {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
