"use client";

import { useState, useEffect, useCallback } from "react";
import { projectConfig } from "@/config/project.config";

// ── Types ──
interface Task {
  id: string;
  userStory: string;
  titre: string;
  description: string;
  type: "Dev" | "Design" | "Test" | "Config";
  estimation: string;
  status: "A faire" | "En cours" | "En review" | "Termine";
  assignee: string;
}

interface SprintInfo {
  id: string;
  nom: string;
  objectif: string;
  objectifCourt: string;
  debut: string;
  fin: string;
  duree: string;
  velocite: string;
  userStories: string[];
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ vos sprints et tâches ci-dessous             ║
// ╚══════════════════════════════════════════════════════════════╝
const sprints: SprintInfo[] = [
  {
    id: "sprint-1",
    nom: "Sprint 1 — Module Principal",
    objectif:
      "Livrer le module principal avec les fonctionnalités de base.",
    objectifCourt:
      "À la fin du Sprint 1, les utilisateurs peuvent réaliser les actions de base du module principal.",
    debut: "Semaine 3",
    fin: "Semaine 5",
    duree: "3 semaines",
    velocite: "13 points d'effort",
    userStories: ["US-001", "US-002", "US-003"],
  },
  {
    id: "sprint-2",
    nom: "Sprint 2 — Module Complémentaire",
    objectif:
      "Livrer le module complémentaire avec tableau de bord et exports.",
    objectifCourt:
      "À la fin du Sprint 2, les managers disposent d'un tableau de bord et peuvent exporter les données.",
    debut: "Semaine 6",
    fin: "Semaine 8",
    duree: "3 semaines",
    velocite: "11 points d'effort",
    userStories: ["US-004", "US-005"],
  },
];

const allTasks: Record<string, Task[]> = {
  "sprint-1": [
    {
      id: "T-001",
      userStory: "US-001",
      titre: "Créer le composant liste",
      description: "Développer le composant de liste avec tri et pagination.",
      type: "Dev",
      estimation: "1j",
      status: "A faire",
      assignee: "À définir",
    },
    {
      id: "T-002",
      userStory: "US-001",
      titre: "Connecter l'API de données",
      description: "Implémenter l'appel API et le mapping des données.",
      type: "Dev",
      estimation: "0.5j",
      status: "A faire",
      assignee: "À définir",
    },
    {
      id: "T-003",
      userStory: "US-002",
      titre: "Implémenter la recherche",
      description: "Barre de recherche avec filtres combinables.",
      type: "Dev",
      estimation: "1j",
      status: "A faire",
      assignee: "À définir",
    },
    {
      id: "T-004",
      userStory: "US-003",
      titre: "Formulaire de création",
      description:
        "Formulaire avec validation et confirmation de création.",
      type: "Dev",
      estimation: "1.5j",
      status: "A faire",
      assignee: "À définir",
    },
    {
      id: "T-005",
      userStory: "US-003",
      titre: "Tests de recette Sprint 1",
      description: "Exécuter les scénarios de test du Sprint 1.",
      type: "Test",
      estimation: "0.5j",
      status: "A faire",
      assignee: "À définir",
    },
  ],
  "sprint-2": [
    {
      id: "T-006",
      userStory: "US-004",
      titre: "Créer le tableau de bord",
      description: "Composant dashboard avec 4 KPIs et graphiques.",
      type: "Dev",
      estimation: "2j",
      status: "A faire",
      assignee: "À définir",
    },
    {
      id: "T-007",
      userStory: "US-005",
      titre: "Implémenter les exports",
      description: "Export CSV et Excel avec filtres appliqués.",
      type: "Dev",
      estimation: "1j",
      status: "A faire",
      assignee: "À définir",
    },
  ],
};

const statusColors: Record<string, string> = {
  "A faire": "bg-[#f1f5f9] text-[#475569]",
  "En cours": "bg-[#eff6ff] text-[#1d4ed8]",
  "En review": "bg-[#fefce8] text-[#a16207]",
  Termine: "bg-[#f0fdf4] text-[#166534]",
};

const typeColors: Record<string, string> = {
  Dev: "bg-[#dbeafe] text-[#1d4ed8]",
  Design: "bg-[#fae8ff] text-[#a21caf]",
  Test: "bg-[#dcfce7] text-[#166534]",
  Config: "bg-[#f1f5f9] text-[#475569]",
};

const statusFlow = ["A faire", "En cours", "En review", "Termine"];

export default function SprintBacklogPage() {
  const [activeSprint, setActiveSprint] = useState(sprints[0].id);
  const [tasks, setTasks] = useState<Record<string, Task[]>>(allTasks);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        `${projectConfig.name}-sprint-tasks`
      );
      if (saved) setTasks(JSON.parse(saved));
    } catch {}
  }, []);

  const saveTasks = useCallback((updated: Record<string, Task[]>) => {
    try {
      localStorage.setItem(
        `${projectConfig.name}-sprint-tasks`,
        JSON.stringify(updated)
      );
    } catch {}
  }, []);

  const cycleTaskStatus = (taskId: string) => {
    setTasks((prev) => {
      const updated = { ...prev };
      for (const sprintId in updated) {
        updated[sprintId] = updated[sprintId].map((t) => {
          if (t.id !== taskId) return t;
          const idx = statusFlow.indexOf(t.status);
          const next = statusFlow[(idx + 1) % statusFlow.length] as Task["status"];
          return { ...t, status: next };
        });
      }
      saveTasks(updated);
      return updated;
    });
  };

  const sprint = sprints.find((s) => s.id === activeSprint)!;
  const sprintTasks = tasks[activeSprint] || [];
  const done = sprintTasks.filter((t) => t.status === "Termine").length;
  const progress =
    sprintTasks.length > 0 ? (done / sprintTasks.length) * 100 : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Sprint Backlog</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 5 — Détail des sprints avec tâches et suivi
        </p>
      </div>

      {/* Sprint selector */}
      <div className="flex gap-2 mb-6">
        {sprints.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSprint(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSprint === s.id
                ? "bg-[#3b82f6] text-white"
                : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
            }`}
          >
            {s.nom}
          </button>
        ))}
      </div>

      {/* Sprint info */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1e293b]">
            {sprint.nom}
          </h2>
          <div className="flex gap-2 text-xs">
            <span className="bg-[#f1f5f9] px-2 py-1 rounded text-[#64748b]">
              {sprint.debut} → {sprint.fin}
            </span>
            <span className="bg-[#f1f5f9] px-2 py-1 rounded text-[#64748b]">
              {sprint.duree}
            </span>
            <span className="bg-[#eff6ff] px-2 py-1 rounded text-[#1d4ed8] font-medium">
              {sprint.velocite}
            </span>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-lg p-3 mb-4">
          <p className="text-sm text-[#475569]">
            <strong>Objectif :</strong> {sprint.objectifCourt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#e2e8f0] rounded-full h-2">
            <div
              className="bg-[#22c55e] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[#64748b]">
            {done}/{sprintTasks.length} tâches terminées
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          <span className="text-xs text-[#64748b]">
            User Stories : {sprint.userStories.join(", ")}
          </span>
        </div>
      </div>

      {/* Kanban-like columns */}
      <div className="grid grid-cols-4 gap-4">
        {statusFlow.map((status) => {
          const columnTasks = sprintTasks.filter((t) => t.status === status);
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-[#334155]">
                  {status === "A faire"
                    ? "À faire"
                    : status === "Termine"
                      ? "Terminé"
                      : status}
                </h3>
                <span className="text-xs bg-[#f1f5f9] px-2 py-0.5 rounded-full text-[#64748b]">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg border border-[#e2e8f0] p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[#3b82f6]">
                        {task.id}
                      </span>
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${typeColors[task.type]}`}
                      >
                        {task.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#1e293b] mb-1">
                      {task.titre}
                    </p>
                    <p className="text-xs text-[#64748b] mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#94a3b8]">
                        {task.userStory} · {task.estimation}
                      </span>
                      <button
                        onClick={() => cycleTaskStatus(task.id)}
                        className={`text-xs font-medium px-2 py-0.5 rounded cursor-pointer hover:ring-1 hover:ring-[#3b82f6] ${statusColors[task.status]}`}
                      >
                        {task.status === "A faire"
                          ? "À faire"
                          : task.status === "Termine"
                            ? "Terminé"
                            : task.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
