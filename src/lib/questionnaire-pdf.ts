import type { jsPDF } from "jspdf";

export interface PdfQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "scale";
  options?: string[];
}

export interface PdfSection {
  title: string;
  description: string;
  questions: PdfQuestion[];
}

type FormData = Record<string, string | string[]>;

interface PdfContext {
  doc: jsPDF;
  y: number;
  marginX: number;
  marginTop: number;
  lineHeight: number;
  maxWidth: number;
  pageBottom: number;
}

function checkPage(ctx: PdfContext, needed = ctx.lineHeight) {
  if (ctx.y + needed > ctx.pageBottom) {
    ctx.doc.addPage();
    ctx.y = ctx.marginTop;
  }
}

function writeLines(
  ctx: PdfContext,
  input: string,
  font: "normal" | "bold" = "normal",
  size = 11
) {
  ctx.doc.setFont("helvetica", font);
  ctx.doc.setFontSize(size);
  const wrapped = ctx.doc.splitTextToSize(input, ctx.maxWidth) as string[];
  for (const line of wrapped) {
    checkPage(ctx);
    ctx.doc.text(line, ctx.marginX, ctx.y);
    ctx.y += ctx.lineHeight;
  }
}

function createPdfContext(doc: jsPDF): PdfContext {
  const marginX = 40;
  const marginTop = 44;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  return {
    doc,
    y: marginTop,
    marginX,
    marginTop,
    lineHeight: 14,
    maxWidth: pageWidth - marginX * 2,
    pageBottom: pageHeight - 40,
  };
}

export function getAnsweredCount(
  sections: PdfSection[],
  data: FormData
): { answered: number; total: number } {
  let total = 0;
  let answered = 0;

  for (const sec of sections) {
    for (const q of sec.questions) {
      total++;
      if (q.type === "scale" && q.options) {
        const hasAnswer = q.options.some(
          (opt) =>
            data[`${q.id}_${opt}`] &&
            String(data[`${q.id}_${opt}`]).trim() !== ""
        );
        if (hasAnswer) answered++;
      } else if (q.type === "checkbox") {
        const val = data[q.id] as string[] | undefined;
        if (val && val.length > 0) answered++;
      } else {
        const val = data[q.id] as string | undefined;
        if (val && val.trim() !== "") answered++;
      }
    }
  }

  return { answered, total };
}

