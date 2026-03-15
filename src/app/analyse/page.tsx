import { projectConfig } from "@/config/project.config";

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ les données d'analyse ci-dessous             ║
// ╚══════════════════════════════════════════════════════════════╝

const stats = [
  {
    label: "Priorités citées",
    value: "—%",
    detail: "Adaptez ce pourcentage aux retours de votre client.",
  },
  {
    label: "Satisfaction actuelle",
    value: "— / 5",
    detail: "Score moyen de satisfaction avec les outils actuels.",
  },
  {
    label: "Irritants fréquents",
    value: "—%",
    detail: "Pourcentage d'utilisateurs signalant des problèmes.",
  },
];

const quotes = [
  "« Citation ou verbatim du client illustrant un besoin clé. »",
  "« Autre citation illustrant un point de douleur. »",
  "« Citation montrant une attente importante. »",
];

const unmetNeeds = [
  "Besoin non couvert identifié lors de l'analyse.",
  "Autre besoin non couvert à adresser.",
  "Besoin complémentaire à intégrer dans le backlog.",
];

const decisions = [
  "Décision prise suite aux retours clients.",
  "Autre décision impactant le périmètre ou la priorisation.",
  "Renforcement d'un critère d'acceptation spécifique.",
];

const maquetteAnalysis = [
  {
    section: "Section 1",
    points: [
      "Point d'analyse positif ou à améliorer.",
      "Autre point sur la maquette.",
    ],
  },
  {
    section: "Section 2",
    points: [
      "Observation sur le parcours utilisateur.",
      "Recommandation d'amélioration.",
    ],
  },
];

export default function AnalysePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Analyse des retours client
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 2 — Synthèse structurée des réponses et analyse
        </p>
      </div>

      {/* Metadata */}
      <div className="bg-[#f1f5f9] rounded-lg px-4 py-2 mb-6 flex items-center gap-3 text-xs text-[#475569]">
        <span className="font-semibold text-[#334155]">Version 1.0</span>
        <span className="text-[#cbd5e1]">|</span>
        <span>Auteur : {projectConfig.author}</span>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Retours client — Indicateurs clés
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4"
            >
              <p className="text-xs text-[#64748b] mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-[#1e293b]">{s.value}</p>
              <p className="text-xs text-[#475569]">{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Verbatims */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <h3 className="font-semibold text-[#334155] text-sm mb-2">
              Synthèse qualitative
            </h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              {quotes.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          {/* Besoins non couverts */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <h3 className="font-semibold text-[#334155] text-sm mb-2">
              Besoins non couverts identifiés
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[#475569]">
              {unmetNeeds.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Décisions */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
          <h3 className="font-semibold text-[#166534] text-sm mb-2">
            Décisions prises suite aux retours
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#166534]">
            {decisions.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Analyse maquette */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Analyse de la maquette / prototype
        </h2>
        <div className="space-y-4">
          {maquetteAnalysis.map((m, i) => (
            <div
              key={i}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4"
            >
              <h3 className="font-semibold text-[#334155] text-sm mb-2">
                {m.section}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#475569]">
                {m.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Matrice impact/effort */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Matrice Impact / Effort
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
            <h4 className="text-xs font-bold text-[#166534] uppercase mb-2">
              Quick Wins (Fort impact, Faible effort)
            </h4>
            <p className="text-sm text-[#475569]">
              Listez ici les fonctionnalités à fort impact et faible effort.
            </p>
          </div>
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4">
            <h4 className="text-xs font-bold text-[#1d4ed8] uppercase mb-2">
              Projets majeurs (Fort impact, Fort effort)
            </h4>
            <p className="text-sm text-[#475569]">
              Listez ici les grandes fonctionnalités à planifier.
            </p>
          </div>
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">
              Nice-to-have (Faible impact, Faible effort)
            </h4>
            <p className="text-sm text-[#475569]">
              Listez ici les petites améliorations non prioritaires.
            </p>
          </div>
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-4">
            <h4 className="text-xs font-bold text-[#991b1b] uppercase mb-2">
              À éviter (Faible impact, Fort effort)
            </h4>
            <p className="text-sm text-[#475569]">
              Listez ici ce qui ne vaut pas l&apos;investissement en v1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
