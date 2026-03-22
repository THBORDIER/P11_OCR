"use client";

import { useState, useEffect, useRef } from "react";

interface Task {
  id: string;
  titre: string;
  status: string;
  type: string;
  estimation: string;
  userStory: string;
}

interface SprintLaunchButtonProps {
  projectId: string;
  sprintId: string;
  sprintName: string;
  todoCount: number;
  tasks?: Task[];
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
  tasks = [],
}: SprintLaunchButtonProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider>("claude");
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<"running" | "done" | "error" | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [mode, setMode] = useState<"sprint" | "task">("task");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const todoTasks = tasks.filter((t) => t.status === "A faire");

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
          if (data.status === "done") {
            // Mark current task as completed
            if (mode === "task" && todoTasks[currentTaskIdx]) {
              const task = todoTasks[currentTaskIdx];
              setCompletedTasks((prev) => [...prev, task.id]);
              // Update task status in DB
              fetch(`/api/projects/${projectId}/tasks/${encodeURIComponent(task.id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Termine" }),
              }).catch(() => {});
            }
          }
        }
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId, mode, currentTaskIdx, todoTasks, projectId]);

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

  const launchTask = async (taskIndex: number) => {
    const task = todoTasks[taskIndex];
    if (!task) return;

    setError("");
    setCurrentTaskIdx(taskIndex);
    setOutput([]);
    setElapsed(0);
    setMinimized(false);

    try {
      const res = await fetch("/api/cli/sprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          sprintId,
          provider: selectedProvider,
          mode: "task",
          taskId: task.id,
          taskTitle: task.titre,
          taskType: task.type,
          taskEstimation: task.estimation,
          taskUserStory: task.userStory,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de lancement");
        return;
      }
      setJobId(data.jobId);
      setJobStatus("running");
    } catch {
      setError("Erreur de connexion");
    }
  };

  const launchWholeSprint = async () => {
    setShowConfirm(false);
    setError("");
    setMode("sprint");
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

  const launchNextTask = () => {
    const nextIdx = currentTaskIdx + 1;
    if (nextIdx < todoTasks.length) {
      setJobId(null);
      setJobStatus(null);
      launchTask(nextIdx);
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
          Lancer
        </button>
      )}

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
              <h3 className="text-lg font-bold">Lancer {sprintName}</h3>
              <p className="text-sm text-emerald-100 mt-1">
                {todoCount} tâche{todoCount > 1 ? "s" : ""} à implémenter
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

              <label className="text-sm font-medium text-[#1e293b] block mb-2 mt-4">
                Mode d&apos;exécution
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("task")}
                  className={`flex-1 p-3 rounded-lg border text-sm text-left ${
                    mode === "task"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="font-medium">Tâche par tâche</div>
                  <div className="text-xs mt-0.5 opacity-70">Un agent par tâche, suivi micro</div>
                </button>
                <button
                  onClick={() => setMode("sprint")}
                  className={`flex-1 p-3 rounded-lg border text-sm text-left ${
                    mode === "sprint"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="font-medium">Sprint complet</div>
                  <div className="text-xs mt-0.5 opacity-70">Toutes les tâches d&apos;un coup</div>
                </button>
              </div>

              {/* Task list for task-by-task mode */}
              {mode === "task" && todoTasks.length > 0 && (
                <div className="mt-4 max-h-48 overflow-y-auto space-y-1">
                  <p className="text-xs text-[#94a3b8] mb-2">Tâches à exécuter dans l&apos;ordre :</p>
                  {todoTasks.map((t, i) => (
                    <div
                      key={t.id}
                      className={`flex items-center gap-2 p-2 rounded text-xs ${
                        completedTasks.includes(t.id)
                          ? "bg-emerald-50 text-emerald-600 line-through"
                          : "bg-[#f8fafc] text-[#475569]"
                      }`}
                    >
                      <span className="w-5 text-center font-mono text-[#94a3b8]">{i + 1}</span>
                      <span className="flex-1 truncate">{t.titre}</span>
                      <span className="text-[#94a3b8] shrink-0">{t.estimation}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-[#94a3b8] mt-3">
                Répertoire : <code className="bg-[#f1f5f9] px-1 rounded">~/DevTracker/{projectId}/</code>
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
                onClick={() => mode === "task" ? launchTask(0) : launchWholeSprint()}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                {mode === "task" ? "Lancer la 1ère tâche" : "Lancer tout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live execution — minimizable panel */}
      {jobId && !minimized && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
              <div className="flex items-center gap-3">
                {jobStatus === "running" && <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />}
                {jobStatus === "done" && <div className="w-3 h-3 rounded-full bg-emerald-400" />}
                {jobStatus === "error" && <div className="w-3 h-3 rounded-full bg-red-400" />}
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {mode === "task" && todoTasks[currentTaskIdx]
                      ? `Tâche ${currentTaskIdx + 1}/${todoTasks.length} — ${todoTasks[currentTaskIdx].titre}`
                      : `${sprintName} — ${PROVIDER_LABELS[selectedProvider]}`}
                  </h3>
                  <p className="text-[#64748b] text-xs">
                    {jobStatus === "running" && `En cours... ${formatElapsed(elapsed)}`}
                    {jobStatus === "done" && `Terminé en ${formatElapsed(elapsed)}`}
                    {jobStatus === "error" && `Erreur après ${formatElapsed(elapsed)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Minimize button */}
                <button
                  onClick={() => setMinimized(true)}
                  className="px-3 py-1.5 text-xs bg-[#334155] text-[#94a3b8] rounded-lg hover:bg-[#475569] hover:text-white transition-colors"
                  title="Réduire"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {jobStatus === "running" && (
                  <button
                    onClick={cancel}
                    className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Annuler
                  </button>
                )}
                {jobStatus === "done" && mode === "task" && currentTaskIdx < todoTasks.length - 1 && (
                  <button
                    onClick={launchNextTask}
                    className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium"
                  >
                    Tâche suivante →
                  </button>
                )}
                {(jobStatus === "done" || jobStatus === "error") && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1.5 text-xs bg-[#334155] text-[#94a3b8] rounded-lg hover:bg-[#475569] hover:text-white transition-colors"
                  >
                    Fermer
                  </button>
                )}
              </div>
            </div>

            {/* Task progress bar (task mode) */}
            {mode === "task" && (
              <div className="px-6 py-2 border-b border-[#334155] flex items-center gap-2">
                {todoTasks.map((t, i) => (
                  <div
                    key={t.id}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      completedTasks.includes(t.id)
                        ? "bg-emerald-400"
                        : i === currentTaskIdx && jobStatus === "running"
                        ? "bg-amber-400 animate-pulse"
                        : "bg-[#334155]"
                    }`}
                    title={t.titre}
                  />
                ))}
              </div>
            )}

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
                      : line.includes("commit") || line.includes("Termine") || line.includes("✓")
                      ? "text-emerald-400"
                      : line.includes("create") || line.includes("write")
                      ? "text-blue-400"
                      : ""
                  }`}
                >
                  {line}
                </div>
              ))}
              {error && (
                <div className="mt-2 p-3 bg-red-500/10 rounded-lg text-red-400 whitespace-pre-wrap">
                  {error.length > 500 ? error.slice(0, 500) + "..." : error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#334155] flex items-center justify-between text-xs text-[#64748b]">
              <span>{output.length} lignes</span>
              <span>~/DevTracker/{projectId}/</span>
            </div>
          </div>
        </div>
      )}

      {/* Minimized floating notification */}
      {jobId && minimized && (
        <div className="fixed bottom-4 right-4 z-[100] bg-[#1e293b] rounded-xl shadow-2xl border border-[#334155] p-4 min-w-[300px] max-w-[400px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {jobStatus === "running" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />}
              {jobStatus === "done" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
              {jobStatus === "error" && <div className="w-2.5 h-2.5 rounded-full bg-red-400" />}
              <span className="text-white text-sm font-medium truncate">
                {mode === "task" && todoTasks[currentTaskIdx]
                  ? `${currentTaskIdx + 1}/${todoTasks.length} ${todoTasks[currentTaskIdx].titre.slice(0, 30)}...`
                  : sprintName}
              </span>
            </div>
            <button
              onClick={() => setMinimized(false)}
              className="p-1 text-[#64748b] hover:text-white transition-colors ml-2"
              title="Agrandir"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#334155] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{
                  width: mode === "task"
                    ? `${((completedTasks.length + (jobStatus === "running" ? 0.5 : 0)) / todoTasks.length) * 100}%`
                    : jobStatus === "done" ? "100%" : "50%",
                }}
              />
            </div>
            <span className="text-[10px] text-[#64748b]">{formatElapsed(elapsed)}</span>
          </div>
          {/* Last output line */}
          {output.length > 0 && (
            <p className="text-[10px] text-[#475569] mt-1.5 truncate font-mono">
              {output[output.length - 1]}
            </p>
          )}
          {/* Quick actions */}
          <div className="flex gap-2 mt-2">
            {jobStatus === "done" && mode === "task" && currentTaskIdx < todoTasks.length - 1 && (
              <button
                onClick={launchNextTask}
                className="flex-1 px-2 py-1 text-[10px] bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 font-medium"
              >
                Tâche suivante →
              </button>
            )}
            {jobStatus === "running" && (
              <button
                onClick={cancel}
                className="px-2 py-1 text-[10px] bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
