"use client";

import { useState, useEffect, useRef } from "react";

interface DevServerButtonProps {
  projectId: string;
}

export default function DevServerButton({ projectId }: DevServerButtonProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [port, setPort] = useState<number>(3001);
  const [output, setOutput] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  // Poll job
  useEffect(() => {
    if (!jobId || status !== "running") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/cli/jobs/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        setOutput(data.output || []);
        if (data.meta?.port) setPort(data.meta.port);
        if (data.status !== "running") {
          setStatus(data.status);
          clearInterval(interval);
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [jobId, status]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [output]);

  const start = async () => {
    setError("");
    try {
      const res = await fetch("/api/cli/devserver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 409) {
        setError(data.error || "Erreur");
        return;
      }
      setJobId(data.jobId);
      setPort(data.port || 3001);
      setStatus("running");
      setShowLogs(true);
    } catch {
      setError("Erreur de connexion");
    }
  };

  const stop = async () => {
    try {
      await fetch("/api/cli/devserver", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      setStatus("idle");
      setJobId(null);
      setOutput([]);
    } catch { /* ignore */ }
  };

  return (
    <div className="inline-flex items-center gap-2">
      {status === "idle" ? (
        <button
          onClick={start}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#f1f5f9] text-[#475569] rounded-lg hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
          Lancer l&apos;app
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <a
              href={`http://localhost:${port}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-mono text-xs"
            >
              localhost:{port}
            </a>
          </div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="px-2 py-1.5 text-xs text-[#64748b] hover:text-[#1e293b] bg-[#f1f5f9] rounded-lg"
          >
            Logs
          </button>
          <button
            onClick={stop}
            className="px-2 py-1.5 text-xs text-red-500 hover:text-red-700 bg-red-50 rounded-lg border border-red-200"
          >
            Arrêter
          </button>
        </div>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}

      {/* Logs panel */}
      {showLogs && output.length > 0 && (
        <div className="fixed bottom-0 right-0 w-[500px] h-[300px] bg-[#1e293b] rounded-tl-xl shadow-2xl z-50 flex flex-col overflow-hidden border-t border-l border-[#334155]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#334155]">
            <span className="text-xs text-[#94a3b8] font-mono">Logs — localhost:{port}</span>
            <button onClick={() => setShowLogs(false)} className="text-[#64748b] hover:text-white text-xs">✕</button>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-3 font-mono text-[11px] text-[#94a3b8] leading-relaxed">
            {output.map((line, i) => (
              <div key={i} className={line.startsWith("[stderr]") ? "text-red-400" : ""}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
