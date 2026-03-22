"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CrudModal, { FieldConfig } from "@/components/CrudModal";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Project = any;

// ── Icon helpers ────────────────────────────────────────────

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ── Section header with + button ────────────────────────────

function SectionHeader({
  title,
  isOwner,
  onAdd,
}: {
  title: string;
  isOwner: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold text-[#1e293b]">{title}</h2>
      {isOwner && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter
        </button>
      )}
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────

function EmptyState({
  label,
  isOwner,
  onAdd,
}: {
  label: string;
  isOwner: boolean;
  onAdd: () => void;
}) {
  if (!isOwner) {
    return (
      <p className="text-sm text-[#94a3b8] italic py-4">Aucun {label} défini</p>
    );
  }
  return (
    <button
      onClick={onAdd}
      className="w-full border-2 border-dashed border-[#cbd5e1] rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-[#94a3b8] hover:border-blue-400 hover:text-blue-500 transition-colors"
    >
      <PlusIcon className="w-8 h-8" />
      <span className="text-sm font-medium">Ajouter un {label}</span>
    </button>
  );
}

// ── Hover action buttons ────────────────────────────────────

function ItemActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
        className="p-1.5 rounded-md bg-white/80 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors shadow-sm"
      >
        <PencilIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
        className="p-1.5 rounded-md bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shadow-sm"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Field definitions ───────────────────────────────────────

const kpiFields: FieldConfig[] = [
  { name: "label", label: "Label", type: "text", required: true },
  { name: "value", label: "Valeur", type: "text", required: true },
  { name: "color", label: "Couleur", type: "color" },
  { name: "order", label: "Ordre", type: "number" },
];

const stackFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", required: true },
  { name: "tag", label: "Tag", type: "text", required: true },
  { name: "tagColorBg", label: "Couleur de fond du tag", type: "color" },
  { name: "tagColorText", label: "Couleur du texte du tag", type: "color" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "order", label: "Ordre", type: "number" },
];

const phaseFields: FieldConfig[] = [
  { name: "phase", label: "Phase (ex: Phase 0)", type: "text", required: true },
  { name: "title", label: "Titre", type: "text", required: true },
  { name: "objectif", label: "Objectif", type: "textarea" },
  { name: "periode", label: "Période", type: "text" },
  { name: "color", label: "Couleur", type: "color" },
  { name: "bg", label: "Couleur de fond", type: "color" },
  { name: "ressources", label: "Ressources", type: "text" },
  { name: "budget", label: "Budget", type: "text" },
  { name: "order", label: "Ordre", type: "number" },
];

const deliverableFields: FieldConfig[] = [
  { name: "title", label: "Titre", type: "text", required: true },
  { name: "desc", label: "Description", type: "textarea" },
  { name: "href", label: "Lien (href)", type: "text", required: true },
  { name: "status", label: "Statut", type: "text" },
  { name: "order", label: "Ordre", type: "number" },
];

const skillFields: FieldConfig[] = [
  { name: "name", label: "Nom", type: "text", required: true },
  { name: "order", label: "Ordre", type: "number" },
];

const projectFields: FieldConfig[] = [
  { name: "name", label: "Nom du projet", type: "text", required: true },
  { name: "subtitle", label: "Sous-titre", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "color", label: "Couleur", type: "color" },
  { name: "author", label: "Auteur", type: "text" },
  { name: "organization", label: "Organisation", type: "text" },
  { name: "contextSummary", label: "Résumé du contexte", type: "textarea" },
  { name: "methodologyFramework", label: "Framework méthodologique", type: "text" },
  { name: "methodologyFrameworkDescription", label: "Description du framework", type: "textarea" },
  { name: "methodologyPrioritization", label: "Méthode de priorisation", type: "text" },
  { name: "methodologyPrioritizationDescription", label: "Description de la priorisation", type: "textarea" },
];

// ── Project Checklist ────────────────────────────────────────

function ProjectChecklist({
  projectId,
  hasContext,
  hasPersonas,
  hasUS,
  hasSprints,
  hasTests,
}: {
  projectId: string;
  hasContext: boolean;
  hasQuestionnaire: boolean;
  hasPersonas: boolean;
  hasUS: boolean;
  hasSprints: boolean;
  hasTests: boolean;
}) {
  const steps = [
    { label: "Cadrage initial", href: `/${projectId}/onboarding`, done: hasContext, desc: "Décrivez le projet, les contraintes et la stack" },
    { label: "Questionnaire client", href: `/${projectId}/questionnaire`, done: hasContext, desc: "Envoyez le questionnaire au client" },
    { label: "Analyser les retours", href: `/${projectId}/analyse`, done: hasPersonas, desc: "Générez des personas depuis les réponses" },
    { label: "Product Backlog", href: `/${projectId}/product-backlog`, done: hasUS, desc: "Créez ou générez les User Stories" },
    { label: "Sprints", href: `/${projectId}/sprint-backlog`, done: hasSprints, desc: "Organisez les tâches en sprints" },
    { label: "Recettage", href: `/${projectId}/recettage`, done: hasTests, desc: "Créez les cas de test" },
  ];

  const completed = steps.filter((s) => s.done).length;
  const allDone = completed === steps.length;

  if (allDone) return null;

  return (
    <div className="bg-gradient-to-r from-[#eff6ff] to-[#f0fdf4] rounded-xl border border-[#dbeafe] p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#1e293b]">
          Démarrage du projet
        </h2>
        <span className="text-xs font-medium text-[#3b82f6] bg-white px-2 py-1 rounded-full">
          {completed}/{steps.length} étapes
        </span>
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <a
            key={i}
            href={step.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              step.done
                ? "bg-white/50 text-[#94a3b8]"
                : i === completed
                ? "bg-white shadow-sm border border-[#e2e8f0] text-[#1e293b] hover:shadow-md"
                : "text-[#94a3b8]"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step.done
                ? "bg-emerald-100 text-emerald-600"
                : i === completed
                ? "bg-[#3b82f6] text-white"
                : "bg-[#f1f5f9] text-[#cbd5e1]"
            }`}>
              {step.done ? "✓" : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${step.done ? "line-through" : ""}`}>{step.label}</p>
              {i === completed && !step.done && (
                <p className="text-xs text-[#64748b]">{step.desc}</p>
              )}
            </div>
            {i === completed && !step.done && (
              <span className="text-xs text-[#3b82f6] font-medium shrink-0">Commencer &rarr;</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────

// ── Activity Feed ────────────────────────────────────────
interface ActivityItem {
  id: number;
  type: string;
  source: string;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

const activityIcons: Record<string, string> = {
  commit: "🔨",
  pr_merged: "🟣",
  pr_opened: "🟢",
  pr_closed: "🔴",
  issue_opened: "📋",
  issue_closed: "✅",
  task_updated: "📝",
  us_validated: "✓",
  email_sent: "📧",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

function ActivityFeed({ projectId }: { projectId: string }) {
  const [logs, setLogs] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/activity`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setLogs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return null;
  if (logs.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
      <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
        <span>⚡</span> Activité récente
      </h2>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {logs.slice(0, 20).map((log) => (
          <div key={log.id} className="flex items-start gap-3 text-sm">
            <span className="text-base mt-0.5 shrink-0">
              {activityIcons[log.type] || "📌"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[#1e293b] font-medium truncate">{log.title}</p>
              <p className="text-xs text-[#94a3b8]">
                {log.message} · {timeAgo(log.createdAt)}
              </p>
            </div>
            {log.metadata && typeof (log.metadata as Record<string, unknown>).sha === "string" ? (
              <span className="font-mono text-xs text-[#3b82f6] bg-[#eff6ff] px-2 py-0.5 rounded shrink-0">
                {(log.metadata as Record<string, string>).sha}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AutoStats {
  userStories: { total: number; validated: number };
  tasks: { total: number; done: number };
  tests: { total: number; ok: number };
}

interface DashboardClientProps {
  initialProject: Project;
  isOwner: boolean;
  autoStats?: AutoStats;
}

export default function DashboardClient({ initialProject, isOwner, autoStats }: DashboardClientProps) {
  const router = useRouter();
  const project = initialProject;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalInitialData, setModalInitialData] = useState<Record<string, unknown> | undefined>();
  const [modalOnSubmit, setModalOnSubmit] = useState<(data: Record<string, unknown>) => Promise<void>>(() => async () => {});
  const [modalOnDelete, setModalOnDelete] = useState<(() => Promise<void>) | undefined>();

  // ── API helpers ─────────────────────────────────────────

  const apiBase = `/api/projects/${project.id}`;

  async function apiPost(endpoint: string, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la création");
    router.refresh();
  }

  async function apiPatch(endpoint: string, id: string | number, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    router.refresh();
  }

  async function apiDelete(endpoint: string, id: string | number) {
    const res = await fetch(`${apiBase}/${endpoint}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  }

  async function apiPatchProject(data: Record<string, unknown>) {
    const res = await fetch(apiBase, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification du projet");
    router.refresh();
  }

  // ── Open modal helpers ────────────────────────────────

  function openCreate(
    title: string,
    fields: FieldConfig[],
    endpoint: string,
  ) {
    setModalTitle(title);
    setModalFields(fields);
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPost(endpoint, data);
    });
    setModalOpen(true);
  }

  function openEdit(
    title: string,
    fields: FieldConfig[],
    endpoint: string,
    item: Record<string, unknown>,
  ) {
    setModalTitle(title);
    setModalFields(fields);
    setModalInitialData(item);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatch(endpoint, item.id as string | number, data);
    });
    setModalOnDelete(() => async () => {
      await apiDelete(endpoint, item.id as string | number);
    });
    setModalOpen(true);
  }

  function openEditProject() {
    setModalTitle("Modifier le projet");
    setModalFields(projectFields);
    setModalInitialData({
      name: project.name,
      subtitle: project.subtitle,
      description: project.description,
      color: project.color,
      author: project.author,
      organization: project.organization,
      contextSummary: project.contextSummary,
      methodologyFramework: project.methodologyFramework,
      methodologyFrameworkDescription: project.methodologyFrameworkDescription,
      methodologyPrioritization: project.methodologyPrioritization,
      methodologyPrioritizationDescription: project.methodologyPrioritizationDescription,
    });
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatchProject(data);
    });
    setModalOpen(true);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b]">
              Cadrage du projet {project.name}
            </h1>
            <p className="text-[#64748b] mt-2">
              {project.author} — {project.organization}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={openEditProject}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Modifier le projet
            </button>
          )}
        </div>
      </div>

      {/* Onboarding checklist */}
      {isOwner && autoStats && (
        <ProjectChecklist
          projectId={project.id}
          hasContext={!!project.contextSummary}
          hasQuestionnaire={autoStats.userStories.total >= 0} // sections exist from creation
          hasPersonas={autoStats.userStories.total >= 0 && project.personas?.length > 0}
          hasUS={autoStats.userStories.total > 0}
          hasSprints={autoStats.tasks.total > 0}
          hasTests={autoStats.tests.total > 0}
        />
      )}

      {/* Auto-calculated progress */}
      {autoStats && (autoStats.userStories.total > 0 || autoStats.tasks.total > 0 || autoStats.tests.total > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748b] uppercase">User Stories</span>
              <span className="text-lg font-bold text-[#3b82f6]">
                {autoStats.userStories.validated}/{autoStats.userStories.total}
              </span>
            </div>
            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b82f6] rounded-full"
                style={{ width: `${autoStats.userStories.total > 0 ? (autoStats.userStories.validated / autoStats.userStories.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748b] uppercase">Tâches</span>
              <span className="text-lg font-bold text-[#22c55e]">
                {autoStats.tasks.done}/{autoStats.tasks.total}
              </span>
            </div>
            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22c55e] rounded-full"
                style={{ width: `${autoStats.tasks.total > 0 ? (autoStats.tasks.done / autoStats.tasks.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748b] uppercase">Tests</span>
              <span className={`text-lg font-bold ${autoStats.tests.ok === autoStats.tests.total && autoStats.tests.total > 0 ? "text-[#22c55e]" : "text-[#f59e0b]"}`}>
                {autoStats.tests.ok}/{autoStats.tests.total}
              </span>
            </div>
            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${autoStats.tests.total > 0 ? (autoStats.tests.ok / autoStats.tests.total) * 100 : 0}%`,
                  backgroundColor: autoStats.tests.ok === autoStats.tests.total && autoStats.tests.total > 0 ? "#22c55e" : "#f59e0b",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contexte + KPIs */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <SectionHeader
          title="Contexte"
          isOwner={isOwner}
          onAdd={() => openCreate("Ajouter un KPI", kpiFields, "kpis")}
        />
        <p className="text-sm text-[#475569] leading-relaxed">
          {project.contextSummary}
        </p>

        {project.kpis.length === 0 ? (
          <div className="mt-4">
            <EmptyState label="KPI" isOwner={isOwner} onAdd={() => openCreate("Ajouter un KPI", kpiFields, "kpis")} />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {project.kpis.map((kpi: any) => (
              <div
                key={kpi.id}
                className="bg-[#f1f5f9] rounded p-3 text-center relative group"
              >
                {isOwner && (
                  <ItemActions
                    onEdit={() => openEdit("Modifier le KPI", kpiFields, "kpis", kpi)}
                    onDelete={() => {
                      openEdit("Modifier le KPI", kpiFields, "kpis", kpi);
                    }}
                  />
                )}
                <div className="text-2xl font-bold" style={{ color: kpi.color }}>
                  {kpi.value}
                </div>
                <div className="text-xs text-[#64748b]">{kpi.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stack technique */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <SectionHeader
          title="Stack technique retenue"
          isOwner={isOwner}
          onAdd={() => openCreate("Ajouter une technologie", stackFields, "stack-items")}
        />
        {project.stackItems.length === 0 ? (
          <EmptyState label="technologie" isOwner={isOwner} onAdd={() => openCreate("Ajouter une technologie", stackFields, "stack-items")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.stackItems.map((tech: any) => (
              <div key={tech.id} className="bg-[#f1f5f9] rounded-lg p-4 relative group">
                {isOwner && (
                  <ItemActions
                    onEdit={() => openEdit("Modifier la technologie", stackFields, "stack-items", tech)}
                    onDelete={() => openEdit("Modifier la technologie", stackFields, "stack-items", tech)}
                  />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-lg font-bold"
                    style={{ color: tech.tagColorText }}
                  >
                    {tech.name}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: tech.tagColorBg,
                      color: tech.tagColorText,
                    }}
                  >
                    {tech.tag}
                  </span>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Méthodologie */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-3">
          Méthodologie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dbeafe] text-[#3b82f6] text-xs font-bold">
                S
              </span>
              Framework {project.methodologyFramework}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {project.methodologyFrameworkDescription}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#fef3c7] text-[#f59e0b] text-xs font-bold">
                M
              </span>
              Priorisation {project.methodologyPrioritization}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {project.methodologyPrioritizationDescription}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { label: "Must Have", color: "#dc2626", desc: "Indispensable au MVP" },
                { label: "Should Have", color: "#f59e0b", desc: "Important, intégré si possible" },
                { label: "Could Have", color: "#3b82f6", desc: "Confort, si reste du budget" },
                { label: "Won't Have", color: "#64748b", desc: "Hors périmètre v1" },
              ].map((p) => (
                <div key={p.label} className="bg-[#f1f5f9] rounded p-2 text-center">
                  <div className="text-xs font-bold" style={{ color: p.color }}>
                    {p.label}
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phases du projet */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <SectionHeader
          title="Phases du projet"
          isOwner={isOwner}
          onAdd={() => openCreate("Ajouter une phase", phaseFields, "phases")}
        />
        {project.phases.length === 0 ? (
          <EmptyState label="phase" isOwner={isOwner} onAdd={() => openCreate("Ajouter une phase", phaseFields, "phases")} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {project.phases.map((phase: any, index: number) => (
                <div key={phase.id} className="relative group">
                  {isOwner && (
                    <ItemActions
                      onEdit={() => openEdit("Modifier la phase", phaseFields, "phases", phase)}
                      onDelete={() => openEdit("Modifier la phase", phaseFields, "phases", phase)}
                    />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: phase.color }}
                    >
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[#1e293b]">
                      {phase.title}
                    </span>
                  </div>
                  <div
                    className="text-xs font-medium mb-1 px-2 py-0.5 rounded-full inline-block text-white"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.periode}
                  </div>
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                    {phase.objectif}
                  </p>
                  {index < project.phases.length - 1 && (
                    <div className="hidden md:block absolute top-3.5 -right-2 text-[#cbd5e1] text-lg">
                      &rarr;
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-1 rounded-full overflow-hidden h-2">
              {project.phases.map((phase: any) => (
                <div
                  key={phase.id}
                  className="flex-1"
                  style={{ backgroundColor: phase.color }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Livrables */}
      <div className="mb-8">
        <SectionHeader
          title="Livrables du projet"
          isOwner={isOwner}
          onAdd={() => openCreate("Ajouter un livrable", deliverableFields, "deliverables")}
        />
        {project.deliverables.length === 0 ? (
          <EmptyState label="livrable" isOwner={isOwner} onAdd={() => openCreate("Ajouter un livrable", deliverableFields, "deliverables")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.deliverables.map((l: any) => (
              <Link
                key={l.id}
                href={l.href}
                className="bg-white rounded-lg border border-[#e2e8f0] p-5 hover:border-[#3b82f6] hover:shadow-md transition-all relative group"
              >
                {isOwner && (
                  <ItemActions
                    onEdit={() => openEdit("Modifier le livrable", deliverableFields, "deliverables", l)}
                    onDelete={() => openEdit("Modifier le livrable", deliverableFields, "deliverables", l)}
                  />
                )}
                <div className="text-xs font-medium text-[#3b82f6] mb-1">
                  {l.status}
                </div>
                <h3 className="font-semibold text-[#1e293b] mb-2">{l.title}</h3>
                <p className="text-sm text-[#64748b]">{l.desc}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Compétences */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
        <SectionHeader
          title="Compétences visées"
          isOwner={isOwner}
          onAdd={() => openCreate("Ajouter une compétence", skillFields, "skills")}
        />
        {project.skills.length === 0 ? (
          <EmptyState label="compétence" isOwner={isOwner} onAdd={() => openCreate("Ajouter une compétence", skillFields, "skills")} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {project.skills.map((c: any) => (
              <div
                key={c.id}
                className="flex items-start gap-2 text-sm text-[#475569] relative group pr-16"
              >
                <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                <span>{c.name}</span>
                {isOwner && (
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={() => openEdit("Modifier la compétence", skillFields, "skills", c)}
                      className="p-1 rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit("Modifier la compétence", skillFields, "skills", c)}
                      className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <ActivityFeed projectId={project.id} />

      {/* CRUD Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        fields={modalFields}
        initialData={modalInitialData}
        onSubmit={modalOnSubmit}
        onDelete={modalOnDelete}
      />
    </div>
  );
}
