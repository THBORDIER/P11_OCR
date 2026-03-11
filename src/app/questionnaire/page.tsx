"use client";

import { useState, useEffect, useCallback } from "react";

interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "scale";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface Section {
  title: string;
  description: string;
  pourquoi: string;
  questions: Question[];
}

const sections: Section[] = [
  {
    title: "1. Contexte business",
    description:
      "Pour bien comprendre votre activitÃƒÆ’Ã‚Â© et adapter le CRM ÃƒÆ’Ã‚Â  vos besoins rÃƒÆ’Ã‚Â©els.",
    pourquoi:
      "Ces questions permettent de dimensionner le projet (nombre d'utilisateurs, volume de donnÃƒÆ’Ã‚Â©es) et d'adapter l'architecture technique aux besoins rÃƒÆ’Ã‚Â©els de Spart.",
    questions: [
      {
        id: "q1_1",
        label: "Pouvez-vous dÃƒÆ’Ã‚Â©crire en quelques phrases l'activitÃƒÆ’Ã‚Â© principale de Spart et vos services proposÃƒÆ’Ã‚Â©s aux PME ?",
        type: "textarea",
        placeholder: "DÃƒÆ’Ã‚Â©crivez votre activitÃƒÆ’Ã‚Â©...",
        required: true,
      },
      {
        id: "q1_2",
        label: "Combien de personnes composent votre ÃƒÆ’Ã‚Â©quipe au total ?",
        type: "select",
        options: ["1-5", "6-10", "11-20", "21-50", "50+"],
        required: true,
      },
      {
        id: "q1_3",
        label: "Combien de clients et prospects gÃƒÆ’Ã‚Â©rez-vous actuellement (approximativement) ?",
        type: "select",
        options: [
          "Moins de 100",
          "100-500",
          "500-1000",
          "1000-5000",
          "Plus de 5000",
        ],
        required: true,
      },
      {
        id: "q1_4",
        label: "Quelle est la taille de votre ÃƒÆ’Ã‚Â©quipe commerciale (nombre de personnes) ?",
        type: "text",
        placeholder: "Ex : 8 commerciaux",
      },
      {
        id: "q1_5",
        label: "Quels sont les diffÃƒÆ’Ã‚Â©rents rÃƒÆ’Ã‚Â´les au sein de votre ÃƒÆ’Ã‚Â©quipe qui utiliseront le CRM ?",
        type: "checkbox",
        options: [
          "Commerciaux / BizDev",
          "Account Managers",
          "Support client",
          "Direction / Management",
          "Marketing",
          "Autre",
        ],
        required: true,
      },
    ],
  },
  {
    title: "2. Outils et pratiques actuels",
    description:
      "Pour comprendre comment vous travaillez aujourd'hui et identifier les points de friction.",
    pourquoi:
      "Comprendre l'existant est essentiel pour identifier les points de douleur, planifier la migration des donnÃƒÆ’Ã‚Â©es et assurer la compatibilitÃƒÆ’Ã‚Â© avec l'ÃƒÆ’Ã‚Â©cosystÃƒÆ’Ã‚Â¨me Microsoft 365.",
    questions: [
      {
        id: "q2_1",
        label: "Quels outils utilisez-vous actuellement pour gÃƒÆ’Ã‚Â©rer vos clients et prospects ?",
        type: "checkbox",
        options: [
          "Fichiers Excel / Google Sheets",
          "Emails (Outlook / Gmail)",
          "CRM existant (Salesforce, HubSpot...)",
          "Outils internes personnalisÃƒÆ’Ã‚Â©s",
          "Carnets / notes papier",
          "Autre",
        ],
      },
      {
        id: "q2_2",
        label: "Quelles sont les principales difficultÃƒÆ’Ã‚Â©s que vous rencontrez avec votre systÃƒÆ’Ã‚Â¨me actuel ?",
        type: "textarea",
        placeholder: "Ex : perte d'informations, doublons, manque de visibilitÃƒÆ’Ã‚Â©...",
        required: true,
      },
      {
        id: "q2_3",
        label: "Utilisez-vous un environnement Google Workspace ou Microsoft 365 ?",
        type: "select",
        options: [
          "Google Workspace (Gmail, Calendar, Drive)",
          "Microsoft 365 (Outlook, Teams, OneDrive)",
          "Les deux",
          "Autre",
        ],
      },
      {
        id: "q2_4",
        label: "Quels outils externes souhaitez-vous connecter au CRM ?",
        type: "checkbox",
        options: [
          "Email (Outlook / Gmail)",
          "Calendrier (Google Calendar / Outlook Calendar)",
          "Outil de facturation",
          "Outil de support (Zendesk, Freshdesk...)",
          "Marketing automation (HubSpot, Mailchimp...)",
          "Aucun pour l'instant",
        ],
      },
    ],
  },
  {
    title: "3. Objectifs et indicateurs de rÃƒÆ’Ã‚Â©ussite",
    description:
      "Pour dÃƒÆ’Ã‚Â©finir les rÃƒÆ’Ã‚Â©sultats attendus et mesurer le succÃƒÆ’Ã‚Â¨s du projet.",
    pourquoi:
      "DÃƒÆ’Ã‚Â©finir des objectifs mesurables permet de valider le succÃƒÆ’Ã‚Â¨s du projet via des KPIs concrets et d'orienter la priorisation MoSCoW du backlog.",
    questions: [
      {
        id: "q3_1",
        label: "Quels sont vos 3 objectifs principaux avec ce CRM ?",
        type: "textarea",
        placeholder: "Ex : centraliser les donnÃƒÆ’Ã‚Â©es, suivre le pipeline en temps rÃƒÆ’Ã‚Â©el...",
        required: true,
      },
      {
        id: "q3_2",
        label: "Comment mesurerez-vous le succÃƒÆ’Ã‚Â¨s du CRM ? Quels KPIs sont importants pour vous ?",
        type: "checkbox",
        options: [
          "Taux d'adoption par les ÃƒÆ’Ã‚Â©quipes",
          "Pipeline commercial ÃƒÆ’Ã‚Â  jour en temps rÃƒÆ’Ã‚Â©el",
          "RÃƒÆ’Ã‚Â©duction du temps de prÃƒÆ’Ã‚Â©paration des rÃƒÆ’Ã‚Â©unions",
          "Taux de conversion prospects/clients",
          "Satisfaction des utilisateurs internes",
          "Autre",
        ],
      },
      {
        id: "q3_3",
        label: "ÃƒÆ’Ã¢â€šÂ¬ quoi ressemblerait le CRM idÃƒÆ’Ã‚Â©al pour votre ÃƒÆ’Ã‚Â©quipe ?",
        type: "textarea",
        placeholder: "DÃƒÆ’Ã‚Â©crivez votre vision...",
      },
      {
        id: "q3_4",
        label: "Sur une ÃƒÆ’Ã‚Â©chelle de 1 ÃƒÆ’Ã‚Â  5, quelle importance accordez-vous ÃƒÆ’Ã‚Â  chacune de ces fonctionnalitÃƒÆ’Ã‚Â©s ?",
        type: "scale",
        options: [
          "Fiches clients et prospects",
          "Pipeline commercial visuel (Kanban)",
          "TÃƒÆ’Ã‚Â¢ches et rappels automatiques",
          "Tableaux de bord et reporting",
          "IntÃƒÆ’Ã‚Â©grations email et agenda",
        ],
      },
    ],
  },
  {
    title: "4. Contraintes et ressources",
    description:
      "Pour dimensionner le projet de maniÃƒÆ’Ã‚Â¨re rÃƒÆ’Ã‚Â©aliste et planifier les livrables.",
    pourquoi:
      "Ces informations conditionnent le planning, le pÃƒÆ’Ã‚Â©rimÃƒÆ’Ã‚Â¨tre du MVP et les choix techniques (budget, RGPD, migration, ressources disponibles).",
    questions: [
      {
        id: "q4_1",
        label: "Quel budget avez-vous prÃƒÆ’Ã‚Â©vu pour ce projet (mÃƒÆ’Ã‚Âªme une fourchette approximative) ?",
        type: "select",
        options: [
          "Moins de 50 000 EUR",
          "50 000 - 100 000 EUR",
          "100 000 - 150 000 EUR",
          "Plus de 150 000 EUR",
          "ÃƒÆ’Ã¢â€šÂ¬ dÃƒÆ’Ã‚Â©finir",
        ],
        required: true,
      },
      {
        id: "q4_2",
        label: "Avez-vous une date souhaitÃƒÆ’Ã‚Â©e pour la mise en service d'une premiÃƒÆ’Ã‚Â¨re version (MVP) ?",
        type: "text",
        placeholder: "Ex : d'ici 3 mois, septembre 2025...",
      },
      {
        id: "q4_3",
        label: "Qui sera votre interlocuteur principal (Product Owner) pour ce projet ?",
        type: "text",
        placeholder: "Nom et fonction",
        required: true,
      },
      {
        id: "q4_4",
        label: "Y a-t-il des donnÃƒÆ’Ã‚Â©es existantes ÃƒÆ’Ã‚Â  migrer vers le nouveau CRM ?",
        type: "select",
        options: [
          "Oui, beaucoup de donnÃƒÆ’Ã‚Â©es (Excel, ERP, emails)",
          "Oui, quelques fichiers Excel",
          "Non, on part de zÃƒÆ’Ã‚Â©ro",
          "Je ne sais pas encore",
        ],
      },
      {
        id: "q4_5",
        label: "Avez-vous des exigences en matiÃƒÆ’Ã‚Â¨re de sÃƒÆ’Ã‚Â©curitÃƒÆ’Ã‚Â© ou de conformitÃƒÆ’Ã‚Â© RGPD ?",
        type: "select",
        options: [
          "Oui, c'est prioritaire",
          "Oui, mais standard",
          "Pas de contrainte particuliÃƒÆ’Ã‚Â¨re",
          "Je ne sais pas",
        ],
      },
    ],
  },
  {
    title: "5. Vision et positionnement",
    description:
      "Pour comprendre votre vision ÃƒÆ’Ã‚Â  long terme et ÃƒÆ’Ã‚Â©viter les erreurs de conception.",
    pourquoi:
      "Anticiper l'ÃƒÆ’Ã‚Â©volution du produit permet d'ÃƒÆ’Ã‚Â©viter des erreurs d'architecture et de concevoir un CRM ÃƒÆ’Ã‚Â©volutif alignÃƒÆ’Ã‚Â© avec la stratÃƒÆ’Ã‚Â©gie de Spart.",
    questions: [
      {
        id: "q5_1",
        label: "Qu'est-ce que vous voulez absolument ÃƒÆ’Ã‚Â©viter dans ce CRM ?",
        type: "textarea",
        placeholder: "Ex : un outil trop complexe, trop de clics pour saisir une info...",
      },
      {
        id: "q5_2",
        label: "Le CRM est-il destinÃƒÆ’Ã‚Â© ÃƒÆ’Ã‚Â  rester un outil interne ou pourrait-il ÃƒÆ’Ã‚Âªtre proposÃƒÆ’Ã‚Â© ÃƒÆ’Ã‚Â  vos clients PME ?",
        type: "select",
        options: [
          "Outil strictement interne",
          "Pourrait ÃƒÆ’Ã‚Âªtre proposÃƒÆ’Ã‚Â© aux clients ÃƒÆ’Ã‚Â  terme",
          "Pas encore dÃƒÆ’Ã‚Â©fini",
        ],
      },
      {
        id: "q5_3",
        label: "Comment chaque rÃƒÆ’Ã‚Â´le devrait-il voir les donnÃƒÆ’Ã‚Â©es ? (chacun voit tout, ou vision restreinte)",
        type: "select",
        options: [
          "Chacun voit uniquement ses propres donnÃƒÆ’Ã‚Â©es",
          "Vision par ÃƒÆ’Ã‚Â©quipe",
          "Tout le monde voit tout",
          "Cela dÃƒÆ’Ã‚Â©pend du rÃƒÆ’Ã‚Â´le (ÃƒÆ’Ã‚Â  dÃƒÆ’Ã‚Â©finir ensemble)",
        ],
      },
      {
        id: "q5_4",
        label: "Y a-t-il autre chose que vous souhaiteriez nous partager et que nous n'avons pas abordÃƒÆ’Ã‚Â© ?",
        type: "textarea",
        placeholder: "Champ libre...",
      },
    ],
  },
];

