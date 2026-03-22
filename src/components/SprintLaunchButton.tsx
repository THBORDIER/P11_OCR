"use client";

import { useState, useEffect, useRef } from "react";

interface SprintLaunchButtonProps {
  projectId: string;
  sprintId: string;
  sprintName: string;
  todoCount: number;
}

type Provider = "claude" | "gemini" | "codex";

const PROVIDER_LABELS: Record<Provider, string> = {
  claude: "Claude CLI",
  gemini: "Gemini CLI",
  codex: "Codex CLI",
};

export default function SprintLaunchButton({
  projectId,
  sprintId,
  sprintName,
  todoCount,
}: SprintLaunchButtonProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider>("claude");
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<"running" | "done" | "error" | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  // Detect providers
  useEffect(() => {
    fetch("/api/cli/providers")
      .then((r) => r.json())
      .then((data) => {
        if (data.local && data.providers?.length > 0) {
          const p = data.providers.filter((x: string) => ["claude", "gemini", "codex"].includes(x)) as Provider[];
          setProviders(p);
          if (p.length > 0) setSelectedProvider(p[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Poll job status
  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/cli/jobs/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        setOutput(data.output || []);
        setJobStatus(data.status);
        setElapsed(data.elapsedMs || 0);
        if (data.status !== "running") {
          clearInterval(interval);
          if (data.error) setError(data.error);
        }
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [output]);

  if (providers.length === 0 || todoCount === 0) return null;

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };

  const launch = async () => {
    setShowConfirm(false);
    setError("");
    try {
      const res = await fetch("/api/cli/sprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, sprintId, provider: selectedProvider }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de lancement");
        return;
      }
      setJobId(data.jobId);
      setJobStatus("running");
      setOutput([]);
      setElapsed(0);
    } catch {
      setError("Erreur de connexion");
    }
  };

  const cancel = async () => {
    if (!jobId) return;
    await fetch(`/api/cli/jobs/${jobId}`, { method: "DELETE" });
    setJobStatus("error");
    setError("Annulé");
  };

  return (
    <>
      {/* Launch button */}
      {!jobId && (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Lancer le sprint
        </button>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
              <h3 className="text-lg font-bold">Lancer {sprintName}</h3>
              <p className="text-sm text-emerald-100 mt-1">
                {todoCount} tâche{todoCount > 1 ? "s" : ""} seront envoyées à l&apos;agent IA pour implémentation.
              </p>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-[#1e293b] block mb-2">
                Agent IA
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as Provider)}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {providers.map((p) => (
                  <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8] mt-2">
                L&apos;agent codera dans <code className="bg-[#f1f5f9] px-1 rounded">~/DevTracker/{projectId}/</code>
              </p>
              {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-[#64748b] hover:text-[#1e293b]"
              >
                Annuler
              </button>
              <button
                onClick={launch}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Lancer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live execution modal */}
      {jobId && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
              <div className="flex items-center gap-3">
                {jobStatus === "running" && (
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {jobStatus === "done" && (
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                )}
                {jobStatus === "error" && (
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                )}
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {sprintName} — {PROVIDER_LABELS[selectedProvider]}
                  </h3>
                  <p className="text-[#64748b] text-xs">
                    {jobStatus === "running" && `En cours... ${formatElapsed(elapsed)}`}
                    {jobStatus === "done" && `Terminé en ${formatElapsed(elapsed)}`}
                    {jobStatus === "error" && `Erreur après ${formatElapsed(elapsed)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {jobStatus === "running" && (
                  <button
                    onClick={cancel}
                    className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Annuler
                  </button>
                )}
                {jobStatus !== "running" && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                  >
                    Fermer & actualiser
                  </button>
                )}
              </div>
            </div>

            {/* Log output */}
            <div
              ref={logRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-xs text-[#94a3b8] leading-relaxed"
              style={{ maxHeight: "60vh" }}
            >
              {output.length === 0 && jobStatus === "running" && (
                <p className="text-[#475569] italic">En attente de la première sortie...</p>
              )}
              {output.map((line, i) => (
                <div
                  key={i}
                  className={`py-0.5 ${
                    line.startsWith("[stderr]")
                      ? "text-red-400"
                      : line.includes("commit") || line.includes("Termine")
                      ? "text-emerald-400"
                      : ""
                  }`}
                >
                  {line}
                </div>
              ))}
              {error && (
                <div className="mt-2 p-3 bg-red-500/10 rounded-lg text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Footer status */}
            <div className="px-6 py-3 border-t border-[#334155] flex items-center justify-between text-xs text-[#64748b]">
              <span>{output.length} lignes</span>
              <span>~/DevTracker/{projectId}/</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
