"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";
import AiGenerateButton from "@/components/AiGenerateButton";
import SendPageButton from "@/components/SendPageButton";
import SprintLaunchButton from "@/components/SprintLaunchButton";
import DevServerButton from "@/components/DevServerButton";

interface Task {
  id: string;
  userStory: string;
  titre: string;
  description: string;
  type: string;
  estimation: string;
  status: string;
  assignee: string;
  sprintId?: string;
}

interface Sprint {
  id: string;
  nom: string;
  objectif: string;
  objectifCourt: string;
  debut: string;
  fin: string;
  duree: string;
  velocite: string;
  userStories: string[];
  tasks: Task[];
}

interface SprintClientProps {
  sprints: Sprint[];
  projectId: string;
  usDescriptions: Record<string, string>;
  isOwner?: boolean;
}

const statusColors: Record<string, string> = {
  "A faire": "bg-[#f1f5f9] text-[#64748b]",
  "En cours": "bg-[#eff6ff] text-[#3b82f6]",
  "En review": "bg-[#fff7ed] text-[#ea580c]",
  Termine: "bg-[#f0fdf4] text-[#22c55e]",
};

const statusDisplayLabels: Record<string, string> = {
  "A faire": "\u00C0 faire",
  "En cours": "En cours",
  "En review": "En review",
  Termine: "Termin\u00E9",
};

