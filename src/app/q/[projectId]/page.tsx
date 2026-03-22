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
  const [submitted, setSubmitted] = useState(false);

  // Respondent identification
  const [respondentId, setRespondentId] = useState<string | null>(null);
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [respondentRole, setRespondentRole] = useState("");
  const [identifyStep, setIdentifyStep] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    params.then(({ projectId: pid }) => {
      setProjectId(pid);

      // Check if respondent already saved in localStorage
      const savedRespondent = localStorage.getItem(`respondent-${pid}`);
      if (savedRespondent) {
        try {
          const parsed = JSON.parse(savedRespondent);
          setRespondentId(parsed.id);
          setRespondentName(parsed.name);
          setIdentifyStep(false);
          // Load their responses
          fetch(`/api/projects/${pid}/questionnaire?respondentId=${parsed.id}`)
            .then((r) => r.json())
            .then((data) => setResponses(data || {}));
        } catch {
          // ignore
        }
      }

      // Fetch sections
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

  const handleIdentify = async () => {
    if (!respondentName.trim() || !projectId) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/questionnaire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: respondentName.trim(),
          email: respondentEmail.trim() || undefined,
          role: respondentRole.trim() || undefined,
        }),
      });
      const respondent = await res.json();
      setRespondentId(respondent.id);
      setIdentifyStep(false);
      localStorage.setItem(`respondent-${projectId}`, JSON.stringify({ id: respondent.id, name: respondent.name }));
    } catch {
      // fallback
    } finally {
      setCreating(false);
    }
  };

  const handleChange = useCallback(
    (questionId: string, value: string) => {
      setResponses((prev) => ({ ...prev, [questionId]: value }));
      if (projectId && respondentId) {
        fetch(`/api/projects/${projectId}/questionnaire`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, value, respondentId }),
        });
      }
    },
    [projectId, respondentId]
  );

  const handleSubmit = () => {
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
          <div className="text-4xl mb-4">&#10003;</div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Merci {respondentName} !</h1>
          <p className="text-[#64748b]">
            Vos réponses au questionnaire de cadrage pour <strong>{projectName}</strong> ont été enregistrées.
          </p>
          <p className="text-sm text-[#94a3b8] mt-4">
            Vous pouvez fermer cette page ou revenir modifier vos réponses.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 text-sm text-[#3b82f6] hover:underline"
          >
            Modifier mes réponses
          </button>
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

  // Step 1: Identification
  if (identifyStep) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
              {projectName?.[0] || "?"}
            </div>
            <h1 className="text-xl font-bold text-[#1e293b]">
              Questionnaire de cadrage
            </h1>
            <p className="text-sm text-[#64748b] mt-1">{projectName}</p>
          </div>

          <p className="text-sm text-[#475569] mb-4">
            Avant de commencer, identifiez-vous pour que vos réponses soient enregistrées séparément.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1">
                Votre nom <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder="Marie Dupont"
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1">
                Email <span className="text-[#94a3b8]">(optionnel)</span>
              </label>
              <input
                type="email"
                value={respondentEmail}
                onChange={(e) => setRespondentEmail(e.target.value)}
                placeholder="marie@example.com"
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1">
                Rôle / Fonction <span className="text-[#94a3b8]">(optionnel)</span>
              </label>
              <input
                type="text"
                value={respondentRole}
                onChange={(e) => setRespondentRole(e.target.value)}
                placeholder="Chef de projet, Développeur, Client..."
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
          </div>

          <button
            onClick={handleIdentify}
            disabled={!respondentName.trim() || creating}
            className="w-full mt-6 px-6 py-2.5 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Chargement..." : "Commencer le questionnaire"}
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Questionnaire
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Questionnaire de cadrage
          </h1>
          <p className="text-[#64748b] mt-2">{projectName}</p>
          <p className="text-sm text-[#94a3b8] mt-1">
            Répondant : <strong className="text-[#475569]">{respondentName}</strong>
            {respondentRole && ` — ${respondentRole}`}
          </p>
          <p className="text-xs text-[#94a3b8] mt-1">
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
            className="px-8 py-3 bg-[#22c55e] text-white font-semibold rounded-lg hover:bg-[#16a34a] transition-colors"
          >
            Envoyer mes réponses
          </button>
        </div>
      </div>
    </div>
  );
}
