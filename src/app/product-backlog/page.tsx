"use client";

import { useState } from "react";

// ── Types ──
interface UserStory {
  id: string;
  epic: string;
  titre: string;
  enTantQue: string;
  jeSouhaite: string;
  afinDe: string;
  criteres: string[];
  estimation: number;
  priorite: "Must" | "Should" | "Could" | "Won't";
  sprint: string;
  valeur: "Critique" | "Haute" | "Moyenne" | "Basse";
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ votre Product Backlog ci-dessous             ║
// ╚══════════════════════════════════════════════════════════════╝
const backlog: UserStory[] = [
  {
    id: "US-001",
    epic: "Module Principal",
    titre: "Voir la liste des éléments",
    enTantQue: "Utilisateur",
    jeSouhaite:
      "voir la liste de tous les éléments avec leurs informations principales",
    afinDe: "avoir une vue d'ensemble rapide",
    criteres: [
      "La liste affiche les colonnes pertinentes",
      "La liste est triable par chaque colonne",
      "Un indicateur visuel distingue les différents statuts",
    ],
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 1",
    valeur: "Critique",
  },
  {
    id: "US-002",
    epic: "Module Principal",
    titre: "Rechercher et filtrer",
    enTantQue: "Utilisateur",
    jeSouhaite: "filtrer et rechercher des éléments par différents critères",
    afinDe: "trouver rapidement l'information recherchée",
    criteres: [
      "Barre de recherche fonctionnelle",
      "Filtres par statut",
      "Filtres combinables",
    ],
    estimation: 3,
    priorite: "Must",
    sprint: "Sprint 1",
    valeur: "Critique",
  },
  {
    id: "US-003",
    epic: "Module Principal",
    titre: "Créer un nouvel élément",
    enTantQue: "Utilisateur",
    jeSouhaite: "pouvoir créer un nouvel élément via un formulaire",
    afinDe: "enrichir la base de données",
    criteres: [
      "Le formulaire contient tous les champs obligatoires",
      "Validation des données en temps réel",
      "Confirmation de création réussie",
    ],
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 1",
    valeur: "Haute",
  },
  {
    id: "US-004",
    epic: "Module Complémentaire",
    titre: "Vue tableau de bord",
    enTantQue: "Manager",
    jeSouhaite: "voir un tableau de bord avec les KPIs principaux",
    afinDe: "suivre la performance de l'équipe",
    criteres: [
      "Affichage de 4 KPIs minimum",
      "Données actualisées en temps réel",
      "Filtres par période",
    ],
    estimation: 8,
    priorite: "Should",
    sprint: "Sprint 2",
    valeur: "Haute",
  },
  {
    id: "US-005",
    epic: "Module Complémentaire",
    titre: "Export des données",
    enTantQue: "Manager",
    jeSouhaite: "exporter les données en CSV ou Excel",
    afinDe: "créer des rapports personnalisés",
    criteres: [
      "Export CSV fonctionnel",
      "Export Excel avec mise en forme",
      "Les filtres actifs sont appliqués à l'export",
    ],
    estimation: 3,
    priorite: "Could",
    sprint: "Sprint 2",
    valeur: "Moyenne",
  },
];

const prioriteColors: Record<string, string> = {
  Must: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
  Should: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]",
  Could: "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]",
  "Won't": "bg-[#f1f5f9] text-[#64748b] border-[#cbd5e1]",
};

const valeurColors: Record<string, string> = {
  Critique: "text-[#dc2626]",
  Haute: "text-[#ea580c]",
  Moyenne: "text-[#2563eb]",
  Basse: "text-[#64748b]",
};

export default function ProductBacklogPage() {
  const [epicFilter, setEpicFilter] = useState("Tous");
  const [prioriteFilter, setPrioriteFilter] = useState("Tous");
  const [expandedUS, setExpandedUS] = useState<string | null>(null);

  const epics = ["Tous", ...Array.from(new Set(backlog.map((us) => us.epic)))];
  const priorites = ["Tous", "Must", "Should", "Could", "Won't"];

  const filtered = backlog
    .filter((us) => epicFilter === "Tous" || us.epic === epicFilter)
    .filter(
      (us) => prioriteFilter === "Tous" || us.priorite === prioriteFilter
    );

  const totalPoints = filtered.reduce((acc, us) => acc + us.estimation, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Product Backlog</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 4 — Backlog complet avec User Stories, critères
          d&apos;acceptation et estimations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#1e293b]">
            {backlog.length}
          </div>
          <div className="text-xs text-[#64748b]">User Stories</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#dc2626]">
            {backlog.filter((us) => us.priorite === "Must").length}
          </div>
          <div className="text-xs text-[#64748b]">Must Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#3b82f6]">
            {totalPoints}
          </div>
          <div className="text-xs text-[#64748b]">Points d&apos;effort</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#8b5cf6]">
            {new Set(backlog.map((us) => us.epic)).size}
          </div>
          <div className="text-xs text-[#64748b]">Epics</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="text-xs text-[#64748b] block mb-1">Epic</label>
          <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1">
            {epics.map((e) => (
              <button
                key={e}
                onClick={() => setEpicFilter(e)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  epicFilter === e
                    ? "bg-white text-[#1e293b] shadow-sm"
                    : "text-[#64748b] hover:text-[#334155]"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-[#64748b] block mb-1">Priorité</label>
          <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1">
            {priorites.map((p) => (
              <button
                key={p}
                onClick={() => setPrioriteFilter(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  prioriteFilter === p
                    ? "bg-white text-[#1e293b] shadow-sm"
                    : "text-[#64748b] hover:text-[#334155]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* US Cards */}
      <div className="space-y-3">
        {filtered.map((us) => (
          <div
            key={us.id}
            className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedUS(expandedUS === us.id ? null : us.id)
              }
              className="w-full text-left p-4 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors"
            >
              <span className="text-sm font-mono font-bold text-[#3b82f6] w-16 shrink-0">
                {us.id}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${prioriteColors[us.priorite]}`}
              >
                {us.priorite}
              </span>
              <span className="text-sm font-semibold text-[#1e293b] flex-1">
                {us.titre}
              </span>
              <span className="text-xs text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
                {us.epic}
              </span>
              <span className="text-xs text-[#64748b]">{us.sprint}</span>
              <span className="text-sm font-bold text-[#1e293b]">
                {us.estimation} pts
              </span>
              <span className="text-[#94a3b8]">
                {expandedUS === us.id ? "−" : "+"}
              </span>
            </button>

            {expandedUS === us.id && (
              <div className="px-4 pb-4 border-t border-[#f1f5f9]">
                <div className="bg-[#f8fafc] rounded-lg p-4 mt-3">
                  <p className="text-sm text-[#475569]">
                    <strong>En tant que</strong> {us.enTantQue},{" "}
                    <strong>je souhaite</strong> {us.jeSouhaite},{" "}
                    <strong>afin de</strong> {us.afinDe}.
                  </p>
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                    Critères d&apos;acceptation
                  </h4>
                  <ul className="space-y-1">
                    {us.criteres.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#475569]"
                      >
                        <span className="text-[#22c55e] mt-0.5">
                          &#10003;
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-[#64748b]">
                  <span>
                    Valeur :{" "}
                    <strong className={valeurColors[us.valeur]}>
                      {us.valeur}
                    </strong>
                  </span>
                  <span>
                    Sprint : <strong>{us.sprint}</strong>
                  </span>
                  <span>
                    Estimation : <strong>{us.estimation} points</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
