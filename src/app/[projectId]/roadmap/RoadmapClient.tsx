"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";
import AiGenerateButton from "@/components/AiGenerateButton";

interface Phase {
  id: number;
  phase: string;
  title: string;
  objectif: string;
  fonctionnalites: string[];
  horsPerimetre: string[];
  utilisateurs: string[];
  dependances: string[];
  ressources: string;
  periode: string;
  budget: string;
  color: string;
  bg: string;
  order: number;
}

const phaseFields: FieldConfig[] = [
  { name: "phase", label: "Phase", type: "text", required: true },
  { name: "title", label: "Titre", type: "text", required: true },
  { name: "objectif", label: "Objectif", type: "textarea" },
  { name: "fonctionnalites", label: "Fonctionnalites (separees par des virgules)", type: "textarea" },
  { name: "horsPerimetre", label: "Hors perimetre (separees par des virgules)", type: "textarea" },
  { name: "utilisateurs", label: "Utilisateurs (separes par des virgules)", type: "textarea" },
  { name: "dependances", label: "Dependances (separees par des virgules)", type: "textarea" },
  { name: "ressources", label: "Ressources", type: "text" },
  { name: "periode", label: "Periode", type: "text" },
  { name: "budget", label: "Budget", type: "text" },
  { name: "color", label: "Couleur bordure (classe CSS)", type: "text" },
  { name: "bg", label: "Couleur fond (classe CSS)", type: "text" },
];

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim()) return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function RoadmapClient({
  phases,
  isOwner,
}: {
  phases: Phase[];
  isOwner: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const apiBase = `/api/projects/${projectId}`;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalInitialData, setModalInitialData] = useState<Record<string, unknown> | undefined>();
  const [modalOnSubmit, setModalOnSubmit] = useState<(data: Record<string, unknown>) => Promise<void>>(() => async () => {});
  const [modalOnDelete, setModalOnDelete] = useState<(() => Promise<void>) | undefined>();

  async function apiPost(data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/phases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la creation");
    router.refresh();
  }

  async function apiPatch(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/phases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    router.refresh();
  }

  async function apiDeletePhase(id: number) {
    const res = await fetch(`${apiBase}/phases/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  }

  function prepareData(data: Record<string, unknown>) {
    return {
      ...data,
      fonctionnalites: toArray(data.fonctionnalites),
      horsPerimetre: toArray(data.horsPerimetre),
      utilisateurs: toArray(data.utilisateurs),
      dependances: toArray(data.dependances),
    };
  }

  function openCreate() {
    setModalTitle("Ajouter une phase");
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPost(prepareData(data));
    });
    setModalOpen(true);
  }

  function openEdit(phase: Phase) {
    setModalTitle("Modifier la phase");
    setModalInitialData({
      ...phase,
      fonctionnalites: phase.fonctionnalites.join(", "),
      horsPerimetre: phase.horsPerimetre.join(", "),
      utilisateurs: phase.utilisateurs.join(", "),
      dependances: phase.dependances.join(", "),
    });
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatch(phase.id, prepareData(data));
    });
    setModalOnDelete(() => async () => {
      await apiDeletePhase(phase.id);
    });
    setModalOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Roadmap produit</h1>
          <p className="text-[#64748b] mt-2">
            Planification des phases du projet
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <AiGenerateButton
              type="phases"
              projectId={projectId}
              label="Générer avec l'IA"
              hasExistingData={phases.length > 0}
              onClearExisting={async () => {
                for (const p of phases) {
                  await fetch(`/api/projects/${projectId}/phases/${p.id}`, { method: "DELETE" });
                }
                window.location.reload();
              }}
              onGenerated={async (items) => {
                for (const item of items) {
                  await fetch(`/api/projects/${projectId}/phases`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(item),
                  });
                }
                window.location.reload();
              }}
            />
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Phase
            </button>
          </div>
        )}
      </div>

      {phases.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-lg mb-2">Aucune phase definie</p>
          <p className="text-[#94a3b8] text-sm">Ajoutez vos phases de projet pour construire la roadmap.</p>
          {isOwner && (
            <button
              onClick={openCreate}
              className="mt-4 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Phase
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Timeline overview */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Vue d&apos;ensemble — {phases.length} phases</h2>
            <div className="flex gap-1">
              {phases.map((p, i) => {
                const colors = ["bg-[#64748b]", "bg-[#3b82f6]", "bg-[#8b5cf6]", "bg-[#f59e0b]", "bg-[#22c55e]", "bg-[#ec4899]", "bg-[#14b8a6]", "bg-[#f97316]"];
                return (
                  <div key={i} className={`flex-1 ${colors[i % colors.length]} rounded p-2 text-white text-xs text-center`}>
                    <div className="font-bold">{p.phase}</div>
                    <div className="opacity-80 truncate">{p.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail par phase */}
          <div className="space-y-4">
            {phases.map((p, i) => (
              <div key={i} className={`${p.bg} rounded-lg border border-[#e2e8f0] border-l-4 ${p.color} p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold text-[#64748b] uppercase">{p.phase}</span>
                    <h3 className="text-lg font-semibold text-[#1e293b]">{p.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1e293b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                      {p.budget}
                    </span>
                    <span className="text-sm text-[#64748b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                      {p.periode}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs text-[#3b82f6] hover:text-[#2563eb] bg-white px-3 py-1 rounded-full border border-[#e2e8f0] hover:border-[#3b82f6] transition-colors"
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#475569] mb-2">
                  <strong>Objectif :</strong> {p.objectif}
                </p>

                <p className="text-xs text-[#64748b] mb-4">
                  <strong>Ressources :</strong> {p.ressources}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#22c55e] uppercase mb-2">
                      Fonctionnalites livrees
                    </h4>
                    <ul className="space-y-1">
                      {p.fonctionnalites.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#475569]">
                          <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#ef4444] uppercase mb-2">
                        Hors perimetre
                      </h4>
                      <ul className="space-y-1">
                        {p.horsPerimetre.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                            <span className="text-[#ef4444] mt-0.5">&#10007;</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                        Utilisateurs concernes
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {p.utilisateurs.map((u, j) => (
                          <span key={j} className="text-xs bg-white px-2 py-0.5 rounded border border-[#e2e8f0] text-[#475569]">
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                        Dependances
                      </h4>
                      <p className="text-sm text-[#64748b]">{p.dependances[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        fields={phaseFields}
        initialData={modalInitialData}
        onSubmit={modalOnSubmit}
        onDelete={modalOnDelete}
      />
    </div>
  );
}