export function generateMarkdown(
  sections: PdfSection[],
  data: FormData,
  projectName: string
): string {
  const lines: string[] = [];
  lines.push(`# Questionnaire de recueil de besoins - ${projectName}`);
  lines.push("");
  lines.push(
    `> Document genere le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} a ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  let globalIndex = 0;

  for (const sec of sections) {
    lines.push(`## ${sec.title}`);
    lines.push("");
    lines.push(`*${sec.description}*`);
    lines.push("");

    for (const q of sec.questions) {
      globalIndex++;
      lines.push(`### Q${globalIndex}. ${q.label}`);
      lines.push("");

      if (q.type === "scale" && q.options) {
        let hasAnyScale = false;
        for (const opt of q.options) {
          const val = data[`${q.id}_${opt}`];
          if (val && String(val).trim() !== "") {
            lines.push(`- **${opt}** : ${val}/5`);
            hasAnyScale = true;
          } else {
            lines.push(`- **${opt}** : _Non renseigne_`);
          }
        }
        if (!hasAnyScale) {
          lines.push("_Aucune note attribuee_");
        }
      } else if (q.type === "checkbox") {
        const val = data[q.id] as string[] | undefined;
        if (val && val.length > 0) {
          for (const item of val) {
            lines.push(`- [x] ${item}`);
          }
          const unchecked = (q.options || []).filter((o) => !val.includes(o));
          for (const item of unchecked) {
            lines.push(`- [ ] ${item}`);
          }
        } else {
          lines.push("_Non renseigne_");
        }
      } else {
        const val = data[q.id] as string | undefined;
        if (val && val.trim() !== "") {
          lines.push(`**Reponse :** ${val}`);
        } else {
          lines.push("_Non renseigne_");
        }
      }

      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  const { answered: a, total: t } = getAnsweredCount(sections, data);
  lines.push("## Recapitulatif");
  lines.push("");
  lines.push(`- **Questions repondues :** ${a} / ${t}`);
  lines.push(
    `- **Taux de completion :** ${t > 0 ? Math.round((a / t) * 100) : 0}%`
  );
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    `*Document genere automatiquement depuis le questionnaire ${projectName}.*`
  );

  return lines.join("\n");
}

export function downloadMarkdown(
  sections: PdfSection[],
  data: FormData,
  projectName: string,
  filePrefix: string
) {
  const md = generateMarkdown(sections, data, projectName);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadFilledPdf(
  sections: PdfSection[],
  data: FormData,
  filePrefix: string,
  title: string
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const ctx = createPdfContext(doc);

  writeLines(ctx, title, "bold", 16);
  ctx.y += 4;
  writeLines(
    ctx,
    `Genere le ${new Date().toLocaleDateString("fr-FR")} a ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
  );
  ctx.y += 8;

  let globalIndex = 0;
  for (const sec of sections) {
    writeLines(ctx, sec.title, "bold", 13);
    writeLines(ctx, sec.description);
    ctx.y += 2;

    for (const q of sec.questions) {
      globalIndex++;
      writeLines(ctx, `Q${globalIndex}. ${q.label}`, "bold");

      if (q.type === "scale" && q.options) {
        for (const opt of q.options) {
          const val = data[`${q.id}_${opt}`];
          writeLines(
            ctx,
            `- ${opt}: ${val && String(val).trim() !== "" ? `${val}/5` : "Non renseigne"}`
          );
        }
      } else if (q.type === "checkbox") {
        const val = data[q.id] as string[] | undefined;
        writeLines(
          ctx,
          `- ${val && val.length ? val.join(", ") : "Non renseigne"}`
        );
      } else {
        const val = data[q.id] as string | undefined;
        writeLines(
          ctx,
          `- ${val && val.trim() !== "" ? val : "Non renseigne"}`
        );
      }

      ctx.y += 4;
    }

    ctx.y += 6;
  }

  const counts = getAnsweredCount(sections, data);
  writeLines(
    ctx,
    `Recapitulatif: ${counts.answered}/${counts.total} questions repondues (${counts.total > 0 ? Math.round((counts.answered / counts.total) * 100) : 0}%)`,
    "bold"
  );

  doc.save(`${filePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function downloadBlankPdf(
  sections: PdfSection[],
  projectId: string,
  projectName: string
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  const marginTop = 44;
  const lineHeight = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - marginX * 2;
  const pageBottom = pageHeight - 50;

  let y = marginTop;

  const check = (needed = lineHeight) => {
    if (y + needed > pageBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  const wl = (
    input: string,
    font: "normal" | "bold" = "normal",
    size = 10
  ) => {
    doc.setFont("helvetica", font);
    doc.setFontSize(size);
    const wrapped = doc.splitTextToSize(input, maxWidth) as string[];
    for (const line of wrapped) {
      check();
      doc.text(line, marginX, y);
      y += lineHeight;
    }
  };

  const drawBlankLines = (count: number) => {
    for (let i = 0; i < count; i++) {
      check(16);
      doc.setDrawColor(200);
      doc.line(marginX + 10, y, pageWidth - marginX, y);
      y += 18;
    }
  };

  const drawCheckboxes = (options: string[]) => {
    for (const opt of options) {
      check(16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.rect(marginX + 10, y - 8, 10, 10);
      doc.text(opt, marginX + 26, y);
      y += 16;
    }
  };

  const drawScaleRow = (label: string) => {
    check(20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(label, marginX + 10, y);
    const scaleX = marginX + 300;
    for (let i = 1; i <= 5; i++) {
      doc.circle(scaleX + i * 30, y - 3, 6);
      doc.setFontSize(8);
      doc.text(String(i), scaleX + i * 30 - 2.5, y - 0.5);
    }
    y += 18;
  };

  // Title
  wl(
    `Questionnaire de recueil de besoins - ${projectName}`,
    "bold",
    16
  );
  y += 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `Document a remplir par le client | Projet ${projectName}`,
    marginX,
    y
  );
  doc.setTextColor(0);
  y += 20;

  // Intro
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  const intro = doc.splitTextToSize(
    "Merci de prendre le temps de remplir ce questionnaire. Vos reponses nous permettront de concevoir un CRM parfaitement adapte a vos besoins. Temps estime : 15 a 20 minutes.",
    maxWidth
  ) as string[];
  for (const line of intro) {
    check();
    doc.text(line, marginX, y);
    y += 12;
  }
  doc.setTextColor(0);
  y += 10;

  // Sections
  let globalQ = 0;
  for (const sec of sections) {
    check(40);

    doc.setFillColor(241, 245, 249);
    doc.rect(marginX - 5, y - 12, maxWidth + 10, 32, "F");
    wl(sec.title, "bold", 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    const descWrapped = doc.splitTextToSize(sec.description, maxWidth) as string[];
    for (const line of descWrapped) {
      check();
      doc.text(line, marginX, y);
      y += 12;
    }
    doc.setTextColor(0);
    y += 8;

    for (const q of sec.questions) {
      globalQ++;
      check(40);

      wl(`Q${globalQ}. ${q.label}`, "bold", 10);
      y += 2;

      if (q.type === "checkbox" && q.options) {
        drawCheckboxes(q.options);
      } else if (q.type === "select" && q.options) {
        drawCheckboxes(q.options);
      } else if (q.type === "scale" && q.options) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(
          "(1 = Peu important, 5 = Indispensable)",
          marginX + 10,
          y
        );
        doc.setTextColor(0);
        y += 14;
        for (const opt of q.options) {
          drawScaleRow(opt);
        }
      } else if (q.type === "textarea") {
        drawBlankLines(4);
      } else {
        drawBlankLines(2);
      }

      y += 8;
    }

    y += 10;
  }

  // Footer
  check(30);
  doc.setDrawColor(200);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Merci pour vos reponses !", marginX, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Ce document est strictement confidentiel. Projet ${projectName}`,
    marginX,
    y
  );

  doc.save(
    `questionnaire-${projectId}-vierge-${new Date().toISOString().slice(0, 10)}.pdf`
  );
}
