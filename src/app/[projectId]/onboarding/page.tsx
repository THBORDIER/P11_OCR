"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Tooltip component
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="w-4 h-4 rounded-full bg-[#e2e8f0] text-[#64748b] text-[10px] font-bold inline-flex items-center justify-center hover:bg-[#cbd5e1] transition-colors"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 w-56 bg-[#1e293b] text-white text-xs rounded-lg p-2.5 shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e293b]" />
        </div>
      )}
    </span>
  );
}

// Selectable chip with optional "custom" free text
function ChipSelector({
  options,
  value,
  onChange,
  freeText,
  freeTextValue,
  onFreeTextChange,
  freeTextPlaceholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  freeText?: boolean;
  freeTextValue?: string;
  onFreeTextChange?: (v: string) => void;
  freeTextPlaceholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt
                ? "bg-[#3b82f6] text-white shadow-sm"
                : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {freeText && (
        <input
          type="text"
          value={freeTextValue || ""}
          onChange={(e) => {
            onFreeTextChange?.(e.target.value);
            if (e.target.value) onChange("");
          }}
          placeholder={freeTextPlaceholder}
          className="w-full px-4 py-2 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        />
      )}
    </div>
  );
}

const STACK_OPTIONS = [
  {
    category: "Technologies web",
    tooltip: "Langages et frameworks pour construire votre application web (site, webapp, API...)",
    items: ["React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML/CSS", "Tailwind CSS", "Node.js", "Express", "Django", "Flask", "Laravel", "Spring Boot", "Ruby on Rails", "FastAPI", "NestJS"],
  },
  {
    category: "Base de données",
    tooltip: "Où sont stockées les données de votre application (utilisateurs, produits, commandes...)",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase"],
  },
  {
    category: "Mobile",
    tooltip: "Si votre projet inclut une application mobile (iPhone, Android)",
    items: ["React Native", "Flutter", "Swift (iOS)", "Kotlin (Android)", "Ionic", "PWA"],
  },
  {
    category: "Hébergement & outils",
    tooltip: "Où votre application sera hébergée et les services utilisés",
    items: ["Vercel", "Netlify", "AWS", "OVH", "Docker", "Heroku", "GCP", "Azure"],
  },
];

