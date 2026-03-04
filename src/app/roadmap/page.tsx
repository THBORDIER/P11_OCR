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
      budget: "10 000 €",
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
      budget: "25 000 €",
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
      budget: "20 000 €",
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
      budget: "15 000 €",
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
      budget: "25 000 €",
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
      budget: "25 000 €",
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

      {/* MVP Section */}
      <div className="bg-[#fffbeb] rounded-lg border-2 border-[#f59e0b] p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-[#f59e0b] text-white rounded-full font-bold text-lg">
            MVP
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#1e293b]">Périmètre du MVP — Fin Sprint 3 (Semaine 10)</h2>
            <p className="text-sm text-[#92400e]">Phase 0 + Sprint 1 + Sprint 2 + Sprint 3</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg border border-[#fde68a] p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">Modules inclus</h4>
            <ul className="space-y-1 text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                <span>Gestion clients et prospects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                <span>Pipeline commercial Kanban</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#10003;</span>
                <span>Tâches et rappels</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-[#fde68a] p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">Objectifs de validation</h4>
            <ul className="space-y-1 text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                <span>20 utilisateurs pilotes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                <span>Fonctionnalités core validées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">&#9679;</span>
                <span>Budget MVP : 70 000 €</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-[#fde68a] p-4">
            <h4 className="text-xs font-bold text-[#92400e] uppercase mb-2">Pourquoi ce périmètre</h4>
            <p className="text-sm text-[#475569]">
              Le MVP couvre les <strong>3 modules de priorité P1</strong> nécessaires aux opérations
              commerciales quotidiennes. Ces fonctionnalités permettent aux commerciaux de gérer
              leurs clients, suivre leurs opportunités et organiser leurs actions — le cœur de leur
              activité journalière.
            </p>
          </div>
        </div>
      </div>

      {/* Justification de l'ordre des sprints */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Justification de l'ordre des sprints</h2>
        <p className="text-sm text-[#64748b] mb-4">
          L'enchaînement des sprints suit une logique de dépendances techniques et de valeur métier décroissante.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#3b82f6] text-white rounded-full font-bold text-xs shrink-0">1</span>
            <div>
              <p className="text-sm font-semibold text-[#1e293b]">Sprint 1 — Clients & Prospects</p>
              <p className="text-sm text-[#64748b]">
                Couche de données fondamentale dont <strong>tous les autres modules dépendent</strong>. Sans fiches
                clients, impossible de créer des opportunités, des tâches ou des rapports.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#8b5cf6] text-white rounded-full font-bold text-xs shrink-0">2</span>
            <div>
              <p className="text-sm font-semibold text-[#1e293b]">Sprint 2 — Pipeline commercial</p>
              <p className="text-sm text-[#64748b]">
                Dépend directement des données clients et constitue la <strong>priorité business n°1</strong>.
                Le suivi des opportunités est le besoin le plus critique exprimé par les commerciaux.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#f59e0b] text-white rounded-full font-bold text-xs shrink-0">3</span>
            <div>
              <p className="text-sm font-semibold text-[#1e293b]">Sprint 3 — Tâches & Rappels</p>
              <p className="text-sm text-[#64748b]">
                Complète les outils de travail quotidien et <strong>permet d'atteindre le MVP</strong>.
                Les tâches sont liées aux clients et aux opportunités, d'où leur position après les sprints 1-2.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#22c55e] text-white rounded-full font-bold text-xs shrink-0">4</span>
            <div>
              <p className="text-sm font-semibold text-[#1e293b]">Sprint 4 — Tableau de bord & Reporting</p>
              <p className="text-sm text-[#64748b]">
                Le reporting nécessite que <strong>les données des sprints 1-3 existent</strong> pour être pertinent.
                Sans volume de données (clients, opportunités, tâches), les dashboards seraient vides et inutiles.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#ec4899] text-white rounded-full font-bold text-xs shrink-0">5</span>
            <div>
              <p className="text-sm font-semibold text-[#1e293b]">Sprint 5 — Intégrations & Migration</p>
              <p className="text-sm text-[#64748b]">
                Techniquement le plus complexe et <strong>non bloquant pour l'usage quotidien</strong>.
                Les intégrations (Outlook, Zendesk, HubSpot) enrichissent l'expérience mais ne sont pas indispensables
                au fonctionnement de base du CRM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan de contingence (Plan B) */}
      <div className="bg-[#fef2f2] rounded-lg border border-[#fecaca] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Plan de contingence (Plan B)</h2>
        <p className="text-sm text-[#64748b] mb-4">
          Stratégies de repli en cas de risques identifiés
        </p>
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-[#fecaca] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded">RISQUE</span>
              <p className="text-sm font-semibold text-[#1e293b]">Sprint 1 prend plus de temps que prévu</p>
            </div>
            <p className="text-sm text-[#64748b]">
              <strong>Plan B :</strong> Réduire le périmètre du Sprint 2 — différer le drag & drop Kanban et se concentrer
              sur une vue liste fonctionnelle. Le drag & drop sera ajouté en itération ultérieure.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[#fecaca] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded">RISQUE</span>
              <p className="text-sm font-semibold text-[#1e293b]">APIs d'intégration indisponibles (Outlook, Zendesk, HubSpot)</p>
            </div>
            <p className="text-sm text-[#64748b]">
              <strong>Plan B :</strong> Mettre en place un import manuel via fichiers CSV comme solution de repli.
              Les connecteurs API seront développés dès que les accès seront disponibles.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[#fecaca] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded">RISQUE</span>
              <p className="text-sm font-semibold text-[#1e293b]">Faible adoption lors du pilote</p>
            </div>
            <p className="text-sm text-[#64748b]">
              <strong>Plan B :</strong> Prolonger la phase pilote de 2 à 4 semaines supplémentaires et organiser
              des sessions de formation dédiées par équipe pour faciliter la prise en main.
            </p>
          </div>
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
