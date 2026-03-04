import Link from "next/link";

const livrables = [
  {
    href: "/questionnaire",
    title: "Questionnaire de recueil de besoins",
    desc: "Formulaire envoyé au client Spart pour clarifier les zones floues du brief initial.",
    status: "Livrable 1",
  },
  {
    href: "/analyse",
    title: "Analyse des retours client",
    desc: "Synthèse structurée des réponses de Spart et de la maquette Figma.",
    status: "Livrable 2",
  },
  {
    href: "/roadmap",
    title: "Roadmap produit",
    desc: "Plan visuel de construction du CRM phase par phase, avec priorités et dépendances.",
    status: "Livrable 3",
  },
  {
    href: "/product-backlog",
    title: "Product Backlog",
    desc: "Backlog complet avec User Stories, critères d'acceptation et estimations.",
    status: "Livrable 4",
  },
  {
    href: "/sprint-backlog",
    title: "Sprint Backlog — Sprint 1",
    desc: "Détail du premier sprint : Module Gestion des Clients.",
    status: "Livrable 5",
  },
  {
    href: "/veille",
    title: "Tableau de veille",
    desc: "Système de veille technologique et métier pour le domaine Low-Code / CRM.",
    status: "Livrable 6",
  },
  {
    href: "/communication",
    title: "Plan de communication",
    desc: "Organisation du suivi client : réunions, canaux, fréquences, parties prenantes.",
    status: "Livrable 7",
  },
];

