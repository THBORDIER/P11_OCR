"use client";

import { useState, useEffect, useCallback } from "react";

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

const sprintInfo = {
  nom: "Sprint 1 — Module Gestion des Clients",
  objectif:
    "Livrer le module complet de gestion des clients et prospects : liste, fiche détaillée, création, modification, historique des échanges.",
  debut: "Semaine 3",
  fin: "Semaine 5",
  duree: "3 semaines (15 jours ouvrables)",
  velocite: "29 points d'effort",
  userStories: ["US-001", "US-002", "US-003", "US-004", "US-005", "US-006"],
};

const tasks: Task[] = [
  // US-001 : Liste des clients
  {
    id: "T-001",
    userStory: "US-001",
    titre: "Créer la table Clients dans Xano",
    description: "Modéliser la table clients avec tous les champs : nom, contact, email, téléphone, secteur, statut, étape, valeur, dernier contact, adresse, taille, site web, date création.",
    type: "Config",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-002",
    userStory: "US-001",
    titre: "Créer l'endpoint API GET /clients",
    description: "API Xano pour récupérer la liste des clients avec pagination, tri et filtres.",
    type: "Dev",
    estimation: "3h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-003",
    userStory: "US-001",
    titre: "Construire la vue tableau clients dans WeWeb",
    description: "Page liste clients avec colonnes : avatar, nom, contact, secteur, statut (tag coloré), étape, valeur, dernier contact.",
    type: "Dev",
    estimation: "4h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-004",
    userStory: "US-001",
    titre: "Ajouter le tri par colonne",
    description: "Permettre le clic sur chaque en-tête de colonne pour trier par ordre croissant/décroissant.",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },

  // US-002 : Filtres et recherche
  {
    id: "T-005",
    userStory: "US-002",
    titre: "Implémenter la barre de recherche",
    description: "Recherche en temps réel par nom, entreprise ou email. Debounce de 300ms.",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-006",
    userStory: "US-002",
    titre: "Ajouter les filtres statut et secteur",
    description: "Deux selects : filtre par statut (Tous/Actif/Prospect) et par secteur. Combinables avec la recherche.",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },

  // US-003 : Fiche client détaillée
  {
    id: "T-007",
    userStory: "US-003",
    titre: "Créer la page fiche client (layout)",
    description: "En-tête avec avatar, nom, statut, secteur. Bloc KPIs (4 cartes). Système d'onglets.",
    type: "Dev",
    estimation: "4h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-008",
    userStory: "US-003",
    titre: "Implémenter l'onglet Aperçu",
    description: "Afficher les informations de contact (email, tél, adresse) et les détails entreprise (secteur, taille, site, date client depuis).",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-009",
    userStory: "US-003",
    titre: "Implémenter l'onglet Affaires",
    description: "Liste des opportunités liées au client avec statut, montant, probabilité.",
    type: "Dev",
    estimation: "3h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-010",
    userStory: "US-003",
    titre: "Créer l'endpoint API GET /clients/:id",
    description: "API Xano retournant le détail complet d'un client avec ses relations (affaires, échanges, tâches).",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },

  // US-004 : Créer un client
  {
    id: "T-011",
    userStory: "US-004",
    titre: "Créer le formulaire de création client",
    description: "Formulaire modal ou pleine page : nom, contact, email, téléphone, secteur, taille, adresse. Champs obligatoires marqués.",
    type: "Dev",
    estimation: "3h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-012",
    userStory: "US-004",
    titre: "Créer l'endpoint API POST /clients",
    description: "API de création avec validation serveur (email unique, champs obligatoires).",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-013",
    userStory: "US-004",
    titre: "Implémenter la détection de doublons",
    description: "À la saisie de l'email, vérifier si un client existe déjà et afficher une alerte.",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },

  // US-005 : Modifier un client
  {
    id: "T-014",
    userStory: "US-005",
    titre: "Rendre la fiche client éditable",
    description: "Bouton Modifier qui passe les champs en mode édition. Bouton Enregistrer avec confirmation.",
    type: "Dev",
    estimation: "3h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-015",
    userStory: "US-005",
    titre: "Créer l'endpoint API PUT /clients/:id",
    description: "API de modification avec historique des changements (champ modifié, ancienne valeur, nouvelle valeur, date, auteur).",
    type: "Dev",
    estimation: "2h",
    status: "A faire",
    assignee: "Thomas B.",
  },

  // US-006 : Historique des échanges
  {
    id: "T-016",
    userStory: "US-006",
    titre: "Créer la table Échanges dans Xano",
    description: "Table : type (Appel/Email/Réunion), titre, description, date, participants, client_id (relation).",
    type: "Config",
    estimation: "1h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-017",
    userStory: "US-006",
    titre: "Implémenter la timeline des échanges",
    description: "Onglet Échanges dans la fiche client : timeline chronologique avec icônes par type, titre, description, date.",
    type: "Dev",
    estimation: "4h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-018",
    userStory: "US-006",
    titre: "Ajouter le filtre par type d'interaction",
    description: "Boutons filtres : Tous, Appels, Emails, Réunions.",
    type: "Dev",
    estimation: "1h",
    status: "A faire",
    assignee: "Thomas B.",
  },

  // Tâches transversales
  {
    id: "T-019",
    userStory: "Transversal",
    titre: "Tests fonctionnels du module Clients",
    description: "Tester tous les parcours : création, modification, recherche, filtres, navigation fiche, timeline. Vérifier les rôles.",
    type: "Test",
    estimation: "4h",
    status: "A faire",
    assignee: "Thomas B.",
  },
  {
    id: "T-020",
    userStory: "Transversal",
    titre: "Design responsive du module",
    description: "Vérifier et ajuster l'affichage tablette et mobile de la liste clients et de la fiche détail.",
    type: "Design",
    estimation: "3h",
    status: "A faire",
    assignee: "Thomas B.",
  },
];

