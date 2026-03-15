// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ les phases de votre roadmap ci-dessous       ║
// ╚══════════════════════════════════════════════════════════════╝

const phases = [
  {
    phase: "Phase 0",
    title: "Initialisation technique",
    objectif:
      "Préparer l'infrastructure : base de données, authentification, architecture.",
    fonctionnalites: [
      "Setup environnement de développement",
      "Modèle de données initial",
      "Authentification et gestion des rôles",
    ],
    horsPerimetre: ["Interface utilisateur finale", "Import de données"],
    utilisateurs: ["Équipe technique"],
    dependances: ["Aucune — point de départ"],
    ressources: "À définir",
    periode: "Semaine 1-2",
    budget: "À définir",
    color: "border-l-[#64748b]",
    bg: "bg-[#f8fafc]",
  },
  {
    phase: "Sprint 1",
    title: "Module principal",
    objectif: "Livrer le module core de l'application.",
    fonctionnalites: [
      "Fonctionnalité 1 du module principal",
      "Fonctionnalité 2 du module principal",
      "Fonctionnalité 3 du module principal",
    ],
    horsPerimetre: ["Intégrations externes", "Import de données"],
    utilisateurs: ["Utilisateurs principaux"],
    dependances: ["Phase 0 terminée"],
    ressources: "À définir",
    periode: "Semaine 3-5",
    budget: "À définir",
    color: "border-l-[#3b82f6]",
    bg: "bg-[#eff6ff]",
  },
  {
    phase: "Sprint 2",
    title: "Module complémentaire",
    objectif: "Étendre les fonctionnalités avec le second module.",
    fonctionnalites: [
      "Fonctionnalité 1 du module complémentaire",
      "Fonctionnalité 2 du module complémentaire",
    ],
    horsPerimetre: ["Automatisation avancée"],
    utilisateurs: ["Tous les utilisateurs"],
    dependances: ["Sprint 1 (données fondamentales)"],
    ressources: "À définir",
    periode: "Semaine 6-8",
    budget: "À définir",
    color: "border-l-[#8b5cf6]",
    bg: "bg-[#f5f3ff]",
  },
  {
    phase: "Sprint 3",
    title: "Reporting et intégrations",
    objectif: "Ajouter le tableau de bord et connecter les outils existants.",
    fonctionnalites: [
      "Tableau de bord avec KPIs",
      "Export de données",
      "Intégrations avec outils existants",
    ],
    horsPerimetre: ["BI avancée", "Intégrations non prioritaires"],
    utilisateurs: ["Direction", "Managers"],
    dependances: ["Sprints 1-2"],
    ressources: "À définir",
    periode: "Semaine 9-12",
    budget: "À définir",
    color: "border-l-[#22c55e]",
    bg: "bg-[#f0fdf4]",
  },
];

export default function RoadmapPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Roadmap produit</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 3 — Plan de construction phase par phase
        </p>
      </div>

      {/* Timeline overview */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Vue d&apos;ensemble</h2>
        <div className="flex gap-1">
          {phases.map((p, i) => {
            const colors = [
              "bg-[#64748b]",
              "bg-[#3b82f6]",
              "bg-[#8b5cf6]",
              "bg-[#22c55e]",
            ];
            return (
              <div
                key={i}
                className={`flex-1 ${colors[i % colors.length]} rounded p-2 text-white text-xs text-center`}
              >
                <div className="font-bold">{p.phase}</div>
                <div className="opacity-80 truncate">{p.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MVP Section */}
      <div className="bg-[#fffbeb] rounded-lg border-2 border-[#f59e0b] p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-[#f59e0b] text-white rounded-full font-bold text-lg">
            MVP
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#1e293b]">
              Périmètre du MVP
            </h2>
            <p className="text-sm text-[#92400e]">
              Définissez ici les modules inclus dans le MVP
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-[#fde68a] p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">
              Modules inclus
            </h4>
            <ul className="space-y-1 text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                <span>Module principal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                <span>Module complémentaire</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-[#fde68a] p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">
              Objectifs de validation
            </h4>
            <ul className="space-y-1 text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                <span>Objectif 1</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                <span>Objectif 2</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-[#fde68a] p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">
              Justification
            </h4>
            <p className="text-sm text-[#475569]">
              Expliquez pourquoi ce périmètre MVP a été choisi.
            </p>
          </div>
        </div>
      </div>

      {/* Plan de contingence */}
      <div className="bg-[#fef2f2] rounded-lg border border-[#fecaca] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-1">
          Plan de contingence (Plan B)
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          Stratégies de repli en cas de risques identifiés
        </p>
        <div className="space-y-3">
          {[
            {
              risque: "Retard sur un sprint",
              planB:
                "Réduire le périmètre du sprint suivant et reporter les fonctionnalités non critiques.",
            },
            {
              risque: "API externe indisponible",
              planB:
                "Mettre en place une solution de contournement manuelle (import CSV par exemple).",
            },
            {
              risque: "Faible adoption utilisateur",
              planB:
                "Prolonger la phase pilote et organiser des sessions de formation supplémentaires.",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-[#fecaca] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded">
                  RISQUE
                </span>
                <p className="text-sm font-semibold text-[#1e293b]">
                  {r.risque}
                </p>
              </div>
              <p className="text-sm text-[#64748b]">
                <strong>Plan B :</strong> {r.planB}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Détail par phase */}
      <div className="space-y-4">
        {phases.map((p, i) => (
          <div
            key={i}
            className={`${p.bg} rounded-lg border border-[#e2e8f0] border-l-4 ${p.color} p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-[#64748b] uppercase">
                  {p.phase}
                </span>
                <h3 className="text-lg font-semibold text-[#1e293b]">
                  {p.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1e293b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                  {p.budget}
                </span>
                <span className="text-sm text-[#64748b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                  {p.periode}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#475569] mb-2">
              <strong>Objectif :</strong> {p.objectif}
            </p>
            <p className="text-xs text-[#64748b] mb-4">
              <strong>Ressources :</strong> {p.ressources}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#22c55e] uppercase mb-2">
                  Fonctionnalités livrées
                </h4>
                <ul className="space-y-1">
                  {p.fonctionnalites.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-[#475569]"
                    >
                      <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#ef4444] uppercase mb-2">
                    Hors périmètre
                  </h4>
                  <ul className="space-y-1">
                    {p.horsPerimetre.map((h, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-[#94a3b8]"
                      >
                        <span className="text-[#ef4444] mt-0.5">&#10007;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                    Utilisateurs concernés
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {p.utilisateurs.map((u, j) => (
                      <span
                        key={j}
                        className="text-xs bg-white px-2 py-0.5 rounded border border-[#e2e8f0] text-[#475569]"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                    Dépendances
                  </h4>
                  <p className="text-sm text-[#64748b]">{p.dependances[0]}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
