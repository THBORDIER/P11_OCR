export default function RoadmapPage() {
  const phases = [
    {
      phase: "Phase 0",
      title: "Initialisation technique",
      objectif: "Préparer l'infrastructure technique : base de données, authentification, architecture de l'application.",
      fonctionnalites: [
        "Setup Xano (BDD + API)",
        "Setup WeWeb (front-end)",
        "Modèle de données (comptes, contacts, opportunités, tâches)",
        "Authentification SSO Outlook",
        "Gestion des rôles et permissions",
      ],
      horsPerimetre: [
        "Interface utilisateur finale",
        "Import de données",
      ],
      utilisateurs: ["Équipe technique", "Chef de projet IT"],
      dependances: ["Aucune — point de départ"],
      ressources: "Thomas Bordier (développeur full-stack)",
      periode: "Semaine 1-2",
      color: "border-l-[#64748b]",
      bg: "bg-[#f8fafc]",
    },
    {
      phase: "Sprint 1",
      title: "Module Clients & Prospects",
      objectif: "Permettre la création, consultation et gestion des fiches clients et contacts.",
      fonctionnalites: [
        "Liste des clients avec filtres (statut, secteur, recherche)",
        "Fiche client détaillée (coordonnées, entreprise, historique)",
        "Création / modification d'un client ou prospect",
        "Gestion multi-contacts par compte",
        "Recherche et déduplication",
      ],
      horsPerimetre: [
        "Import de données existantes",
        "Intégrations email",
      ],
      utilisateurs: ["Commerciaux", "Account Managers", "Support"],
      dependances: ["Phase 0 terminée (BDD + auth)"],
      ressources: "Thomas Bordier (développeur full-stack) · Référent métier commercial",
      periode: "Semaine 3-5",
      color: "border-l-[#3b82f6]",
      bg: "bg-[#eff6ff]",
    },
    {
      phase: "Sprint 2",
      title: "Pipeline commercial (Kanban)",
      objectif: "Suivre l'avancement des opportunités de vente de manière visuelle et interactive.",
      fonctionnalites: [
        "Vue Kanban du pipeline (Prospect, Contacté, Proposition, Négociation, Gagné, Perdu)",
        "Drag & drop des cartes entre colonnes",
        "Carte opportunité (entreprise, montant, probabilité, prochaine action)",
        "Bouton + Nouvelle affaire",
        "Résumé du pipeline (totaux par étape)",
      ],
      horsPerimetre: [
        "Relances automatiques",
        "Forecast avancée",
      ],
      utilisateurs: ["Commerciaux", "Managers", "Direction"],
      dependances: ["Sprint 1 (module Clients nécessaire pour lier les opportunités)"],
      ressources: "Thomas Bordier (développeur full-stack) · Référent métier commercial",
      periode: "Semaine 6-8",
      color: "border-l-[#8b5cf6]",
      bg: "bg-[#f5f3ff]",
    },
    {
      phase: "Sprint 3",
      title: "Tâches & Rappels",
      objectif: "Permettre la gestion des actions quotidiennes liées aux clients et opportunités.",
      fonctionnalites: [
        "Création de tâches avec titre, description, entreprise, échéance, priorité",
        "Assignation à un responsable",
        "Filtres : toutes, en attente, en retard, terminées",
        "Rappels automatiques (email + notification in-app)",
        "Synchronisation Outlook Calendar (bidirectionnelle)",
      ],
      horsPerimetre: [
        "Automatisation avancée (workflows complexes)",
        "Push mobile",
      ],
      utilisateurs: ["Commerciaux", "Account Managers"],
      dependances: ["Sprint 1 (fiches clients pour lier les tâches)"],
      ressources: "Thomas Bordier (développeur full-stack)",
      periode: "Semaine 9-10",
      color: "border-l-[#f59e0b]",
      bg: "bg-[#fffbeb]",
    },
    {
      phase: "Sprint 4",
      title: "Tableau de bord & Reporting",
      objectif: "Offrir une vision synthétique de la performance commerciale à la direction et aux managers.",
      fonctionnalites: [
        "KPIs globaux (opportunités, prévisions revenus, clients actifs, tâches en attente)",
        "Progression du pipeline (barres par étape)",
        "Graphique revenus mensuels (histogramme)",
        "Graphique affaires signées (courbe)",
        "Forecast mensuel consolidé",
        "Export CSV / Excel",
      ],
      horsPerimetre: [
        "Rapports personnalisables par l'utilisateur",
        "BI avancée",
      ],
      utilisateurs: ["Direction", "Managers"],
      dependances: ["Sprints 1-3 (les données à agréger doivent exister)"],
      ressources: "Thomas Bordier (développeur full-stack) · Référent métier Direction",
      periode: "Semaine 11-13",
      color: "border-l-[#22c55e]",
      bg: "bg-[#f0fdf4]",
    },
    {
      phase: "Sprint 5",
      title: "Intégrations & Migration",
      objectif: "Connecter le CRM aux outils existants et migrer les données historiques.",
      fonctionnalites: [
        "Intégration Outlook (email + calendrier bidirectionnel)",
        "Intégration Zendesk (historique tickets dans fiche client)",
        "Intégration HubSpot (import automatique des leads)",
        "Connexion à l'outil de facturation interne (API)",
        "Import des données existantes (2 500 comptes, 10 000 contacts)",
        "Nettoyage et déduplication des données importées",
      ],
      horsPerimetre: [
        "Intégration Salesforce",
        "Intégration SAP",
      ],
      utilisateurs: ["Tous les rôles"],
      dependances: ["Sprints 1-4 (application fonctionnelle)"],
      ressources: "Thomas Bordier (développeur full-stack) · Chef de projet IT · Référent métier",
      periode: "Semaine 14-16",
      color: "border-l-[#ec4899]",
      bg: "bg-[#fdf2f8]",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Roadmap produit</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 3 — Plan de construction du CRM SpartCRM phase par phase
        </p>
      </div>

      {/* Timeline overview */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Vue d'ensemble — 16 semaines</h2>
        <div className="flex gap-1">
          {phases.map((p, i) => {
            const widths = ["w-[12.5%]", "w-[18.75%]", "w-[18.75%]", "w-[12.5%]", "w-[18.75%]", "w-[18.75%]"];
            const colors = ["bg-[#64748b]", "bg-[#3b82f6]", "bg-[#8b5cf6]", "bg-[#f59e0b]", "bg-[#22c55e]", "bg-[#ec4899]"];
            return (
              <div key={i} className={`${widths[i]} ${colors[i]} rounded p-2 text-white text-xs text-center`}>
                <div className="font-bold">{p.phase}</div>
                <div className="opacity-80 truncate">{p.title}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-[#94a3b8] mt-2 px-1">
          <span>S1</span>
          <span>S4</span>
          <span>S8</span>
          <span>S12</span>
          <span>S16</span>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-[#64748b]">
          <span className="inline-block w-3 h-3 bg-[#f59e0b] rounded-full"></span>
          <span>MVP livrable à S10 (fin Sprint 3) — Déploiement pilote 20 utilisateurs à M+4</span>
        </div>
      </div>

      {/* Détail par phase */}
      <div className="space-y-4">
        {phases.map((p, i) => (
          <div key={i} className={`${p.bg} rounded-lg border border-[#e2e8f0] border-l-4 ${p.color} p-6`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-[#64748b] uppercase">{p.phase}</span>
                <h3 className="text-lg font-semibold text-[#1e293b]">{p.title}</h3>
              </div>
              <span className="text-sm text-[#64748b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                {p.periode}
              </span>
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
                    <li key={j} className="flex items-start gap-2 text-sm text-[#475569]">
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
                      <li key={j} className="flex items-start gap-2 text-sm text-[#94a3b8]">
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
                      <span key={j} className="text-xs bg-white px-2 py-0.5 rounded border border-[#e2e8f0] text-[#475569]">
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
