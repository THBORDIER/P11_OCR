import { projectConfig } from "@/config/project.config";

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ votre plan de communication ci-dessous       ║
// ╚══════════════════════════════════════════════════════════════╝

const stakeholders = [
  {
    nom: "Sponsor / Directeur",
    role: "Valide les orientations stratégiques, arbitre les priorités",
    implication: "Haute" as const,
    canal: "Réunion mensuelle + email",
  },
  {
    nom: "Chef de projet",
    role: "Coordonne les aspects techniques et fonctionnels",
    implication: "Haute" as const,
    canal: "Réunion hebdo + Slack/Teams",
  },
  {
    nom: "Référents métier",
    role: "Fournissent les besoins métier, valident les user stories",
    implication: "Moyenne" as const,
    canal: "Réunion de sprint + email",
  },
  {
    nom: "Utilisateurs finaux",
    role: "Utilisent l'application, participent aux tests",
    implication: "Faible" as const,
    canal: "Démo de sprint + formation",
  },
];

const ceremonies = [
  {
    nom: "Daily Stand-up",
    frequence: "Quotidien",
    duree: "15 min",
    participants: "Équipe de développement",
    objectif:
      "Synchroniser l'équipe, identifier les blocages, aligner les priorités du jour.",
    canal: "Slack/Teams (asynchrone)",
  },
  {
    nom: "Sprint Planning",
    frequence: "Début de sprint",
    duree: "2h",
    participants: "Product Owner + Équipe",
    objectif:
      "Sélectionner les US du sprint, définir le périmètre et les objectifs.",
    canal: "Visioconférence",
  },
  {
    nom: "Sprint Review",
    frequence: "Fin de sprint",
    duree: "1h",
    participants: "Équipe + Client",
    objectif:
      "Démontrer les livrables du sprint, recueillir les retours client.",
    canal: "Visioconférence + partage d'écran",
  },
  {
    nom: "Rétrospective",
    frequence: "Fin de sprint",
    duree: "45 min",
    participants: "Équipe interne",
    objectif:
      "Identifier les améliorations de processus pour le sprint suivant.",
    canal: "Visioconférence",
  },
  {
    nom: "Comité de pilotage",
    frequence: "Mensuel",
    duree: "1h",
    participants: "Sponsor + Chef de projet + PO",
    objectif:
      "Valider l'avancement global, arbitrer les décisions stratégiques.",
    canal: "Réunion présentielle / visio",
  },
];

const escalationLevels = [
  {
    niveau: "Niveau 1 — Blocage technique",
    action: "Le développeur signale le blocage au Daily Stand-up.",
    delai: "Résolution sous 24h",
    responsable: "Équipe technique",
  },
  {
    niveau: "Niveau 2 — Blocage fonctionnel",
    action:
      "Le Product Owner tranche avec le référent métier lors d'un point dédié.",
    delai: "Résolution sous 48h",
    responsable: "Product Owner",
  },
  {
    niveau: "Niveau 3 — Blocage stratégique",
    action:
      "Escalade au Comité de pilotage pour arbitrage (budget, périmètre, délai).",
    delai: "Résolution sous 1 semaine",
    responsable: "Sponsor",
  },
];

const tools = [
  {
    outil: "Slack / Teams",
    usage: "Communication quotidienne, partage de fichiers, notifications",
    public: "Toute l'équipe",
  },
  {
    outil: "Email",
    usage: "Communications formelles, comptes-rendus, validations",
    public: "Parties prenantes externes",
  },
  {
    outil: "Drive partagé",
    usage: "Documentation projet, maquettes, spécifications",
    public: "Équipe + Client",
  },
  {
    outil: "Outil de gestion de projet",
    usage: "Suivi des sprints, backlog, tâches",
    public: "Équipe de développement",
  },
];

export default function CommunicationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Plan de communication
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 8 — Organisation du suivi projet avec les parties prenantes
        </p>
      </div>

      {/* Parties prenantes */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Parties prenantes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Partie prenante
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Rôle dans le projet
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Implication
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Canal préféré
                </th>
              </tr>
            </thead>
            <tbody>
              {stakeholders.map((p, i) => (
                <tr key={i} className="border-b border-[#f1f5f9]">
                  <td className="py-3 px-4 font-medium text-[#334155]">
                    {p.nom}
                  </td>
                  <td className="py-3 px-4 text-[#475569]">{p.role}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        p.implication === "Haute"
                          ? "bg-[#fef2f2] text-[#dc2626]"
                          : p.implication === "Moyenne"
                            ? "bg-[#fff7ed] text-[#ea580c]"
                            : "bg-[#f0f9ff] text-[#0284c7]"
                      }`}
                    >
                      {p.implication}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">{p.canal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cérémonies */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Cérémonies et réunions
        </h2>
        <div className="space-y-3">
          {ceremonies.map((c, i) => (
            <div
              key={i}
              className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-[#1e293b]">{c.nom}</h3>
                <span className="text-xs bg-[#dbeafe] text-[#1d4ed8] px-2 py-0.5 rounded font-medium">
                  {c.frequence}
                </span>
                <span className="text-xs bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded">
                  {c.duree}
                </span>
              </div>
              <p className="text-sm text-[#475569] mb-1">{c.objectif}</p>
              <div className="flex gap-4 text-xs text-[#64748b]">
                <span>
                  Participants : <strong>{c.participants}</strong>
                </span>
                <span>
                  Canal : <strong>{c.canal}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalade */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Procédure d&apos;escalade
        </h2>
        <div className="space-y-3">
          {escalationLevels.map((e, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 ${
                i === 0
                  ? "bg-[#eff6ff] border-[#bfdbfe]"
                  : i === 1
                    ? "bg-[#fff7ed] border-[#fed7aa]"
                    : "bg-[#fef2f2] border-[#fecaca]"
              }`}
            >
              <h3 className="font-semibold text-[#1e293b] text-sm mb-1">
                {e.niveau}
              </h3>
              <p className="text-sm text-[#475569]">{e.action}</p>
              <div className="flex gap-4 text-xs text-[#64748b] mt-2">
                <span>
                  Délai : <strong>{e.delai}</strong>
                </span>
                <span>
                  Responsable : <strong>{e.responsable}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outils */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Outils de communication
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Outil
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Usage
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                  Public cible
                </th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t, i) => (
                <tr key={i} className="border-b border-[#f1f5f9]">
                  <td className="py-3 px-4 font-medium text-[#334155]">
                    {t.outil}
                  </td>
                  <td className="py-3 px-4 text-[#475569]">{t.usage}</td>
                  <td className="py-3 px-4 text-[#475569]">{t.public}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
