// ╔══════════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION PROJET — Modifiez ce fichier pour personnaliser ║
// ║  votre portail de cadrage projet.                              ║
// ╚══════════════════════════════════════════════════════════════════╝

export const projectConfig = {
  // ── Identité du projet ──
  name: "MonProjet",
  subtitle: "Cadrage Projet",
  description: "Livrables de cadrage du projet — Description courte",
  author: "Votre Nom",
  organization: "Votre Organisation",

  // ── Contexte ──
  context: {
    summary:
      "Description du contexte projet. Présentez le client, son activité et le besoin auquel le projet répond.",
    kpis: [
      { label: "Utilisateurs", value: "10", color: "#3b82f6" },
      { label: "Budget", value: "50k", color: "#f59e0b" },
      { label: "Mois", value: "4", color: "#22c55e" },
      { label: "Modules", value: "3", color: "#8b5cf6" },
    ],
  },

  // ── Stack technique ──
  stack: [
    {
      name: "Frontend",
      tag: "Front-End",
      tagColor: { bg: "#dbeafe", text: "#3b82f6" },
      description: "Décrivez la technologie front-end choisie et pourquoi.",
    },
    {
      name: "Backend",
      tag: "Back-End",
      tagColor: { bg: "#fef3c7", text: "#f59e0b" },
      description: "Décrivez la technologie back-end choisie et pourquoi.",
    },
  ],

  // ── Méthodologie ──
  methodology: {
    framework: "Scrum",
    frameworkDescription:
      "Le projet est découpé en sprints de 3 semaines avec des cérémonies adaptées : Sprint Planning, Daily Stand-up, Sprint Review et Rétrospective.",
    prioritization: "MoSCoW",
    prioritizationDescription:
      "Chaque User Story est classée selon la méthode MoSCoW pour garantir que le MVP livre un maximum de valeur métier.",
  },

  // ── Phases du projet ──
  phases: [
    {
      label: "Cadrage",
      duration: "M0 → M1",
      detail: "Recueil des besoins, analyse fonctionnelle, choix techniques",
      color: "#3b82f6",
    },
    {
      label: "Dev MVP",
      duration: "M1 → M3",
      detail: "Développement itératif des modules prioritaires",
      color: "#f59e0b",
    },
    {
      label: "Pilote",
      duration: "M3 → M4",
      detail: "Déploiement auprès d'un groupe test, feedback, corrections",
      color: "#22c55e",
    },
    {
      label: "Déploiement",
      duration: "M4 → M5",
      detail: "Déploiement complet, formation, support",
      color: "#8b5cf6",
    },
  ],

  // ── Livrables ──
  deliverables: [
    {
      href: "/questionnaire",
      title: "Questionnaire de recueil de besoins",
      desc: "Formulaire de clarification des besoins envoyé au client.",
      status: "Livrable 1",
    },
    {
      href: "/analyse",
      title: "Analyse des retours client",
      desc: "Synthèse structurée des réponses client.",
      status: "Livrable 2",
    },
    {
      href: "/roadmap",
      title: "Roadmap produit",
      desc: "Plan de construction phase par phase avec priorités et dépendances.",
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
      title: "Sprint Backlog",
      desc: "Détail des sprints avec tâches et suivi.",
      status: "Livrable 5",
    },
    {
      href: "/recettage",
      title: "Template de recettage",
      desc: "Grille de recette avec suivi des tests par US.",
      status: "Livrable 6",
    },
    {
      href: "/veille",
      title: "Tableau de veille",
      desc: "Système de veille technologique et métier.",
      status: "Livrable 7",
    },
    {
      href: "/communication",
      title: "Plan de communication",
      desc: "Organisation du suivi : réunions, canaux, parties prenantes.",
      status: "Livrable 8",
    },
  ],

  // ── Compétences visées ──
  skills: [
    "Recueillir et formaliser des besoins clients",
    "Prioriser des fonctionnalités grâce à une roadmap",
    "Élaborer et entretenir un Product Backlog",
    "Créer un Sprint Backlog",
    "Effectuer une veille générale sur son domaine professionnel",
    "Communiquer en interne et externe sur le développement d'un produit",
    "Élaborer un cadrage précis Front-End et Back-End d'un produit",
  ],

  // ── Navigation ──
  navItems: [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/questionnaire", label: "Questionnaire", icon: "📋" },
    { href: "/analyse", label: "Analyse retours", icon: "🔍" },
    { href: "/recettage", label: "Recettage", icon: "✅" },
    { href: "/roadmap", label: "Roadmap", icon: "🗺️" },
    { href: "/product-backlog", label: "Product Backlog", icon: "📦" },
    { href: "/sprint-backlog", label: "Sprint Backlog", icon: "🏃" },
    { href: "/veille", label: "Veille", icon: "📡" },
    { href: "/communication", label: "Communication", icon: "💬" },
  ],
};
