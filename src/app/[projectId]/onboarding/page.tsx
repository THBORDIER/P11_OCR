"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STACK_OPTIONS = [
  { category: "Frontend", items: ["React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML/CSS", "Tailwind CSS", "Bootstrap"] },
  { category: "Backend", items: ["Node.js", "Express", "NestJS", "Django", "Flask", "Laravel", "Spring Boot", "Ruby on Rails", "FastAPI"] },
  { category: "Base de données", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase"] },
  { category: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"] },
  { category: "DevOps", items: ["Docker", "Kubernetes", "CI/CD", "AWS", "GCP", "Azure", "Vercel", "Netlify"] },
  { category: "Autre", items: ["GraphQL", "REST API", "WebSocket", "Stripe", "Auth0", "Prisma", "TypeScript"] },
];

const BUDGET_OPTIONS = ["< 5k €", "5k - 15k €", "15k - 50k €", "50k - 100k €", "> 100k €", "Non défini"];
const TIMELINE_OPTIONS = ["< 1 mois", "1-3 mois", "3-6 mois", "6-12 mois", "> 12 mois", "Non défini"];
const TEAM_OPTIONS = ["Solo", "2-3 personnes", "4-6 personnes", "7-10 personnes", "> 10 personnes"];

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Context
  const [context, setContext] = useState("");
  const [objectives, setObjectives] = useState("");
  const [targetUsers, setTargetUsers] = useState("");

  // Step 2: Constraints
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [team, setTeam] = useState("");
  const [constraints, setConstraints] = useState("");

  // Step 3: Stack
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [customStack, setCustomStack] = useState("");

  const toggleStack = (item: string) => {
    setSelectedStack((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    setSaving(true);

    // Build context summary
    const summary = [
      context && `Contexte : ${context}`,
      objectives && `Objectifs : ${objectives}`,
      targetUsers && `Utilisateurs cibles : ${targetUsers}`,
      budget && budget !== "Non défini" && `Budget : ${budget}`,
      timeline && timeline !== "Non défini" && `Délai : ${timeline}`,
      team && `Équipe : ${team}`,
      constraints && `Contraintes : ${constraints}`,
    ].filter(Boolean).join("\n");

    // Update project
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contextSummary: summary,
        description: context || undefined,
      }),
    });

    // Create stack items
    const allStack = [...selectedStack, ...customStack.split(",").map((s) => s.trim()).filter(Boolean)];
    for (let i = 0; i < allStack.length; i++) {
      await fetch(`/api/projects/${projectId}/stack-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: allStack[i],
          tag: allStack[i],
          tagColorBg: "#eff6ff",
          tagColorText: "#3b82f6",
          description: "",
          order: i,
        }),
      });
    }

    // Create KPIs from structured data
    const kpis = [
      budget && budget !== "Non défini" && { label: "Budget", value: budget, color: "#f59e0b" },
      timeline && timeline !== "Non défini" && { label: "Délai", value: timeline, color: "#3b82f6" },
      team && { label: "Équipe", value: team, color: "#8b5cf6" },
      allStack.length > 0 && { label: "Technologies", value: String(allStack.length), color: "#22c55e" },
    ].filter(Boolean) as { label: string; value: string; color: string }[];

    for (let i = 0; i < kpis.length; i++) {
      await fetch(`/api/projects/${projectId}/kpis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...kpis[i], order: i }),
      });
    }

    router.push(`/${projectId}`);
  };

  const totalSteps = 3;

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                s === step
                  ? "bg-[#3b82f6] text-white shadow-md"
                  : s < step
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-[#f1f5f9] text-[#94a3b8]"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
            <span className={`text-sm ${s === step ? "text-[#1e293b] font-medium" : "text-[#94a3b8]"}`}>
              {s === 1 ? "Contexte" : s === 2 ? "Contraintes" : "Stack technique"}
            </span>
            {s < totalSteps && <div className={`w-8 h-0.5 ${s < step ? "bg-emerald-300" : "bg-[#e2e8f0]"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
          Cadrage initial
        </h1>
        <p className="text-sm text-[#94a3b8] mb-8">
          {step === 1 && "Décrivez votre projet pour générer automatiquement le questionnaire et les premières US."}
          {step === 2 && "Définissez les contraintes pour adapter le planning et les priorités."}
          {step === 3 && "Sélectionnez les technologies pour pré-configurer la stack."}
        </p>

        {/* Step 1: Contexte */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Décrivez le projet en quelques phrases <span className="text-red-400">*</span>
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                placeholder="Ex : Refonte d'une plateforme e-commerce B2C avec panier, paiement Stripe, gestion des stocks et tableau de bord admin. L'objectif est de remplacer la solution Shopify actuelle par une solution custom..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Objectifs principaux
              </label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={3}
                placeholder="Ex : Réduire les coûts d'exploitation de 30%, améliorer le taux de conversion, offrir une meilleure expérience mobile..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Utilisateurs cibles
              </label>
              <input
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                placeholder="Ex : PME du secteur retail, 50-200 employés, non techniques"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contraintes */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">Budget estimé</label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudget(opt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      budget === opt
                        ? "bg-[#3b82f6] text-white shadow-sm"
                        : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">Délai souhaité</label>
              <div className="flex flex-wrap gap-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTimeline(opt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeline === opt
                        ? "bg-[#3b82f6] text-white shadow-sm"
                        : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">Taille de l'équipe</label>
              <div className="flex flex-wrap gap-2">
                {TEAM_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTeam(opt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      team === opt
                        ? "bg-[#3b82f6] text-white shadow-sm"
                        : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Contraintes particulières
              </label>
              <textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                rows={3}
                placeholder="Ex : RGPD, accessibilité WCAG, hébergement en France, compatibilité IE11..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Stack */}
        {step === 3 && (
          <div className="space-y-5">
            {STACK_OPTIONS.map((cat) => (
              <div key={cat.category}>
                <label className="block text-sm font-medium text-[#1e293b] mb-2">{cat.category}</label>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleStack(item)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedStack.includes(item)
                          ? "bg-[#3b82f6] text-white shadow-sm"
                          : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                      }`}
                    >
                      {selectedStack.includes(item) ? "✓ " : ""}{item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Autres technologies
              </label>
              <input
                value={customStack}
                onChange={(e) => setCustomStack(e.target.value)}
                placeholder="Séparées par des virgules : Elasticsearch, RabbitMQ..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            {selectedStack.length > 0 && (
              <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
                <p className="text-xs text-[#94a3b8] mb-1">Stack sélectionnée :</p>
                <p className="text-sm text-[#1e293b] font-medium">{selectedStack.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#f1f5f9]">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
            >
              &larr; Retour
            </button>
          ) : (
            <button
              onClick={() => router.push(`/${projectId}`)}
              className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
            >
              Passer le cadrage
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !context.trim()}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] transition-all disabled:opacity-50"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#22c55e] hover:bg-[#16a34a] transition-all disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Terminer le cadrage"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
