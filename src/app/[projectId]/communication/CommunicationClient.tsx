"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";

interface Stakeholder {
  id: number;
  nom: string;
  role: string;
  implication: string;
  canal: string;
  order: number;
}

interface Ritual {
  id: number;
  rituel: string;
  frequence: string;
  participants: string;
  objectif: string;
  format: string;
  livrable: string;
  order: number;
}

const stakeholderFields: FieldConfig[] = [
  { name: "nom", label: "Nom", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "implication", label: "Implication", type: "select", options: ["Haute", "Moyenne", "Faible"], required: true },
  { name: "canal", label: "Canal prefere", type: "text" },
];

const ritualFields: FieldConfig[] = [
  { name: "rituel", label: "Rituel", type: "text", required: true },
  { name: "frequence", label: "Frequence", type: "text", required: true },
  { name: "participants", label: "Participants", type: "text" },
  { name: "objectif", label: "Objectif", type: "textarea" },
  { name: "format", label: "Format", type: "text" },
  { name: "livrable", label: "Livrable", type: "text" },
];

export default function CommunicationClient({
  stakeholders,
  rituals,
  isOwner,
  projectName,
}: {
  stakeholders: Stakeholder[];
  rituals: Ritual[];
  isOwner: boolean;
  projectName: string;
}) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const apiBase = `/api/projects/${projectId}`;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalInitialData, setModalInitialData] = useState<Record<string, unknown> | undefined>();
  const [modalOnSubmit, setModalOnSubmit] = useState<(data: Record<string, unknown>) => Promise<void>>(() => async () => {});
  const [modalOnDelete, setModalOnDelete] = useState<(() => Promise<void>) | undefined>();
  const [templateOpen, setTemplateOpen] = useState(false);

  async function apiPost(endpoint: string, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la creation");
    router.refresh();
  }

  async function apiPatch(endpoint: string, id: number, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    router.refresh();
  }

  async function apiDeleteItem(endpoint: string, id: number) {
    const res = await fetch(`${apiBase}/${endpoint}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  }

  function openCreateStakeholder() {
    setModalTitle("Ajouter une partie prenante");
    setModalFields(stakeholderFields);
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPost("stakeholders", data);
    });
    setModalOpen(true);
  }

  function openEditStakeholder(s: Stakeholder) {
    setModalTitle("Modifier la partie prenante");
    setModalFields(stakeholderFields);
    setModalInitialData({ ...s });
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatch("stakeholders", s.id, data);
    });
    setModalOnDelete(() => async () => {
      await apiDeleteItem("stakeholders", s.id);
    });
    setModalOpen(true);
  }

  function openCreateRitual() {
    setModalTitle("Ajouter un rituel");
    setModalFields(ritualFields);
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPost("rituals", data);
    });
    setModalOpen(true);
  }

  function openEditRitual(r: Ritual) {
    setModalTitle("Modifier le rituel");
    setModalFields(ritualFields);
    setModalInitialData({ ...r });
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatch("rituals", r.id, data);
    });
    setModalOnDelete(() => async () => {
      await apiDeleteItem("rituals", r.id);
    });
    setModalOpen(true);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Plan de communication client
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 7 — Organisation du suivi professionnel avec le client tout au long du projet
        </p>
      </div>

      {/* Parties prenantes */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1e293b]">
            Parties prenantes
          </h2>
          {isOwner && (
            <button
              onClick={openCreateStakeholder}
              className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Partie prenante
            </button>
          )}
        </div>

        {stakeholders.length === 0 ? (
          <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-8 text-center">
            <p className="text-[#64748b] text-lg mb-2">Aucune partie prenante</p>
            <p className="text-[#94a3b8] text-sm">Ajoutez les parties prenantes de votre projet.</p>
            {isOwner && (
              <button
                onClick={openCreateStakeholder}
                className="mt-4 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                + Partie prenante
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="text-left py-3 px-4 font-medium text-[#64748b]">Partie prenante</th>
                  <th className="text-left py-3 px-4 font-medium text-[#64748b]">Role dans le projet</th>
                  <th className="text-left py-3 px-4 font-medium text-[#64748b]">Implication</th>
                  <th className="text-left py-3 px-4 font-medium text-[#64748b]">Canal prefere</th>
                  {isOwner && <th className="text-right py-3 px-4 font-medium text-[#64748b]">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {stakeholders.map((p) => (
                  <tr key={p.id} className="border-b border-[#f1f5f9]">
                    <td className="py-3 px-4 font-medium text-[#334155]">{p.nom}</td>
                    <td className="py-3 px-4 text-[#475569]">{p.role}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        p.implication === "Haute"
                          ? "bg-[#fef2f2] text-[#dc2626]"
                          : p.implication === "Moyenne"
                          ? "bg-[#fff7ed] text-[#ea580c]"
                          : "bg-[#f0f9ff] text-[#0284c7]"
                      }`}>
                        {p.implication}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">{p.canal}</td>
                    {isOwner && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openEditStakeholder(p)}
                          className="text-xs text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                        >
                          Modifier
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rituels de communication */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1e293b]">
            Rituels de communication
          </h2>
          {isOwner && (
            <button
              onClick={openCreateRitual}
              className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Rituel
            </button>
          )}
        </div>

        {rituals.length === 0 ? (
          <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-8 text-center">
            <p className="text-[#64748b] text-lg mb-2">Aucun rituel de communication</p>
            <p className="text-[#94a3b8] text-sm">Ajoutez les rituels de communication de votre projet.</p>
            {isOwner && (
              <button
                onClick={openCreateRitual}
                className="mt-4 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                + Rituel
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {rituals.map((r) => (
              <div key={r.id} className="bg-[#f8fafc] rounded-lg p-5 relative">
                {isOwner && (
                  <button
                    onClick={() => openEditRitual(r)}
                    className="absolute top-3 right-3 text-xs text-[#3b82f6] hover:text-[#2563eb] bg-white px-2 py-1 rounded border border-[#e2e8f0] hover:border-[#3b82f6] transition-colors"
                  >
                    Modifier
                  </button>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#334155]">{r.rituel}</h3>
                  <span className="text-xs bg-[#eff6ff] text-[#3b82f6] px-3 py-1 rounded-full font-medium">
                    {r.frequence}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-bold text-[#64748b] uppercase">Participants</span>
                    <p className="text-[#475569] mt-1">{r.participants}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#64748b] uppercase">Format</span>
                    <p className="text-[#475569] mt-1">{r.format}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#64748b] uppercase">Objectif</span>
                    <p className="text-[#475569] mt-1">{r.objectif}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#64748b] uppercase">Livrable</span>
                    <p className="text-[#475569] mt-1">{r.livrable}</p>
                  </div>
                </div>
              </div>
            ))}
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
            {/* Canaux de communication */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Canaux de communication</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { canal: "Email", usage: "Communication formelle, comptes-rendus, validations, partage de documents.", regle: `Reponse sous 24h ouvrables. Objet clair avec prefixe [Projet].` },
                  { canal: "Teams / Slack", usage: "Echanges rapides, questions ponctuelles, partage de liens, coordination quotidienne.", regle: "Canal dedie au projet. Pas de decisions importantes par chat." },
                  { canal: "Visio (Teams / Google Meet)", usage: "Points hebdo, sprint reviews, sprint planning, comites de pilotage.", regle: "Invitation envoyee 48h a l'avance avec ordre du jour." },
                  { canal: "Outil de gestion de projet (Notion)", usage: "Suivi du backlog, roadmap, documentation technique, base de connaissances.", regle: "Source de verite unique pour le suivi de projet. Mis a jour en continu." },
                ].map((c, i) => (
                  <div key={i} className="bg-[#f8fafc] rounded-lg p-4">
                    <h3 className="font-semibold text-[#334155] mb-2">{c.canal}</h3>
                    <p className="text-sm text-[#475569] mb-2">{c.usage}</p>
                    <p className="text-xs text-[#64748b] italic">{c.regle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gestion des escalades */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Gestion des escalades</h2>
              <div className="space-y-3">
                {[
                  { niveau: "Niveau 1", type: "Blocage operationnel", action: "Point direct avec le Chef de projet IT via Teams/Slack.", delai: "Resolution sous 24h", color: "border-l-[#22c55e]" },
                  { niveau: "Niveau 2", type: "Blocage fonctionnel ou decision metier", action: "Reunion d'arbitrage avec le Chef de projet IT + Referent metier concerne.", delai: "Resolution sous 48h", color: "border-l-[#f59e0b]" },
                  { niveau: "Niveau 3", type: "Blocage strategique ou budgetaire", action: "Escalade au Sponsor (Directeur commercial). Reunion exceptionnelle si necessaire.", delai: "Resolution sous 1 semaine", color: "border-l-[#ef4444]" },
                ].map((e, i) => (
                  <div key={i} className={`bg-[#f8fafc] rounded-lg border-l-4 ${e.color} p-4`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-[#64748b]">{e.niveau}</span>
                      <span className="font-medium text-[#334155] text-sm">{e.type}</span>
                    </div>
                    <p className="text-sm text-[#475569]">{e.action}</p>
                    <p className="text-xs text-[#94a3b8] mt-1">{e.delai}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conduite du changement */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Conduite du changement</h2>
              <div className="space-y-4">
                {[
                  { phase: "Phase 1 — Sensibilisation", periode: "M1-M2", actions: ["Communication sur le projet aupres de toutes les equipes", "Presentation des benefices attendus", "Identification des ambassadeurs par equipe"], color: "border-l-[#3b82f6]" },
                  { phase: "Phase 2 — Accompagnement", periode: "M3-M4", actions: ["Formations par role", "Documentation utilisateur : guides pas-a-pas, videos courtes", "FAQ en ligne mise a jour en continu"], color: "border-l-[#8b5cf6]" },
                  { phase: "Phase 3 — Deploiement progressif", periode: "M4-M5", actions: ["Pilote avec 20 utilisateurs volontaires sur le perimetre MVP", "Collecte de feedback structure", "Ajustements UX et fonctionnels avant generalisation"], color: "border-l-[#f59e0b]" },
                  { phase: "Phase 4 — Generalisation", periode: "M5-M6", actions: ["Deploiement a tous les utilisateurs", "Support renforce pendant 2 semaines", "Suivi du taux d'adoption et accompagnement des retardataires"], color: "border-l-[#22c55e]" },
                ].map((p, i) => (
                  <div key={i} className={`bg-[#f8fafc] rounded-lg border-l-4 ${p.color} p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#334155]">{p.phase}</h3>
                      <span className="text-xs bg-[#eff6ff] text-[#3b82f6] px-3 py-1 rounded-full font-medium">{p.periode}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {p.actions.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#475569]">
                          <span className="text-[#94a3b8] mt-0.5">&bull;</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* KPIs */}
              <div className="mt-5 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-4">
                <h3 className="text-sm font-semibold text-[#166534] mb-3">KPIs de conduite du changement</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { kpi: "Taux d'adoption", cible: "90% a M+3", detail: "Pourcentage d'utilisateurs actifs sur le projet" },
                    { kpi: "Satisfaction utilisateur", cible: "> 4/5", detail: "Score moyen sur questionnaire de satisfaction" },
                    { kpi: "Tickets de support", cible: "-50%", detail: "Reduction de 50% des tickets entre M+1 et M+3" },
                  ].map((k, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-bold text-[#166534]">{k.cible}</p>
                      <p className="text-sm font-medium text-[#334155]">{k.kpi}</p>
                      <p className="text-xs text-[#64748b] mt-1">{k.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Matrice RACI */}
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Matrice RACI</h2>
              <p className="text-sm text-[#64748b] mb-4">
                <strong>R</strong> = Responsable &middot; <strong>A</strong> = Accountable &middot; <strong>C</strong> = Consulte &middot; <strong>I</strong> = Informe
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 px-4 font-medium text-[#64748b]">Activite</th>
                      <th className="text-center py-3 px-4 font-medium text-[#64748b]">Developpeur</th>
                      <th className="text-center py-3 px-4 font-medium text-[#64748b]">Sponsor</th>
                      <th className="text-center py-3 px-4 font-medium text-[#64748b]">Chef de projet IT</th>
                      <th className="text-center py-3 px-4 font-medium text-[#64748b]">Referents metier</th>
                      <th className="text-center py-3 px-4 font-medium text-[#64748b]">Utilisateurs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { activite: "Cadrage des besoins", thomas: "R", sponsor: "A", chef: "C", referents: "C", utilisateurs: "I" },
                      { activite: "Developpement", thomas: "R", sponsor: "I", chef: "A", referents: "C", utilisateurs: "I" },
                      { activite: "Tests fonctionnels", thomas: "R", sponsor: "I", chef: "A", referents: "R", utilisateurs: "C" },
                      { activite: "Validation des livrables", thomas: "C", sponsor: "A", chef: "R", referents: "C", utilisateurs: "I" },
                      { activite: "Formation", thomas: "R", sponsor: "I", chef: "A", referents: "C", utilisateurs: "R" },
                      { activite: "Deploiement", thomas: "R", sponsor: "A", chef: "R", referents: "I", utilisateurs: "I" },
                      { activite: "Support post-go-live", thomas: "R", sponsor: "I", chef: "A", referents: "C", utilisateurs: "C" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#f1f5f9]">
                        <td className="py-3 px-4 font-medium text-[#334155]">{row.activite}</td>
                        {[row.thomas, row.sponsor, row.chef, row.referents, row.utilisateurs].map((val, j) => (
                          <td key={j} className="py-3 px-4 text-center">
                            <span className={`inline-block w-7 h-7 leading-7 rounded-full text-xs font-bold ${
                              val === "R" ? "bg-[#dbeafe] text-[#2563eb]"
                                : val === "A" ? "bg-[#fef2f2] text-[#dc2626]"
                                : val === "C" ? "bg-[#fff7ed] text-[#ea580c]"
                                : "bg-[#f1f5f9] text-[#94a3b8]"
                            }`}>
                              {val}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regles de communication */}
            <div className="bg-[#eff6ff] rounded-lg border border-[#bfdbfe] p-6">
              <h2 className="text-lg font-semibold text-[#1e40af] mb-4">Regles de communication</h2>
              <div className="grid grid-cols-2 gap-3 text-sm text-[#1e40af]">
                {[
                  "Toute decision importante est confirmee par ecrit (email ou Notion)",
                  "Les comptes-rendus sont envoyes sous 24h apres chaque reunion",
                  "Le Product Backlog est la source de verite pour le perimetre fonctionnel",
                  "Tout changement de perimetre passe par le Chef de projet IT avant arbitrage",
                  "Les retours sur les demos sont documentes et priorises dans le backlog",
                  "Le prefixe [Projet] est utilise dans tous les emails du projet",
                  "Les acces aux outils (Notion, staging) sont partages des le kickoff",
                  "Un rapport d'avancement visuel est partage avant chaque comite de pilotage",
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5">&#10003;</span>
                    <span>{r}</span>
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
        fields={modalFields}
        initialData={modalInitialData}
        onSubmit={modalOnSubmit}
        onDelete={modalOnDelete}
      />
    </div>
  );
}
