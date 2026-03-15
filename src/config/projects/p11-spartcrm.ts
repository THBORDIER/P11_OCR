import { ProjectConfig } from "../project.config";

export const p11Config: ProjectConfig = {
  id: "p11-spartcrm",
  name: "SpartCRM",
  subtitle: "Cadrage Projet P11",
  description:
    "Livrables de cadrage du projet SpartCRM — CRM sur mesure pour Spart, PME B2B de transformation digitale.",
  author: "Thomas Bordier",
  organization: "OpenClassrooms P11",
  color: "#3b82f6",

  context: {
    summary:
      "Spart est une PME B2B spécialisée dans la transformation digitale. L'équipe de 21 collaborateurs gère environ 250 clients actifs et un pipeline commercial de 50 à 80 opportunités en parallèle. Le besoin : un CRM sur mesure pour remplacer les tableurs Excel actuels, centraliser les données clients et automatiser le suivi commercial.",
    kpis: [
      { label: "Utilisateurs", value: "21", color: "#3b82f6" },
      { label: "Budget", value: "120k", color: "#f59e0b" },
      { label: "Mois", value: "6", color: "#22c55e" },
      { label: "Modules", value: "5", color: "#8b5cf6" },
    ],
  },

  stack: [
    {
      name: "WeWeb",
      tag: "Front-End Low-Code",
      tagColor: { bg: "#dbeafe", text: "#3b82f6" },
      description:
        "Plateforme Low-Code visuelle pour construire des interfaces responsives sans coder. Connecteurs natifs Xano, Supabase, API REST.",
    },
    {
      name: "Xano",
      tag: "Back-End No-Code",
      tagColor: { bg: "#fef3c7", text: "#f59e0b" },
      description:
        "Back-end scalable No-Code : base de données PostgreSQL, API builder visuel, authentification, logique métier sans code serveur.",
    },
    {
      name: "Zapier / n8n",
      tag: "Automatisation",
      tagColor: { bg: "#dcfce7", text: "#16a34a" },
      description:
        "Automatisation des workflows : notifications, synchronisation de données, envoi d'emails, intégration avec les outils tiers.",
    },
  ],

  methodology: {
    framework: "Scrum",
    frameworkDescription:
      "Le projet est découpé en 5 sprints de 3 semaines avec des cérémonies adaptées : Sprint Planning, Daily Stand-up (asynchrone), Sprint Review et Rétrospective.",
    prioritization: "MoSCoW",
    prioritizationDescription:
      "Chaque User Story est classée selon la méthode MoSCoW pour garantir que le MVP livre un maximum de valeur métier dès le Sprint 3.",
  },

  phases: [
    {
      label: "Cadrage",
      duration: "S0 → S2",
      detail:
        "Recueil des besoins, analyse fonctionnelle, choix techniques, product backlog",
      color: "#3b82f6",
    },
    {
      label: "Dev MVP",
      duration: "S3 → S14",
      detail:
        "5 sprints de développement : Clients, Pipeline, Tâches, Dashboard, Intégrations",
      color: "#f59e0b",
    },
    {
      label: "Pilote",
      duration: "S15 → S18",
      detail:
        "Déploiement auprès d'un groupe test de 5 commerciaux, feedback, corrections",
      color: "#22c55e",
    },
    {
      label: "Généralisation",
      duration: "S19 → S24",
      detail:
        "Déploiement complet, formation de l'équipe, support post-lancement",
      color: "#8b5cf6",
    },
  ],

  deliverables: [
    {
      href: "/p11-spartcrm/questionnaire",
      title: "Questionnaire de recueil de besoins",
      desc: "Formulaire de clarification des besoins envoyé au client Spart.",
      status: "Livrable 1",
    },
    {
      href: "/p11-spartcrm/analyse",
      title: "Analyse des retours client",
      desc: "Synthèse structurée des réponses du directeur commercial et des équipes.",
      status: "Livrable 2",
    },
    {
      href: "/p11-spartcrm/roadmap",
      title: "Roadmap produit",
      desc: "Plan de construction sur 6 mois avec MVP au Sprint 3.",
      status: "Livrable 3",
    },
    {
      href: "/p11-spartcrm/product-backlog",
      title: "Product Backlog",
      desc: "22 User Stories, 116 points d'effort, 6 epics.",
      status: "Livrable 4",
    },
    {
      href: "/p11-spartcrm/sprint-backlog",
      title: "Sprint Backlog",
      desc: "5 sprints détaillés avec 78 tâches et suivi Kanban.",
      status: "Livrable 5",
    },
    {
      href: "/p11-spartcrm/recettage",
      title: "Template de recettage",
      desc: "42 cas de test répartis sur les 5 sprints.",
      status: "Livrable 6",
    },
    {
      href: "/p11-spartcrm/veille",
      title: "Tableau de veille",
      desc: "Veille technologique Low-Code/No-Code, IA et CRM.",
      status: "Livrable 7",
    },
    {
      href: "/p11-spartcrm/communication",
      title: "Plan de communication",
      desc: "RACI, cérémonies, escalade, conduite du changement.",
      status: "Livrable 8",
    },
  ],

  skills: [
    "Recueillir et formaliser des besoins clients",
    "Prioriser des fonctionnalités grâce à une roadmap",
    "Élaborer et entretenir un Product Backlog",
    "Créer un Sprint Backlog",
    "Effectuer une veille générale sur son domaine professionnel",
    "Communiquer en interne et externe sur le développement d'un produit",
    "Élaborer un cadrage précis Front-End et Back-End d'un produit",
  ],

  navItems: [
    { href: "/p11-spartcrm", label: "Accueil", icon: "🏠" },
    { href: "/p11-spartcrm/questionnaire", label: "Questionnaire", icon: "📋" },
    { href: "/p11-spartcrm/analyse", label: "Analyse retours", icon: "🔍" },
    { href: "/p11-spartcrm/recettage", label: "Recettage", icon: "✅" },
    { href: "/p11-spartcrm/roadmap", label: "Roadmap", icon: "🗺️" },
    {
      href: "/p11-spartcrm/product-backlog",
      label: "Product Backlog",
      icon: "📦",
    },
    {
      href: "/p11-spartcrm/sprint-backlog",
      label: "Sprint Backlog",
      icon: "🏃",
    },
    { href: "/p11-spartcrm/veille", label: "Veille", icon: "📡" },
    { href: "/p11-spartcrm/communication", label: "Communication", icon: "💬" },
  ],
};
