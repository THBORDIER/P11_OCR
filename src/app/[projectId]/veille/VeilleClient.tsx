"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CrudModal, { FieldConfig } from "@/components/CrudModal";

/* ───────────────────────── Types ───────────────────────── */
type Source = { nom: string; url: string };
type Theme = {
  id: number;
  theme: string;
  description: string;
  sources: Source[];
  avantages: string;
  consultation: string;
  utiliseDansProjet?: boolean;
  apprentissage?: string;
  categoryId: number;
};
type Categorie = {
  id: number;
  titre: string;
  miseAJour: string;
  items: Theme[];
};

const categoryFields: FieldConfig[] = [
  { name: "titre", label: "Titre de la categorie", type: "text", required: true },
  { name: "miseAJour", label: "Date de mise a jour", type: "text", required: true },
];

const themeFields: FieldConfig[] = [
  { name: "theme", label: "Theme", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "avantages", label: "Avantages", type: "textarea" },
  { name: "consultation", label: "Mode de consultation", type: "textarea" },
  { name: "apprentissage", label: "Apprentissage pour le projet", type: "textarea" },
];

/* ───────────────────────── Component ───────────────────────── */
export default function VeilleClient({
  categories,
  isOwner,
  projectName,
}: {
  categories: Categorie[];
  isOwner: boolean;
  projectName: string;
}) {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const apiBase = `/api/projects/${projectId}`;

  const [tableOpen, setTableOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFields, setModalFieldsState] = useState<FieldConfig[]>([]);
  const [modalInitialData, setModalInitialData] = useState<Record<string, unknown> | undefined>();
  const [modalOnSubmit, setModalOnSubmit] = useState<(data: Record<string, unknown>) => Promise<void>>(() => async () => {});
  const [modalOnDelete, setModalOnDelete] = useState<(() => Promise<void>) | undefined>();

  /* Build flat list with numbering */
  const allThemes: (Theme & { numero: number; categorie: string })[] = [];
  let counter = 0;
  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      counter++;
      allThemes.push({ ...item, numero: counter, categorie: cat.titre });
    });
  });

  const totalThemes = allThemes.length;
  const themesUtilises = allThemes.filter((t) => t.utiliseDansProjet).length;
  const totalSources = allThemes.reduce(
    (acc, t) => acc + t.sources.length,
    0
  );

  /* ── API helpers ── */
  async function apiPostCategory(data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/tech-watch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la creation");
    router.refresh();
  }

  async function apiPatchCategory(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/tech-watch/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    router.refresh();
  }

  async function apiDeleteCategory(id: number) {
    const res = await fetch(`${apiBase}/tech-watch/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  }

  async function apiPostTheme(data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/tech-watch-themes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la creation");
    router.refresh();
  }

  async function apiPatchTheme(id: number, data: Record<string, unknown>) {
    const res = await fetch(`${apiBase}/tech-watch-themes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    router.refresh();
  }

  async function apiDeleteTheme(id: number) {
    const res = await fetch(`${apiBase}/tech-watch-themes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    router.refresh();
  }

  /* ── Modal helpers ── */
  function openCreateCategory() {
    setModalTitle("Ajouter une categorie");
    setModalFieldsState(categoryFields);
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPostCategory(data);
    });
    setModalOpen(true);
  }

  function openEditCategory(cat: Categorie) {
    setModalTitle("Modifier la categorie");
    setModalFieldsState(categoryFields);
    setModalInitialData({ titre: cat.titre, miseAJour: cat.miseAJour });
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatchCategory(cat.id, data);
    });
    setModalOnDelete(() => async () => {
      await apiDeleteCategory(cat.id);
    });
    setModalOpen(true);
  }

  function openCreateTheme(categoryId: number) {
    setModalTitle("Ajouter un theme");
    setModalFieldsState(themeFields);
    setModalInitialData(undefined);
    setModalOnDelete(undefined);
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPostTheme({ ...data, categoryId });
    });
    setModalOpen(true);
  }

  function openEditTheme(theme: Theme) {
    setModalTitle("Modifier le theme");
    setModalFieldsState(themeFields);
    setModalInitialData({
      theme: theme.theme,
      description: theme.description,
      avantages: theme.avantages,
      consultation: theme.consultation,
      apprentissage: theme.apprentissage || "",
    });
    setModalOnSubmit(() => async (data: Record<string, unknown>) => {
      await apiPatchTheme(theme.id, data);
    });
    setModalOnDelete(() => async () => {
      await apiDeleteTheme(theme.id);
    });
    setModalOpen(true);
  }

  /* ── Export PDF ── */
  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const marginX = 40;
    const marginTop = 44;
    const lineHeight = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - marginX * 2;
    const pageBottom = pageHeight - 40;

    let y = marginTop;

    const checkPage = (needed = lineHeight) => {
      if (y + needed > pageBottom) {
        doc.addPage();
        y = marginTop;
      }
    };

    const writeLines = (
      input: string,
      font: "normal" | "bold" = "normal",
      size = 10
    ) => {
      doc.setFont("helvetica", font);
      doc.setFontSize(size);
      const wrapped = doc.splitTextToSize(input, maxWidth) as string[];
      for (const line of wrapped) {
        checkPage();
        doc.text(line, marginX, y);
        y += lineHeight;
      }
    };

    const writeLinesIndent = (
      input: string,
      indent = 15,
      font: "normal" | "bold" = "normal",
      size = 10
    ) => {
      doc.setFont("helvetica", font);
      doc.setFontSize(size);
      const wrapped = doc.splitTextToSize(
        input,
        maxWidth - indent
      ) as string[];
      for (const line of wrapped) {
        checkPage();
        doc.text(line, marginX + indent, y);
        y += lineHeight;
      }
    };

    const drawHr = () => {
      checkPage();
      doc.setDrawColor(200);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 8;
    };

    // ── Titre
    writeLines(`Tableau de veille technologique - ${projectName}`, "bold", 16);
    y += 2;
    writeLines(
      `Genere le ${new Date().toLocaleDateString("fr-FR")} | ${totalThemes} themes | ${themesUtilises} appliques au projet | ${totalSources} sources`,
      "normal",
      9
    );
    y += 10;
    drawHr();

    // ── Tableau recapitulatif
    writeLines("TABLEAU RECAPITULATIF", "bold", 13);
    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setFillColor(241, 245, 249);
    checkPage(18);
    doc.rect(marginX, y - 10, maxWidth, 16, "F");
    doc.text("#", marginX + 4, y);
    doc.text("Theme", marginX + 24, y);
    doc.text("Categorie", marginX + 250, y);
    doc.text("Sources", marginX + 370, y);
    doc.text("Projet", marginX + 480, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    for (const t of allThemes) {
      checkPage(14);
      doc.text(String(t.numero), marginX + 4, y);
      const themeTrunc =
        t.theme.length > 42 ? t.theme.slice(0, 39) + "..." : t.theme;
      doc.text(themeTrunc, marginX + 24, y);
      const catTrunc =
        t.categorie.length > 20
          ? t.categorie.slice(0, 17) + "..."
          : t.categorie;
      doc.text(catTrunc, marginX + 250, y);
      doc.text(String(t.sources.length), marginX + 370, y);
      doc.text(t.utiliseDansProjet ? "Oui" : "-", marginX + 480, y);
      y += 12;
    }

    y += 10;
    drawHr();

    // ── Detail par categorie
    writeLines("DETAIL PAR CATEGORIE", "bold", 13);
    y += 6;

    for (const cat of categories) {
      checkPage(30);
      writeLines(`${cat.titre}  (MAJ: ${cat.miseAJour})`, "bold", 11);
      y += 2;

      for (const item of cat.items) {
        checkPage(40);
        const prefix = item.utiliseDansProjet ? "[PROJET] " : "";
        writeLines(`${prefix}${item.theme}`, "bold", 10);

        writeLinesIndent(`Description: ${item.description}`);

        writeLinesIndent(
          `Sources: ${item.sources.map((s) => `${s.nom} (${s.url})`).join(" | ")}`
        );

        writeLinesIndent(`Avantages: ${item.avantages}`);
        writeLinesIndent(`Consultation: ${item.consultation}`);

        if (item.apprentissage) {
          doc.setTextColor(21, 128, 61);
          writeLinesIndent(
            `-> Apprentissage ${projectName}: ${item.apprentissage}`,
            15,
            "bold"
          );
          doc.setTextColor(0, 0, 0);
        }

        y += 6;
      }

      y += 4;
    }

    doc.save(
      `veille-technologique-${projectId}-${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Tableau de veille technologique
          </h1>
          <p className="text-[#64748b] mt-2">
            Veille technologique — {totalThemes} thèmes surveillés, {totalSources} sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={openCreateCategory}
              className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Categorie
            </button>
          )}
          <button
            onClick={exportPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors shadow-sm"
          >
            <span>&#128196;</span> Exporter PDF
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-lg mb-2">Aucune categorie de veille</p>
          <p className="text-[#94a3b8] text-sm">
            {isOwner
              ? "Ajoutez vos categories et themes de veille technologique."
              : "Les categories de veille n'ont pas encore ete configurees."}
          </p>
          {isOwner && (
            <button
              onClick={openCreateCategory}
              className="mt-4 px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              + Categorie
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── Dashboard global ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
              <p className="text-2xl font-bold text-[#3b82f6]">{totalThemes}</p>
              <p className="text-xs text-[#64748b] mt-1">Themes surveilles</p>
            </div>
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
              <p className="text-2xl font-bold text-[#22c55e]">{themesUtilises}</p>
              <p className="text-xs text-[#64748b] mt-1">
                Appliques au projet
              </p>
            </div>
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
              <p className="text-2xl font-bold text-[#8b5cf6]">{totalSources}</p>
              <p className="text-xs text-[#64748b] mt-1">Sources actives</p>
            </div>
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
              <p className="text-2xl font-bold text-[#f59e0b]">{categories.length}</p>
              <p className="text-xs text-[#64748b] mt-1">Categories</p>
            </div>
          </div>

          {/* ── Objectif ── */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
            <h2 className="text-base font-semibold mb-2">Objectif de la veille</h2>
            <p className="text-sm text-[#475569]">
              Maintenir une veille active sur les technologies, outils et bonnes
              pratiques liés au projet. Cette veille permet de rester compétitif,
              d&apos;anticiper les évolutions et de proposer des solutions à jour.
            </p>
          </div>

          {/* ── Tableau synthetique recapitulatif ── */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] mb-6 overflow-hidden">
            <button
              onClick={() => setTableOpen(!tableOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors text-left"
            >
              <h2 className="text-base font-semibold text-[#1e293b] flex items-center gap-2">
                <span className="text-lg">&#128202;</span> Tableau recapitulatif des
                themes
              </h2>
              <span className="text-[#94a3b8] text-sm">
                {tableOpen ? "Reduire" : "Deplier"}
              </span>
            </button>
            {tableOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8fafc] border-t border-[#e2e8f0]">
                      <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                        #
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                        Theme
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                        Categorie
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                        Sources
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                        Frequence
                      </th>
                      <th className="text-center px-4 py-2.5 font-semibold text-[#475569] text-xs">
                        Projet
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allThemes.map((t) => (
                      <tr
                        key={t.numero}
                        className="border-t border-[#f1f5f9] hover:bg-[#fafbfd]"
                      >
                        <td className="px-4 py-2 text-[#94a3b8] font-mono text-xs">
                          {t.numero}
                        </td>
                        <td className="px-4 py-2 text-[#334155] font-medium max-w-[260px]">
                          {t.theme}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-[10px] whitespace-nowrap">
                            {t.categorie.length > 25
                              ? t.categorie.slice(0, 22) + "..."
                              : t.categorie}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {t.sources.map((s, i) => (
                              <a
                                key={i}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#3b82f6] hover:underline"
                              >
                                {s.nom}
                                {i < t.sources.length - 1 ? "," : ""}
                              </a>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs text-[#64748b] max-w-[180px]">
                          {t.consultation.split("+")[0].trim()}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {t.utiliseDansProjet ? (
                            <span
                              className="inline-block text-xs"
                              title="Utilise dans le projet"
                            >
                              &#127919;
                            </span>
                          ) : (
                            <span className="text-[#d1d5db]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Categories detaillees ── */}
          {(() => {
            let runningCounter = 0;
            return categories.map((cat, ci) => (
              <div key={ci} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                    {cat.titre}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94a3b8] bg-[#f1f5f9] px-3 py-1 rounded-full">
                      Derniere mise a jour : {cat.miseAJour}
                    </span>
                    {isOwner && (
                      <>
                        <button
                          onClick={() => openCreateTheme(cat.id)}
                          className="text-xs text-[#3b82f6] hover:text-[#2563eb] bg-white px-3 py-1 rounded-full border border-[#e2e8f0] hover:border-[#3b82f6] transition-colors"
                        >
                          + Theme
                        </button>
                        <button
                          onClick={() => openEditCategory(cat)}
                          className="text-xs text-[#64748b] hover:text-[#334155] bg-white px-3 py-1 rounded-full border border-[#e2e8f0] hover:border-[#94a3b8] transition-colors"
                        >
                          Modifier
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {cat.items.map((item, ii) => {
                    runningCounter++;
                    const currentNumber = runningCounter;
                    return (
                      <div
                        key={ii}
                        className={`bg-white rounded-lg border p-5 relative ${
                          item.utiliseDansProjet
                            ? "border-[#86efac] border-l-4 border-l-[#22c55e]"
                            : "border-[#e2e8f0]"
                        }`}
                      >
                        {isOwner && (
                          <button
                            onClick={() => openEditTheme(item)}
                            className="absolute top-3 right-3 text-xs text-[#3b82f6] hover:text-[#2563eb] bg-white px-2 py-1 rounded border border-[#e2e8f0] hover:border-[#3b82f6] transition-colors"
                          >
                            Modifier
                          </button>
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#3b82f6]">
                                Theme {currentNumber}
                              </span>
                              {item.utiliseDansProjet && (
                                <span className="text-[10px] bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-full font-medium">
                                  &#127919; Utilise dans le projet
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-[#334155] mt-1">
                              {item.theme}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-[#64748b] mb-4">
                          {item.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                              Sources
                            </h4>
                            <ul className="space-y-1">
                              {item.sources.map((s, si) => (
                                <li key={si}>
                                  <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#3b82f6] hover:underline hover:text-[#2563eb] transition-colors"
                                  >
                                    {s.nom} &rarr;
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                              Avantages
                            </h4>
                            <p className="text-sm text-[#475569]">
                              {item.avantages}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                              Mode de consultation
                            </h4>
                            <p className="text-sm text-[#475569]">
                              {item.consultation}
                            </p>
                          </div>
                        </div>

                        {/* Apprentissage */}
                        {item.apprentissage && (
                          <div className="mt-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-md p-3">
                            <h4 className="text-xs font-bold text-[#15803d] uppercase mb-1">
                              &#128161; Apprentissage applique au projet
                            </h4>
                            <p className="text-sm text-[#166534]">
                              {item.apprentissage}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </>
      )}

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
