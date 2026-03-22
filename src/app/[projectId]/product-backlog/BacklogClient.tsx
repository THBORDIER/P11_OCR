"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";

interface UserStory {
  id: string;
  epic: string;
  titre: string;
  enTantQue: string;
  jeSouhaite: string;
  afinDe: string;
  criteres: string[];
  detailsMetier: string[];
  contraintes: string[];
  dependancesTech: string[];
  estimation: number;
  priorite: string;
  sprint: string;
  valeur: string;
  validatedAt: string | null;
}

interface BacklogClientProps {
  initialStories: UserStory[];
  projectId: string;
  isOwner?: boolean;
}

const epicsFromStories = (stories: UserStory[]) => [...new Set(stories.map((us) => us.epic))];
const sprintsList = ["Phase 0", "Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];
const priorityColors: Record<string, string> = {
  Must: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
  Should: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]",
  Could: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]",
  "Won't": "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
};

const valeurColors: Record<string, string> = {
  Critique: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
  Haute: "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
  Moyenne: "bg-[#f0f9ff] text-[#075985] border-[#bae6fd]",
};

const getCardDetails = (us: UserStory) => {
  const detailsMetier =
    us.detailsMetier && us.detailsMetier.length > 0
      ? us.detailsMetier
      : [
          `Acteur principal : ${us.enTantQue}`,
          `Valeur métier attendue : ${us.afinDe}`,
          `Priorisation : ${us.priorite} (${us.valeur})`,
        ];

  const contraintes =
    us.contraintes && us.contraintes.length > 0
      ? us.contraintes
      : ["Aucune contrainte spécifiée."];

  const dependancesTech =
    us.dependancesTech && us.dependancesTech.length > 0
      ? us.dependancesTech
      : ["Aucune dépendance technique spécifiée."];

  return { detailsMetier, contraintes, dependancesTech };
};

/** Strip project prefix from ID: "p11-spartcrm:US-001" -> "US-001" */
function displayId(id: string): string {
  const idx = id.indexOf(":");
  return idx >= 0 ? id.slice(idx + 1) : id;
}

