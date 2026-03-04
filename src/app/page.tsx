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
