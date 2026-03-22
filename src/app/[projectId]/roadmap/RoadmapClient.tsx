"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";

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
            Livrable 3 — Roadmap produit — Phases du projet
          </p>
        </div>
        {isOwner && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            + Phase
          </button>
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
            <h2 className="text-lg font-semibold mb-4">Vue d&apos;ensemble — 16 semaines</h2>
            <div className="flex gap-1">
              {phases.map((p, i) => {
                const widths = ["w-[12.5%]", "w-[18.75%]", "w-[18.75%]", "w-[12.5%]", "w-[18.75%]", "w-[18.75%]"];
                const colors = ["bg-[#64748b]", "bg-[#3b82f6]", "bg-[#8b5cf6]", "bg-[#f59e0b]", "bg-[#22c55e]", "bg-[#ec4899]"];
                return (
                  <div key={i} className={`${widths[i] || "flex-1"} ${colors[i] || "bg-[#3b82f6]"} rounded p-2 text-white text-xs text-center`}>
                    <div className="font-bold">{p.phase}</div>
                    <div className="opacity-80 truncate">{p.title}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-[#94a3b8] mt-2 px-1">
              <span>S1</span>
              <span>S4</span>
              <span>S8</span>
              <span>S12</span>
              <span>S16</span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-[#64748b]">
              <span className="inline-block w-3 h-3 bg-[#f59e0b] rounded-full"></span>
              <span>MVP livrable a S10 (fin Sprint 3) — Deploiement pilote 20 utilisateurs a M+4</span>
            </div>
          </div>

          {/* MVP Section */}
          <div className="bg-[#fffbeb] rounded-lg border-2 border-[#f59e0b] p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-[#f59e0b] text-white rounded-full font-bold text-lg">
                MVP
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#1e293b]">Perimetre du MVP — Fin Sprint 3 (Semaine 10)</h2>
                <p className="text-sm text-[#92400e]">Phase 0 + Sprint 1 + Sprint 2 + Sprint 3</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg border border-[#fde68a] p-4">
                <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">Modules inclus</h4>
                <ul className="space-y-1 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                    <span>Gestion clients et prospects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                    <span>Pipeline commercial Kanban</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                    <span>Taches et rappels</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-[#fde68a] p-4">
                <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">Objectifs de validation</h4>
                <ul className="space-y-1 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                    <span>20 utilisateurs pilotes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                    <span>Fonctionnalites core validees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                    <span>Budget MVP : 70 000 EUR</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-[#fde68a] p-4">
                <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">Pourquoi ce perimetre</h4>
                <p className="text-sm text-[#475569]">
                  Le MVP couvre les <strong>3 modules de priorite P1</strong> necessaires aux operations
                  commerciales quotidiennes. Ces fonctionnalites permettent aux commerciaux de gerer
                  leurs clients, suivre leurs opportunites et organiser leurs actions — le coeur de leur
                  activite journaliere.
                </p>
              </div>
            </div>
          </div>

          {/* Justification de l'ordre des sprints */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Justification de l&apos;ordre des sprints</h2>
            <p className="text-sm text-[#64748b] mb-4">
              L&apos;enchainement des sprints suit une logique de dependances techniques et de valeur metier decroissante.
            </p>
            <div className="space-y-3">
              {[
                { num: 1, color: "bg-[#3b82f6]", title: "Sprint 1 — Clients & Prospects", desc: "Couche de donnees fondamentale dont tous les autres modules dependent. Sans fiches clients, impossible de creer des opportunites, des taches ou des rapports." },
                { num: 2, color: "bg-[#8b5cf6]", title: "Sprint 2 — Pipeline commercial", desc: "Depend directement des donnees clients et constitue la priorite business n1. Le suivi des opportunites est le besoin le plus critique exprime par les commerciaux." },
                { num: 3, color: "bg-[#f59e0b]", title: "Sprint 3 — Taches & Rappels", desc: "Complete les outils de travail quotidien et permet d'atteindre le MVP. Les taches sont liees aux clients et aux opportunites, d'ou leur position apres les sprints 1-2." },
                { num: 4, color: "bg-[#22c55e]", title: "Sprint 4 — Tableau de bord & Reporting", desc: "Le reporting necessite que les donnees des sprints 1-3 existent pour etre pertinent. Sans volume de donnees, les dashboards seraient vides et inutiles." },
                { num: 5, color: "bg-[#ec4899]", title: "Sprint 5 — Integrations & Migration", desc: "Techniquement le plus complexe et non bloquant pour l'usage quotidien. Les integrations enrichissent l'experience mais ne sont pas indispensables au fonctionnement de base du projet." },
              ].map((s) => (
                <div key={s.num} className="flex items-start gap-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 ${s.color} text-white rounded-full font-bold text-xs shrink-0`}>{s.num}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1e293b]">{s.title}</p>
                    <p className="text-sm text-[#64748b]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan de contingence */}
          <div className="bg-[#fef2f2] rounded-lg border border-[#fecaca] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Plan de contingence (Plan B)</h2>
            <p className="text-sm text-[#64748b] mb-4">Strategies de repli en cas de risques identifies</p>
            <div className="space-y-3">
              {[
                { risk: "Sprint 1 prend plus de temps que prevu", plan: "Reduire le perimetre du Sprint 2 — differer le drag & drop Kanban et se concentrer sur une vue liste fonctionnelle." },
                { risk: "APIs d'integration indisponibles (Outlook, Zendesk, HubSpot)", plan: "Mettre en place un import manuel via fichiers CSV comme solution de repli." },
                { risk: "Faible adoption lors du pilote", plan: "Prolonger la phase pilote de 2 a 4 semaines supplementaires et organiser des sessions de formation dediees par equipe." },
              ].map((r, i) => (
                <div key={i} className="bg-white rounded-lg border border-[#fecaca] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded">RISQUE</span>
                    <p className="text-sm font-semibold text-[#1e293b]">{r.risk}</p>
                  </div>
                  <p className="text-sm text-[#64748b]"><strong>Plan B :</strong> {r.plan}</p>
                </div>
              ))}
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