export default function BacklogClient({ initialStories, projectId, isOwner }: BacklogClientProps) {
  const router = useRouter();
  const backlog = initialStories;
  const epics = epicsFromStories(backlog);

  const [filterEpic, setFilterEpic] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterSprint, setFilterSprint] = useState<string>("all");
  const [expandedUS, setExpandedUS] = useState<string | null>(null);
  // Store validation date (ISO string) or null if not validated
  const [validatedUS, setValidatedUS] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {};
    backlog.forEach((us) => {
      initial[us.id] = us.validatedAt || null;
    });
    return initial;
  });

  // CRUD state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUS, setEditingUS] = useState<UserStory | null>(null);

  // Persist validation to DB
  const persistValidation = useCallback(async (usId: string, validated: boolean) => {
    // Strip project prefix for API: "my-project:US-001" → "US-001"
    const shortId = usId.includes(":") ? usId.split(":").slice(1).join(":") : usId;
    try {
      await fetch(`/api/projects/${projectId}/backlog/validate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shortId, validated }),
      });
    } catch {
      // Silent fail — UI already updated optimistically
    }
  }, [projectId]);

  const toggleValidation = (id: string) => {
    const current = validatedUS[id];
    const newVal = current ? null : new Date().toISOString();
    setValidatedUS((prev) => ({ ...prev, [id]: newVal }));
    persistValidation(id, !current);
  };

  const isUSValidated = (id: string) => !!validatedUS[id];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const validatedCount = backlog.filter((us) => isUSValidated(us.id)).length;

  const filtered = backlog.filter((us) => {
    if (filterEpic !== "all" && us.epic !== filterEpic) return false;
    if (filterPriority !== "all" && us.priorite !== filterPriority) return false;
    if (filterSprint !== "all" && us.sprint !== filterSprint) return false;
    return true;
  });

  const totalPoints = filtered.reduce((sum, us) => sum + us.estimation, 0);

  // Compute points per sprint for the filtered stories
  const sprintPoints: Record<string, number> = {};
  filtered.forEach((us) => {
    sprintPoints[us.sprint] = (sprintPoints[us.sprint] || 0) + us.estimation;
  });
  const sprintOrder = [
    "Phase 0",
    "Sprint 1",
    "Sprint 2",
    "Sprint 3",
    "Sprint 4",
    "Sprint 5",
  ];
  const sortedSprints = Object.keys(sprintPoints).sort(
    (a, b) => sprintOrder.indexOf(a) - sprintOrder.indexOf(b)
  );

  // ─── CRUD helpers ───────────────────────────────────────

  const usFields: FieldConfig[] = [
    ...(editingUS
      ? []
      : [{ name: "shortId", label: "Identifiant (ex: US-023)", type: "text" as const, required: true }]),
    {
      name: "epic",
      label: "Epic",
      type: "select" as const,
      options: [...epics, "Autre"],
    },
    { name: "titre", label: "Titre", type: "text" as const, required: true },
    { name: "enTantQue", label: "En tant que (role)", type: "text" as const },
    { name: "jeSouhaite", label: "Je souhaite", type: "textarea" as const },
    { name: "afinDe", label: "Afin de", type: "textarea" as const },
    { name: "estimation", label: "Estimation (points)", type: "number" as const },
    {
      name: "priorite",
      label: "Priorite",
      type: "select" as const,
      options: ["Must", "Should", "Could", "Won't"],
    },
    {
      name: "sprint",
      label: "Sprint",
      type: "select" as const,
      options: [...sprintsList, "Non planifie"],
    },
    {
      name: "valeur",
      label: "Valeur",
      type: "select" as const,
      options: ["Critique", "Haute", "Moyenne"],
    },
  ];

  const openCreate = () => {
    setEditingUS(null);
    setModalOpen(true);
  };

  const openEdit = (us: UserStory) => {
    setEditingUS(us);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (editingUS) {
      // PATCH
      const res = await fetch(
        `/api/projects/${projectId}/user-stories/${encodeURIComponent(editingUS.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            epic: data.epic,
            titre: data.titre,
            enTantQue: data.enTantQue,
            jeSouhaite: data.jeSouhaite,
            afinDe: data.afinDe,
            estimation: Number(data.estimation) || 0,
            priorite: data.priorite,
            sprint: data.sprint,
            valeur: data.valeur,
          }),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la modification");
    } else {
      // POST
      const shortId = (data.shortId as string).trim();
      const fullId = `${projectId}:${shortId}`;
      const res = await fetch(`/api/projects/${projectId}/user-stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fullId,
          epic: data.epic,
          titre: data.titre,
          enTantQue: data.enTantQue || "",
          jeSouhaite: data.jeSouhaite || "",
          afinDe: data.afinDe || "",
          criteres: [],
          detailsMetier: [],
          contraintes: [],
          dependancesTech: [],
          estimation: Number(data.estimation) || 0,
          priorite: data.priorite,
          sprint: data.sprint,
          valeur: data.valeur,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la creation");
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!editingUS) return;
    const res = await fetch(
      `/api/projects/${projectId}/user-stories/${encodeURIComponent(editingUS.id)}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  };

  const getInitialData = () => {
    if (!editingUS) return undefined;
    return {
      epic: editingUS.epic,
      titre: editingUS.titre,
      enTantQue: editingUS.enTantQue,
      jeSouhaite: editingUS.jeSouhaite,
      afinDe: editingUS.afinDe,
      estimation: editingUS.estimation,
      priorite: editingUS.priorite,
      sprint: editingUS.sprint,
      valeur: editingUS.valeur,
    };
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Product Backlog</h1>
          <p className="text-[#64748b] mt-2">
            {backlog.length} User Stories — {backlog.reduce((s, u) => s + u.estimation, 0)} points d'effort total
          </p>
        </div>
        {isOwner && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            User Story
          </button>
        )}
      </div>

      {backlog.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-[#64748b] text-lg mb-2">Aucune User Story</p>
          <p className="text-[#94a3b8] text-sm mb-4">
            {isOwner
              ? "Commencez par ajouter des User Stories ou générez-les avec l'IA."
              : "Le backlog n'a pas encore été alimenté."}
          </p>
          {isOwner && (
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + User Story
            </button>
          )}
        </div>
      ) : (
      <>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#dc2626]">
            {backlog.filter((u) => u.priorite === "Must").length}
          </div>
          <div className="text-xs text-[#64748b]">Must Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#ea580c]">
            {backlog.filter((u) => u.priorite === "Should").length}
          </div>
          <div className="text-xs text-[#64748b]">Should Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#0284c7]">
            {backlog.filter((u) => u.priorite === "Could").length}
          </div>
          <div className="text-xs text-[#64748b]">Could Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#1e293b]">{epics.length}</div>
          <div className="text-xs text-[#64748b]">Epics</div>
        </div>
        <div className={`rounded-lg border p-4 text-center ${validatedCount === backlog.length ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-white border-[#e2e8f0]"}`}>
          <div className={`text-2xl font-bold ${validatedCount === backlog.length ? "text-[#22c55e]" : "text-[#f59e0b]"}`}>
            {validatedCount}/{backlog.length}
          </div>
          <div className="text-xs text-[#64748b]">Validees PO</div>
        </div>
      </div>

      {/* Points per Sprint — clickable to filter */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
        <h3 className="text-sm font-bold text-[#334155] mb-3">Points par sprint</h3>
        <div className="flex flex-wrap gap-3">
          {sortedSprints.map((sprint) => (
            <button
              key={sprint}
              onClick={() => setFilterSprint(filterSprint === sprint ? "all" : sprint)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all cursor-pointer ${
                filterSprint === sprint
                  ? "bg-[#3b82f6] border border-[#3b82f6] ring-2 ring-[#3b82f6]/30"
                  : "bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#3b82f6]"
              }`}
            >
              <span className={`text-xs font-medium ${filterSprint === sprint ? "text-white" : "text-[#475569]"}`}>
                {sprint}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                filterSprint === sprint
                  ? "bg-white/20 text-white"
                  : "text-[#3b82f6] bg-[#eff6ff]"
              }`}>
                {sprintPoints[sprint]} pts
              </span>
            </button>
          ))}
          {filterSprint !== "all" && (
            <button
              onClick={() => setFilterSprint("all")}
              className="text-xs text-[#94a3b8] hover:text-[#ef4444] px-2 py-2 transition-colors"
            >
              ✕ Reinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Estimation Summary */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
        <h3 className="text-sm font-bold text-[#334155] mb-3 flex items-center gap-2">
          <span className="text-base">&#127922;</span> Estimation
        </h3>
        <div className="flex items-center gap-6 text-sm text-[#475569]">
          <div>
            <span className="font-bold text-[#1e293b] text-lg">{totalPoints}</span>
            <span className="ml-1">points total</span>
          </div>
          <div>
            <span className="font-bold text-[#1e293b] text-lg">{sortedSprints.length}</span>
            <span className="ml-1">sprints</span>
          </div>
          {sortedSprints.length > 0 && (
            <div>
              <span className="font-bold text-[#1e293b] text-lg">
                ~{Math.round(totalPoints / sortedSprints.length)}
              </span>
              <span className="ml-1">pts/sprint (vélocité moy.)</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterEpic}
          onChange={(e) => setFilterEpic(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Toutes les Epics</option>
          {epics.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Toutes les priorites</option>
          <option value="Must">Must Have</option>
          <option value="Should">Should Have</option>
          <option value="Could">Could Have</option>
        </select>
        <select
          value={filterSprint}
          onChange={(e) => setFilterSprint(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Tous les sprints</option>
          {sprintsList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="ml-auto text-sm text-[#64748b] flex items-center">
          {filtered.length} stories — {totalPoints} points
        </div>
      </div>

      {/* Backlog items */}
      <div className="space-y-3">
        {filtered.map((us) => {
          const enTantQuePreview = `En tant que ${us.enTantQue}, je souhaite ${us.jeSouhaite}`;
          const truncated =
            enTantQuePreview.length > 100
              ? enTantQuePreview.slice(0, 100) + "..."
              : enTantQuePreview;

          const isValidated = isUSValidated(us.id);
          const validationDate = validatedUS[us.id];
          const cardDetails = getCardDetails(us);

          return (
            <div
              key={us.id}
              className={`rounded-lg border overflow-hidden transition-all ${
                isValidated
                  ? "bg-[#f0fdf4] border-[#86efac] border-l-4 border-l-[#22c55e]"
                  : "bg-white border-[#e2e8f0]"
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => setExpandedUS(expandedUS === us.id ? null : us.id)}
                  className="flex-1 p-4 text-left hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#94a3b8] w-16">{displayId(us.id)}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${priorityColors[us.priorite]}`}>
                      {us.priorite}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${valeurColors[us.valeur]}`}>
                      {us.valeur}
                    </span>
<span className="flex-1 font-medium text-sm text-[#334155]">{us.titre}</span>
                    {isValidated && (
                      <span className="text-xs font-bold text-[#22c55e] bg-[#dcfce7] px-2 py-0.5 rounded border border-[#86efac] flex items-center gap-1">
                        <span>&#10003;</span> Validee{validationDate ? ` le ${formatDate(validationDate)}` : ""}
                      </span>
                    )}
                    <span className="text-xs text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
                      {us.epic}
                    </span>
                    <span className="text-xs font-medium text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
                      {us.criteres.length} critere{us.criteres.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-xs font-medium text-[#7c3aed] bg-[#faf5ff] px-2 py-0.5 rounded border border-[#ddd6fe]">
                      {cardDetails.contraintes.length} contrainte{cardDetails.contraintes.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-xs font-bold text-[#3b82f6] bg-[#eff6ff] px-2 py-0.5 rounded">
                      {us.estimation} pts
                    </span>
                    <span className="text-xs text-[#94a3b8]">{us.sprint}</span>
                    <span className="text-[#94a3b8]">{expandedUS === us.id ? "\u25B2" : "\u25BC"}</span>
                  </div>
                  {expandedUS !== us.id && (
                    <div className="mt-1 ml-20 text-xs text-[#94a3b8] italic truncate">
                      {truncated}
                    </div>
                  )}
                </button>
                {isOwner && (
                  <div className="flex items-center gap-1 pr-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(us); }}
                      className="p-1.5 rounded hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
                      title="Modifier"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Supprimer cette User Story ?")) {
                          fetch(`/api/projects/${projectId}/user-stories/${encodeURIComponent(us.id)}`, { method: "DELETE" })
                            .then(() => router.refresh());
                        }
                      }}
                      className="p-1.5 rounded hover:bg-[#fef2f2] text-[#94a3b8] hover:text-[#ef4444] transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {expandedUS === us.id && (
                <div className="border-t border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <p className="text-sm text-[#475569]">
                      <strong>En tant que</strong> {us.enTantQue},
                      <strong> je souhaite</strong> {us.jeSouhaite},
                      <strong> afin de</strong> {us.afinDe}.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                      Criteres d'acceptation
                    </h4>
                    <ul className="space-y-1">
                      {us.criteres.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#475569]">
                          <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 grid md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">Details metier</h4>
                      <ul className="space-y-1">
                        {cardDetails.detailsMetier.map((detail, i) => (
                          <li key={i} className="text-sm text-[#475569]">{detail}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">Contraintes</h4>
                      <ul className="space-y-1">
                        {cardDetails.contraintes.map((contrainte, i) => (
                          <li key={i} className="text-sm text-[#475569]">{contrainte}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">Dependances techniques</h4>
                      <ul className="space-y-1">
                        {cardDetails.dependancesTech.map((dep, i) => (
                          <li key={i} className="text-sm text-[#475569]">{dep}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                    <div className="text-xs text-[#94a3b8]">
                      Sprint : {us.sprint} · Estimation : {us.estimation} pts
                      {isValidated && validationDate && (
                        <span className="ml-2 text-[#22c55e]">
                          · Validee le {formatDate(validationDate)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isValidated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleValidation(us.id);
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444] transition-all"
                        >
                          ✕ Devalider
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValidation(us.id);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isValidated
                            ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                            : "bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#22c55e] hover:text-[#22c55e]"
                        }`}
                      >
                        {isValidated ? "\u2713 Validee par le PO" : "Valider cette US"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      </>
      )}

      {/* CRUD Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUS ? `Modifier ${displayId(editingUS.id)}` : "Nouvelle User Story"}
        fields={usFields}
        initialData={getInitialData()}
        onSubmit={handleSubmit}
        onDelete={editingUS ? handleDelete : undefined}
      />
    </div>
  );
}
