"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";

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
          Livrable 2 — Synthese structuree des reponses client et de la maquette Figma
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
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Persona
            </button>
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

      {/* Template d'exemple — collapsible */}
      <div className="bg-[#fffbeb] rounded-lg border border-[#fde68a] mb-6 overflow-hidden">
        <button
          onClick={() => setTemplateOpen(!templateOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#fef3c7] transition-colors text-left"
        >
          <div>
            <h2 className="text-base font-semibold text-[#92400e] flex items-center gap-2">
              Template d&apos;exemple
            </h2>
            <p className="text-xs text-[#b45309] mt-0.5">Ces donnees sont des exemples. Modifiez-les selon votre projet.</p>
          </div>
          <span className="text-[#b45309] text-sm">
            {templateOpen ? "Reduire" : "Deplier"}
          </span>
        </button>
        {templateOpen && (
          <div className="p-6 pt-2 space-y-6">
            {/* Retours fictifs */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#1e293b]">Retours client fictifs recus</h2>
                  <p className="text-sm text-[#64748b] mt-1">
                    Cette section simule des retours recueillis apres envoi du questionnaire pour illustrer la demarche d&apos;analyse.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-[#eff6ff] text-[#1d4ed8] px-2 py-1 rounded">
                  Donnees simulees - Exercice P11
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                  <p className="text-xs text-[#64748b] mb-1">Priorites citees</p>
                  <p className="text-2xl font-bold text-[#1e293b]">63%</p>
                  <p className="text-xs text-[#475569]">des retours orientent le Sprint 1 sur la centralisation client.</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                  <p className="text-xs text-[#64748b] mb-1">Satisfaction percue (avant projet)</p>
                  <p className="text-2xl font-bold text-[#1e293b]">2.4 / 5</p>
                  <p className="text-xs text-[#475569]">sur les outils actuels (Excel + email + notes).</p>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                  <p className="text-xs text-[#64748b] mb-1">Irritants frequents</p>
                  <p className="text-2xl font-bold text-[#1e293b]">71%</p>
                  <p className="text-xs text-[#475569]">signalent pertes d&apos;information et doublons de suivi.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                  <h3 className="font-semibold text-[#334155] text-sm mb-2">Synthese qualitative</h3>
                  <ul className="space-y-2 text-sm text-[#475569]">
                    <li>&ldquo;On perd du temps a reconstruire le contexte d&apos;un client avant chaque appel.&rdquo;</li>
                    <li>&ldquo;Le pipeline actuel est incomplet, impossible de fiabiliser le forecast.&rdquo;</li>
                    <li>&ldquo;On veut une interface simple, utilisable sans formation longue.&rdquo;</li>
                  </ul>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                  <h3 className="font-semibold text-[#334155] text-sm mb-2">Besoins non couverts identifies</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#475569]">
                    <li>Historique unifie (emails, appels, reunions) visible en un ecran.</li>
                    <li>Rappels de relance automatiques sur les opportunites inactives.</li>
                    <li>Vue manager avec indicateurs de conversion par commercial.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
                <h3 className="font-semibold text-[#166534] text-sm mb-2">Decisions prises suite aux retours</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#166534]">
                  <li>Maintien du module Clients en priorite absolue sur le Sprint 1.</li>
                  <li>Ajout d&apos;un critere d&apos;acceptation sur la fiabilite du pipeline (mise a jour en temps reel).</li>
                  <li>Renforcement des scenarios de recette sur recherche, doublons et historique.</li>
                </ul>
              </div>
            </div>

            {/* Contexte et objectifs */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
                Contexte et objectifs du client
              </h2>
              <div className="space-y-3 text-sm text-[#475569]">
                <p>
                  <strong>Societe :</strong> Client — Services B2B, accompagnement des
                  PME dans l&apos;adoption d&apos;outils digitaux.
                </p>
                <p>
                  <strong>Probleme actuel :</strong> Donnees clients dispersees entre
                  Excel, emails et carnets personnels. Perte d&apos;informations, manque de
                  visibilite, collaboration difficile.
                </p>
                <div className="bg-[#f1f5f9] rounded-lg p-4 mt-3">
                  <h3 className="font-medium text-[#334155] mb-2">Objectifs confirmes par le client</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Centraliser toutes les donnees clients/prospects dans un seul outil</li>
                    <li>Structurer et standardiser les processus de vente et de suivi</li>
                    <li>Ameliorer la collaboration entre commerciaux, support et direction</li>
                    <li>Donner de la visibilite au management via des tableaux de bord temps reel</li>
                    <li>Favoriser l&apos;adoption avec un outil simple, intuitif et accessible</li>
                  </ul>
                </div>
                <div className="bg-[#f0fdf4] rounded-lg p-4 mt-3">
                  <h3 className="font-medium text-[#166534] mb-2">Criteres de succes</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#166534]">
                    <li>90% d&apos;utilisateurs actifs dans les 3 mois suivant le deploiement</li>
                    <li>Pipeline commercial tenu a jour a 95% en temps reel</li>
                    <li>Reduction de 30% du temps de preparation des comites commerciaux</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Utilisateurs */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
                Utilisateurs concernes — 21 personnes
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 px-4 font-medium text-[#64748b]">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-[#64748b]">Effectif</th>
                      <th className="text-left py-3 px-4 font-medium text-[#64748b]">Responsabilites</th>
                      <th className="text-left py-3 px-4 font-medium text-[#64748b]">Besoins CRM</th>
                      <th className="text-left py-3 px-4 font-medium text-[#64748b]">Droits d&apos;acces</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#f1f5f9]">
                      <td className="py-3 px-4 font-medium">Commerciaux</td>
                      <td className="py-3 px-4">10</td>
                      <td className="py-3 px-4">Prospection, suivi des opportunites, relances</td>
                      <td className="py-3 px-4">Fiches prospects, pipeline, rappels</td>
                      <td className="py-3 px-4">Acces a leurs comptes et opportunites</td>
                    </tr>
                    <tr className="border-b border-[#f1f5f9]">
                      <td className="py-3 px-4 font-medium">Account Managers</td>
                      <td className="py-3 px-4">5</td>
                      <td className="py-3 px-4">Suivi satisfaction, renouvellements, upsell, onboarding</td>
                      <td className="py-3 px-4">Historique client, satisfaction, contrats</td>
                      <td className="py-3 px-4">Vision consolidee de leur equipe</td>
                    </tr>
                    <tr className="border-b border-[#f1f5f9]">
                      <td className="py-3 px-4 font-medium">Support client</td>
                      <td className="py-3 px-4">4</td>
                      <td className="py-3 px-4">Reponse aux problemes/questions clients</td>
                      <td className="py-3 px-4">Acces rapide a l&apos;historique client</td>
                      <td className="py-3 px-4">Acces partiel selon besoin</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Direction</td>
                      <td className="py-3 px-4">2</td>
                      <td className="py-3 px-4">Pilotage global, previsions, objectifs</td>
                      <td className="py-3 px-4">Tableaux de bord, KPIs, rapports</td>
                      <td className="py-3 px-4">Vision globale</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fonctionnalites */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
                Fonctionnalites attendues (par priorite)
              </h2>
              <div className="space-y-4">
                {[
                  { priority: "P1", color: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]", title: "Gestion des donnees clients", items: ["Fiches comptes et contacts", "Deduplication et recherche avancee", "Historique complet des interactions"] },
                  { priority: "P1", color: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]", title: "Pipeline des opportunites", items: ["Pipeline visuel Kanban", "Probabilite de closing par etape", "Relances et rappels configurables"] },
                  { priority: "P2", color: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]", title: "Activites et taches", items: ["Creation de taches et rappels automatiques", "Notifications email et push mobile", "Synchronisation bidirectionnelle avec Outlook"] },
                  { priority: "P2", color: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]", title: "Reporting et tableaux de bord", items: ["Tableau de bord commercial : CA, opportunites, taux de conversion", "Reporting activite par commercial", "Forecast mensuel consolide, exports CSV/Excel"] },
                  { priority: "P3", color: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]", title: "Integrations externes", items: ["Outlook", "Outil de facturation interne", "Zendesk", "HubSpot"] },
                  { priority: "P3", color: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]", title: "Securite et conformite", items: ["Authentification SSO", "Droits par role", "Sauvegardes quotidiennes", "Conformite RGPD"] },
                ].map((f, i) => (
                  <div key={i} className={`rounded-lg border p-4 ${f.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-current/10">{f.priority}</span>
                      <h3 className="font-semibold">{f.title}</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm opacity-80">
                      {f.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraintes */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Contraintes et planning</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f1f5f9] rounded-lg p-4">
                  <h3 className="font-medium text-[#334155] text-sm mb-2">Budget</h3>
                  <p className="text-2xl font-bold text-[#1e293b]">120 000 EUR</p>
                  <p className="text-xs text-[#64748b]">Licences + deploiement + formation</p>
                </div>
                <div className="bg-[#f1f5f9] rounded-lg p-4">
                  <h3 className="font-medium text-[#334155] text-sm mb-2">Planning</h3>
                  <div className="space-y-1 text-sm text-[#475569]">
                    <p>Phase de cadrage : 1 mois</p>
                    <p>Dev & config MVP : 3 mois</p>
                    <p>Deploiement pilote (20 users) : M+4</p>
                    <p>Generalisation : M+6</p>
                  </div>
                </div>
                <div className="bg-[#f1f5f9] rounded-lg p-4">
                  <h3 className="font-medium text-[#334155] text-sm mb-2">Migration</h3>
                  <div className="space-y-1 text-sm text-[#475569]">
                    <p>~2 500 comptes clients/prospects</p>
                    <p>~10 000 contacts a importer</p>
                    <p>Sources : Excel, Outlook, ERP</p>
                    <p>Historique 2 dernieres annees</p>
                  </div>
                </div>
                <div className="bg-[#f1f5f9] rounded-lg p-4">
                  <h3 className="font-medium text-[#334155] text-sm mb-2">Ressources</h3>
                  <div className="space-y-1 text-sm text-[#475569]">
                    <p>1 sponsor : Directeur commercial</p>
                    <p>1 chef de projet IT (temps partiel)</p>
                    <p>1 referent metier par equipe</p>
                    <p>Accompagnement externe attendu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risques */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Risques et points d&apos;attention</h2>
              <div className="space-y-3">
                {[
                  { risk: "Adoption par les utilisateurs", mitigation: "Prevoir une conduite du changement, formation, et un outil simple/intuitif.", level: "Eleve", color: "text-[#dc2626]" },
                  { risk: "Qualite des donnees sources", mitigation: "Nettoyage prevu avant import. Deduplication et normalisation necessaires.", level: "Moyen", color: "text-[#ea580c]" },
                  { risk: "Gestion des integrations techniques", mitigation: "Valider les APIs disponibles (Outlook, Zendesk, HubSpot) en amont.", level: "Moyen", color: "text-[#ea580c]" },
                  { risk: "Surcharge fonctionnelle", mitigation: "Rester simple et utilisable. Ne pas alourdir l'outil.", level: "Faible", color: "text-[#0284c7]" },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-4 bg-[#f8fafc] rounded-lg p-4">
                    <span className={`text-xs font-bold ${r.color} whitespace-nowrap mt-0.5`}>{r.level}</span>
                    <div>
                      <p className="font-medium text-sm text-[#334155]">{r.risk}</p>
                      <p className="text-sm text-[#64748b]">{r.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decisions validees vs a confirmer */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Decisions validees vs a confirmer</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-5">
                  <h3 className="font-semibold text-[#166534] mb-3 flex items-center gap-2">
                    <span>&#9989;</span> Decisions validees
                  </h3>
                  <div className="space-y-2 text-sm text-[#166534]">
                    {["Stack technique retenue : WeWeb (front) + Xano (back + BDD)", "Authentification SSO via Outlook confirmee", "Pipeline Kanban en 5 etapes valide avec le client", "Hebergement Europe (conformite RGPD) valide", "21 utilisateurs repartis en 4 roles avec droits differencies", "Budget global de 120 000 EUR approuve par la direction"].map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">&#10003;</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#fffbeb] rounded-lg border border-[#fde68a] p-5">
                  <h3 className="font-semibold text-[#92400e] mb-3 flex items-center gap-2">
                    <span>&#9888;&#65039;</span> Points a confirmer
                  </h3>
                  <div className="space-y-2 text-sm text-[#92400e]">
                    {["Niveau de detail des rapports attendus", "Gestion documentaire (contrats, propositions)", "Detail du workflow d'onboarding client", "Processus exact de qualification des leads", "Priorite des integrations (Zendesk vs HubSpot)", "Niveau de personnalisation des vues par role", "Frequence et format des sauvegardes", "Plan de formation des equipes"].map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">&#9888;</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Matrice Impact / Effort */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-2">Matrice Impact / Effort — Priorisation des fonctionnalites</h2>
              <p className="text-sm text-[#64748b] mb-4">Classification des fonctionnalites identifiees selon leur impact business et l&apos;effort de mise en oeuvre.</p>
              <div className="grid grid-cols-2 gap-0 border border-[#e2e8f0] rounded-lg overflow-hidden">
                <div className="col-span-2 flex items-center justify-center bg-[#f1f5f9] py-2 border-b border-[#e2e8f0]">
                  <span className="text-xs font-semibold text-[#475569] tracking-wide uppercase">Effort faible &larr;&nbsp;&nbsp;&nbsp;&nbsp;&rarr; Effort eleve</span>
                </div>
                <div className="bg-[#f0fdf4] p-5 border-r border-b border-[#e2e8f0]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span>
                    <h3 className="font-semibold text-[#166534] text-sm">Quick Wins</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-[#166534]">
                    <li>Fiches clients & recherche</li>
                    <li>Pipeline Kanban</li>
                    <li>Filtres et tri</li>
                  </ul>
                </div>
                <div className="bg-[#fff7ed] p-5 border-b border-[#e2e8f0]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#f97316]"></span>
                    <h3 className="font-semibold text-[#9a3412] text-sm">Projets strategiques</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-[#9a3412]">
                    <li>Integrations Outlook</li>
                    <li>Tableau de bord & KPIs</li>
                    <li>Migration donnees</li>
                  </ul>
                </div>
                <div className="bg-[#f0f9ff] p-5 border-r border-[#e2e8f0]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                    <h3 className="font-semibold text-[#1e40af] text-sm">Bonus rapides</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-[#1e40af]">
                    <li>Export CSV</li>
                    <li>Tags et labels personnalises</li>
                  </ul>
                </div>
                <div className="bg-[#f8fafc] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#94a3b8]"></span>
                    <h3 className="font-semibold text-[#475569] text-sm">A eviter / reporter</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-[#475569]">
                    <li>BI avancee</li>
                    <li>Integration SAP</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tracabilite */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-2">Tracabilite Questionnaire &rarr; Analyse</h2>
              <p className="text-sm text-[#64748b] mb-4">Correspondance entre les questions posees lors du recueil des besoins et les decisions d&apos;analyse qui en decoulent.</p>
              <div className="space-y-3">
                {[
                  { question: "Q1.3", label: "Volume de clients/prospects geres", response: "~2 500 comptes, ~10 000 contacts", decision: "Dimensionnement BDD", color: "bg-[#f0f9ff] border-[#bae6fd]" },
                  { question: "Q2.2", label: "Difficultes actuelles dans le suivi client", response: "Donnees dispersees (Excel, emails, carnets)", decision: "Priorite P1 sur la centralisation des donnees", color: "bg-[#fef2f2] border-[#fecaca]" },
                  { question: "Q3.4", label: "Echelle de priorisation des fonctionnalites", response: "Pipeline Kanban note 9/10, Fiches clients 10/10", decision: "Priorisation MoSCoW : Pipeline Kanban = Must Have", color: "bg-[#f0fdf4] border-[#bbf7d0]" },
                  { question: "Q4.1", label: "Budget et contraintes financieres", response: "120 000 EUR tout compris", decision: "Choix stack low-code (WeWeb + Xano)", color: "bg-[#fff7ed] border-[#fed7aa]" },
                  { question: "Q4.5", label: "Exigences RGPD et securite des donnees", response: "Conformite RGPD obligatoire, donnees sensibles", decision: "Hebergement Europe, conformite RGPD", color: "bg-[#faf5ff] border-[#e9d5ff]" },
                ].map((item, i) => (
                  <div key={i} className={`rounded-lg border p-4 ${item.color}`}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-[45%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-[#1e293b] text-white px-2 py-0.5 rounded">{item.question}</span>
                          <span className="text-sm font-medium text-[#334155]">{item.label}</span>
                        </div>
                        <p className="text-xs text-[#64748b] italic ml-1">Reponse : &ldquo;{item.response}&rdquo;</p>
                      </div>
                      <div className="shrink-0 flex items-center justify-center text-xl text-[#94a3b8] font-bold mt-1">&rarr;</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#334155] mb-1">{item.decision}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maquette Figma */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Maquette Figma — Captures annotees</h2>
              <p className="text-sm text-[#64748b] mb-4">Captures ecran de la maquette Figma, annotees pour le developpement.</p>
              <div className="grid grid-cols-2 gap-4">
                {["Vue liste clients", "Fiche client detaillee", "Pipeline Kanban", "Tableau de bord"].map((title, i) => (
                  <div key={i} className="border-2 border-[#cbd5e1] rounded-lg bg-[#f8fafc] overflow-hidden">
                    <div className="bg-[#e2e8f0] px-4 py-2 border-b border-[#cbd5e1]">
                      <p className="text-sm font-semibold text-[#334155]">Capture {i + 1} — {title}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[#94a3b8] italic">Wireframe disponible dans la maquette Figma.</p>
                    </div>
                  </div>
                ))}
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