function createFakeFormData(): Record<string, string | string[]> {
  const fakeTextAnswers: Record<string, string> = {
    q1_1: "Spart accompagne les PME dans la digitalisation commerciale et operationnelle.",
    q1_4: "10 commerciaux",
    q2_2: "Donnees dispersees, doublons frequents, faible visibilite sur le pipeline.",
    q3_1: "Centraliser les donnees, fiabiliser le suivi commercial, accelerer les relances.",
    q3_3: "Un CRM simple, rapide, utilisable sur mobile et partage par toute l'equipe.",
    q4_2: "MVP attendu dans 3 mois.",
    q4_3: "Sophie Martin - Directrice commerciale",
    q5_1: "Eviter un outil lourd, lent et difficile a adopter.",
    q5_4: "Besoin d'un reporting manager fiable avant chaque comite hebdomadaire.",
  };

  const data: Record<string, string | string[]> = {};

  for (const section of sections) {
    for (const question of section.questions) {
      if (question.type === "checkbox") {
        data[question.id] = (question.options || []).slice(0, 2);
        continue;
      }

      if (question.type === "select") {
        data[question.id] = question.options?.[0] || "";
        continue;
      }

      if (question.type === "scale" && question.options) {
        question.options.forEach((opt, index) => {
          data[`${question.id}_${opt}`] = String(5 - (index % 3));
        });
        continue;
      }

      data[question.id] = fakeTextAnswers[question.id] || "Reponse fictive client.";
    }
  }

  return data;
}
const STORAGE_KEY = "spartcrm-questionnaire";
const FAKE_FORM_DATA = createFakeFormData();