const statusColors: Record<string, string> = {
  "A faire": "bg-[#f1f5f9] text-[#64748b]",
  "En cours": "bg-[#eff6ff] text-[#3b82f6]",
  "En review": "bg-[#fff7ed] text-[#ea580c]",
  Termine: "bg-[#f0fdf4] text-[#22c55e]",
};

const statusDisplayLabels: Record<string, string> = {
  "A faire": "À faire",
  "En cours": "En cours",
  "En review": "En review",
  Termine: "Terminé",
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

const statusFlow: Task["status"][] = ["A faire", "En cours", "En review", "Termine"];

const initialTasks = tasks;

export default function SprintBacklogPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [liveTasks, setLiveTasks] = useState<Task[]>(initialTasks);

  // Load saved statuses from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spartcrm-sprint-statuses");
      if (saved) {
        const savedStatuses: Record<string, Task["status"]> = JSON.parse(saved);
        setLiveTasks(
          initialTasks.map((t) => ({
            ...t,
            status: savedStatuses[t.id] || t.status,
          }))
        );
      }
    } catch {}
  }, []);

  const saveStatuses = useCallback((updatedTasks: Task[]) => {
    try {
      const statuses: Record<string, string> = {};
      updatedTasks.forEach((t) => { statuses[t.id] = t.status; });
      localStorage.setItem("spartcrm-sprint-statuses", JSON.stringify(statuses));
    } catch {}
  }, []);

  const cycleStatus = (taskId: string) => {
    setLiveTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = statusFlow.indexOf(t.status);
        const nextIndex = (currentIndex + 1) % statusFlow.length;
        return { ...t, status: statusFlow[nextIndex] };
      });
      saveStatuses(updated);
      return updated;
    });
  };

  const resetAllStatuses = () => {
    const resetTasks = initialTasks.map((t) => ({ ...t, status: "A faire" as Task["status"] }));
    setLiveTasks(resetTasks);
    saveStatuses(resetTasks);
  };

  const filtered = statusFilter === "all"
    ? liveTasks
    : liveTasks.filter((t) => t.status === statusFilter);

  const grouped = sprintInfo.userStories.concat(["Transversal"]).map((us) => ({
    us,
    tasks: filtered.filter((t) => t.userStory === us),
  })).filter((g) => g.tasks.length > 0);

  const totalHeures = liveTasks.reduce((sum, t) => sum + parseInt(t.estimation), 0);

  // Burndown chart data
  const statusCounts = {
    "A faire": liveTasks.filter((t) => t.status === "A faire").reduce((s, t) => s + parseInt(t.estimation), 0),
    "En cours": liveTasks.filter((t) => t.status === "En cours").reduce((s, t) => s + parseInt(t.estimation), 0),
    "En review": liveTasks.filter((t) => t.status === "En review").reduce((s, t) => s + parseInt(t.estimation), 0),
    Termine: liveTasks.filter((t) => t.status === "Termine").reduce((s, t) => s + parseInt(t.estimation), 0),
  };

  const pct = (hours: number) => totalHeures > 0 ? Math.round((hours / totalHeures) * 100) : 0;
  const completedPct = pct(statusCounts["Termine"]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Sprint Backlog</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 5 — Détail du premier sprint
        </p>
      </div>

      {/* Sprint Goal Banner */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-lg p-6 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">🎯</span>
          <div>
            <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-1">
              Objectif du Sprint 1
            </h2>
            <p className="text-white text-lg font-semibold leading-relaxed">
              &laquo; À la fin du Sprint 1, un commercial peut créer, consulter, rechercher et modifier des fiches clients/prospects avec historique des échanges, depuis n&apos;importe quel navigateur. &raquo;
            </p>
          </div>
        </div>
      </div>

      {/* Sprint info */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#1e293b] mb-2">
          {sprintInfo.nom}
        </h2>
        <p className="text-sm text-[#475569] mb-4">{sprintInfo.objectif}</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#1e293b]">{sprintInfo.debut} - {sprintInfo.fin}</div>
            <div className="text-xs text-[#64748b]">Période</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#3b82f6]">{sprintInfo.velocite}</div>
            <div className="text-xs text-[#64748b]">Points d'effort</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#8b5cf6]">{sprintInfo.userStories.length} US</div>
            <div className="text-xs text-[#64748b]">User Stories</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#f59e0b]">{totalHeures}h</div>
            <div className="text-xs text-[#64748b]">Estimation totale</div>
          </div>
        </div>

        {/* Team Capacity */}
        <div className="mt-6 border-t border-[#e2e8f0] pt-5">
          <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-base">👥</span> Capacité de l&apos;équipe
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
              <div className="text-xs text-[#64748b] mb-1">Développeur</div>
              <div className="text-sm font-semibold text-[#1e293b]">Thomas Bordier</div>
              <div className="text-xs text-[#475569] mt-0.5">5j/semaine, 7h/jour = 35h/semaine</div>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
              <div className="text-xs text-[#64748b] mb-1">Capacité brute</div>
              <div className="text-sm font-semibold text-[#1e293b]">105 heures</div>
              <div className="text-xs text-[#475569] mt-0.5">Sprint de 3 semaines (35h × 3)</div>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
              <div className="text-xs text-[#64748b] mb-1">Facteur de focus</div>
              <div className="text-sm font-semibold text-[#f59e0b]">80% → 84h disponibles</div>
              <div className="text-xs text-[#475569] mt-0.5">Réunions, imprévus, apprentissage</div>
            </div>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
              <div className="text-xs text-[#64748b] mb-1">Charge planifiée</div>
              <div className="text-sm font-semibold text-[#22c55e]">50h → taux d&apos;occupation 60%</div>
              <div className="text-xs text-[#475569] mt-0.5">Marge pour imprévus et dette technique</div>
            </div>
          </div>
        </div>

        {/* Daily Standup */}
        <div className="mt-5 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-3 flex items-start gap-2.5">
          <span className="text-base mt-0.5">💬</span>
          <div>
            <div className="text-xs font-bold text-[#1e40af] mb-0.5">Rituel quotidien</div>
            <p className="text-xs text-[#1e40af]">
              Standup asynchrone via Slack (<span className="font-mono font-semibold">#spartcrm-daily</span>) — Qu&apos;ai-je fait hier ? Que vais-je faire aujourd&apos;hui ? Ai-je des blocages ?
            </p>
          </div>
        </div>
      </div>

      {/* Sprint Selection Criteria */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-3 flex items-center gap-2">
          <span className="text-base">📋</span> Pourquoi ces 6 User Stories dans le Sprint 1 ?
        </h2>
        <div className="space-y-2.5">
          {[
            {
              icon: "🔴",
              text: "Toutes sont des US « Must Have » (priorité MoSCoW la plus haute)",
            },
            {
              icon: "🧩",
              text: "Elles forment un ensemble fonctionnel complet et autonome (module Clients)",
            },
            {
              icon: "📊",
              text: "29 points d'effort respectent la vélocité cible de l'équipe",
            },
            {
              icon: "🏗️",
              text: "Elles constituent le socle de données nécessaire aux sprints suivants (Pipeline, Tâches)",
            },
            {
              icon: "✅",
              text: "Le client a validé ce périmètre lors du Sprint Planning",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-[#334155]">
              <span className="mt-0.5 shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
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
            Terminé — {statusCounts["Termine"]}h
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
            À faire — {statusCounts["A faire"]}h
          </div>
          <div className="ml-auto font-semibold text-[#1e293b]">
            {completedPct}% complété ({statusCounts["Termine"]}h / {totalHeures}h)
          </div>
        </div>
      </div>

      {/* Status filter + reset */}
      <div className="flex gap-2 mb-6">
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
            {s === "all" ? "Toutes" : statusDisplayLabels[s] || s} ({s === "all" ? liveTasks.length : liveTasks.filter((t) => t.status === s).length})
          </button>
        ))}
        <button
          onClick={resetAllStatuses}
          className="ml-auto px-3 py-2 rounded-lg text-xs border border-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444] transition-colors"
          title="Réinitialiser tous les statuts"
        >
          ↺ Réinitialiser
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
                  {group.us === "US-001" && "Voir la liste des clients"}
                  {group.us === "US-002" && "Filtrer et rechercher des clients"}
                  {group.us === "US-003" && "Consulter la fiche client détaillée"}
                  {group.us === "US-004" && "Créer un nouveau client ou prospect"}
                  {group.us === "US-005" && "Modifier une fiche client"}
                  {group.us === "US-006" && "Voir l'historique des échanges"}
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
                    {task.id}
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
                  {/* Assignee badge */}
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Definition of Done */}
      <div className="bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-6 mt-8">
        <h2 className="text-lg font-semibold text-[#166534] mb-3">
          Definition of Done (DoD)
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-[#166534]">
          {[
            "Le code est déployé sur l'environnement de staging",
            "Les tests fonctionnels sont passés avec succès",
            "L'affichage est responsive (desktop + tablette)",
            "Les permissions par rôle sont respectées",
            "La fonctionnalité a été démontrée au Product Owner",
            "Aucun bug bloquant ou critique n'est ouvert",
          ].map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5">&#10003;</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
