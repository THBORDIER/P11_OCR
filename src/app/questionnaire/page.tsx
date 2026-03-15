"use client";

import { useState, useEffect, useCallback } from "react";
import { projectConfig } from "@/config/project.config";

// ── Types ──
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

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ vos sections et questions ci-dessous         ║
// ╚══════════════════════════════════════════════════════════════╝
const sections: Section[] = [
  {
    title: "1. Contexte et activité",
    description:
      "Pour bien comprendre votre activité et adapter la solution à vos besoins réels.",
    pourquoi:
      "Ces questions permettent de dimensionner le projet et d'adapter l'architecture technique.",
    questions: [
      {
        id: "q1_1",
        label: "Pouvez-vous décrire en quelques phrases votre activité principale ?",
        type: "textarea",
        placeholder: "Décrivez votre activité...",
        required: true,
      },
      {
        id: "q1_2",
        label: "Combien de personnes composent votre équipe ?",
        type: "select",
        options: ["1-5", "6-10", "11-20", "21-50", "50+"],
        required: true,
      },
      {
        id: "q1_3",
        label: "Quels sont les différents rôles qui utiliseront l'application ?",
        type: "checkbox",
        options: [
          "Direction / Management",
          "Équipe opérationnelle",
          "Support",
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
      "Pour comprendre votre environnement de travail actuel et les points de friction.",
    pourquoi:
      "Identifier les outils existants permet de planifier les intégrations et la migration.",
    questions: [
      {
        id: "q2_1",
        label: "Quels outils utilisez-vous actuellement pour gérer cette activité ?",
        type: "textarea",
        placeholder: "Ex : Excel, Google Sheets, un logiciel spécifique...",
        required: true,
      },
      {
        id: "q2_2",
        label: "Sur une échelle de 1 à 5, quel est votre niveau de satisfaction avec les outils actuels ?",
        type: "scale",
        required: true,
      },
      {
        id: "q2_3",
        label: "Quels sont les principaux problèmes rencontrés avec les outils actuels ?",
        type: "checkbox",
        options: [
          "Perte de données",
          "Doublons d'information",
          "Manque de visibilité",
          "Lenteur des processus",
          "Pas de collaboration en temps réel",
          "Autre",
        ],
      },
    ],
  },
  {
    title: "3. Fonctionnalités attendues",
    description:
      "Pour identifier les fonctionnalités prioritaires de la nouvelle solution.",
    pourquoi:
      "Prioriser les fonctionnalités selon vos besoins permet de livrer un MVP pertinent.",
    questions: [
      {
        id: "q3_1",
        label: "Quelles sont les 3 fonctionnalités les plus importantes pour vous ?",
        type: "textarea",
        placeholder: "Décrivez vos priorités...",
        required: true,
      },
      {
        id: "q3_2",
        label: "Avez-vous besoin d'intégrations avec des outils existants ?",
        type: "checkbox",
        options: [
          "Email (Outlook / Gmail)",
          "Calendrier",
          "Outils de messagerie (Slack / Teams)",
          "Suite bureautique",
          "Autre",
        ],
      },
      {
        id: "q3_3",
        label: "Quel est votre budget approximatif pour ce projet ?",
        type: "select",
        options: [
          "< 10 000 €",
          "10 000 - 30 000 €",
          "30 000 - 80 000 €",
          "80 000 - 150 000 €",
          "> 150 000 €",
        ],
      },
    ],
  },
  {
    title: "4. Contraintes et déploiement",
    description:
      "Pour anticiper les contraintes techniques et organisationnelles.",
    pourquoi:
      "Comprendre les contraintes permet d'adapter le planning et les choix techniques.",
    questions: [
      {
        id: "q4_1",
        label: "Avez-vous des contraintes de sécurité ou de conformité particulières ?",
        type: "textarea",
        placeholder: "Ex : RGPD, hébergement en France, SSO...",
      },
      {
        id: "q4_2",
        label: "Quelle est votre date de mise en production souhaitée ?",
        type: "text",
        placeholder: "Ex : Septembre 2026",
        required: true,
      },
      {
        id: "q4_3",
        label: "Les utilisateurs sont-ils prêts à consacrer du temps à la formation ?",
        type: "select",
        options: [
          "Oui, plusieurs sessions",
          "Oui, une session courte",
          "Non, l'outil doit être intuitif",
        ],
      },
    ],
  },
];

export default function QuestionnairePage() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [openSection, setOpenSection] = useState<number | null>(0);

  // Persistence localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${projectConfig.name}-questionnaire`);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
  }, []);

  const save = useCallback(
    (updated: Record<string, string | string[]>) => {
      try {
        localStorage.setItem(
          `${projectConfig.name}-questionnaire`,
          JSON.stringify(updated)
        );
      } catch {}
    },
    []
  );

  const handleChange = (id: string, value: string | string[]) => {
    const updated = { ...answers, [id]: value };
    setAnswers(updated);
    save(updated);
  };

  const handleCheckbox = (id: string, option: string, checked: boolean) => {
    const current = (answers[id] as string[]) || [];
    const updated = checked
      ? [...current, option]
      : current.filter((o) => o !== option);
    handleChange(id, updated);
  };

  const totalQuestions = sections.reduce(
    (acc, s) => acc + s.questions.length,
    0
  );
  const answeredQuestions = sections.reduce(
    (acc, s) =>
      acc +
      s.questions.filter((q) => {
        const a = answers[q.id];
        return a && (typeof a === "string" ? a.trim() !== "" : a.length > 0);
      }).length,
    0
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Questionnaire de recueil de besoins
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 1 — Formulaire de clarification des besoins client
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#334155]">
            Progression
          </span>
          <span className="text-sm text-[#64748b]">
            {answeredQuestions} / {totalQuestions} questions
          </span>
        </div>
        <div className="w-full bg-[#e2e8f0] rounded-full h-2">
          <div
            className="bg-[#3b82f6] h-2 rounded-full transition-all"
            style={{
              width: `${(answeredQuestions / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden"
          >
            <button
              onClick={() =>
                setOpenSection(openSection === sIndex ? null : sIndex)
              }
              className="w-full text-left p-6 flex items-center justify-between hover:bg-[#f8fafc] transition-colors"
            >
              <div>
                <h2 className="text-lg font-semibold text-[#1e293b]">
                  {section.title}
                </h2>
                <p className="text-sm text-[#64748b] mt-1">
                  {section.description}
                </p>
              </div>
              <span className="text-[#94a3b8] text-xl">
                {openSection === sIndex ? "−" : "+"}
              </span>
            </button>

            {openSection === sIndex && (
              <div className="px-6 pb-6 border-t border-[#f1f5f9]">
                <div className="bg-[#eff6ff] rounded-lg p-3 mt-4 mb-6">
                  <p className="text-xs text-[#1d4ed8]">
                    <strong>Pourquoi ces questions :</strong>{" "}
                    {section.pourquoi}
                  </p>
                </div>

                <div className="space-y-6">
                  {section.questions.map((q) => (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-[#334155] mb-2">
                        {q.label}
                        {q.required && (
                          <span className="text-[#ef4444] ml-1">*</span>
                        )}
                      </label>

                      {q.type === "text" && (
                        <input
                          type="text"
                          value={(answers[q.id] as string) || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          placeholder={q.placeholder}
                          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                        />
                      )}

                      {q.type === "textarea" && (
                        <textarea
                          value={(answers[q.id] as string) || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          placeholder={q.placeholder}
                          rows={3}
                          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                        />
                      )}

                      {q.type === "select" && (
                        <select
                          value={(answers[q.id] as string) || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                        >
                          <option value="">Sélectionnez...</option>
                          {q.options?.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      )}

                      {q.type === "checkbox" && (
                        <div className="flex flex-wrap gap-3">
                          {q.options?.map((o) => (
                            <label
                              key={o}
                              className="flex items-center gap-2 text-sm text-[#475569]"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  ((answers[q.id] as string[]) || []).includes(
                                    o
                                  )
                                }
                                onChange={(e) =>
                                  handleCheckbox(q.id, o, e.target.checked)
                                }
                                className="rounded border-[#e2e8f0]"
                              />
                              {o}
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === "scale" && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              onClick={() => handleChange(q.id, String(n))}
                              className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                                answers[q.id] === String(n)
                                  ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                                  : "border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9]"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                          <span className="text-xs text-[#94a3b8] self-center ml-2">
                            1 = Très insatisfait — 5 = Très satisfait
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