const phases = [
  {
    label: "Cadrage",
    duration: "M0 → M1",
    detail: "Recueil des besoins, analyse fonctionnelle, choix techniques, roadmap produit",
    color: "#3b82f6",
  },
  {
    label: "Dev MVP",
    duration: "M1 → M4",
    detail: "Développement itératif des 5 modules en 3 sprints de 3 semaines",
    color: "#f59e0b",
  },
  {
    label: "Pilote",
    duration: "M4 → M5",
    detail: "Déploiement auprès d'un groupe test, recueil de feedback, corrections",
    color: "#22c55e",
  },
  {
    label: "Généralisation",
    duration: "M5 → M6",
    detail: "Déploiement complet, formation des utilisateurs, support post-lancement",
    color: "#8b5cf6",
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Cadrage du projet SpartCRM
        </h1>
        <p className="text-[#64748b] mt-2">
          Projet OpenClassrooms P11 — Développeur Low-Code — Thomas Bordier
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3">Contexte</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          <strong>Spart</strong> est une société B2B qui accompagne les PME dans
          leur transformation digitale. Elle souhaite un{" "}
          <strong>CRM interne sur-mesure</strong> pour centraliser ses données
          clients, structurer son pipeline commercial et améliorer la
          collaboration entre ses équipes (commerciaux, account managers, support,
          direction).
        </p>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-2xl font-bold text-[#3b82f6]">21</div>
            <div className="text-xs text-[#64748b]">Utilisateurs</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-2xl font-bold text-[#f59e0b]">120k</div>
            <div className="text-xs text-[#64748b]">Budget</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-2xl font-bold text-[#22c55e]">6</div>
            <div className="text-xs text-[#64748b]">Mois</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-2xl font-bold text-[#8b5cf6]">5</div>
            <div className="text-xs text-[#64748b]">Modules</div>
          </div>
        </div>
      </div>

      {/* Stack technique retenue */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-3">
          Stack technique retenue
        </h2>
        <p className="text-sm text-[#475569] leading-relaxed mb-4">
          Le choix de la stack repose sur trois critères : rapidité de
          développement Low-Code, scalabilité pour accompagner la croissance de
          Spart, et coût maîtrisé dans le budget de 120 000 €.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#f1f5f9] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-[#3b82f6]">WeWeb</span>
              <span className="text-xs bg-[#dbeafe] text-[#3b82f6] px-2 py-0.5 rounded-full font-medium">
                Front-End
              </span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed">
              Constructeur visuel No-Code avec export Vue.js. Permet de créer des
              interfaces complexes (tableaux, filtres, dashboards) sans écrire de
              code, tout en gardant la main sur le CSS et la logique métier.
            </p>
          </div>
          <div className="bg-[#f1f5f9] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-[#f59e0b]">Xano</span>
              <span className="text-xs bg-[#fef3c7] text-[#f59e0b] px-2 py-0.5 rounded-full font-medium">
                Back-End
              </span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed">
              Back-end No-Code avec API REST auto-générée. Gère la logique
              métier (workflows, rôles, permissions) et expose des endpoints
              sécurisés consommés par WeWeb. Scalable et sans serveur à gérer.
            </p>
          </div>
        </div>
      </div>

      {/* Méthodologie */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-3">
          Méthodologie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dbeafe] text-[#3b82f6] text-xs font-bold">
                S
              </span>
              Framework Scrum
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Le projet est découpé en <strong>sprints de 3 semaines</strong>{" "}
              avec des cérémonies adaptées au contexte Low-Code : Sprint
              Planning, Daily Stand-up (asynchrone via Slack), Sprint Review avec
              le client et Rétrospective interne. Le Product Owner (Thomas)
              priorise le backlog et valide les incréments avec Spart à chaque
              fin de sprint.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#fef3c7] text-[#f59e0b] text-xs font-bold">
                M
              </span>
              Priorisation MoSCoW
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Chaque User Story est classée selon la méthode{" "}
              <strong>MoSCoW</strong> pour garantir que le MVP livre un maximum
              de valeur métier dans le budget et le délai impartis.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-[#f1f5f9] rounded p-2 text-center">
                <div className="text-xs font-bold text-[#dc2626]">Must Have</div>
                <div className="text-xs text-[#475569] mt-0.5">Indispensable au MVP</div>
              </div>
              <div className="bg-[#f1f5f9] rounded p-2 text-center">
                <div className="text-xs font-bold text-[#f59e0b]">Should Have</div>
                <div className="text-xs text-[#475569] mt-0.5">Important, intégré si possible</div>
              </div>
              <div className="bg-[#f1f5f9] rounded p-2 text-center">
                <div className="text-xs font-bold text-[#3b82f6]">Could Have</div>
                <div className="text-xs text-[#475569] mt-0.5">Confort, si reste du budget</div>
              </div>
              <div className="bg-[#f1f5f9] rounded p-2 text-center">
                <div className="text-xs font-bold text-[#64748b]">Won&apos;t Have</div>
                <div className="text-xs text-[#475569] mt-0.5">Hors périmètre v1</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phases du projet */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Phases du projet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {phases.map((phase, index) => (
            <div key={phase.label} className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: phase.color }}
                >
                  {index + 1}
                </span>
                <span className="font-semibold text-[#1e293b]">
                  {phase.label}
                </span>
              </div>
              <div
                className="text-xs font-medium mb-1 px-2 py-0.5 rounded-full inline-block text-white"
                style={{ backgroundColor: phase.color }}
              >
                {phase.duration}
              </div>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                {phase.detail}
              </p>
              {index < phases.length - 1 && (
                <div className="hidden md:block absolute top-3.5 -right-2 text-[#cbd5e1] text-lg">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-1 rounded-full overflow-hidden h-2">
          <div className="bg-[#3b82f6]" style={{ width: "16.6%" }} />
          <div className="bg-[#f59e0b]" style={{ width: "50%" }} />
          <div className="bg-[#22c55e]" style={{ width: "16.6%" }} />
          <div className="bg-[#8b5cf6]" style={{ width: "16.8%" }} />
        </div>
        <div className="flex justify-between text-xs text-[#64748b] mt-1">
          <span>M0</span>
          <span>M1</span>
          <span>M4</span>
          <span>M5</span>
          <span>M6</span>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Livrables du projet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {livrables.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bg-white rounded-lg border border-[#e2e8f0] p-5 hover:border-[#3b82f6] hover:shadow-md transition-all"
          >
            <div className="text-xs font-medium text-[#3b82f6] mb-1">
              {l.status}
            </div>
            <h3 className="font-semibold text-[#1e293b] mb-2">{l.title}</h3>
            <p className="text-sm text-[#64748b]">{l.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mt-8">
        <h2 className="text-lg font-semibold mb-3">Compétences visées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Recueillir et formaliser des besoins clients",
            "Prioriser des fonctionnalités grâce à une roadmap",
            "Élaborer et entretenir un Product Backlog",
            "Créer un Sprint Backlog",
            "Effectuer une veille générale sur son domaine professionnel",
            "Communiquer en interne et externe sur le développement d'un produit",
            "Élaborer un cadrage précis Front-End et Back-End d'un produit",
          ].map((c) => (
            <div
              key={c}
              className="flex items-start gap-2 text-sm text-[#475569]"
            >
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
