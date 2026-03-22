"use client";

import { useState, useEffect, useRef } from "react";

interface TestLaunchButtonProps {
  projectId: string;
  testCount: number;
}

type Provider = "claude" | "gemini" | "codex";

const PROVIDER_LABELS: Record<string, string> = {
  claude: "Claude CLI",
  gemini: "Gemini CLI",
  codex: "Codex CLI",
  npm: "npm test",
};

export default function TestLaunchButton({ projectId, testCount }: TestLaunchButtonProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<"running" | "done" | "error" | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/cli/providers")
      .then((r) => r.json())
      .then((data) => {
        if (data.local && data.providers?.length > 0) {
          const p = data.providers.filter((x: string) => ["claude", "gemini", "codex"].includes(x)) as Provider[];
          setProviders(p);
        }
      })
      .catch(() => {});
  }, []);

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
        if (data.status !== "running") clearInterval(interval);
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [output]);

  if (testCount === 0) return null;

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
  };

  const launch = async () => {
    setError("");
    try {
      const res = await fetch("/api/cli/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, provider: selectedProvider || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setJobId(data.jobId);
      setJobStatus("running");
      setOutput([]);
    } catch {
      setError("Erreur de connexion");
    }
  };

  return (
    <>
      {!jobId && (
        <div className="flex items-center gap-1.5">
          {providers.length > 0 && (
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="text-xs bg-[#fef3c7] text-[#92400e] border border-[#fde68a] rounded-lg px-2 py-1.5"
            >
              <option value="">npm test (auto)</option>
              {providers.map((p) => (
                <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>
              ))}
            </select>
          )}
          <button
            onClick={launch}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lancer les tests ({testCount})
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {jobId && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
              <div className="flex items-center gap-3">
                {jobStatus === "running" && <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />}
                {jobStatus === "done" && <div className="w-3 h-3 rounded-full bg-emerald-400" />}
                {jobStatus === "error" && <div className="w-3 h-3 rounded-full bg-red-400" />}
                <div>
                  <h3 className="text-white font-semibold text-sm">Exécution des tests</h3>
                  <p className="text-[#64748b] text-xs">
                    {jobStatus === "running" && `En cours... ${formatElapsed(elapsed)}`}
                    {jobStatus === "done" && `Terminé en ${formatElapsed(elapsed)}`}
                    {jobStatus === "error" && `Erreur après ${formatElapsed(elapsed)}`}
                  </p>
                </div>
              </div>
              {jobStatus !== "running" && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
                >
                  Fermer & actualiser
                </button>
              )}
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs text-[#94a3b8] leading-relaxed" style={{ maxHeight: "60vh" }}>
              {output.length === 0 && <p className="text-[#475569] italic">En attente...</p>}
              {output.map((line, i) => (
                <div key={i} className={line.startsWith("[stderr]") ? "text-red-400" : line.includes("OK") || line.includes("pass") ? "text-emerald-400" : ""}>{line}</div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-[#334155] text-xs text-[#64748b]">
              {output.length} lignes — ~/DevTracker/{projectId}/
            </div>
          </div>
        </div>
      )}
    </>
  );
}
