"use client";

import { useState, useEffect, useCallback } from "react";
import { projectConfig } from "@/config/project.config";

// ── Types ──
interface RecettageRow {
  id: string;
  us: string;
  sprint: string;
  etape: string;
  action: string;
  attendu: string;
  obtenu: string;
  statut: string;
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ vos lignes de test ci-dessous                ║
// ╚══════════════════════════════════════════════════════════════╝
const initialRows: RecettageRow[] = [
  // ─── Sprint 1 : Exemples ───
  {
    id: "R-001",
    us: "US-001",
    sprint: "Sprint 1",
    etape: "Fonctionnalité A",
    action: "Effectuer l'action principale",
    attendu: "Le résultat attendu est conforme aux critères d'acceptation.",
    obtenu: "À renseigner après test.",
    statut: "A tester",
  },
  {
    id: "R-002",
    us: "US-001",
    sprint: "Sprint 1",
    etape: "Validation",
    action: "Vérifier la cohérence des données",
    attendu: "Les données sont correctes et complètes.",
    obtenu: "À renseigner après test.",
    statut: "A tester",
  },
  {
    id: "R-003",
    us: "US-002",
    sprint: "Sprint 1",
    etape: "Recherche",
    action: "Rechercher un élément spécifique",
    attendu: "Les résultats correspondent au terme recherché.",
    obtenu: "À renseigner après test.",
    statut: "A tester",
  },
  // ─── Sprint 2 : Exemples ───
  {
    id: "R-004",
    us: "US-003",
    sprint: "Sprint 2",
    etape: "Fonctionnalité B",
    action: "Effectuer l'action du module 2",
    attendu: "Le comportement est conforme à la spécification.",
    obtenu: "À tester lors du Sprint 2.",
    statut: "A tester",
  },
  {
    id: "R-005",
    us: "US-004",
    sprint: "Sprint 2",
    etape: "Intégration",
    action: "Vérifier l'intégration entre modules",
    attendu: "Les modules communiquent correctement.",
    obtenu: "À tester lors du Sprint 2.",
    statut: "A tester",
  },
];

const statusStyles: Record<string, string> = {
  OK: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  KO: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
  "A retester": "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
  "A tester": "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]",
  "En cours": "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
};

const statusFlow = ["A tester", "En cours", "OK", "KO", "A retester"];

const statusDisplayLabels: Record<string, string> = {
  "A tester": "À tester",
  "En cours": "En cours",
  OK: "OK",
  KO: "KO",
  "A retester": "À retester",
};

export default function RecettagePage() {
  const allSprints = [
    "Tous",
    ...Array.from(new Set(initialRows.map((r) => r.sprint))),
  ];
  const [sprintFilter, setSprintFilter] = useState("Tous");
  const [rows, setRows] = useState<RecettageRow[]>(initialRows);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        `${projectConfig.name}-recettage-statuses`
      );
      if (saved) {
        const savedStatuses: Record<string, string> = JSON.parse(saved);
        setRows(
          initialRows.map((r) => ({
            ...r,
            statut: savedStatuses[r.id] || r.statut,
          }))
        );
      }
    } catch {}
  }, []);

  const saveStatuses = useCallback((updated: RecettageRow[]) => {
    try {
      const statuses: Record<string, string> = {};
      updated.forEach((r) => {
        statuses[r.id] = r.statut;
      });
      localStorage.setItem(
        `${projectConfig.name}-recettage-statuses`,
        JSON.stringify(statuses)
      );
    } catch {}
  }, []);

  const cycleStatus = (rowId: string) => {
    setRows((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== rowId) return r;
        const currentIndex = statusFlow.indexOf(r.statut);
        const nextIndex = (currentIndex + 1) % statusFlow.length;
        return { ...r, statut: statusFlow[nextIndex] };
      });
      saveStatuses(updated);
      return updated;
    });
  };

  const resetAllStatuses = () => {
    setRows(initialRows);
    saveStatuses(initialRows);
  };

  const filtered =
    sprintFilter === "Tous"
      ? rows
      : rows.filter((r) => r.sprint === sprintFilter);

  const countByStatus = (status: string) =>
    filtered.filter((r) => r.statut === status).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Template de recettage
        </h1>
        <p className="text-[#64748b] mt-2">
          Grille de recette avec suivi des tests par User Story
        </p>
      </div>

      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-5 mb-6">
        <h2 className="text-base font-semibold text-[#92400e] mb-2">
          Mode d&apos;emploi
        </h2>
        <div className="text-sm text-[#92400e] space-y-1">
          <p>
            Une ligne = un test, lié à une US, avec action testée et écart
            attendu/obtenu.
          </p>
          <p>
            Quand valider : en fin de sprint review après démonstration.
          </p>
          <p>Qui signe : Product Owner + représentant client.</p>
          <p className="font-semibold">
            Cliquez sur un statut pour le faire avancer (À tester → En cours →
            OK → KO → À retester).
          </p>
        </div>
      </div>

      {/* Filtres + stats */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1">
          {allSprints.map((s) => (
            <button
              key={s}
              onClick={() => setSprintFilter(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sprintFilter === s
                  ? "bg-white text-[#1e293b] shadow-sm"
                  : "text-[#64748b] hover:text-[#334155]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={resetAllStatuses}
          className="px-3 py-1.5 rounded-lg text-xs border border-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444] transition-colors"
        >
          ↺ Réinitialiser
        </button>
        <div className="flex gap-3 ml-auto text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block" />
            OK : {countByStatus("OK")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block" />
            KO : {countByStatus("KO")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] inline-block" />
            À retester : {countByStatus("A retester")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block" />
            En cours : {countByStatus("En cours")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] inline-block" />
            À tester : {countByStatus("A tester")}
          </span>
          <span className="font-semibold text-[#334155]">
            Total : {filtered.length} tests
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  US
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  Sprint
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  Étape
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  Action
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  Résultat attendu
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  Résultat obtenu
                </th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#f1f5f9] align-top"
                >
                  <td className="py-3 px-4 font-medium text-[#1e293b] whitespace-nowrap">
                    {row.us}
                  </td>
                  <td className="py-3 px-4 text-[#64748b] whitespace-nowrap text-xs">
                    {row.sprint}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">{row.etape}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.action}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.attendu}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.obtenu}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => cycleStatus(row.id)}
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 hover:ring-[#3b82f6] ${statusStyles[row.statut] || ""}`}
                    >
                      {statusDisplayLabels[row.statut] || row.statut}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
