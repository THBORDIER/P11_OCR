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
      "Pour bien comprendre votre activité et adapter le CRM à vos besoins réels.",
    pourquoi:
      "Ces questions permettent de dimensionner le projet (nombre d'utilisateurs, volume de données) et d'adapter l'architecture technique aux besoins réels de Spart.",
    questions: [
      {
        id: "q1_1",
        label: "Pouvez-vous décrire en quelques phrases l'activité principale de Spart et vos services proposés aux PME ?",
        type: "textarea",
        placeholder: "Décrivez votre activité...",
        required: true,
      },
      {
        id: "q1_2",
        label: "Combien de personnes composent votre équipe au total ?",
        type: "select",
        options: ["1-5", "6-10", "11-20", "21-50", "50+"],
        required: true,
      },
      {
        id: "q1_3",
        label: "Combien de clients et prospects gérez-vous actuellement (approximativement) ?",
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
        label: "Quelle est la taille de votre équipe commerciale (nombre de personnes) ?",
        type: "text",
        placeholder: "Ex : 8 commerciaux",
      },
      {
        id: "q1_5",
        label: "Quels sont les différents rôles au sein de votre équipe qui utiliseront le CRM ?",
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
      "Comprendre l'existant est essentiel pour identifier les points de douleur, planifier la migration des données et assurer la compatibilité avec l'écosystème Microsoft 365.",
    questions: [
      {
        id: "q2_1",
        label: "Quels outils utilisez-vous actuellement pour gérer vos clients et prospects ?",
        type: "checkbox",
        options: [
          "Fichiers Excel / Google Sheets",
          "Emails (Outlook / Gmail)",
          "CRM existant (Salesforce, HubSpot...)",
          "Outils internes personnalisés",
          "Carnets / notes papier",
          "Autre",
        ],
      },
      {
        id: "q2_2",
        label: "Quelles sont les principales difficultés que vous rencontrez avec votre système actuel ?",
        type: "textarea",
        placeholder: "Ex : perte d'informations, doublons, manque de visibilité...",
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
    title: "3. Objectifs et indicateurs de réussite",
    description:
      "Pour définir les résultats attendus et mesurer le succès du projet.",
    pourquoi:
      "Définir des objectifs mesurables permet de valider le succès du projet via des KPIs concrets et d'orienter la priorisation MoSCoW du backlog.",
    questions: [
      {
        id: "q3_1",
        label: "Quels sont vos 3 objectifs principaux avec ce CRM ?",
        type: "textarea",
        placeholder: "Ex : centraliser les données, suivre le pipeline en temps réel...",
        required: true,
      },
      {
        id: "q3_2",
        label: "Comment mesurerez-vous le succès du CRM ? Quels KPIs sont importants pour vous ?",
        type: "checkbox",
        options: [
          "Taux d'adoption par les équipes",
          "Pipeline commercial à jour en temps réel",
          "Réduction du temps de préparation des réunions",
          "Taux de conversion prospects/clients",
          "Satisfaction des utilisateurs internes",
          "Autre",
        ],
      },
      {
        id: "q3_3",
        label: "À quoi ressemblerait le CRM idéal pour votre équipe ?",
        type: "textarea",
        placeholder: "Décrivez votre vision...",
      },
      {
        id: "q3_4",
        label: "Sur une échelle de 1 à 5, quelle importance accordez-vous à chacune de ces fonctionnalités ?",
        type: "scale",
        options: [
          "Fiches clients et prospects",
          "Pipeline commercial visuel (Kanban)",
          "Tâches et rappels automatiques",
          "Tableaux de bord et reporting",
          "Intégrations email et agenda",
        ],
      },
    ],
  },
  {
    title: "4. Contraintes et ressources",
    description:
      "Pour dimensionner le projet de manière réaliste et planifier les livrables.",
    pourquoi:
      "Ces informations conditionnent le planning, le périmètre du MVP et les choix techniques (budget, RGPD, migration, ressources disponibles).",
    questions: [
      {
        id: "q4_1",
        label: "Quel budget avez-vous prévu pour ce projet (même une fourchette approximative) ?",
        type: "select",
        options: [
          "Moins de 50 000 EUR",
          "50 000 - 100 000 EUR",
          "100 000 - 150 000 EUR",
          "Plus de 150 000 EUR",
          "À définir",
        ],
        required: true,
      },
      {
        id: "q4_2",
        label: "Avez-vous une date souhaitée pour la mise en service d'une première version (MVP) ?",
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
        label: "Y a-t-il des données existantes à migrer vers le nouveau CRM ?",
        type: "select",
        options: [
          "Oui, beaucoup de données (Excel, ERP, emails)",
          "Oui, quelques fichiers Excel",
          "Non, on part de zéro",
          "Je ne sais pas encore",
        ],
      },
      {
        id: "q4_5",
        label: "Avez-vous des exigences en matière de sécurité ou de conformité RGPD ?",
        type: "select",
        options: [
          "Oui, c'est prioritaire",
          "Oui, mais standard",
          "Pas de contrainte particulière",
          "Je ne sais pas",
        ],
      },
    ],
  },
  {
    title: "5. Vision et positionnement",
    description:
      "Pour comprendre votre vision à long terme et éviter les erreurs de conception.",
    pourquoi:
      "Anticiper l'évolution du produit permet d'éviter des erreurs d'architecture et de concevoir un CRM évolutif aligné avec la stratégie de Spart.",
    questions: [
      {
        id: "q5_1",
        label: "Qu'est-ce que vous voulez absolument éviter dans ce CRM ?",
        type: "textarea",
        placeholder: "Ex : un outil trop complexe, trop de clics pour saisir une info...",
      },
      {
        id: "q5_2",
        label: "Le CRM est-il destiné à rester un outil interne ou pourrait-il être proposé à vos clients PME ?",
        type: "select",
        options: [
          "Outil strictement interne",
          "Pourrait être proposé aux clients à terme",
          "Pas encore défini",
        ],
      },
      {
        id: "q5_3",
        label: "Comment chaque rôle devrait-il voir les données ? (chacun voit tout, ou vision restreinte)",
        type: "select",
        options: [
          "Chacun voit uniquement ses propres données",
          "Vision par équipe",
          "Tout le monde voit tout",
          "Cela dépend du rôle (à définir ensemble)",
        ],
      },
      {
        id: "q5_4",
        label: "Y a-t-il autre chose que vous souhaiteriez nous partager et que nous n'avons pas abordé ?",
        type: "textarea",
        placeholder: "Champ libre...",
      },
    ],
  },
];

const STORAGE_KEY = "spartcrm-questionnaire";

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

  // Generate Markdown content from responses
  const generateMarkdown = useCallback((): string => {
    const lines: string[] = [];
    lines.push("# Questionnaire de recueil de besoins — SpartCRM");
    lines.push("");
    lines.push(`> Document généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`);
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
            const val = formData[`${q.id}_${opt}`];
            if (val && String(val).trim() !== "") {
              lines.push(`- **${opt}** : ${val}/5`);
              hasAnyScale = true;
            } else {
              lines.push(`- **${opt}** : _Non renseigné_`);
            }
          }
          if (!hasAnyScale) {
            lines.push("_Aucune note attribuée_");
          }
        } else if (q.type === "checkbox") {
          const val = formData[q.id] as string[] | undefined;
          if (val && val.length > 0) {
            for (const item of val) {
              lines.push(`- [x] ${item}`);
            }
            // Show unchecked options too
            const unchecked = (q.options || []).filter((o) => !val.includes(o));
            for (const item of unchecked) {
              lines.push(`- [ ] ${item}`);
            }
          } else {
            lines.push("_Non renseigné_");
          }
        } else {
          const val = formData[q.id] as string | undefined;
          if (val && val.trim() !== "") {
            lines.push(`**Réponse :** ${val}`);
          } else {
            lines.push("_Non renseigné_");
          }
        }

        lines.push("");
      }

      lines.push("---");
      lines.push("");
    }

    // Summary footer
    const { answered: a, total: t } = getAnsweredCount();
    lines.push(`## Récapitulatif`);
    lines.push("");
    lines.push(`- **Questions répondues :** ${a} / ${t}`);
    lines.push(`- **Taux de complétion :** ${t > 0 ? Math.round((a / t) * 100) : 0}%`);
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("*Document généré automatiquement depuis le questionnaire SpartCRM.*");

    return lines.join("\n");
  }, [formData]);

  // Download Markdown file
  const downloadMarkdown = useCallback(() => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `questionnaire-spartcrm-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateMarkdown]);

  // Count answered questions
  const getAnsweredCount = (): { answered: number; total: number } => {
    let total = 0;
    let answered = 0;
    for (const sec of sections) {
      for (const q of sec.questions) {
        total++;
        if (q.type === "scale" && q.options) {
          // For scale, check if at least one sub-option is answered
          const hasAnswer = q.options.some(
            (opt) => formData[`${q.id}_${opt}`] && String(formData[`${q.id}_${opt}`]).trim() !== ""
          );
          if (hasAnswer) answered++;
        } else if (q.type === "checkbox") {
          const val = formData[q.id] as string[] | undefined;
          if (val && val.length > 0) answered++;
        } else {
          const val = formData[q.id] as string | undefined;
          if (val && val.trim() !== "") answered++;
        }
      }
    }
    return { answered, total };
  };

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
            Livrable 1 — Document envoyé au client Spart pour clarifier le brief initial
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
            Merci pour vos réponses !
          </h2>
          <p className="text-[#64748b] mb-4">
            Votre questionnaire a été soumis avec succès.
            Vous avez répondu à {answered} question{answered > 1 ? "s" : ""} sur {total}.
          </p>
          <p className="text-sm text-[#94a3b8] mb-6">
            Nous analyserons vos réponses et reviendrons vers vous rapidement
            pour la prochaine étape du projet.
          </p>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 inline-block">
            <p className="text-sm text-[#166534]">
              Un récapitulatif vous sera envoyé par email. Vos réponses sont
              sauvegardées localement et peuvent être consultées à tout moment.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#475569] hover:bg-[#f8fafc]"
            >
              Revenir au questionnaire
            </button>
            <button
              onClick={downloadMarkdown}
              className="px-6 py-2 rounded-lg bg-[#3b82f6] text-white text-sm hover:bg-[#2563eb] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger (.md)
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
          Livrable 1 — Document envoyé au client Spart pour clarifier le brief initial
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold mb-2">Introduction</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Bonjour et merci de prendre le temps de répondre à ce questionnaire.
          Je suis Thomas Bordier, développeur Low-Code freelance, en charge du
          développement de votre CRM sur-mesure. Ce questionnaire a pour
          objectif de recueillir toutes les informations nécessaires pour
          comprendre votre activité et vos besoins réels, préparer un backlog
          produit complet, planifier les livraisons par étapes et définir les
          priorités fonctionnelles dès le départ.
        </p>
        <p className="text-sm text-[#475569] mt-2">
          <strong>Temps estimé :</strong> 15 à 20 minutes. Vos réponses
          serviront directement à concevoir un produit adapté à vos besoins
          métier.
        </p>
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
                  <option value="">-- Sélectionnez --</option>
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
              Récapitulatif avant soumission
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#e2e8f0] rounded-full h-2">
                <div
                  className="bg-[#3b82f6] h-2 rounded-full transition-all"
                  style={{ width: `${total > 0 ? (answered / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-[#475569] whitespace-nowrap">
                {answered} / {total} questions répondues
              </span>
            </div>
            {answered < total && (
              <p className="text-xs text-[#94a3b8] mt-2">
                Certaines questions n'ont pas encore été complétées.
                Vous pouvez tout de même soumettre le questionnaire.
              </p>
            )}
            {answered === total && (
              <p className="text-xs text-[#22c55e] mt-2">
                Toutes les questions ont été complétées. Vous pouvez soumettre le questionnaire.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrentSection((p) => Math.max(0, p - 1))}
            disabled={currentSection === 0}
            className="px-6 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#475569] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            onClick={downloadMarkdown}
            className="px-4 py-2 rounded-lg border border-[#3b82f6] text-[#3b82f6] text-sm hover:bg-[#eff6ff] flex items-center gap-2"
            title="Télécharger les réponses en Markdown"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger (.md)
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
  );
}