export default function QuestionnairePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFormData(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage on every change
  const saveToStorage = useCallback((data: Record<string, string | string[]>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [id]: value };
      saveToStorage(next);
      return next;
    });
  };

  const handleCheckboxChange = (id: string, option: string, checked: boolean) => {
    setFormData((prev) => {
      const current = (prev[id] as string[]) || [];
      let next: Record<string, string | string[]>;
      if (checked) {
        next = { ...prev, [id]: [...current, option] };
      } else {
        next = { ...prev, [id]: current.filter((o) => o !== option) };
      }
      saveToStorage(next);
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Optionally clear localStorage after submission
    // localStorage.removeItem(STORAGE_KEY);
  };
  const getAnsweredCountFromData = useCallback((data: Record<string, string | string[]>): { answered: number; total: number } => {
    let total = 0;
    let answered = 0;

    for (const sec of sections) {
      for (const q of sec.questions) {
        total++;
        if (q.type === "scale" && q.options) {
          const hasAnswer = q.options.some(
            (opt) => data[`${q.id}_${opt}`] && String(data[`${q.id}_${opt}`]).trim() !== ""
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
  }, []);

  const generateMarkdown = useCallback((data: Record<string, string | string[]> = formData): string => {
    const lines: string[] = [];
    lines.push("# Questionnaire de recueil de besoins - SpartCRM");
    lines.push("");
    lines.push(`> Document genere le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} a ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`);
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

    const { answered: a, total: t } = getAnsweredCountFromData(data);
    lines.push("## Recapitulatif");
    lines.push("");
    lines.push(`- **Questions repondues :** ${a} / ${t}`);
    lines.push(`- **Taux de completion :** ${t > 0 ? Math.round((a / t) * 100) : 0}%`);
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("*Document genere automatiquement depuis le questionnaire SpartCRM.*");

    return lines.join("\n");
  }, [formData, getAnsweredCountFromData]);

  const downloadMarkdown = useCallback((data: Record<string, string | string[]> = formData, filePrefix = "questionnaire-spartcrm") => {
    const md = generateMarkdown(data);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formData, generateMarkdown]);

  const downloadPdf = useCallback(async (
    data: Record<string, string | string[]>,
    filePrefix: string,
    title: string
  ) => {
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

    const writeLines = (input: string, font: "normal" | "bold" = "normal", size = 11) => {
      doc.setFont("helvetica", font);
      doc.setFontSize(size);
      const wrapped = doc.splitTextToSize(input, maxWidth) as string[];
      for (const line of wrapped) {
        if (y > pageBottom) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(line, marginX, y);
        y += lineHeight;
      }
    };

    writeLines(title, "bold", 16);
    y += 4;
    writeLines(`Genere le ${new Date().toLocaleDateString("fr-FR")} a ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`);
    y += 8;

    let globalIndex = 0;
    for (const sec of sections) {
      writeLines(sec.title, "bold", 13);
      writeLines(sec.description);
      y += 2;

      for (const q of sec.questions) {
        globalIndex++;
        writeLines(`Q${globalIndex}. ${q.label}`, "bold");

        if (q.type === "scale" && q.options) {
          for (const opt of q.options) {
            const val = data[`${q.id}_${opt}`];
            writeLines(`- ${opt}: ${val && String(val).trim() !== "" ? `${val}/5` : "Non renseigne"}`);
          }
        } else if (q.type === "checkbox") {
          const val = data[q.id] as string[] | undefined;
          writeLines(`- ${val && val.length ? val.join(", ") : "Non renseigne"}`);
        } else {
          const val = data[q.id] as string | undefined;
          writeLines(`- ${val && val.trim() !== "" ? val : "Non renseigne"}`);
        }

        y += 4;
      }

      y += 6;
    }

    const counts = getAnsweredCountFromData(data);
    writeLines(`Recapitulatif: ${counts.answered}/${counts.total} questions repondues (${counts.total > 0 ? Math.round((counts.answered / counts.total) * 100) : 0}%)`, "bold");

    doc.save(`${filePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }, [getAnsweredCountFromData]);

  const downloadCurrentPdf = useCallback(() => {
    void downloadPdf(formData, "questionnaire-spartcrm", "Questionnaire de recueil de besoins - SpartCRM");
  }, [downloadPdf, formData]);

  const downloadFakePdf = useCallback(() => {
    void downloadPdf(FAKE_FORM_DATA, "questionnaire-spartcrm-fake", "Questionnaire fictif - SpartCRM");
  }, [downloadPdf]);

  const getAnsweredCount = (): { answered: number; total: number } => getAnsweredCountFromData(formData);

  // Submitted confirmation screen
  if (submitted) {
    const { answered, total } = getAnsweredCount();
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Questionnaire de recueil de besoins
          </h1>
          <p className="text-[#64748b] mt-2">
            Livrable 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Document envoyÃƒÆ’Ã‚Â© au client Spart pour clarifier le brief initial
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 text-center">
          <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-2">
            Merci pour vos rÃƒÆ’Ã‚Â©ponses !
          </h2>
          <p className="text-[#64748b] mb-4">
            Votre questionnaire a ÃƒÆ’Ã‚Â©tÃƒÆ’Ã‚Â© soumis avec succÃƒÆ’Ã‚Â¨s.
            Vous avez rÃƒÆ’Ã‚Â©pondu ÃƒÆ’Ã‚Â  {answered} question{answered > 1 ? "s" : ""} sur {total}.
          </p>
          <p className="text-sm text-[#94a3b8] mb-6">
            Nous analyserons vos rÃƒÆ’Ã‚Â©ponses et reviendrons vers vous rapidement
            pour la prochaine ÃƒÆ’Ã‚Â©tape du projet.
          </p>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 inline-block">
            <p className="text-sm text-[#166534]">
              Un rÃƒÆ’Ã‚Â©capitulatif vous sera envoyÃƒÆ’Ã‚Â© par email. Vos rÃƒÆ’Ã‚Â©ponses sont
              sauvegardÃƒÆ’Ã‚Â©es localement et peuvent ÃƒÆ’Ã‚Âªtre consultÃƒÆ’Ã‚Â©es ÃƒÆ’Ã‚Â  tout moment.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#475569] hover:bg-[#f8fafc]"
            >
              Revenir au questionnaire
            </button>
            <button
              onClick={() => downloadMarkdown(formData, "questionnaire-spartcrm")}
              className="px-6 py-2 rounded-lg bg-[#3b82f6] text-white text-sm hover:bg-[#2563eb]"
            >
              Telecharger (.md)
            </button>
            <button
              onClick={downloadCurrentPdf}
              className="px-6 py-2 rounded-lg bg-[#0ea5e9] text-white text-sm hover:bg-[#0284c7]"
            >
              Telecharger (.pdf)
            </button>
            <button
              onClick={downloadFakePdf}
              className="px-6 py-2 rounded-lg border border-[#0ea5e9] text-[#0ea5e9] text-sm hover:bg-[#e0f2fe]"
            >
              Fake (.pdf)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const section = sections[currentSection];
  const { answered, total } = getAnsweredCount();
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Questionnaire de recueil de besoins
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Document envoyÃƒÆ’Ã‚Â© au client Spart pour clarifier le brief initial
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold mb-2">Introduction</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Bonjour et merci de prendre le temps de rÃƒÆ’Ã‚Â©pondre ÃƒÆ’Ã‚Â  ce questionnaire.
          Je suis Thomas Bordier, dÃƒÆ’Ã‚Â©veloppeur Low-Code freelance, en charge du
          dÃƒÆ’Ã‚Â©veloppement de votre CRM sur-mesure. Ce questionnaire a pour
          objectif de recueillir toutes les informations nÃƒÆ’Ã‚Â©cessaires pour
          comprendre votre activitÃƒÆ’Ã‚Â© et vos besoins rÃƒÆ’Ã‚Â©els, prÃƒÆ’Ã‚Â©parer un backlog
          produit complet, planifier les livraisons par ÃƒÆ’Ã‚Â©tapes et dÃƒÆ’Ã‚Â©finir les
          prioritÃƒÆ’Ã‚Â©s fonctionnelles dÃƒÆ’Ã‚Â¨s le dÃƒÆ’Ã‚Â©part.
        </p>
        <p className="text-sm text-[#475569] mt-2">
          <strong>Temps estimÃƒÆ’Ã‚Â© :</strong> 15 ÃƒÆ’Ã‚Â  20 minutes. Vos rÃƒÆ’Ã‚Â©ponses
          serviront directement ÃƒÆ’Ã‚Â  concevoir un produit adaptÃƒÆ’Ã‚Â© ÃƒÆ’Ã‚Â  vos besoins
          mÃƒÆ’Ã‚Â©tier.
        </p>
      </div>

      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-[#1e40af]">
          Besoin d'un export de demonstration ? Generez le questionnaire fictif en PDF a tout moment.
        </p>
        <button
          onClick={downloadFakePdf}
          className="px-4 py-2 rounded-lg bg-[#1d4ed8] text-white text-sm hover:bg-[#1e40af]"
        >
          Exporter fake (.pdf)
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-6">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentSection(i)}
            className={`flex-1 h-2 rounded-full transition-colors ${
              i <= currentSection ? "bg-[#3b82f6]" : "bg-[#e2e8f0]"
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-[#64748b] mb-4">
        Section {currentSection + 1} / {sections.length}
      </div>

      {/* Section */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
        <h2 className="text-xl font-semibold text-[#1e293b] mb-1">
          {section.title}
        </h2>
        <p className="text-sm text-[#64748b] mb-4">{section.description}</p>

        {/* Pourquoi - justification block */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold text-[#1e40af] mb-1">
                Pourquoi ces questions ?
              </p>
              <p className="text-sm text-[#1e40af]">
                {section.pourquoi}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {section.questions.map((q, qIndex) => {
            // Compute global question number (Q1, Q2, ... across all sections)
            const globalIndex =
              sections
                .slice(0, currentSection)
                .reduce((acc, s) => acc + s.questions.length, 0) +
              qIndex +
              1;

            return (
            <div key={q.id}>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                <span className="inline-flex items-center justify-center bg-[#3b82f6] text-white text-xs font-bold rounded-full w-7 h-7 mr-2">
                  Q{globalIndex}
                </span>
                {q.label}
                {q.required && <span className="text-[#ef4444] ml-1">*</span>}
              </label>

              {q.type === "text" && (
                <input
                  type="text"
                  value={(formData[q.id] as string) || ""}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  value={(formData[q.id] as string) || ""}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
              )}

              {q.type === "select" && (
                <select
                  value={(formData[q.id] as string) || ""}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                >
                  <option value="">-- SÃƒÆ’Ã‚Â©lectionnez --</option>
                  {q.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {q.type === "checkbox" && (
                <div className="space-y-2">
                  {q.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-[#475569]"
                    >
                      <input
                        type="checkbox"
                        checked={((formData[q.id] as string[]) || []).includes(opt)}
                        onChange={(e) =>
                          handleCheckboxChange(q.id, opt, e.target.checked)
                        }
                        className="rounded border-[#e2e8f0]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === "scale" && (
                <div className="space-y-3">
                  {q.options?.map((opt) => (
                    <div key={opt} className="flex items-center gap-4">
                      <span className="text-sm text-[#475569] w-64">{opt}</span>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <label
                            key={n}
                            className="flex flex-col items-center gap-1"
                          >
                            <input
                              type="radio"
                              name={`${q.id}_${opt}`}
                              value={n}
                              checked={formData[`${q.id}_${opt}`] === String(n)}
                              onChange={() =>
                                handleInputChange(`${q.id}_${opt}`, String(n))
                              }
                              className="accent-[#3b82f6]"
                            />
                            <span className="text-xs text-[#94a3b8]">{n}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-[#94a3b8] pl-64 ml-4 pr-2">
                    <span>Pas important</span>
                    <span>Essentiel</span>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Recap before submit on last section */}
        {isLastSection && (
          <div className="mt-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#334155] mb-2">
              RÃƒÆ’Ã‚Â©capitulatif avant soumission
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#e2e8f0] rounded-full h-2">
                <div
                  className="bg-[#3b82f6] h-2 rounded-full transition-all"
                  style={{ width: `${total > 0 ? (answered / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-[#475569] whitespace-nowrap">
                {answered} / {total} questions rÃƒÆ’Ã‚Â©pondues
              </span>
            </div>
            {answered < total && (
              <p className="text-xs text-[#94a3b8] mt-2">
                Certaines questions n'ont pas encore ÃƒÆ’Ã‚Â©tÃƒÆ’Ã‚Â© complÃƒÆ’Ã‚Â©tÃƒÆ’Ã‚Â©es.
                Vous pouvez tout de mÃƒÆ’Ã‚Âªme soumettre le questionnaire.
              </p>
            )}
            {answered === total && (
              <p className="text-xs text-[#22c55e] mt-2">
                Toutes les questions ont ÃƒÆ’Ã‚Â©tÃƒÆ’Ã‚Â© complÃƒÆ’Ã‚Â©tÃƒÆ’Ã‚Â©es. Vous pouvez soumettre le questionnaire.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentSection((p) => Math.max(0, p - 1))}
            disabled={currentSection === 0}
            className="px-6 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#475569] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Precedent
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => downloadMarkdown(formData, "questionnaire-spartcrm")}
              className="px-4 py-2 rounded-lg border border-[#3b82f6] text-[#3b82f6] text-sm hover:bg-[#eff6ff]"
              title="Telecharger les reponses en Markdown"
            >
              Telecharger (.md)
            </button>
            <button
              onClick={downloadCurrentPdf}
              className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white text-sm hover:bg-[#0284c7]"
              title="Telecharger les reponses en PDF"
            >
              Telecharger (.pdf)
            </button>
            <button
              onClick={downloadFakePdf}
              className="px-4 py-2 rounded-lg border border-[#0ea5e9] text-[#0ea5e9] text-sm hover:bg-[#e0f2fe]"
              title="Telecharger le questionnaire fictif en PDF"
            >
              Fake (.pdf)
            </button>
            {currentSection < sections.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentSection((p) => Math.min(sections.length - 1, p + 1))
                }
                className="px-6 py-2 rounded-lg bg-[#3b82f6] text-white text-sm hover:bg-[#2563eb]"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-[#22c55e] text-white text-sm hover:bg-[#16a34a]"
              >
                Soumettre le questionnaire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
