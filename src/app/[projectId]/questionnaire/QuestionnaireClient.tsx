"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AiGenerateButton from "@/components/AiGenerateButton";
import {
  getAnsweredCount,
  downloadMarkdown,
  downloadFilledPdf,
  downloadBlankPdf,
  type PdfSection,
} from "@/lib/questionnaire-pdf";

// ── Respondents Panel — shows client responses ──────────────

interface RespondentData {
  id: string;
  name: string;
  email?: string;
  role?: string;
  _count: { responses: number };
  createdAt: string;
}

function RespondentsPanel({ projectId, sections }: { projectId: string; sections: Section[] }) {
  const [respondents, setRespondents] = useState<RespondentData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/questionnaire`)
      .then((r) => r.json())
      .then((data) => {
        setRespondents(data.respondents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const loadResponses = async (respondentId: string) => {
    if (selectedId === respondentId) {
      setSelectedId(null);
      return;
    }
    setSelectedId(respondentId);
    const res = await fetch(`/api/projects/${projectId}/questionnaire?respondentId=${respondentId}`);
    const data = await res.json();
    setResponses(data);
  };

  if (loading) return null;
  if (respondents.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 font-medium">Aucune réponse reçue</p>
        <p className="text-xs text-amber-600 mt-1">
          Envoyez le lien du questionnaire au client pour commencer à recevoir des réponses.
        </p>
      </div>
    );
  }

  // Build question map for labels
  const questionMap = new Map<string, string>();
  for (const s of sections) {
    for (const q of s.questions) {
      questionMap.set(q.id, q.label);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
      <h2 className="text-base font-semibold text-[#1e293b] mb-1">
        Réponses reçues
      </h2>
      <p className="text-xs text-[#94a3b8] mb-4">
        {respondents.length} répondant{respondents.length > 1 ? "s" : ""} — Cliquez pour voir les réponses
      </p>

      <div className="space-y-2">
        {respondents.map((r) => (
          <div key={r.id}>
            <button
              onClick={() => loadResponses(r.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                selectedId === r.id
                  ? "bg-[#eff6ff] border border-[#3b82f6]"
                  : "bg-[#f8fafc] hover:bg-[#f1f5f9] border border-transparent"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {r.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1e293b] truncate">{r.name}</p>
                <p className="text-xs text-[#94a3b8]">
                  {r.role || "—"}{r.email ? ` · ${r.email}` : ""} · {r._count.responses} réponses
                </p>
              </div>
              <span className="text-xs text-[#94a3b8] shrink-0">
                {new Date(r.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <svg
                className={`w-4 h-4 text-[#94a3b8] transition-transform ${selectedId === r.id ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded responses */}
            {selectedId === r.id && (
              <div className="mt-2 ml-12 space-y-3 pb-2">
                {sections.map((section) => {
                  const sectionResponses = section.questions.filter((q) => responses[q.id]);
                  if (sectionResponses.length === 0) return null;
                  return (
                    <div key={section.title}>
                      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                        {section.title}
                      </p>
                      {sectionResponses.map((q) => (
                        <div key={q.id} className="mb-2">
                          <p className="text-xs text-[#94a3b8]">{q.label}</p>
                          <p className="text-sm text-[#1e293b] bg-[#f8fafc] rounded px-3 py-1.5 mt-0.5">
                            {responses[q.id]}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })}
                {Object.keys(responses).length === 0 && (
                  <p className="text-xs text-[#94a3b8] italic">Aucune réponse enregistrée</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main types ──────────────────────────────────────────────

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

interface QuestionnaireClientProps {
  sections: Section[];
  projectId: string;
  projectName: string;
  isOwner?: boolean;
}

function createFakeFormData(sections: Section[]): Record<string, string | string[]> {
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
      data[question.id] = "Exemple de réponse client.";
    }
  }

  return data;
}

export default function QuestionnaireClient({ sections, projectId, projectName, isOwner }: QuestionnaireClientProps) {
  const router = useRouter();

  // AI generation callback for questionnaire sections
  const handleAiGenerated = async (items: Record<string, unknown>[]) => {
    for (const item of items) {
      const section = item as { sectionTitle?: string; sectionDescription?: string; questions?: { label: string; type: string; options?: string[]; required?: boolean }[] };
      // Create section with questions via dedicated API
      await fetch(`/api/projects/${projectId}/questionnaire`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: section.sectionTitle || (item as Record<string, string>).label || "Section",
          description: section.sectionDescription || "",
          questions: section.questions || [{ label: (item as Record<string, string>).label, type: (item as Record<string, string>).type || "textarea", required: true }],
        }),
      });
    }
    window.location.reload();
  };

  // Empty state
  if (!sections.length) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Questionnaire de recueil de besoins
          </h1>
          <p className="text-[#64748b] mt-2">
            Recueil de besoins client
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-lg mb-2">Aucune question</p>
          <p className="text-[#94a3b8] text-sm mb-4">
            Générez des questions avec l'IA ou ajoutez-les manuellement.
          </p>
          <AiGenerateButton
            type="questionnaire"
            projectId={projectId}
            label="Générer le questionnaire"
            hasExistingData={false}
            onGenerated={handleAiGenerated}
          />
        </div>
      </div>
    );
  }

  const STORAGE_KEY = `${projectId}-questionnaire`;
  const FAKE_FORM_DATA = createFakeFormData(sections);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  // Cast sections for PDF helpers (same shape, just lacks pourquoi which is unused)
  const pdfSections: PdfSection[] = sections;

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
  };

  const handleDownloadMd = useCallback(
    (data: Record<string, string | string[]> = formData) => {
      downloadMarkdown(pdfSections, data, projectName, `questionnaire-${projectId}`);
    },
    [formData, pdfSections, projectName, projectId]
  );

  const handleDownloadPdf = useCallback(() => {
    void downloadFilledPdf(
      pdfSections,
      formData,
      `questionnaire-${projectId}`,
      `Questionnaire de recueil de besoins - ${projectName}`
    );
  }, [pdfSections, formData, projectId, projectName]);

  const handleDownloadFakePdf = useCallback(() => {
    void downloadFilledPdf(
      pdfSections,
      FAKE_FORM_DATA,
      `questionnaire-${projectId}-fake`,
      `Questionnaire fictif - ${projectName}`
    );
  }, [pdfSections, FAKE_FORM_DATA, projectId, projectName]);

  const handleDownloadBlankPdf = useCallback(() => {
    void downloadBlankPdf(pdfSections, projectId, projectName);
  }, [pdfSections, projectId, projectName]);

  const { answered, total } = getAnsweredCount(pdfSections, formData);

  // Submitted confirmation screen
  if (submitted) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Questionnaire de recueil de besoins
          </h1>
          <p className="text-[#64748b] mt-2">
            Recueil de besoins client
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
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#475569] hover:bg-[#f8fafc]"
            >
              Revenir au questionnaire
            </button>
            <button
              onClick={() => handleDownloadMd(formData)}
              className="px-6 py-2 rounded-lg bg-[#3b82f6] text-white text-sm hover:bg-[#2563eb]"
            >
              Telecharger (.md)
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-6 py-2 rounded-lg bg-[#0ea5e9] text-white text-sm hover:bg-[#0284c7]"
            >
              Telecharger (.pdf)
            </button>
            <button
              onClick={handleDownloadBlankPdf}
              className="px-6 py-2 rounded-lg border border-[#64748b] text-[#64748b] text-sm hover:bg-[#f1f5f9]"
            >
              PDF vierge
            </button>
          </div>
        </div>
      </div>
    );
  }

  const section = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b]">
              Questionnaire de recueil de besoins
            </h1>
            <p className="text-[#64748b] mt-2">
              Recueil de besoins client
            </p>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <AiGenerateButton
                type="questionnaire"
                projectId={projectId}
                label="Régénérer avec l'IA"
                hasExistingData={sections.length > 0}
                onGenerated={handleAiGenerated}
              />
              <button
                onClick={() => {
                  const url = `${window.location.origin}/q/${projectId}`;
                  navigator.clipboard.writeText(url);
                  alert("Lien copié : " + url);
                }}
                className="px-3 py-1.5 text-sm bg-[#f0fdf4] text-[#16a34a] rounded-lg hover:bg-[#dcfce7] transition-colors"
              >
                Copier le lien client
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Respondents responses viewer */}
      {isOwner && <RespondentsPanel projectId={projectId} sections={sections} />}

      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold mb-2">Introduction</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Bonjour et merci de prendre le temps de répondre à ce questionnaire.
          Ce questionnaire a pour objectif de recueillir les informations
          nécessaires au cadrage du projet. Il permettra de comprendre votre
          activité et vos besoins réels, préparer un backlog produit complet,
          planifier les livraisons par étapes et définir les priorités
          fonctionnelles dès le départ.
        </p>
        <p className="text-sm text-[#475569] mt-2">
          <strong>Temps estimé :</strong> 15 à 20 minutes. Vos réponses
          serviront directement à concevoir un produit adapté à vos besoins
          métier.
        </p>
      </div>

      {/* Actions owner */}
      {isOwner && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-medium text-[#166534]">Lien public du questionnaire</p>
              <p className="text-xs text-[#15803d] font-mono mt-1">
                {typeof window !== "undefined" ? `${window.location.origin}/q/${projectId}` : `/q/${projectId}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/q/${projectId}`;
                  navigator.clipboard.writeText(url);
                  alert("Lien copié !");
                }}
                className="px-4 py-2 rounded-lg bg-white text-[#166534] border border-[#166534] text-sm hover:bg-[#f0fdf4] transition-colors"
              >
                Copier le lien
              </button>
              <button
                onClick={async () => {
                  const email = prompt("Email du client :");
                  if (!email) return;
                  try {
                    const res = await fetch(`/api/projects/${projectId}/questionnaire/send`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ to: email }),
                    });
                    if (res.ok) {
                      alert(`Questionnaire envoyé à ${email} !`);
                    } else {
                      const data = await res.json();
                      alert(data.error || "Erreur lors de l'envoi");
                    }
                  } catch {
                    alert("Erreur lors de l'envoi");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#166534] text-white text-sm hover:bg-[#15803d] transition-colors"
              >
                Envoyer par email
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-[#1e40af]">
          Exports PDF disponibles pour démonstration ou envoi.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadBlankPdf}
            className="px-4 py-2 rounded-lg bg-white text-[#1d4ed8] border border-[#1d4ed8] text-sm hover:bg-[#eff6ff]"
          >
            PDF vierge
          </button>
        </div>
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
              onClick={() => handleDownloadMd(formData)}
              className="px-4 py-2 rounded-lg border border-[#3b82f6] text-[#3b82f6] text-sm hover:bg-[#eff6ff]"
              title="Telecharger les reponses en Markdown"
            >
              Telecharger (.md)
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white text-sm hover:bg-[#0284c7]"
              title="Telecharger les reponses en PDF"
            >
              Telecharger (.pdf)
            </button>
            <button
              onClick={handleDownloadBlankPdf}
              className="px-4 py-2 rounded-lg border border-[#64748b] text-[#64748b] text-sm hover:bg-[#f1f5f9]"
              title="Telecharger le questionnaire vierge en PDF"
            >
              PDF vierge
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
