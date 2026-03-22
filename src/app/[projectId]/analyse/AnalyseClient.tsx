"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";
import AiGenerateButton from "@/components/AiGenerateButton";

interface Persona {
  id: number;
  initials: string;
  nom: string;
  age: number;
  role: string;
  contexte: string;
  besoinPrincipal: string;
  frustration: string;
  objectif: string;
  order: number;
}

const PERSONA_COLORS = [
  { bg: "bg-[#dbeafe]", text: "text-[#2563eb]" },
  { bg: "bg-[#fce7f3]", text: "text-[#db2777]" },
  { bg: "bg-[#d1fae5]", text: "text-[#059669]" },
  { bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
  { bg: "bg-[#e0e7ff]", text: "text-[#4f46e5]" },
];

const personaFields: FieldConfig[] = [
  { name: "initials", label: "Initiales", type: "text", required: true },
  { name: "nom", label: "Nom", type: "text", required: true },
  { name: "age", label: "Age", type: "number", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "contexte", label: "Contexte", type: "textarea" },
  { name: "besoinPrincipal", label: "Besoin principal", type: "textarea" },
  { name: "frustration", label: "Frustration", type: "textarea" },
  { name: "objectif", label: "Objectif", type: "textarea" },
];

export default function AnalyseClient({
  personas,
  isOwner,
  projectName,
}: {
  personas: Persona[];
  isOwner: boolean;
  projectName: string;
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
  const [templateOpen, setTemplateOpen] = useState(false);

  async function apiPost(data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/personas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la creation");
    router.refresh();
  }

  async function apiPatch(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/personas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    router.refresh();
  }

  async function apiDeletePersona(id: number) {
    const res = await fetch(`${apiBase}/personas/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  }

  function openCreate() {
    setModalTitle("Ajouter un persona");
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPost(data);
    });
    setModalOpen(true);
  }

  function openEdit(persona: Persona) {
    setModalTitle("Modifier le persona");
    setModalInitialData({ ...persona });
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatch(persona.id, data);
    });
    setModalOnDelete(() => async () => {
      await apiDeletePersona(persona.id);
    });
    setModalOpen(true);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Analyse des retours client
        </h1>
        <p className="text-[#64748b] mt-2">
          Synthèse des retours client et analyse
        </p>
      </div>

      {/* Document metadata */}
      <div className="bg-[#f1f5f9] rounded-lg px-4 py-2 mb-6 flex items-center gap-3 text-xs text-[#475569]">
        <span className="font-semibold text-[#334155]">Version 1.2</span>
        <span className="text-[#cbd5e1]">|</span>
        <span>Derniere mise a jour : 4 mars 2026</span>
        <span className="text-[#cbd5e1]">|</span>
        <span>Auteur : {projectName}</span>
      </div>

      {/* Personas section — from DB */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-[#1e293b]">
            Personas utilisateurs
          </h2>
          {isOwner && (
            <div className="flex items-center gap-2">
              <AiGenerateButton
                type="analyse"
                projectId={projectId}
                label="Analyser les retours"
                onGenerated={async (items) => {
                  for (const item of items) {
                    await fetch(`${apiBase}/personas`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(item),
                    });
                  }
                  router.refresh();
                }}
              />
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                + Persona
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-[#64748b] mb-4">
          Profils types representatifs des futurs utilisateurs du projet, construits a partir des entretiens et du questionnaire.
        </p>

        {personas.length === 0 ? (
          <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-8 text-center">
            <p className="text-[#64748b] text-lg mb-2">Aucun persona</p>
            <p className="text-[#94a3b8] text-sm">
              {isOwner
                ? "Ajoutez-en ou generez-les avec l'IA."
                : "Les personas n'ont pas encore ete configures."}
            </p>
            {isOwner && (
              <button
                onClick={openCreate}
                className="mt-4 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                + Persona
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {personas.map((persona, i) => {
              const color = PERSONA_COLORS[i % PERSONA_COLORS.length];
              return (
                <div key={persona.id} className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-5 relative">
                  {isOwner && (
                    <button
                      onClick={() => openEdit(persona)}
                      className="absolute top-3 right-3 text-xs text-[#3b82f6] hover:text-[#2563eb] bg-white px-2 py-1 rounded border border-[#e2e8f0] hover:border-[#3b82f6] transition-colors"
                    >
                      Modifier
                    </button>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full ${color.bg} flex items-center justify-center text-xl font-bold ${color.text}`}>
                      {persona.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1e293b]">{persona.nom}</p>
                      <p className="text-xs text-[#64748b]">{persona.age} ans — {persona.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-[#334155]">Contexte : </span>
                      <span className="text-[#475569]">{persona.contexte}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#334155]">Besoin principal : </span>
                      <span className="text-[#475569]">{persona.besoinPrincipal}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#dc2626]">Frustration : </span>
                      <span className="text-[#475569]">{persona.frustration}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#166534]">Objectif : </span>
                      <span className="text-[#475569]">{persona.objectif}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide d'analyse — collapsible */}
      <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] mb-6 overflow-hidden">
        <button
          onClick={() => setTemplateOpen(!templateOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#f1f5f9] transition-colors text-left"
        >
          <div>
            <h2 className="text-base font-semibold text-[#475569] flex items-center gap-2">
              📖 Guide d&apos;analyse
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">Comment exploiter les retours du questionnaire client.</p>
          </div>
          <span className="text-[#94a3b8] text-sm">
            {templateOpen ? "Réduire" : "Déplier"}
          </span>
        </button>
        {templateOpen && (
          <div className="p-6 pt-2 space-y-4">
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
              <h3 className="font-semibold text-[#1e293b] mb-3">Étapes d&apos;analyse recommandées</h3>
              <div className="space-y-3 text-sm text-[#475569]">
                <div className="flex items-start gap-3">
                  <span className="bg-[#3b82f6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div>
                    <p className="font-medium text-[#1e293b]">Créer les personas</p>
                    <p>À partir des réponses au questionnaire, identifiez 3 à 5 profils types d&apos;utilisateurs avec leurs besoins, frustrations et objectifs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#8b5cf6] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div>
                    <p className="font-medium text-[#1e293b]">Synthétiser les besoins</p>
                    <p>Regroupez les réponses par thème : objectifs business, contraintes techniques, outils existants, attentes fonctionnelles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#f59e0b] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div>
                    <p className="font-medium text-[#1e293b]">Prioriser les fonctionnalités</p>
                    <p>Classez les fonctionnalités identifiées avec la méthode MoSCoW (Must/Should/Could/Won&apos;t) pour définir le périmètre du MVP.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#22c55e] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <div>
                    <p className="font-medium text-[#1e293b]">Transformer en User Stories</p>
                    <p>Chaque besoin priorisé devient une User Story dans le Product Backlog, estimée en story points.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
              <h3 className="font-semibold text-[#1e293b] mb-3">Modèle de persona</h3>
              <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0] text-sm text-[#64748b]">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-medium text-[#334155]">Nom :</span> Prénom + rôle métier</div>
                  <div><span className="font-medium text-[#334155]">Âge :</span> Tranche représentative</div>
                  <div><span className="font-medium text-[#334155]">Contexte :</span> Situation professionnelle</div>
                  <div><span className="font-medium text-[#334155]">Besoin principal :</span> Ce qu&apos;il cherche</div>
                  <div><span className="font-medium text-[#334155]">Frustration :</span> Ce qui le bloque aujourd&apos;hui</div>
                  <div><span className="font-medium text-[#334155]">Objectif :</span> Ce qu&apos;il veut atteindre</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        fields={personaFields}
        initialData={modalInitialData}
        onSubmit={modalOnSubmit}
        onDelete={modalOnDelete}
      />
    </div>
  );
}
