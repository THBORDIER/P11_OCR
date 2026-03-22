"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";
import AiGenerateButton from "@/components/AiGenerateButton";

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

interface RecettageClientProps {
  initialRows: RecettageRow[];
  projectId: string;
  isOwner?: boolean;
}

const statusStyles: Record<string, string> = {
  OK: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  KO: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
  "A retester": "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
  "A tester": "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]",
};

const statusFlow = ["A tester", "En cours", "OK", "KO", "A retester"];

const statusDisplayLabels: Record<string, string> = {
  "A tester": "\u00C0 tester",
  "En cours": "En cours",
  OK: "OK",
  KO: "KO",
  "A retester": "\u00C0 retester",
};

/** Strip project prefix from ID: "p11-spartcrm:R-001" -> "R-001" */
function displayId(id: string): string {
  const idx = id.indexOf(":");
  return idx >= 0 ? id.slice(idx + 1) : id;
}

export default function RecettageClient({ initialRows, projectId, isOwner }: RecettageClientProps) {
  const router = useRouter();
  const sprintOptions = ["Tous", ...new Set(initialRows.map((r) => r.sprint))];
  const [sprintFilter, setSprintFilter] = useState("Tous");
  const [rows, setRows] = useState<RecettageRow[]>(initialRows);

  // CRUD state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RecettageRow | null>(null);

  // Persist status change to DB
  const persistStatus = useCallback(async (rowId: string, newStatus: string) => {
    try {
      await fetch(`/api/projects/${projectId}/recettage/${encodeURIComponent(rowId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });
    } catch {
      // Silent fail — UI already updated optimistically
    }
  }, [projectId]);

  const cycleStatus = (rowId: string) => {
    setRows((prev) => {
      const updated = prev.map((r) => {
        if (r.id !== rowId) return r;
        const currentIndex = statusFlow.indexOf(r.statut);
        const nextIndex = (currentIndex + 1) % statusFlow.length;
        const newStatus = statusFlow[nextIndex];
        persistStatus(r.id, newStatus);
        return { ...r, statut: newStatus };
      });
      return updated;
    });
  };

  const resetAllStatuses = () => {
    const reset = initialRows.map((r) => ({ ...r, statut: "A tester" }));
    setRows(reset);
    // Persist all resets
    reset.forEach((r) => persistStatus(r.id, "A tester"));
  };

  const filtered = sprintFilter === "Tous"
    ? rows
    : rows.filter((r) => r.sprint === sprintFilter);

  const countByStatus = (status: string) => filtered.filter((r) => r.statut === status).length;

  // ─── CRUD helpers ───────────────────────────────────────

  const testCaseFields: FieldConfig[] = [
    ...(editingRow
      ? []
      : [{ name: "shortId", label: "Identifiant (ex: R-050)", type: "text" as const, required: true }]),
    { name: "us", label: "User Story (ex: US-001)", type: "text" as const, required: true },
    { name: "sprint", label: "Sprint", type: "text" as const },
    { name: "etape", label: "Etape", type: "text" as const },
    { name: "action", label: "Action", type: "textarea" as const },
    { name: "attendu", label: "Resultat attendu", type: "textarea" as const },
    { name: "obtenu", label: "Resultat obtenu", type: "textarea" as const },
    {
      name: "statut",
      label: "Statut",
      type: "select" as const,
      options: ["A tester", "En cours", "OK", "KO", "A retester"],
    },
  ];

  const openCreate = () => {
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEdit = (row: RecettageRow) => {
    setEditingRow(row);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (editingRow) {
      const res = await fetch(
        `/api/projects/${projectId}/recettage/${encodeURIComponent(editingRow.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            us: data.us,
            sprint: data.sprint,
            etape: data.etape,
            action: data.action,
            attendu: data.attendu,
            obtenu: data.obtenu,
            statut: data.statut,
          }),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la modification");
    } else {
      const shortId = (data.shortId as string).trim();
      const fullId = `${projectId}:${shortId}`;
      const res = await fetch(`/api/projects/${projectId}/recettage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: fullId,
          us: data.us || "",
          sprint: data.sprint || "",
          etape: data.etape || "",
          action: data.action || "",
          attendu: data.attendu || "",
          obtenu: data.obtenu || "",
          statut: data.statut || "A tester",
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la creation");
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!editingRow) return;
    const res = await fetch(
      `/api/projects/${projectId}/recettage/${encodeURIComponent(editingRow.id)}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  };

  const getInitialData = () => {
    if (!editingRow) return undefined;
    return {
      us: editingRow.us,
      sprint: editingRow.sprint,
      etape: editingRow.etape,
      action: editingRow.action,
      attendu: editingRow.attendu,
      obtenu: editingRow.obtenu,
      statut: editingRow.statut,
    };
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Recettage</h1>
          <p className="text-[#64748b] mt-2">
            Grille de recette — {initialRows.length} cas de test
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <AiGenerateButton
              type="test-cases"
              projectId={projectId}
              label="Générer avec l'IA"
              onGenerated={async (items) => {
                for (const item of items) {
                  await fetch(`/api/projects/${projectId}/recettage`, {
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
              className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Cas de test
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-5 mb-6">
        <h2 className="text-base font-semibold text-[#92400e] mb-2">Mode d&apos;emploi recettage</h2>
        <div className="text-sm text-[#92400e] space-y-1">
          <p>Comment remplir : une ligne = un test, lie a une US, avec action testee et ecart attendu/obtenu.</p>
          <p>Quand valider : en fin de sprint review apres demonstration et correction des points KO.</p>
          <p>Qui signe : Product Owner + representant client (sponsor ou referent metier).</p>
          <p className="font-semibold">Cliquez sur un statut pour le faire avancer (A tester &rarr; En cours &rarr; OK &rarr; KO &rarr; A retester).</p>
        </div>
      </div>

      {/* Sprint filter + stats */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1">
          {sprintOptions.map((s) => (
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
          title="Reinitialiser tous les statuts"
        >
          ↺ Reinitialiser
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
            A retester : {countByStatus("A retester")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block" />
            En cours : {countByStatus("En cours")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] inline-block" />
            A tester : {countByStatus("A tester")}
          </span>
          <span className="font-semibold text-[#334155]">
            Total : {filtered.length} tests
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#94a3b8] text-lg mb-2">Aucun cas de test</p>
          <p className="text-[#94a3b8] text-sm">Ajoutez-en ou generez-les avec l'IA</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  {isOwner && <th className="py-3 px-2 w-16"></th>}
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">US</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">Sprint</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">Etape</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">Resultat attendu</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">Resultat obtenu</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#475569]">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-[#f1f5f9] align-top">
                    {isOwner && (
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1 rounded hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
                            title="Modifier"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Supprimer ce cas de test ?")) {
                                fetch(`/api/projects/${projectId}/recettage/${encodeURIComponent(row.id)}`, { method: "DELETE" })
                                  .then(() => router.refresh());
                              }
                            }}
                            className="p-1 rounded hover:bg-[#fef2f2] text-[#94a3b8] hover:text-[#ef4444] transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4 font-mono text-xs text-[#94a3b8] whitespace-nowrap">{displayId(row.id)}</td>
                    <td className="py-3 px-4 font-medium text-[#1e293b] whitespace-nowrap">{row.us}</td>
                    <td className="py-3 px-4 text-[#64748b] whitespace-nowrap text-xs">{row.sprint}</td>
                    <td className="py-3 px-4 text-[#334155]">{row.etape}</td>
                    <td className="py-3 px-4 text-[#475569]">{row.action}</td>
                    <td className="py-3 px-4 text-[#475569]">{row.attendu}</td>
                    <td className="py-3 px-4 text-[#475569]">{row.obtenu}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => cycleStatus(row.id)}
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 hover:ring-[#3b82f6] ${statusStyles[row.statut] || ""}`}
                        title="Cliquer pour changer le statut"
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
      )}

      {/* CRUD Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRow ? `Modifier ${displayId(editingRow.id)}` : "Nouveau cas de test"}
        fields={testCaseFields}
        initialData={getInitialData()}
        onSubmit={handleSubmit}
        onDelete={editingRow ? handleDelete : undefined}
      />
    </div>
  );
}