const typeColors: Record<string, string> = {
  Dev: "bg-[#eff6ff] text-[#3b82f6]",
  Config: "bg-[#f5f3ff] text-[#8b5cf6]",
  Test: "bg-[#fff7ed] text-[#ea580c]",
  Design: "bg-[#fdf2f8] text-[#ec4899]",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Strip project prefix from ID: "p11-spartcrm:sprint-1" -> "sprint-1" */
function displayId(id: string): string {
  const idx = id.indexOf(":");
  return idx >= 0 ? id.slice(idx + 1) : id;
}

const statusFlow = ["A faire", "En cours", "En review", "Termine"];

export default function SprintClient({ sprints, projectId, usDescriptions, isOwner }: SprintClientProps) {
  const router = useRouter();

  if (sprints.length === 0) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b]">Sprint Backlog</h1>
            <p className="text-[#64748b] mt-2">Détail des sprints et découpage en tâches</p>
          </div>
          {isOwner && (
            <AiGenerateButton
              type="sprints"
              projectId={projectId}
              label="Générer des sprints"
              hasExistingData={sprints.length > 0}
              onClearExisting={async () => {
                for (const s of sprints) {
                  await fetch(`/api/projects/${projectId}/sprints/${encodeURIComponent(s.id)}`, { method: "DELETE" });
                }
                window.location.reload();
              }}
              onGenerated={async (items) => {
                for (const item of items) {
                  const s = item as { name?: string; goal?: string; startDate?: string; endDate?: string; tasks?: { title: string; status?: string; userStory?: string; estimation?: string; type?: string }[] };
                  const sprintId = `${projectId}:${(s.name || "Sprint").toLowerCase().replace(/\s+/g, "-")}`;
                  await fetch(`/api/projects/${projectId}/sprints`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: sprintId,
                      nom: s.name || "",
                      objectif: s.goal || "",
                      objectifCourt: s.goal?.slice(0, 50) || "",
                      debut: s.startDate || "",
                      fin: s.endDate || "",
                      duree: "2 semaines",
                      velocite: "",
                      userStories: [],
                    }),
                  });
                  for (const t of s.tasks || []) {
                    const taskId = `${projectId}:T-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                    await fetch(`/api/projects/${projectId}/tasks`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: taskId, sprintId,
                        userStory: t.userStory || "", titre: t.title,
                        description: "", type: t.type || "Dev", estimation: t.estimation || "2h",
                        status: t.status || "A faire", assignee: "",
                      }),
                    });
                  }
                }
                window.location.reload();
              }}
            />
          )}
          <SendPageButton projectId={projectId} pageType="sprints" />
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-lg mb-2">Aucun sprint défini</p>
          <p className="text-sm text-[#94a3b8]">Générez des sprints avec l'IA ou créez-en manuellement.</p>
        </div>
      </div>
    );
  }

  return <SprintClientInner sprints={sprints} projectId={projectId} usDescriptions={usDescriptions} isOwner={isOwner} />;
}

function SprintClientInner({ sprints, projectId, usDescriptions, isOwner }: SprintClientProps) {
  const router = useRouter();
  const [selectedSprint, setSelectedSprint] = useState(sprints[0].id);
  const [statusFilter, setStatusFilter] = useState("all");

  // CRUD state
  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskSprintId, setTaskSprintId] = useState<string>("");

  // Build a tasks-by-sprint map from the props
  const buildTaskMap = () => {
    const map: Record<string, Task[]> = {};
    sprints.forEach((s) => {
      map[s.id] = s.tasks || [];
    });
    return map;
  };

  const [liveTasks, setLiveTasks] = useState<Record<string, Task[]>>(buildTaskMap);

  const sprint = sprints.find((s) => s.id === selectedSprint)!;
  const currentTasks = liveTasks[selectedSprint] || [];

  // Load saved statuses from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${projectId}-sprint-statuses-v2`);
      if (saved) {
        const savedStatuses: Record<string, Record<string, string>> = JSON.parse(saved);
        const originalMap = buildTaskMap();
        const restored: Record<string, Task[]> = {};
        for (const [sprintId, tasks] of Object.entries(originalMap)) {
          const sprintStatuses = savedStatuses[sprintId] || {};
          restored[sprintId] = tasks.map((t) => ({
            ...t,
            status: sprintStatuses[t.id] || t.status,
          }));
        }
        setLiveTasks(restored);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const saveStatuses = useCallback((updated: Record<string, Task[]>) => {
    try {
      const statuses: Record<string, Record<string, string>> = {};
      for (const [sprintId, tasks] of Object.entries(updated)) {
        statuses[sprintId] = {};
        tasks.forEach((t) => { statuses[sprintId][t.id] = t.status; });
      }
      localStorage.setItem(`${projectId}-sprint-statuses-v2`, JSON.stringify(statuses));
    } catch {}
  }, [projectId]);

  const cycleStatus = (taskId: string) => {
    setLiveTasks((prev) => {
      const updated = {
        ...prev,
        [selectedSprint]: prev[selectedSprint].map((t) => {
          if (t.id !== taskId) return t;
          const currentIndex = statusFlow.indexOf(t.status);
          const nextIndex = (currentIndex + 1) % statusFlow.length;
          return { ...t, status: statusFlow[nextIndex] };
        }),
      };
      saveStatuses(updated);
      return updated;
    });
  };

  const resetAllStatuses = () => {
    const originalMap = buildTaskMap();
    setLiveTasks((prev) => {
      const updated = {
        ...prev,
        [selectedSprint]: (originalMap[selectedSprint] || []).map((t) => ({ ...t, status: "A faire" })),
      };
      saveStatuses(updated);
      return updated;
    });
  };

  const filtered = statusFilter === "all"
    ? currentTasks
    : currentTasks.filter((t) => t.status === statusFilter);

  // Group tasks by their userStory field (dynamic, not from sprint.userStories)
  const usSet = new Set(filtered.map((t) => t.userStory || "Transversal"));
  const grouped = Array.from(usSet).map((us) => ({
    us,
    tasks: filtered.filter((t) => (t.userStory || "Transversal") === us),
  })).filter((g) => g.tasks.length > 0);

  const totalHeures = currentTasks.reduce((sum, t) => sum + parseFloat(t.estimation) || 0, 0);

  const statusCounts = {
    "A faire": currentTasks.filter((t) => t.status === "A faire").reduce((s, t) => s + parseInt(t.estimation), 0),
    "En cours": currentTasks.filter((t) => t.status === "En cours").reduce((s, t) => s + parseInt(t.estimation), 0),
    "En review": currentTasks.filter((t) => t.status === "En review").reduce((s, t) => s + parseInt(t.estimation), 0),
    Termine: currentTasks.filter((t) => t.status === "Termine").reduce((s, t) => s + parseInt(t.estimation), 0),
  };

  const pct = (hours: number) => totalHeures > 0 ? Math.round((hours / totalHeures) * 100) : 0;
  const completedPct = pct(statusCounts["Termine"]);

  // ─── CRUD helpers ───────────────────────────────────────

  const sprintFields: FieldConfig[] = [
    ...(editingSprint
      ? []
      : [{ name: "shortId", label: "Identifiant (ex: sprint-6)", type: "text" as const, required: true }]),
    { name: "nom", label: "Nom", type: "text" as const, required: true },
    { name: "objectif", label: "Objectif", type: "textarea" as const },
    { name: "objectifCourt", label: "Objectif court", type: "text" as const },
    { name: "debut", label: "Debut", type: "text" as const },
    { name: "fin", label: "Fin", type: "text" as const },
    { name: "duree", label: "Duree", type: "text" as const },
    { name: "velocite", label: "Velocite", type: "text" as const },
  ];

  const taskFields: FieldConfig[] = [
    ...(editingTask
      ? []
      : [{ name: "shortId", label: "Identifiant (ex: T-050)", type: "text" as const, required: true }]),
    { name: "userStory", label: "User Story", type: "text" as const },
    { name: "titre", label: "Titre", type: "text" as const, required: true },
    { name: "description", label: "Description", type: "textarea" as const },
    {
      name: "type",
      label: "Type",
      type: "select" as const,
      options: ["Dev", "Config", "Test", "Design"],
    },
    { name: "estimation", label: "Estimation (ex: 3h)", type: "text" as const },
    { name: "assignee", label: "Assignee", type: "text" as const },
  ];

  const openCreateSprint = () => {
    setEditingSprint(null);
    setSprintModalOpen(true);
  };

  const openEditSprint = (s: Sprint) => {
    setEditingSprint(s);
    setSprintModalOpen(true);
  };

  const handleSprintSubmit = async (data: Record<string, unknown>) => {
    if (editingSprint) {
      const res = await fetch(
        `/api/projects/${projectId}/sprints/${encodeURIComponent(editingSprint.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: data.nom,
            objectif: data.objectif,
            objectifCourt: data.objectifCourt,
            debut: data.debut,
            fin: data.fin,
            duree: data.duree,
            velocite: data.velocite,
          }),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la modification");
    } else {
      const shortId = (data.shortId as string).trim();
      const fullId = `${projectId}:${shortId}`;
      const res = await fetch(`/api/projects/${projectId}/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fullId,
          nom: data.nom || "",
          objectif: data.objectif || "",
          objectifCourt: data.objectifCourt || "",
          debut: data.debut || "",
          fin: data.fin || "",
          duree: data.duree || "",
          velocite: data.velocite || "",
          userStories: [],
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la creation");
    }
    router.refresh();
  };

  const handleSprintDelete = async () => {
    if (!editingSprint) return;
    const res = await fetch(
      `/api/projects/${projectId}/sprints/${encodeURIComponent(editingSprint.id)}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  };

  const openCreateTask = (sprintId: string) => {
    setEditingTask(null);
    setTaskSprintId(sprintId);
    setTaskModalOpen(true);
  };

  const openEditTask = (task: Task, sprintId: string) => {
    setEditingTask(task);
    setTaskSprintId(sprintId);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data: Record<string, unknown>) => {
    if (editingTask) {
      const res = await fetch(
        `/api/projects/${projectId}/tasks/${encodeURIComponent(editingTask.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userStory: data.userStory,
            titre: data.titre,
            description: data.description,
            type: data.type,
            estimation: data.estimation,
            assignee: data.assignee,
          }),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la modification");
    } else {
      const shortId = (data.shortId as string).trim();
      const fullId = `${projectId}:${shortId}`;
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fullId,
          sprintId: taskSprintId,
          userStory: data.userStory || "Transversal",
          titre: data.titre || "",
          description: data.description || "",
          type: data.type || "Dev",
          estimation: data.estimation || "1h",
          status: "A faire",
          assignee: data.assignee || "",
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la creation");
    }
    router.refresh();
  };

  const handleTaskDelete = async () => {
    if (!editingTask) return;
    const res = await fetch(
      `/api/projects/${projectId}/tasks/${encodeURIComponent(editingTask.id)}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  };

  const getSprintInitialData = () => {
    if (!editingSprint) return undefined;
    return {
      nom: editingSprint.nom,
      objectif: editingSprint.objectif,
      objectifCourt: editingSprint.objectifCourt,
      debut: editingSprint.debut,
      fin: editingSprint.fin,
      duree: editingSprint.duree,
      velocite: editingSprint.velocite,
    };
  };

  const getTaskInitialData = () => {
    if (!editingTask) return undefined;
    return {
      userStory: editingTask.userStory,
      titre: editingTask.titre,
      description: editingTask.description,
      type: editingTask.type,
      estimation: editingTask.estimation,
      assignee: editingTask.assignee,
    };
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Sprint Backlog</h1>
          <p className="text-[#64748b] mt-2">
            Détail des sprints et découpage en tâches
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <AiGenerateButton
              type="sprints"
              projectId={projectId}
              label="Générer des sprints"
              hasExistingData={sprints.length > 0}
              onClearExisting={async () => {
                for (const s of sprints) {
                  await fetch(`/api/projects/${projectId}/sprints/${encodeURIComponent(s.id)}`, { method: "DELETE" });
                }
                window.location.reload();
              }}
              onGenerated={async (items) => {
                // Delete existing sprints first (cascade deletes tasks)
                for (const existing of sprints) {
                  await fetch(`/api/projects/${projectId}/sprints/${encodeURIComponent(existing.id)}`, { method: "DELETE" });
                }

                for (const item of items) {
                  const s = item as { name?: string; goal?: string; startDate?: string; endDate?: string; tasks?: { title: string; status?: string; userStory?: string; estimation?: string; type?: string }[] };
                  const sprintId = `${projectId}:${(s.name || "Sprint").toLowerCase().replace(/\s+/g, "-")}`;
                  const res = await fetch(`/api/projects/${projectId}/sprints`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: sprintId,
                      nom: s.name || "",
                      objectif: s.goal || "",
                      objectifCourt: s.goal?.slice(0, 50) || "",
                      debut: s.startDate || "",
                      fin: s.endDate || "",
                      duree: "2 semaines",
                      velocite: "",
                      userStories: [],
                    }),
                  });
                  if (!res.ok) {
                    console.error("Sprint creation failed:", await res.text());
                    continue;
                  }
                  // Create tasks
                  for (const t of s.tasks || []) {
                    const taskId = `${projectId}:T-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                    const taskRes = await fetch(`/api/projects/${projectId}/tasks`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: taskId,
                        sprintId,
                        userStory: t.userStory || "",
                        titre: t.title,
                        description: "",
                        type: t.type || "Dev",
                        estimation: t.estimation || "2h",
                        status: t.status || "A faire",
                        assignee: "",
                      }),
                    });
                    if (!taskRes.ok) console.error("Task creation failed:", await taskRes.text());
                  }
                }
                window.location.reload();
              }}
            />
            <button
              onClick={openCreateSprint}
              className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Sprint
            </button>
            <SprintLaunchButton
              projectId={projectId}
              sprintId={selectedSprint}
              sprintName={displayId(selectedSprint).replace("sprint-", "Sprint ")}
              todoCount={currentTasks.filter((t) => t.status === "A faire").length}
            />
            <DevServerButton projectId={projectId} />
          </div>
        )}
        <SendPageButton projectId={projectId} pageType="sprints" />
      </div>

      {/* Sprint selector tabs */}
      <div className="flex gap-1 mb-6 bg-[#f1f5f9] rounded-lg p-1 overflow-x-auto">
        {sprints.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSelectedSprint(s.id); setStatusFilter("all"); }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSprint === s.id
                ? "bg-white text-[#1e293b] shadow-sm"
                : "text-[#64748b] hover:text-[#334155] hover:bg-white/50"
            }`}
          >
            {displayId(s.id).replace("sprint-", "Sprint ")}
          </button>
        ))}
      </div>

      {/* Sprint Goal Banner */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-lg p-6 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">&#127919;</span>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-1">
              Objectif du {displayId(sprint.id).replace("sprint-", "Sprint ")}
            </h2>
            <p className="text-white text-lg font-semibold leading-relaxed">
              &laquo; {sprint.objectifCourt} &raquo;
            </p>
          </div>
          {isOwner && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditSprint(sprint)}
                className="p-1.5 rounded hover:bg-white/20 text-blue-200 hover:text-white transition-colors"
                title="Modifier le sprint"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm("Supprimer ce sprint et toutes ses taches ?")) {
                    fetch(`/api/projects/${projectId}/sprints/${encodeURIComponent(sprint.id)}`, { method: "DELETE" })
                      .then(() => router.refresh());
                  }
                }}
                className="p-1.5 rounded hover:bg-white/20 text-blue-200 hover:text-red-300 transition-colors"
                title="Supprimer le sprint"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sprint info */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#1e293b] mb-2">
          {sprint.nom}
        </h2>
        <p className="text-sm text-[#475569] mb-4">{sprint.objectif}</p>
        <div className="grid grid-cols-3 gap-4">
          {(sprint.debut || sprint.fin) && (
            <div className="bg-[#f1f5f9] rounded p-3 text-center">
              <div className="text-sm font-bold text-[#1e293b]">{sprint.debut}{sprint.fin ? ` — ${sprint.fin}` : ""}</div>
              <div className="text-xs text-[#64748b]">Période</div>
            </div>
          )}
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#3b82f6]">{currentTasks.length}</div>
            <div className="text-xs text-[#64748b]">Tâches</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#22c55e]">{currentTasks.filter((t: Task) => t.status === "Termine").length}/{currentTasks.length}</div>
            <div className="text-xs text-[#64748b]">Terminées</div>
          </div>
        </div>

      </div>

      {/* Burndown / Progress chart */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Progression du sprint
        </h2>
        <div className="mb-3">
          <div className="flex w-full h-8 rounded-lg overflow-hidden">
            {statusCounts["Termine"] > 0 && (
              <div
                className="bg-[#22c55e] h-full flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ width: `${completedPct}%` }}
              >
                {completedPct}%
              </div>
            )}
            {statusCounts["En review"] > 0 && (
              <div
                className="bg-[#f97316] h-full transition-all"
                style={{ width: `${pct(statusCounts["En review"])}%` }}
              />
            )}
            {statusCounts["En cours"] > 0 && (
              <div
                className="bg-[#3b82f6] h-full transition-all"
                style={{ width: `${pct(statusCounts["En cours"])}%` }}
              />
            )}
            {statusCounts["A faire"] > 0 && (
              <div
                className="bg-[#cbd5e1] h-full transition-all"
                style={{ width: `${pct(statusCounts["A faire"])}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-[#475569]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#22c55e] inline-block" />
            Termine — {statusCounts["Termine"]}h
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#f97316] inline-block" />
            En review — {statusCounts["En review"]}h
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#3b82f6] inline-block" />
            En cours — {statusCounts["En cours"]}h
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#cbd5e1] inline-block" />
            A faire — {statusCounts["A faire"]}h
          </div>
          <div className="ml-auto font-semibold text-[#1e293b]">
            {completedPct}% complete ({statusCounts["Termine"]}h / {totalHeures}h)
          </div>
        </div>
      </div>

      {/* Kanban mini overview */}
      {currentTasks.length > 0 && (() => {
        const kanbanCounts: Record<string, number> = {
          "A faire": currentTasks.filter((t: { status: string }) => t.status === "A faire").length,
          "En cours": currentTasks.filter((t: { status: string }) => t.status === "En cours").length,
          "En review": currentTasks.filter((t: { status: string }) => t.status === "En review").length,
          "Termine": currentTasks.filter((t: { status: string }) => t.status === "Termine").length,
        };
        const kanbanColors: Record<string, string> = { "A faire": "#94a3b8", "En cours": "#3b82f6", "En review": "#f59e0b", "Termine": "#22c55e" };
        return (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
            <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
              {Object.entries(kanbanCounts).map(([status, count]) => (
                count > 0 ? (
                  <div
                    key={status}
                    className="h-full transition-all"
                    style={{
                      width: `${(count / currentTasks.length) * 100}%`,
                      backgroundColor: kanbanColors[status],
                    }}
                  />
                ) : null
              ))}
            </div>
            <div className="flex justify-between text-xs">
              {Object.entries(kanbanCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kanbanColors[status] }} />
                  <span className="text-[#64748b]">{status === "Termine" ? "Terminé" : status}</span>
                  <span className="font-semibold text-[#1e293b]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Status filter + reset */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "A faire", "En cours", "En review", "Termine"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              statusFilter === s
                ? "bg-[#3b82f6] text-white"
                : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
            }`}
          >
            {s === "all" ? "Toutes" : statusDisplayLabels[s] || s} ({s === "all" ? currentTasks.length : currentTasks.filter((t) => t.status === s).length})
          </button>
        ))}
        {isOwner && (
          <button
            onClick={() => openCreateTask(selectedSprint)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] hover:bg-[#dcfce7] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tache
          </button>
        )}
        <button
          onClick={resetAllStatuses}
          className="ml-auto px-3 py-2 rounded-lg text-xs border border-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444] transition-colors"
          title="Reinitialiser tous les statuts"
        >
          ↺ Reinitialiser
        </button>
      </div>

      {/* Tasks grouped by US */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.us}>
            <h3 className="text-sm font-bold text-[#64748b] uppercase mb-3 flex items-center gap-2">
              <span className="bg-[#3b82f6] text-white px-2 py-0.5 rounded text-xs">
                {group.us}
              </span>
              {group.us !== "Transversal" && (
                <span className="font-normal normal-case text-[#475569]">
                  {usDescriptions[group.us] || group.us}
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {group.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg border border-[#e2e8f0] p-4 flex items-start gap-4"
                >
                  <span className="text-xs font-mono text-[#94a3b8] w-12 mt-0.5">
                    {displayId(task.id)}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeColors[task.type]}`}>
                    {task.type}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#334155]">
                      {task.titre}
                    </h4>
                    <p className="text-xs text-[#64748b] mt-1">
                      {task.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#3b82f6]">
                    {task.estimation}
                  </span>
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e0e7ff] text-[#4338ca] text-[10px] font-bold shrink-0"
                    title={task.assignee}
                  >
                    {getInitials(task.assignee)}
                  </span>
                  <button
                    onClick={() => cycleStatus(task.id)}
                    className={`text-xs font-medium px-2 py-1 rounded cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 hover:ring-[#3b82f6] ${statusColors[task.status]}`}
                    title="Cliquer pour changer le statut"
                  >
                    {statusDisplayLabels[task.status] || task.status}
                  </button>
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditTask(task, selectedSprint)}
                        className="p-1 rounded hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Supprimer cette tache ?")) {
                            fetch(`/api/projects/${projectId}/tasks/${encodeURIComponent(task.id)}`, { method: "DELETE" })
                              .then(() => router.refresh());
                          }
                        }}
                        className="p-1 rounded hover:bg-[#fef2f2] text-[#94a3b8] hover:text-[#ef4444] transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sprint CRUD Modal */}
      <CrudModal
        isOpen={sprintModalOpen}
        onClose={() => setSprintModalOpen(false)}
        title={editingSprint ? `Modifier ${displayId(editingSprint.id)}` : "Nouveau Sprint"}
        fields={sprintFields}
        initialData={getSprintInitialData()}
        onSubmit={handleSprintSubmit}
        onDelete={editingSprint ? handleSprintDelete : undefined}
      />

      {/* Task CRUD Modal */}
      <CrudModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTask ? `Modifier ${displayId(editingTask.id)}` : "Nouvelle Tache"}
        fields={taskFields}
        initialData={getTaskInitialData()}
        onSubmit={handleTaskSubmit}
        onDelete={editingTask ? handleTaskDelete : undefined}
      />
    </div>
  );
}
