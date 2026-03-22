"use client";

import { useState, useEffect, useCallback } from "react";

interface Question {
  id: string;
  label: string;
  type: string;
  options: string[];
  placeholder: string | null;
  required: boolean;
}

interface Section {
  id: number;
  title: string;
  description: string;
  pourquoi: string;
  questions: Question[];
}

export default function PublicQuestionnairePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    params.then(({ projectId: pid }) => {
      setProjectId(pid);
      // Fetch questionnaire data
      fetch(`/api/projects/${pid}/questionnaire`)
        .then((r) => r.json())
        .then((data) => setResponses(data || {}));
      // Fetch sections via a public endpoint
      fetch(`/api/q/${pid}`)
        .then((r) => r.json())
        .then((data) => {
          setSections(data.sections || []);
          setProjectName(data.projectName || "");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  const handleChange = useCallback(
    (questionId: string, value: string) => {
      setResponses((prev) => ({ ...prev, [questionId]: value }));
      setSaved(false);
      // Auto-save
      if (projectId) {
        fetch(`/api/projects/${projectId}/questionnaire`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, value }),
        });
      }
    },
    [projectId]
  );

  const handleSubmit = () => {
    setSaved(true);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse text-[#94a3b8]">Chargement du questionnaire...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center max-w-md">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Merci !</h1>
          <p className="text-[#64748b]">
            Vos réponses au questionnaire de cadrage pour <strong>{projectName}</strong> ont été enregistrées.
          </p>
        </div>
      </div>
    );
  }

  if (!sections.length) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-[#94a3b8]">Ce questionnaire n&apos;est pas encore prêt.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Questionnaire de cadrage
          </h1>
          <p className="text-[#64748b] mt-2">{projectName}</p>
          <p className="text-sm text-[#94a3b8] mt-1">
            Vos réponses sont sauvegardées automatiquement.
          </p>
        </div>

        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-[#1e293b] mb-1">
              {section.title}
            </h2>
            <p className="text-sm text-[#64748b] mb-4">{section.description}</p>

            <div className="space-y-4">
              {section.questions.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-[#475569] mb-1">
                    {q.label}
                    {q.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {q.type === "textarea" ? (
                    <textarea
                      value={responses[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      placeholder={q.placeholder || ""}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                    />
                  ) : q.type === "select" ? (
                    <select
                      value={responses[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    >
                      <option value="">Sélectionnez...</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={q.type === "number" ? "number" : "text"}
                      value={responses[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      placeholder={q.placeholder || ""}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Envoyer mes réponses
          </button>
          {saved && (
            <p className="text-sm text-green-600 mt-2">Réponses sauvegardées !</p>
          )}
        </div>
      </div>
    </div>
  );
}
