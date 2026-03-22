"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateAllButtonProps {
  projectId: string;
  provider: string;
  hasRespondents: boolean;
  hasPersonas: boolean;
  hasUS: boolean;
  hasPhases: boolean;
  hasSprints: boolean;
  hasTests: boolean;
}

const STEPS = [
  { key: "personas", label: "Personas", icon: "👤", type: "analyse" },
  { key: "us", label: "User Stories", icon: "📋", type: "user-stories" },
  { key: "phases", label: "Roadmap", icon: "🗺️", type: "phases" },
  { key: "sprints", label: "Sprints", icon: "🏃", type: "sprints" },
  { key: "tests", label: "Tests", icon: "✅", type: "test-cases" },
];

export default function GenerateAllButton({
  projectId,
  provider,
  hasRespondents,
  hasPersonas,
  hasUS,
  hasPhases,
  hasSprints,
  hasTests,
}: GenerateAllButtonProps) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepStatuses, setStepStatuses] = useState<("pending" | "running" | "done" | "error")[]>(
    STEPS.map(() => "pending")
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Don't show if questionnaire not done
  if (!hasRespondents) return null;

  // Check what already exists
  const existingMap: Record<string, boolean> = {
    personas: hasPersonas,
    us: hasUS,
    phases: hasPhases,
    sprints: hasSprints,
    tests: hasTests,
  };

  const allDone = hasPersonas && hasUS && hasPhases && hasSprints && hasTests;

  async function getPrompt(type: string): Promise<string | null> {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, projectId, getPromptOnly: true }),
    });
    const data = await res.json();
    return data.prompt || null;
  }

  async function generateViaProvider(type: string): Promise<Record<string, unknown>[]> {
    if (provider === "manual") {
      throw new Error("Mode manuel non supporté pour la génération automatique");
    }

    if (provider === "ollama") {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur Ollama");
      return data.items || [];
    }

    // CLI provider
    const prompt = await getPrompt(type);
    if (!prompt) throw new Error("Impossible de générer le prompt");

    const res = await fetch("/api/cli/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        prompt: prompt + "\n\nRéponds UNIQUEMENT avec le JSON demandé, sans texte ni commentaire.",
        projectSlug: projectId,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur CLI");

    const output = data.response || data.output || "";
    const jsonMatch = output.match(/\{[\s\S]*"items"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).items || [];
    }
    const parsed = JSON.parse(output);
    return parsed.items || (Array.isArray(parsed) ? parsed : [parsed]);
  }

  async function insertItems(type: string, items: Record<string, unknown>[]) {
    const apiBase = `/api/projects/${projectId}`;

    if (type === "analyse") {
      for (const item of items) {
        await fetch(`${apiBase}/personas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
    } else if (type === "user-stories") {
      for (const item of items) {
        const us = item as Record<string, string>;
        await fetch(`${apiBase}/user-stories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `${projectId}:US-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            titre: us.titre || us.title || "",
            enTantQue: us.enTantQue || us.role || "",
            jeSouhaite: us.jeSouhaite || us.action || "",
            afinDe: us.afinDe || us.benefit || "",
            criteres: us.criteres || us.criteria || "",
            priorite: us.priorite || us.priority || "Should",
            estimation: us.estimation || us.points || "3",
            epic: us.epic || "",
            sprint: us.sprint || "",
            contraintes: us.contraintes || "",
          }),
        });
      }
    } else if (type === "phases") {
      for (let i = 0; i < items.length; i++) {
        await fetch(`${apiBase}/phases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...items[i], order: i }),
        });
      }
    } else if (type === "sprints") {
      for (const item of items) {
        const s = item as Record<string, unknown>;
        const sprintId = `${projectId}:${(String(s.name || "Sprint")).toLowerCase().replace(/\s+/g, "-")}`;
        await fetch(`${apiBase}/sprints`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: sprintId,
            nom: s.name || "",
            objectif: s.goal || "",
            objectifCourt: String(s.goal || "").slice(0, 50),
            debut: s.startDate || "",
            fin: s.endDate || "",
            duree: "2 semaines",
            velocite: "",
            userStories: [],
          }),
        });
        const tasks = (s.tasks || []) as Record<string, string>[];
        for (const t of tasks) {
          await fetch(`${apiBase}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `${projectId}:T-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              sprintId,
              userStory: t.userStory || "",
              titre: t.title || "",
              description: "",
              type: t.type || "Dev",
              estimation: t.estimation || "2h",
              status: t.status || "A faire",
              assignee: "",
            }),
          });
        }
      }
    } else if (type === "test-cases") {
      for (const item of items) {
        const tc = item as Record<string, string>;
        await fetch(`${apiBase}/recettage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `${projectId}:TC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            us: tc.us || "",
            sprint: tc.sprint || "",
            etape: tc.etape || "",
            action: tc.action || "",
            attendu: tc.attendu || "",
            obtenu: tc.obtenu || "",
            statut: tc.statut || "A tester",
          }),
        });
      }
    }
  }

  async function runAll() {
    setRunning(true);
    setErrorMsg("");
    setStepStatuses(STEPS.map(() => "pending"));

    for (let i = 0; i < STEPS.length; i++) {
      const step = STEPS[i];
      setCurrentStep(i);
      setStepStatuses((prev) => prev.map((s, j) => (j === i ? "running" : s)));

      try {
        // Skip if data already exists (don't overwrite)
        if (existingMap[step.key]) {
          setStepStatuses((prev) => prev.map((s, j) => (j === i ? "done" : s)));
          continue;
        }

        const items = await generateViaProvider(step.type);
        await insertItems(step.type, items);
        setStepStatuses((prev) => prev.map((s, j) => (j === i ? "done" : s)));

        // Small delay between steps so server can catch up
        await new Promise((r) => setTimeout(r, 1000));
      } catch (e) {
        setStepStatuses((prev) => prev.map((s, j) => (j === i ? "error" : s)));
        setErrorMsg(`Erreur à l'étape "${step.label}" : ${e instanceof Error ? e.message : "inconnue"}`);
        break;
      }
    }

    setCurrentStep(-1);
    setRunning(false);
    window.location.reload();
  }

  return (
    <>
      {/* Trigger button */}
      {!running && (
        <button
          onClick={runAll}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl text-base font-bold mb-6"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {allDone ? "Tout regénérer" : "Générer tout le projet"}
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            Personas → US → Roadmap → Sprints → Tests
          </span>
        </button>
      )}

      {/* Progress modal */}
      {running && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/85 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1e293b]">
                Génération automatique
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                Chaque étape utilise les données précédentes pour plus de cohérence.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const status = stepStatuses[i];
                const isSkipped = existingMap[step.key] && status === "done";
                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      status === "running"
                        ? "bg-blue-50 border border-blue-200"
                        : status === "done"
                        ? "bg-emerald-50 border border-emerald-200"
                        : status === "error"
                        ? "bg-red-50 border border-red-200"
                        : "bg-[#f8fafc] border border-[#e2e8f0]"
                    }`}
                  >
                    {/* Icon */}
                    <span className="text-xl w-8 text-center">{step.icon}</span>

                    {/* Label */}
                    <span className={`flex-1 text-sm font-medium ${
                      status === "running" ? "text-blue-700" :
                      status === "done" ? "text-emerald-700" :
                      status === "error" ? "text-red-700" :
                      "text-[#64748b]"
                    }`}>
                      {step.label}
                      {isSkipped && <span className="text-xs ml-1 opacity-60">(déjà fait)</span>}
                    </span>

                    {/* Status indicator */}
                    {status === "running" && (
                      <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {status === "done" && (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {status === "error" && (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {status === "pending" && (
                      <span className="w-5 h-5 rounded-full border-2 border-[#cbd5e1]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700">{errorMsg}</p>
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-red-500 to-red-400"
                  style={{
                    width: `${(stepStatuses.filter((s) => s === "done").length / STEPS.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[#94a3b8] text-center mt-2">
                {stepStatuses.filter((s) => s === "done").length}/{STEPS.length} étapes terminées
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