const BUDGET_OPTIONS = ["Gratuit / Open source", "< 1k €", "1k - 5k €", "5k - 15k €", "15k - 50k €", "> 50k €"];
const TIMELINE_OPTIONS = ["< 1 mois", "1-3 mois", "3-6 mois", "6-12 mois", "> 12 mois"];
const TEAM_OPTIONS = ["Solo", "2-3 personnes", "4-6 personnes", "> 6 personnes"];

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);

  // Step 1: Context
  const [context, setContext] = useState("");
  const [objectives, setObjectives] = useState("");
  const [targetUsers, setTargetUsers] = useState("");

  // Step 2: Constraints
  const [budget, setBudget] = useState("");
  const [budgetCustom, setBudgetCustom] = useState("");
  const [timeline, setTimeline] = useState("");
  const [timelineCustom, setTimelineCustom] = useState("");
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

  const effectiveBudget = budgetCustom || budget;
  const effectiveTimeline = timelineCustom || timeline;

  const handleFinish = async () => {
    setSaving(true);

    const summary = [
      context && `Contexte : ${context}`,
      objectives && `Objectifs : ${objectives}`,
      targetUsers && `Utilisateurs cibles : ${targetUsers}`,
      effectiveBudget && `Budget : ${effectiveBudget}`,
      effectiveTimeline && `Délai : ${effectiveTimeline}`,
      team && `Équipe : ${team}`,
      constraints && `Contraintes : ${constraints}`,
    ].filter(Boolean).join("\n");

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

    // Create KPIs
    const kpis = [
      effectiveBudget && { label: "Budget", value: effectiveBudget, color: "#f59e0b" },
      effectiveTimeline && { label: "Délai", value: effectiveTimeline, color: "#3b82f6" },
      team && { label: "Équipe", value: team, color: "#8b5cf6" },
    ].filter(Boolean) as { label: string; value: string; color: string }[];

    for (let i = 0; i < kpis.length; i++) {
      await fetch(`/api/projects/${projectId}/kpis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...kpis[i], order: i }),
      });
    }

    setSaving(false);
    setFinished(true);
  };

  // Step 4: Post-cadrage — generate with AI or go to dashboard
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl mx-auto mb-4">
            &#10003;
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">
            Cadrage terminé !
          </h1>
          <p className="text-[#64748b] mb-8">
            Les informations de votre projet ont été enregistrées. Vous pouvez maintenant :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a
              href={`/${projectId}/questionnaire`}
              className="block bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 hover:shadow-md hover:border-[#3b82f6] transition-all text-left"
            >
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-[#1e293b] mb-1">Envoyer le questionnaire</h3>
              <p className="text-xs text-[#64748b]">Envoyez le lien au client pour recueillir ses besoins</p>
            </a>
            <a
              href={`/${projectId}/analyse`}
              className="block bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 hover:shadow-md hover:border-[#8b5cf6] transition-all text-left"
            >
              <div className="text-2xl mb-2">&#9889;</div>
              <h3 className="font-semibold text-[#1e293b] mb-1">Générer avec l'IA</h3>
              <p className="text-xs text-[#64748b]">Générez des personas, US et phases depuis le contexte (Ollama ou copier/coller)</p>
            </a>
            <a
              href={`/${projectId}/product-backlog`}
              className="block bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 hover:shadow-md hover:border-[#22c55e] transition-all text-left"
            >
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-[#1e293b] mb-1">Écrire le backlog</h3>
              <p className="text-xs text-[#64748b]">Créez manuellement les User Stories du projet</p>
            </a>
            <a
              href={`/${projectId}`}
              className="block bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 hover:shadow-md hover:border-[#f59e0b] transition-all text-left"
            >
              <div className="text-2xl mb-2">&#127968;</div>
              <h3 className="font-semibold text-[#1e293b] mb-1">Aller au dashboard</h3>
              <p className="text-xs text-[#64748b]">Voir la vue d'ensemble et la checklist de suivi</p>
            </a>
          </div>
        </div>
      </div>
    );
  }

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
              {s === 1 ? "Contexte" : s === 2 ? "Contraintes" : "Technologies"}
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
          {step === 1 && "Décrivez votre projet. Ces informations serviront de contexte pour l'IA."}
          {step === 2 && "Tout est optionnel. Sélectionnez un bouton ou tapez librement."}
          {step === 3 && "Optionnel. Sélectionnez les technologies utilisées ou tapez-les."}
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
                placeholder="Ex : Application de gestion de stock pour une boulangerie. Le gérant doit pouvoir suivre les entrées/sorties de matières premières et les produits finis..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
                autoFocus
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
                placeholder="Ex : Gagner du temps sur l'inventaire, éviter les ruptures, avoir un historique..."
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
                placeholder="Ex : Le gérant et les employés de la boulangerie"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contraintes */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                Budget estimé
                <Tooltip text="Le budget global du projet, incluant développement, hébergement et maintenance. Sélectionnez une fourchette ou tapez un montant libre." />
              </label>
              <ChipSelector
                options={BUDGET_OPTIONS}
                value={budget}
                onChange={(v) => { setBudget(v); setBudgetCustom(""); }}
                freeText
                freeTextValue={budgetCustom}
                onFreeTextChange={(v) => { setBudgetCustom(v); if (v) setBudget(""); }}
                freeTextPlaceholder="Ou tapez un montant libre : 3000 €, bénévole, à définir..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                Délai souhaité
                <Tooltip text="Le temps disponible entre le début du projet et la première livraison utilisable." />
              </label>
              <ChipSelector
                options={TIMELINE_OPTIONS}
                value={timeline}
                onChange={(v) => { setTimeline(v); setTimelineCustom(""); }}
                freeText
                freeTextValue={timelineCustom}
                onFreeTextChange={(v) => { setTimelineCustom(v); if (v) setTimeline(""); }}
                freeTextPlaceholder="Ou tapez librement : 6 semaines, pas de deadline..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                Taille de l'équipe
                <Tooltip text="Le nombre de personnes qui travailleront sur le projet (développeurs, designers, chefs de projet...)." />
              </label>
              <ChipSelector
                options={TEAM_OPTIONS}
                value={team}
                onChange={setTeam}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Contraintes particulières
                <Tooltip text="Tout ce qui limite ou conditionne le projet : réglementation (RGPD), accessibilité, hébergement spécifique, compatibilité navigateur..." />
              </label>
              <textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                rows={3}
                placeholder="Ex : Doit fonctionner hors-ligne, données sensibles, hébergement en France..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Technologies */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Technologies libres
              </label>
              <input
                value={customStack}
                onChange={(e) => setCustomStack(e.target.value)}
                placeholder="Tapez vos technologies séparées par des virgules : WordPress, Figma, Notion..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                autoFocus
              />
              <p className="text-xs text-[#94a3b8] mt-1">Ou sélectionnez dans les catégories ci-dessous (tout est optionnel)</p>
            </div>

            {STACK_OPTIONS.map((cat) => (
              <div key={cat.category}>
                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                  {cat.category}
                  <Tooltip text={cat.tooltip} />
                </label>
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

            {(selectedStack.length > 0 || customStack) && (
              <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
                <p className="text-xs text-[#94a3b8] mb-1">Stack sélectionnée :</p>
                <p className="text-sm text-[#1e293b] font-medium">
                  {[...selectedStack, ...customStack.split(",").map((s) => s.trim()).filter(Boolean)].join(", ")}
                </p>
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
