import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "dotenv";

config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── DELETE ALL DATA (respect foreign key order) ───
  await prisma.techWatchSource.deleteMany();
  await prisma.techWatchTheme.deleteMany();
  await prisma.techWatchCategory.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.ritual.deleteMany();
  await prisma.stakeholder.deleteMany();
  await prisma.persona.deleteMany();
  await prisma.questionnaireResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionnaireSection.deleteMany();
  await prisma.task.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.userStory.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.navItem.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.stackItem.deleteMany();
  await prisma.projectKpi.deleteMany();
  await prisma.project.deleteMany();

  console.log("✅ Cleared all existing data");

  // ═══════════════════════════════════════════════════════════
  // P11-SPARTCRM PROJECT
  // ═══════════════════════════════════════════════════════════

  await prisma.project.create({
    data: {
      id: "p11-spartcrm",
      name: "SpartCRM",
      subtitle: "Cadrage Projet P11",
      isPublic: true,
      description:
        "Livrables de cadrage du projet SpartCRM — CRM sur mesure pour Spart, PME B2B de transformation digitale.",
      author: "Thomas Bordier",
      organization: "OpenClassrooms P11",
      color: "#3b82f6",
      contextSummary:
        "Spart est une PME B2B spécialisée dans la transformation digitale. L'équipe de 21 collaborateurs gère environ 250 clients actifs et un pipeline commercial de 50 à 80 opportunités en parallèle. Le besoin : un CRM sur mesure pour remplacer les tableurs Excel actuels, centraliser les données clients et automatiser le suivi commercial.",
      methodologyFramework: "Scrum",
      methodologyFrameworkDescription:
        "Le projet est découpé en 5 sprints de 3 semaines avec des cérémonies adaptées : Sprint Planning, Daily Stand-up (asynchrone), Sprint Review et Rétrospective.",
      methodologyPrioritization: "MoSCoW",
      methodologyPrioritizationDescription:
        "Chaque User Story est classée selon la méthode MoSCoW pour garantir que le MVP livre un maximum de valeur métier dès le Sprint 3.",

      // ─── KPIs ───
      kpis: {
        create: [
          { label: "Utilisateurs", value: "21", color: "#3b82f6", order: 0 },
          { label: "Budget", value: "120k", color: "#f59e0b", order: 1 },
          { label: "Mois", value: "6", color: "#22c55e", order: 2 },
          { label: "Modules", value: "5", color: "#8b5cf6", order: 3 },
        ],
      },

      // ─── STACK ───
      stackItems: {
        create: [
          {
            name: "WeWeb",
            tag: "Front-End Low-Code",
            tagColorBg: "#dbeafe",
            tagColorText: "#3b82f6",
            description:
              "Plateforme Low-Code visuelle pour construire des interfaces responsives sans coder. Connecteurs natifs Xano, Supabase, API REST.",
            order: 0,
          },
          {
            name: "Xano",
            tag: "Back-End No-Code",
            tagColorBg: "#fef3c7",
            tagColorText: "#f59e0b",
            description:
              "Back-end scalable No-Code : base de données PostgreSQL, API builder visuel, authentification, logique métier sans code serveur.",
            order: 1,
          },
          {
            name: "Zapier / n8n",
            tag: "Automatisation",
            tagColorBg: "#dcfce7",
            tagColorText: "#16a34a",
            description:
              "Automatisation des workflows : notifications, synchronisation de données, envoi d'emails, intégration avec les outils tiers.",
            order: 2,
          },
        ],
      },

      // ─── PHASES (Roadmap) ───
      phases: {
        create: [
          {
            phase: "Phase 0",
            title: "Initialisation technique",
            objectif:
              "Préparer l'infrastructure technique : base de données, authentification, architecture de l'application.",
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
            order: 0,
          },
          {
            phase: "Sprint 1",
            title: "Module Clients & Prospects",
            objectif:
              "Permettre la création, consultation et gestion des fiches clients et contacts.",
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
            ressources:
              "Thomas Bordier (développeur full-stack) · Référent métier commercial",
            periode: "Semaine 3-5",
            budget: "25 000 €",
            color: "border-l-[#3b82f6]",
            bg: "bg-[#eff6ff]",
            order: 1,
          },
          {
            phase: "Sprint 2",
            title: "Pipeline commercial (Kanban)",
            objectif:
              "Suivre l'avancement des opportunités de vente de manière visuelle et interactive.",
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
            dependances: [
              "Sprint 1 (module Clients nécessaire pour lier les opportunités)",
            ],
            ressources:
              "Thomas Bordier (développeur full-stack) · Référent métier commercial",
            periode: "Semaine 6-8",
            budget: "20 000 €",
            color: "border-l-[#8b5cf6]",
            bg: "bg-[#f5f3ff]",
            order: 2,
          },
          {
            phase: "Sprint 3",
            title: "Tâches & Rappels",
            objectif:
              "Permettre la gestion des actions quotidiennes liées aux clients et opportunités.",
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
            dependances: [
              "Sprint 1 (fiches clients pour lier les tâches)",
            ],
            ressources: "Thomas Bordier (développeur full-stack)",
            periode: "Semaine 9-10",
            budget: "15 000 €",
            color: "border-l-[#f59e0b]",
            bg: "bg-[#fffbeb]",
            order: 3,
          },
          {
            phase: "Sprint 4",
            title: "Tableau de bord & Reporting",
            objectif:
              "Offrir une vision synthétique de la performance commerciale à la direction et aux managers.",
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
            dependances: [
              "Sprints 1-3 (les données à agréger doivent exister)",
            ],
            ressources:
              "Thomas Bordier (développeur full-stack) · Référent métier Direction",
            periode: "Semaine 11-13",
            budget: "25 000 €",
            color: "border-l-[#22c55e]",
            bg: "bg-[#f0fdf4]",
            order: 4,
          },
          {
            phase: "Sprint 5",
            title: "Intégrations & Migration",
            objectif:
              "Connecter le CRM aux outils existants et migrer les données historiques.",
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
            dependances: [
              "Sprints 1-4 (application fonctionnelle)",
            ],
            ressources:
              "Thomas Bordier (développeur full-stack) · Chef de projet IT · Référent métier",
            periode: "Semaine 14-16",
            budget: "25 000 €",
            color: "border-l-[#ec4899]",
            bg: "bg-[#fdf2f8]",
            order: 5,
          },
        ],
      },

      // ─── DELIVERABLES ───
      deliverables: {
        create: [
          {
            href: "/p11-spartcrm/questionnaire",
            title: "Questionnaire de recueil de besoins",
            desc: "Formulaire de clarification des besoins envoyé au client Spart.",
            status: "Livrable 1",
            order: 0,
          },
          {
            href: "/p11-spartcrm/analyse",
            title: "Analyse des retours client",
            desc: "Synthèse structurée des réponses du directeur commercial et des équipes.",
            status: "Livrable 2",
            order: 1,
          },
          {
            href: "/p11-spartcrm/roadmap",
            title: "Roadmap produit",
            desc: "Plan de construction sur 6 mois avec MVP au Sprint 3.",
            status: "Livrable 3",
            order: 2,
          },
          {
            href: "/p11-spartcrm/product-backlog",
            title: "Product Backlog",
            desc: "22 User Stories, 116 points d'effort, 6 epics.",
            status: "Livrable 4",
            order: 3,
          },
          {
            href: "/p11-spartcrm/sprint-backlog",
            title: "Sprint Backlog",
            desc: "5 sprints détaillés avec 78 tâches et suivi Kanban.",
            status: "Livrable 5",
            order: 4,
          },
          {
            href: "/p11-spartcrm/recettage",
            title: "Template de recettage",
            desc: "42 cas de test répartis sur les 5 sprints.",
            status: "Livrable 6",
            order: 5,
          },
          {
            href: "/p11-spartcrm/veille",
            title: "Tableau de veille",
            desc: "Veille technologique Low-Code/No-Code, IA et CRM.",
            status: "Livrable 7",
            order: 6,
          },
          {
            href: "/p11-spartcrm/communication",
            title: "Plan de communication",
            desc: "RACI, cérémonies, escalade, conduite du changement.",
            status: "Livrable 8",
            order: 7,
          },
        ],
      },

      // ─── NAV ITEMS ───
      navItems: {
        create: [
          { href: "/p11-spartcrm", label: "Accueil", icon: "🏠", order: 0 },
          { href: "/p11-spartcrm/questionnaire", label: "Questionnaire", icon: "📋", order: 1 },
          { href: "/p11-spartcrm/analyse", label: "Analyse retours", icon: "🔍", order: 2 },
          { href: "/p11-spartcrm/recettage", label: "Recettage", icon: "✅", order: 3 },
          { href: "/p11-spartcrm/roadmap", label: "Roadmap", icon: "🗺️", order: 4 },
          { href: "/p11-spartcrm/product-backlog", label: "Product Backlog", icon: "📦", order: 5 },
          { href: "/p11-spartcrm/sprint-backlog", label: "Sprint Backlog", icon: "🏃", order: 6 },
          { href: "/p11-spartcrm/veille", label: "Veille", icon: "📡", order: 7 },
          { href: "/p11-spartcrm/communication", label: "Communication", icon: "💬", order: 8 },
        ],
      },

      // ─── SKILLS ───
      skills: {
        create: [
          { name: "Recueillir et formaliser des besoins clients", order: 0 },
          { name: "Prioriser des fonctionnalités grâce à une roadmap", order: 1 },
          { name: "Élaborer et entretenir un Product Backlog", order: 2 },
          { name: "Créer un Sprint Backlog", order: 3 },
          { name: "Effectuer une veille générale sur son domaine professionnel", order: 4 },
          { name: "Communiquer en interne et externe sur le développement d'un produit", order: 5 },
          { name: "Élaborer un cadrage précis Front-End et Back-End d'un produit", order: 6 },
        ],
      },

      // ─── USER STORIES (22) ───
      userStories: {
        create: [
          // Epic: Gestion des Clients
          {
            id: "p11-spartcrm:US-001",
            epic: "Gestion des Clients",
            titre: "Voir la liste des clients",
            enTantQue: "Commercial",
            jeSouhaite: "voir la liste de tous mes clients et prospects avec leurs informations principales",
            afinDe: "avoir une vue d'ensemble rapide de mon portefeuille",
            criteres: [
              "La liste affiche : nom société, contact principal, secteur, statut, étape pipeline, valeur, dernier contact",
              "La liste est triable par chaque colonne",
              "Un indicateur visuel distingue Actif (vert) de Prospect (bleu)",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Sprint 1",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-002",
            epic: "Gestion des Clients",
            titre: "Filtrer et rechercher des clients",
            enTantQue: "Commercial",
            jeSouhaite: "filtrer la liste par statut et secteur, et rechercher par nom, email ou entreprise",
            afinDe: "trouver rapidement un client spécifique",
            criteres: [
              "Barre de recherche fonctionnelle (nom, entreprise, email)",
              "Filtre par statut (Tous, Actif, Prospect)",
              "Filtre par secteur (Technologie, Consulting, Finance, R&D, Industrie)",
              "Les filtres sont combinables",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 3,
            priorite: "Must",
            sprint: "Sprint 1",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-003",
            epic: "Gestion des Clients",
            titre: "Consulter la fiche client détaillée",
            enTantQue: "Commercial",
            jeSouhaite: "accéder à la fiche complète d'un client avec toutes ses informations",
            afinDe: "préparer mes rendez-vous et avoir le contexte complet",
            criteres: [
              "En-tête : nom, contact principal, statut, secteur",
              "KPIs : valeur totale, affaires actives, revenus générés, tâches en cours",
              "Onglets : Aperçu, Affaires, Échanges, Tâches, Documents",
              "Informations de contact (email, téléphone, adresse)",
              "Détails entreprise (secteur, taille, site web, date client depuis)",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 8,
            priorite: "Must",
            sprint: "Sprint 1",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-004",
            epic: "Gestion des Clients",
            titre: "Créer un nouveau client ou prospect",
            enTantQue: "Commercial",
            jeSouhaite: "ajouter un nouveau compte client ou prospect dans le CRM",
            afinDe: "enregistrer immédiatement un nouveau contact après un premier échange",
            criteres: [
              "Formulaire avec champs : nom société, contact principal, email, téléphone, secteur, taille, adresse",
              "Le statut par défaut est 'Prospect'",
              "Validation des champs obligatoires (nom, email)",
              "Détection des doublons (alerte si email ou nom identique existe)",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Sprint 1",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-005",
            epic: "Gestion des Clients",
            titre: "Modifier une fiche client",
            enTantQue: "Account Manager",
            jeSouhaite: "modifier les informations d'un client existant",
            afinDe: "garder les données à jour après un changement de contact ou de situation",
            criteres: [
              "Tous les champs de la fiche sont éditables",
              "Historique des modifications (qui a modifié quoi et quand)",
              "Bouton Enregistrer avec confirmation",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 3,
            priorite: "Must",
            sprint: "Sprint 1",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-006",
            epic: "Gestion des Clients",
            titre: "Voir l'historique des échanges client",
            enTantQue: "Support client",
            jeSouhaite: "consulter la timeline des interactions avec un client (appels, emails, réunions)",
            afinDe: "ne pas reposer les mêmes questions et comprendre le contexte rapidement",
            criteres: [
              "Timeline chronologique des événements",
              "Chaque entrée : type (Appel/Email/Réunion), titre, description, date, participants",
              "Filtre par type d'interaction",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Sprint 1",
            valeur: "Critique",
          },
          // Epic: Pipeline Commercial
          {
            id: "p11-spartcrm:US-007",
            epic: "Pipeline Commercial",
            titre: "Voir le pipeline Kanban",
            enTantQue: "Commercial",
            jeSouhaite: "voir toutes mes opportunités organisées en colonnes par étape de vente",
            afinDe: "visualiser l'avancement de mes affaires d'un coup d'œil",
            criteres: [
              "6 colonnes : Prospect, Contacté, Proposition envoyée, Négociation, Gagné, Perdu",
              "Chaque colonne affiche le nombre d'affaires et la valeur totale",
              "Résumé du pipeline en bas de page",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 8,
            priorite: "Must",
            sprint: "Sprint 2",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-008",
            epic: "Pipeline Commercial",
            titre: "Déplacer une opportunité (drag & drop)",
            enTantQue: "Commercial",
            jeSouhaite: "déplacer une carte d'opportunité d'une colonne à une autre par glisser-déposer",
            afinDe: "mettre à jour le statut d'une affaire rapidement",
            criteres: [
              "Le drag & drop fonctionne entre toutes les colonnes",
              "La mise à jour est immédiate et persistante",
              "Les totaux par colonne se recalculent automatiquement",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Sprint 2",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-009",
            epic: "Pipeline Commercial",
            titre: "Créer une nouvelle opportunité",
            enTantQue: "Commercial",
            jeSouhaite: "créer une nouvelle affaire liée à un compte client",
            afinDe: "suivre une nouvelle opportunité de vente dès le premier contact",
            criteres: [
              "Formulaire : client lié, montant, probabilité de closing, prochaine action",
              "L'opportunité apparaît automatiquement dans la colonne 'Prospect'",
              "Le contact assigné est pré-rempli",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 3,
            priorite: "Must",
            sprint: "Sprint 2",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-010",
            epic: "Pipeline Commercial",
            titre: "Voir le détail d'une opportunité",
            enTantQue: "Manager",
            jeSouhaite: "consulter le détail d'une carte d'opportunité (montant, probabilité, historique)",
            afinDe: "évaluer la qualité d'une affaire et décider des priorités",
            criteres: [
              "La carte affiche : entreprise, contact assigné, montant, date, probabilité, prochaine action",
              "Menu contextuel pour modifier ou supprimer",
              "L'historique des modifications de l'opportunité est visible (changements d'étape, de montant)",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 3,
            priorite: "Must",
            sprint: "Sprint 2",
            valeur: "Critique",
          },
          // Epic: Tâches et Rappels
          {
            id: "p11-spartcrm:US-011",
            epic: "Tâches et Rappels",
            titre: "Voir la liste des tâches",
            enTantQue: "Commercial",
            jeSouhaite: "voir mes tâches à faire avec leur priorité et échéance",
            afinDe: "organiser ma journée et ne rien oublier",
            criteres: [
              "Liste avec : titre, description, entreprise liée, échéance, responsable, priorité",
              "Onglets de filtre : Toutes, En attente, En retard, Terminées",
              "Code couleur priorité : haute (rouge), moyenne (gris), basse (gris clair)",
              "Indicateur visuel pour les tâches en retard",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Sprint 3",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-012",
            epic: "Tâches et Rappels",
            titre: "Créer une tâche",
            enTantQue: "Commercial",
            jeSouhaite: "créer une tâche liée à un client ou une opportunité",
            afinDe: "planifier mes prochaines actions commerciales",
            criteres: [
              "Formulaire : titre, description, entreprise liée, échéance, priorité, responsable",
              "La tâche peut être liée à un client OU à une opportunité",
              "Possibilité d'assigner à un autre collaborateur",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 3,
            priorite: "Must",
            sprint: "Sprint 3",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-013",
            epic: "Tâches et Rappels",
            titre: "Recevoir des rappels automatiques",
            enTantQue: "Commercial",
            jeSouhaite: "recevoir un rappel par email quand une tâche approche de son échéance",
            afinDe: "ne jamais manquer une relance importante",
            criteres: [
              "Notification email envoyée 24h avant l'échéance",
              "Notification in-app visible dans l'interface",
              "Possibilité de configurer le délai de rappel",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Should",
            sprint: "Sprint 3",
            valeur: "Haute",
          },
          // Epic: Tableau de bord
          {
            id: "p11-spartcrm:US-014",
            epic: "Tableau de bord",
            titre: "Voir le dashboard manager",
            enTantQue: "Directeur commercial",
            jeSouhaite: "voir un tableau de bord synthétique avec les KPIs clés",
            afinDe: "piloter l'activité commerciale sans fouiller dans les détails",
            criteres: [
              "4 KPIs en haut : opportunités totales, prévision revenus, clients actifs, tâches en attente",
              "Tendances en pourcentage sur chaque KPI",
              "Widget progression du pipeline (barres par étape)",
              "Widget tâches à venir (liste triée par priorité)",
              "Widget activité récente (flux chronologique)",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 8,
            priorite: "Must",
            sprint: "Sprint 4",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-015",
            epic: "Tableau de bord",
            titre: "Consulter les rapports de performance",
            enTantQue: "Directeur commercial",
            jeSouhaite: "accéder à des rapports détaillés sur les ventes et l'activité",
            afinDe: "analyser les tendances et prendre des décisions stratégiques",
            criteres: [
              "4 onglets : Revenue Trends, Conversion Funnel, Pipeline Distribution, Team Performance",
              "Graphique revenus mensuels (histogramme)",
              "Graphique affaires signées (courbe)",
              "KPIs : revenus totaux, affaires signées, taux de conversion, prospects actifs",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 8,
            priorite: "Should",
            sprint: "Sprint 4",
            valeur: "Haute",
          },
          {
            id: "p11-spartcrm:US-016",
            epic: "Tableau de bord",
            titre: "Exporter des rapports",
            enTantQue: "Manager",
            jeSouhaite: "exporter les données du tableau de bord en CSV ou Excel",
            afinDe: "préparer mes comités commerciaux et partager les chiffres",
            criteres: [
              "Bouton export CSV sur chaque vue de reporting",
              "Bouton export Excel sur la liste des clients",
              "Le fichier exporté contient les colonnes visibles à l'écran",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 3,
            priorite: "Should",
            sprint: "Sprint 3",
            valeur: "Haute",
          },
          // Epic: Intégrations
          {
            id: "p11-spartcrm:US-017",
            epic: "Intégrations",
            titre: "Synchroniser les emails Outlook",
            enTantQue: "Commercial",
            jeSouhaite: "voir les emails échangés avec un client directement dans sa fiche CRM",
            afinDe: "centraliser toutes les communications dans un seul outil",
            criteres: [
              "Synchronisation bidirectionnelle Outlook",
              "Les emails apparaissent dans l'onglet Échanges de la fiche client",
              "Possibilité d'envoyer un email depuis le CRM",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 8,
            priorite: "Could",
            sprint: "Sprint 5",
            valeur: "Moyenne",
          },
          {
            id: "p11-spartcrm:US-018",
            epic: "Intégrations",
            titre: "Synchroniser le calendrier Outlook",
            enTantQue: "Commercial",
            jeSouhaite: "que mes tâches CRM apparaissent dans mon calendrier Outlook et inversement",
            afinDe: "avoir une seule vue de mes rendez-vous et actions",
            criteres: [
              "Les tâches avec échéance se retrouvent dans Outlook Calendar",
              "Les RDV Outlook liés à un client apparaissent dans le CRM",
              "Synchronisation bidirectionnelle en temps réel",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Could",
            sprint: "Sprint 5",
            valeur: "Moyenne",
          },
          {
            id: "p11-spartcrm:US-019",
            epic: "Intégrations",
            titre: "Importer les leads HubSpot",
            enTantQue: "Manager marketing",
            jeSouhaite: "que les leads qualifiés depuis HubSpot soient automatiquement créés dans le CRM",
            afinDe: "fluidifier le passage marketing vers commercial",
            criteres: [
              "Import automatique des leads qualifiés depuis HubSpot",
              "Les champs sont mappés correctement (nom, email, entreprise, source)",
              "Notification au commercial assigné",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Could",
            sprint: "Sprint 4",
            valeur: "Moyenne",
          },
          {
            id: "p11-spartcrm:US-020",
            epic: "Intégrations",
            titre: "Importer les données historiques",
            enTantQue: "Chef de projet IT",
            jeSouhaite: "importer les données existantes (Excel, ERP) dans le CRM",
            afinDe: "démarrer avec un CRM pré-rempli et éviter la double saisie",
            criteres: [
              "Import de 2 500 comptes et 10 000 contacts depuis Excel",
              "Mapping des colonnes source vers les champs CRM",
              "Détection et gestion des doublons",
              "Conservation de l'historique des 2 dernières années",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 8,
            priorite: "Must",
            sprint: "Sprint 5",
            valeur: "Critique",
          },
          // Epic: Sécurité
          {
            id: "p11-spartcrm:US-021",
            epic: "Sécurité",
            titre: "Se connecter via SSO Outlook",
            enTantQue: "Utilisateur",
            jeSouhaite: "me connecter au CRM avec mon compte Outlook professionnel",
            afinDe: "ne pas gérer un mot de passe supplémentaire",
            criteres: [
              "Authentification SSO via Microsoft 365 / Outlook",
              "Redirection automatique après connexion",
              "Session persistante (pas besoin de se reconnecter chaque jour)",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Phase 0",
            valeur: "Critique",
          },
          {
            id: "p11-spartcrm:US-022",
            epic: "Sécurité",
            titre: "Voir uniquement ses propres données",
            enTantQue: "Commercial",
            jeSouhaite: "voir uniquement les clients et opportunités dont je suis responsable",
            afinDe: "protéger la confidentialité et me concentrer sur mon périmètre",
            criteres: [
              "Un commercial ne voit que ses comptes et opportunités",
              "Un manager voit les données de son équipe",
              "La direction voit tout",
              "Le support a un accès partiel adapté",
            ],
            detailsMetier: [],
            contraintes: [],
            dependancesTech: [],
            estimation: 5,
            priorite: "Must",
            sprint: "Phase 0",
            valeur: "Critique",
          },
        ],
      },

      // ─── SPRINTS ───
      sprints: {
        create: [
          {
            id: "p11-spartcrm:sprint-1",
            nom: "Sprint 1 — Module Gestion des Clients",
            objectif:
              "Livrer le module complet de gestion des clients et prospects : liste, fiche détaillée, création, modification, historique des échanges.",
            objectifCourt:
              "À la fin du Sprint 1, un commercial peut créer, consulter, rechercher et modifier des fiches clients/prospects avec historique des échanges, depuis n\u2019importe quel navigateur.",
            debut: "Semaine 3",
            fin: "Semaine 5",
            duree: "3 semaines (15 jours ouvrables)",
            velocite: "29 points d'effort",
            userStories: ["US-001", "US-002", "US-003", "US-004", "US-005", "US-006"],
            tasks: {
              create: [
                // US-001
                { id: "p11-spartcrm:T-001", userStory: "US-001", titre: "Créer la table Clients dans Xano", description: "Modéliser la table clients avec tous les champs : nom, contact, email, téléphone, secteur, statut, étape, valeur, dernier contact, adresse, taille, site web, date création.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-002", userStory: "US-001", titre: "Créer l'endpoint API GET /clients", description: "API Xano pour récupérer la liste des clients avec pagination, tri et filtres.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-003", userStory: "US-001", titre: "Construire la vue tableau clients dans WeWeb", description: "Page liste clients avec colonnes : avatar, nom, contact, secteur, statut (tag coloré), étape, valeur, dernier contact.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-004", userStory: "US-001", titre: "Ajouter le tri par colonne", description: "Permettre le clic sur chaque en-tête de colonne pour trier par ordre croissant/décroissant.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-002
                { id: "p11-spartcrm:T-005", userStory: "US-002", titre: "Implémenter la barre de recherche", description: "Recherche en temps réel par nom, entreprise ou email. Debounce de 300ms.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-006", userStory: "US-002", titre: "Ajouter les filtres statut et secteur", description: "Deux selects : filtre par statut (Tous/Actif/Prospect) et par secteur. Combinables avec la recherche.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-007", userStory: "US-002", titre: "Implémenter la pagination des résultats", description: "Navigation par pages avec 25 résultats par défaut. Affichage du nombre total de résultats.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-003
                { id: "p11-spartcrm:T-008", userStory: "US-003", titre: "Créer la page fiche client (layout)", description: "En-tête avec avatar, nom, statut, secteur. Bloc KPIs (4 cartes). Système d'onglets.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-009", userStory: "US-003", titre: "Implémenter l'onglet Aperçu", description: "Afficher les informations de contact (email, tél, adresse) et les détails entreprise (secteur, taille, site, date client depuis).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-010", userStory: "US-003", titre: "Implémenter l'onglet Affaires", description: "Liste des opportunités liées au client avec statut, montant, probabilité.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-011", userStory: "US-003", titre: "Créer l'endpoint API GET /clients/:id", description: "API Xano retournant le détail complet d'un client avec ses relations (affaires, échanges, tâches).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-004
                { id: "p11-spartcrm:T-012", userStory: "US-004", titre: "Créer le formulaire de création client", description: "Formulaire modal ou pleine page : nom, contact, email, téléphone, secteur, taille, adresse. Champs obligatoires marqués.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-013", userStory: "US-004", titre: "Créer l'endpoint API POST /clients", description: "API de création avec validation serveur (email unique, champs obligatoires).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-014", userStory: "US-004", titre: "Implémenter la détection de doublons", description: "À la saisie de l'email, vérifier si un client existe déjà et afficher une alerte.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-005
                { id: "p11-spartcrm:T-015", userStory: "US-005", titre: "Rendre la fiche client éditable", description: "Bouton Modifier qui passe les champs en mode édition. Bouton Enregistrer avec confirmation.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-016", userStory: "US-005", titre: "Créer l'endpoint API PUT /clients/:id", description: "API de modification avec historique des changements (champ modifié, ancienne valeur, nouvelle valeur, date, auteur).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-017", userStory: "US-005", titre: "Ajouter la validation côté client", description: "Vérification des champs obligatoires, format email, format téléphone avant envoi au serveur.", type: "Dev", estimation: "1h", status: "A faire", assignee: "Thomas B." },
                // US-006
                { id: "p11-spartcrm:T-018", userStory: "US-006", titre: "Créer la table Échanges dans Xano", description: "Table : type (Appel/Email/Réunion), titre, description, date, participants, client_id (relation).", type: "Config", estimation: "1h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-019", userStory: "US-006", titre: "Implémenter la timeline des échanges", description: "Onglet Échanges dans la fiche client : timeline chronologique avec icônes par type, titre, description, date.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-020", userStory: "US-006", titre: "Ajouter le filtre par type d'interaction", description: "Boutons filtres : Tous, Appels, Emails, Réunions.", type: "Dev", estimation: "1h", status: "A faire", assignee: "Thomas B." },
                // Transversal
                { id: "p11-spartcrm:T-021", userStory: "Transversal", titre: "Tests fonctionnels du module Clients", description: "Tester tous les parcours : création, modification, recherche, filtres, navigation fiche, timeline. Vérifier les rôles.", type: "Test", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-022", userStory: "Transversal", titre: "Design responsive du module", description: "Vérifier et ajuster l'affichage tablette et mobile de la liste clients et de la fiche détail.", type: "Design", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-023", userStory: "Transversal", titre: "Tests de permissions RBAC", description: "Vérifier que chaque rôle (commercial, manager, support) voit uniquement les données autorisées.", type: "Test", estimation: "2h", status: "A faire", assignee: "Thomas B." },
              ],
            },
          },
          {
            id: "p11-spartcrm:sprint-2",
            nom: "Sprint 2 — Pipeline Commercial Kanban",
            objectif:
              "Livrer le pipeline commercial visuel en Kanban : vue d'ensemble des opportunités, drag & drop entre étapes, création et détail d'une opportunité.",
            objectifCourt:
              "À la fin du Sprint 2, un commercial peut visualiser, créer et déplacer ses opportunités dans un pipeline Kanban interactif.",
            debut: "Semaine 6",
            fin: "Semaine 8",
            duree: "3 semaines (15 jours ouvrables)",
            velocite: "24 points d'effort",
            userStories: ["US-007", "US-008", "US-009", "US-010"],
            tasks: {
              create: [
                // US-007
                { id: "p11-spartcrm:T-024", userStory: "US-007", titre: "Créer la table Opportunités dans Xano", description: "Table : titre, entreprise, contact, montant, probabilité, étape (Nouveau/Qualifié/Proposition/Négociation/Gagné/Perdu), date création.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-025", userStory: "US-007", titre: "Construire la vue Kanban dans WeWeb", description: "6 colonnes correspondant aux étapes du pipeline. Cartes affichant entreprise, montant, probabilité. Totaux par colonne.", type: "Dev", estimation: "5h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-026", userStory: "US-007", titre: "Créer l'endpoint API GET /opportunites", description: "API retournant les opportunités groupées par étape avec filtres (commercial, période, montant minimum).", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                // US-008
                { id: "p11-spartcrm:T-027", userStory: "US-008", titre: "Implémenter le drag & drop entre colonnes", description: "Utilisation d'une librairie de DnD. Déplacement visuel fluide avec indicateur de zone de dépôt.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-028", userStory: "US-008", titre: "Créer l'endpoint API PATCH /opportunites/:id/etape", description: "API de mise à jour de l'étape avec recalcul automatique des totaux par colonne.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-029", userStory: "US-008", titre: "Ajouter les animations et feedback visuel", description: "Animation de glissement, highlight de la colonne cible, toast de confirmation après déplacement.", type: "Design", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-009
                { id: "p11-spartcrm:T-030", userStory: "US-009", titre: "Créer le formulaire d'ajout d'opportunité", description: "Modal avec champs : titre, entreprise (autocomplete), contact, montant, probabilité, étape initiale, notes.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-031", userStory: "US-009", titre: "Créer l'endpoint API POST /opportunites", description: "API de création avec validation (montant positif, entreprise existante, champs obligatoires).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-032", userStory: "US-009", titre: "Lier l'opportunité à un client existant", description: "Autocomplete sur le champ entreprise qui recherche dans la base clients. Liaison automatique.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-010
                { id: "p11-spartcrm:T-033", userStory: "US-010", titre: "Créer la vue détail d'une opportunité", description: "Page ou panneau latéral affichant : entreprise, contact, montant, probabilité, étape, historique des changements.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-034", userStory: "US-010", titre: "Implémenter le menu contextuel", description: "Clic droit ou bouton '...' sur la carte : Modifier, Supprimer, Changer d'étape, Ajouter une note.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-035", userStory: "US-010", titre: "Afficher l'historique des modifications", description: "Timeline des changements d'étape et de montant avec date, auteur et ancienne/nouvelle valeur.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // Transversal
                { id: "p11-spartcrm:T-036", userStory: "Transversal", titre: "Tests fonctionnels du pipeline", description: "Tester le drag & drop, la création, le détail. Vérifier la cohérence des totaux par colonne.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-037", userStory: "Transversal", titre: "Tests de performance Kanban", description: "Vérifier la fluidité avec 100+ opportunités. Optimiser le rendu si nécessaire.", type: "Test", estimation: "2h", status: "A faire", assignee: "Thomas B." },
              ],
            },
          },
          {
            id: "p11-spartcrm:sprint-3",
            nom: "Sprint 3 — Tâches & Rappels",
            objectif:
              "Permettre la gestion des tâches liées aux clients et opportunités avec un système de rappels automatiques pour ne rien oublier.",
            objectifCourt:
              "À la fin du Sprint 3, chaque utilisateur peut créer, suivre et recevoir des rappels sur ses tâches commerciales.",
            debut: "Semaine 9",
            fin: "Semaine 11",
            duree: "3 semaines (15 jours ouvrables)",
            velocite: "18 points d'effort",
            userStories: ["US-011", "US-012", "US-013"],
            tasks: {
              create: [
                // US-011
                { id: "p11-spartcrm:T-038", userStory: "US-011", titre: "Créer la table Tâches dans Xano", description: "Table : titre, description, statut (À faire/En cours/Terminé), priorité, date échéance, assigné, client_id, opportunite_id.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-039", userStory: "US-011", titre: "Construire la vue liste des tâches", description: "Page avec tableau triable : titre, client lié, priorité (tag coloré), échéance, statut. Filtres par statut et priorité.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-040", userStory: "US-011", titre: "Créer l'endpoint API GET /taches", description: "API avec filtres (statut, priorité, assigné, échéance) et pagination. Inclure les relations client et opportunité.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-012
                { id: "p11-spartcrm:T-041", userStory: "US-012", titre: "Créer le formulaire d'ajout de tâche", description: "Modal : titre, description, priorité, date échéance, assignation, lien client/opportunité. Validation des champs.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-042", userStory: "US-012", titre: "Créer l'endpoint API POST /taches", description: "API de création avec validation et notification au membre assigné.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-043", userStory: "US-012", titre: "Implémenter la création rapide depuis la fiche client", description: "Bouton 'Ajouter une tâche' dans la fiche client qui pré-remplit le lien client.", type: "Dev", estimation: "1h", status: "A faire", assignee: "Thomas B." },
                // US-013
                { id: "p11-spartcrm:T-044", userStory: "US-013", titre: "Configurer le système de notifications", description: "Service de notification dans Xano : vérification des échéances, génération des alertes, envoi par email.", type: "Config", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-045", userStory: "US-013", titre: "Créer le centre de notifications in-app", description: "Icône cloche dans le header avec badge. Panneau déroulant listant les rappels avec lien vers la tâche.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-046", userStory: "US-013", titre: "Implémenter les règles de rappel", description: "Rappel J-1 et J-0 pour les tâches à échéance. Rappel si tâche en retard. Paramètres personnalisables.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // Transversal
                { id: "p11-spartcrm:T-047", userStory: "Transversal", titre: "Tests fonctionnels tâches et rappels", description: "Tester création, modification, suppression de tâches. Vérifier le déclenchement des rappels.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
              ],
            },
          },
          {
            id: "p11-spartcrm:sprint-4",
            nom: "Sprint 4 — Reporting & Dashboard",
            objectif:
              "Construire le tableau de bord manager et les rapports de performance commerciale avec export des données.",
            objectifCourt:
              "À la fin du Sprint 4, un manager peut suivre la performance de son équipe via un dashboard et exporter les rapports.",
            debut: "Semaine 12",
            fin: "Semaine 14",
            duree: "3 semaines (15 jours ouvrables)",
            velocite: "21 points d'effort",
            userStories: ["US-014", "US-015", "US-016"],
            tasks: {
              create: [
                // US-014
                { id: "p11-spartcrm:T-048", userStory: "US-014", titre: "Créer la page dashboard manager", description: "Layout avec KPIs en haut (CA pipeline, taux conversion, nb opportunités, tâches en retard) et zone graphiques en dessous.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-049", userStory: "US-014", titre: "Implémenter les graphiques de performance", description: "Graphiques : évolution CA pipeline (courbe), répartition par étape (camembert), activité par commercial (barres).", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-050", userStory: "US-014", titre: "Créer les endpoints API d'agrégation", description: "APIs calculant les KPIs et données graphiques : /stats/pipeline, /stats/activite, /stats/conversion.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                // US-015
                { id: "p11-spartcrm:T-051", userStory: "US-015", titre: "Créer la page rapports", description: "Interface avec filtres (période, commercial, secteur) et tableau de résultats détaillé.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-052", userStory: "US-015", titre: "Implémenter les filtres dynamiques", description: "Filtres combinables avec mise à jour en temps réel des résultats. Sélecteur de période personnalisable.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-053", userStory: "US-015", titre: "Créer l'endpoint API GET /rapports", description: "API avec filtres multiples retournant données tabulaires : commercial, nb clients, nb opportunités, CA, taux conversion.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-016
                { id: "p11-spartcrm:T-054", userStory: "US-016", titre: "Implémenter l'export Excel", description: "Bouton 'Exporter en Excel' générant un fichier .xlsx avec les données filtrées du rapport.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-055", userStory: "US-016", titre: "Implémenter l'export PDF", description: "Bouton 'Exporter en PDF' générant un rapport formaté avec en-tête, tableau et graphiques.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-056", userStory: "US-016", titre: "Ajouter l'envoi par email programmé", description: "Option d'envoi automatique du rapport par email chaque lundi matin au manager.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // Transversal
                { id: "p11-spartcrm:T-057", userStory: "Transversal", titre: "Tests fonctionnels dashboard et rapports", description: "Vérifier les calculs KPIs, la cohérence des graphiques et le bon fonctionnement des exports.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
              ],
            },
          },
          {
            id: "p11-spartcrm:sprint-5",
            nom: "Sprint 5 — Intégrations & Migration",
            objectif:
              "Connecter le CRM à l'écosystème Microsoft 365, importer les leads HubSpot, migrer les données historiques et sécuriser les accès via SSO.",
            objectifCourt:
              "À la fin du Sprint 5, le CRM est connecté à Outlook, les données sont migrées et les accès sécurisés par SSO.",
            debut: "Semaine 15",
            fin: "Semaine 18",
            duree: "4 semaines (20 jours ouvrables)",
            velocite: "24 points d'effort",
            userStories: ["US-017", "US-018", "US-019", "US-020", "US-021", "US-022"],
            tasks: {
              create: [
                // US-017
                { id: "p11-spartcrm:T-058", userStory: "US-017", titre: "Configurer le connecteur Microsoft Graph API", description: "Inscription de l'app dans Azure AD, configuration des scopes (Mail.Read, Mail.Send), gestion du token OAuth2.", type: "Config", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-059", userStory: "US-017", titre: "Implémenter la synchronisation bidirectionnelle", description: "Récupération des emails liés à un contact CRM. Envoi d'emails depuis la fiche client via Graph API.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-060", userStory: "US-017", titre: "Afficher les emails dans l'onglet Échanges", description: "Intégration des emails synchronisés dans la timeline existante avec icône dédiée et aperçu.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-018
                { id: "p11-spartcrm:T-061", userStory: "US-018", titre: "Connecter le calendrier Outlook via Graph API", description: "Scope Calendar.ReadWrite. Récupération des événements liés aux contacts CRM.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-062", userStory: "US-018", titre: "Créer la vue agenda dans le CRM", description: "Vue semaine/mois affichant les rendez-vous synchronisés avec lien vers la fiche client.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-063", userStory: "US-018", titre: "Implémenter la création de RDV depuis le CRM", description: "Bouton 'Planifier un RDV' dans la fiche client créant l'événement dans Outlook automatiquement.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-019
                { id: "p11-spartcrm:T-064", userStory: "US-019", titre: "Créer le connecteur API HubSpot", description: "Authentification OAuth2 HubSpot, récupération des contacts et deals via l'API v3.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-065", userStory: "US-019", titre: "Implémenter le mapping et import des leads", description: "Correspondance champs HubSpot → CRM. Import par lot avec gestion des doublons (email unique).", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-066", userStory: "US-019", titre: "Créer l'interface d'import avec rapport", description: "Page d'import : sélection source, aperçu des données, lancement, rapport (importés/doublons/erreurs).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-020
                { id: "p11-spartcrm:T-067", userStory: "US-020", titre: "Créer le module d'upload CSV/Excel", description: "Interface drag & drop pour upload de fichiers. Détection automatique des colonnes et aperçu des données.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-068", userStory: "US-020", titre: "Implémenter le mapping de colonnes", description: "Interface de correspondance colonnes fichier → champs CRM avec détection intelligente des noms similaires.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-069", userStory: "US-020", titre: "Créer le processus d'import par lot", description: "Import asynchrone avec barre de progression. Gestion des erreurs ligne par ligne. Rapport final téléchargeable.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                // US-021
                { id: "p11-spartcrm:T-070", userStory: "US-021", titre: "Configurer l'authentification SSO Azure AD", description: "Configuration du fournisseur d'identité Azure AD dans Xano. Gestion du flux OAuth2/OIDC.", type: "Config", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-071", userStory: "US-021", titre: "Créer la page de connexion SSO", description: "Bouton 'Se connecter avec Microsoft' redirigeant vers Azure AD. Gestion du callback et création de session.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-072", userStory: "US-021", titre: "Gérer le provisioning automatique des comptes", description: "À la première connexion SSO, créer automatiquement le profil utilisateur CRM avec le bon rôle.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // US-022
                { id: "p11-spartcrm:T-073", userStory: "US-022", titre: "Implémenter le système RBAC dans Xano", description: "Middleware vérifiant le rôle de l'utilisateur sur chaque endpoint. 4 rôles : Commercial, Account Manager, Support, Direction.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-074", userStory: "US-022", titre: "Filtrer les données côté API selon le rôle", description: "Commercial : ses clients uniquement. Manager : son équipe. Direction : tout. Support : clients assignés.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-075", userStory: "US-022", titre: "Adapter l'interface selon les permissions", description: "Masquer les boutons/menus non autorisés. Afficher un message si l'utilisateur accède à une ressource interdite.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
                // Transversal
                { id: "p11-spartcrm:T-076", userStory: "Transversal", titre: "Tests d'intégration Microsoft 365", description: "Tester la sync email, calendrier et SSO de bout en bout avec un compte de test Azure AD.", type: "Test", estimation: "4h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-077", userStory: "Transversal", titre: "Tests de migration de données", description: "Importer les ~2500 comptes et ~10000 contacts de test. Vérifier la cohérence et les doublons.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
                { id: "p11-spartcrm:T-078", userStory: "Transversal", titre: "Tests de sécurité RBAC complets", description: "Vérifier l'isolation des données par rôle sur toutes les pages. Tester les tentatives d'accès non autorisé.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
              ],
            },
          },
        ],
      },

      // ─── QUESTIONNAIRE SECTIONS ───
      questionnaireSections: {
        create: [
          {
            title: "1. Contexte business",
            description: "Pour bien comprendre votre activité et adapter le CRM à vos besoins réels.",
            pourquoi: "Ces questions permettent de dimensionner le projet (nombre d'utilisateurs, volume de données) et d'adapter l'architecture technique aux besoins réels de Spart.",
            order: 0,
            questions: {
              create: [
                { id: "p11-spartcrm:q1_1", label: "Pouvez-vous décrire en quelques phrases l'activité principale de Spart et vos services proposés aux PME ?", type: "textarea", options: [], placeholder: "Décrivez votre activité...", required: true, order: 0 },
                { id: "p11-spartcrm:q1_2", label: "Combien de personnes composent votre équipe au total ?", type: "select", options: ["1-5", "6-10", "11-20", "21-50", "50+"], required: true, order: 1 },
                { id: "p11-spartcrm:q1_3", label: "Combien de clients et prospects gérez-vous actuellement (approximativement) ?", type: "select", options: ["Moins de 100", "100-500", "500-1000", "1000-5000", "Plus de 5000"], required: true, order: 2 },
                { id: "p11-spartcrm:q1_4", label: "Quelle est la taille de votre équipe commerciale (nombre de personnes) ?", type: "text", options: [], placeholder: "Ex : 8 commerciaux", order: 3 },
                { id: "p11-spartcrm:q1_5", label: "Quels sont les différents rôles au sein de votre équipe qui utiliseront le CRM ?", type: "checkbox", options: ["Commerciaux / BizDev", "Account Managers", "Support client", "Direction / Management", "Marketing", "Autre"], required: true, order: 4 },
              ],
            },
          },
          {
            title: "2. Outils et pratiques actuels",
            description: "Pour comprendre comment vous travaillez aujourd'hui et identifier les points de friction.",
            pourquoi: "Comprendre l'existant est essentiel pour identifier les points de douleur, planifier la migration des données et assurer la compatibilité avec l'écosystème Microsoft 365.",
            order: 1,
            questions: {
              create: [
                { id: "p11-spartcrm:q2_1", label: "Quels outils utilisez-vous actuellement pour gérer vos clients et prospects ?", type: "checkbox", options: ["Fichiers Excel / Google Sheets", "Emails (Outlook / Gmail)", "CRM existant (Salesforce, HubSpot...)", "Outils internes personnalisés", "Carnets / notes papier", "Autre"], order: 0 },
                { id: "p11-spartcrm:q2_2", label: "Quelles sont les principales difficultés que vous rencontrez avec votre système actuel ?", type: "textarea", options: [], placeholder: "Ex : perte d'informations, doublons, manque de visibilité...", required: true, order: 1 },
                { id: "p11-spartcrm:q2_3", label: "Utilisez-vous un environnement Google Workspace ou Microsoft 365 ?", type: "select", options: ["Google Workspace (Gmail, Calendar, Drive)", "Microsoft 365 (Outlook, Teams, OneDrive)", "Les deux", "Autre"], order: 2 },
                { id: "p11-spartcrm:q2_4", label: "Quels outils externes souhaitez-vous connecter au CRM ?", type: "checkbox", options: ["Email (Outlook / Gmail)", "Calendrier (Google Calendar / Outlook Calendar)", "Outil de facturation", "Outil de support (Zendesk, Freshdesk...)", "Marketing automation (HubSpot, Mailchimp...)", "Aucun pour l'instant"], order: 3 },
              ],
            },
          },
          {
            title: "3. Objectifs et indicateurs de réussite",
            description: "Pour définir les résultats attendus et mesurer le succès du projet.",
            pourquoi: "Définir des objectifs mesurables permet de valider le succès du projet via des KPIs concrets et d'orienter la priorisation MoSCoW du backlog.",
            order: 2,
            questions: {
              create: [
                { id: "p11-spartcrm:q3_1", label: "Quels sont vos 3 objectifs principaux avec ce CRM ?", type: "textarea", options: [], placeholder: "Ex : centraliser les données, suivre le pipeline en temps réel...", required: true, order: 0 },
                { id: "p11-spartcrm:q3_2", label: "Comment mesurerez-vous le succès du CRM ? Quels KPIs sont importants pour vous ?", type: "checkbox", options: ["Taux d'adoption par les équipes", "Pipeline commercial à jour en temps réel", "Réduction du temps de préparation des réunions", "Taux de conversion prospects/clients", "Satisfaction des utilisateurs internes", "Autre"], order: 1 },
                { id: "p11-spartcrm:q3_3", label: "À quoi ressemblerait le CRM idéal pour votre équipe ?", type: "textarea", options: [], placeholder: "Décrivez votre vision...", order: 2 },
                { id: "p11-spartcrm:q3_4", label: "Sur une échelle de 1 à 5, quelle importance accordez-vous à chacune de ces fonctionnalités ?", type: "scale", options: ["Fiches clients et prospects", "Pipeline commercial visuel (Kanban)", "Tâches et rappels automatiques", "Tableaux de bord et reporting", "Intégrations email et agenda"], order: 3 },
              ],
            },
          },
          {
            title: "4. Contraintes et ressources",
            description: "Pour dimensionner le projet de manière réaliste et planifier les livrables.",
            pourquoi: "Ces informations conditionnent le planning, le périmètre du MVP et les choix techniques (budget, RGPD, migration, ressources disponibles).",
            order: 3,
            questions: {
              create: [
                { id: "p11-spartcrm:q4_1", label: "Quel budget avez-vous prévu pour ce projet (même une fourchette approximative) ?", type: "select", options: ["Moins de 50 000 EUR", "50 000 - 100 000 EUR", "100 000 - 150 000 EUR", "Plus de 150 000 EUR", "À définir"], required: true, order: 0 },
                { id: "p11-spartcrm:q4_2", label: "Avez-vous une date souhaitée pour la mise en service d'une première version (MVP) ?", type: "text", options: [], placeholder: "Ex : d'ici 3 mois, septembre 2025...", order: 1 },
                { id: "p11-spartcrm:q4_3", label: "Qui sera votre interlocuteur principal (Product Owner) pour ce projet ?", type: "text", options: [], placeholder: "Nom et fonction", required: true, order: 2 },
                { id: "p11-spartcrm:q4_4", label: "Y a-t-il des données existantes à migrer vers le nouveau CRM ?", type: "select", options: ["Oui, beaucoup de données (Excel, ERP, emails)", "Oui, quelques fichiers Excel", "Non, on part de zéro", "Je ne sais pas encore"], order: 3 },
                { id: "p11-spartcrm:q4_5", label: "Avez-vous des exigences en matière de sécurité ou de conformité RGPD ?", type: "select", options: ["Oui, c'est prioritaire", "Oui, mais standard", "Pas de contrainte particulière", "Je ne sais pas"], order: 4 },
              ],
            },
          },
          {
            title: "5. Vision et positionnement",
            description: "Pour comprendre votre vision à long terme et éviter les erreurs de conception.",
            pourquoi: "Anticiper l'évolution du produit permet d'éviter des erreurs d'architecture et de concevoir un CRM évolutif aligné avec la stratégie de Spart.",
            order: 4,
            questions: {
              create: [
                { id: "p11-spartcrm:q5_1", label: "Qu'est-ce que vous voulez absolument éviter dans ce CRM ?", type: "textarea", options: [], placeholder: "Ex : un outil trop complexe, trop de clics pour saisir une info...", order: 0 },
                { id: "p11-spartcrm:q5_2", label: "Le CRM est-il destiné à rester un outil interne ou pourrait-il être proposé à vos clients PME ?", type: "select", options: ["Outil strictement interne", "Pourrait être proposé aux clients à terme", "Pas encore défini"], order: 1 },
                { id: "p11-spartcrm:q5_3", label: "Comment chaque rôle devrait-il voir les données ? (chacun voit tout, ou vision restreinte)", type: "select", options: ["Chacun voit uniquement ses propres données", "Vision par équipe", "Tout le monde voit tout", "Cela dépend du rôle (à définir ensemble)"], order: 2 },
                { id: "p11-spartcrm:q5_4", label: "Y a-t-il autre chose que vous souhaiteriez nous partager et que nous n'avons pas abordé ?", type: "textarea", options: [], placeholder: "Champ libre...", order: 3 },
              ],
            },
          },
        ],
      },

      // ─── PERSONAS ───
      personas: {
        create: [
          {
            initials: "MD",
            nom: "Marc Duval",
            age: 35,
            role: "Commercial terrain",
            contexte: "Passe 80% de son temps en déplacement chez les clients. Utilise principalement son smartphone entre deux rendez-vous.",
            besoinPrincipal: "Saisie rapide d'un prospect sur mobile après un RDV, accès immédiat aux fiches clients avant un meeting.",
            frustration: "Perd des informations entre deux RDV car il note sur papier ou dans des SMS. Oublie de relancer faute de rappel.",
            objectif: "Ne plus perdre aucun prospect et gagner du temps sur la saisie administrative.",
            order: 0,
          },
          {
            initials: "SM",
            nom: "Sophie Martin",
            age: 42,
            role: "Directrice commerciale",
            contexte: "Pilote une équipe de 10 commerciaux. Doit rendre compte au CODIR chaque semaine avec des prévisions fiables.",
            besoinPrincipal: "Vision pipeline en temps réel, forecast consolidé et indicateurs de performance par commercial.",
            frustration: "Prépare ses comités commerciaux dans Excel en agrégeant manuellement les données de chaque commercial. Prend une demi-journée.",
            objectif: "Avoir un tableau de bord fiable et automatisé pour piloter la performance commerciale.",
            order: 1,
          },
          {
            initials: "LP",
            nom: "Lucas Petit",
            age: 28,
            role: "Support client",
            contexte: "Traite 30 à 40 demandes clients par jour. Doit comprendre rapidement le contexte de chaque client pour résoudre les problèmes.",
            besoinPrincipal: "Accès rapide à l'historique complet du client (interactions, contrat, tickets passés) depuis un seul écran.",
            frustration: "Doit demander aux commerciaux le contexte d'un client par email ou Slack avant de pouvoir répondre. Temps de réponse allongé.",
            objectif: "Réduire le temps de résolution en ayant toutes les informations client accessibles instantanément.",
            order: 2,
          },
        ],
      },

      // ─── STAKEHOLDERS ───
      stakeholders: {
        create: [
          {
            nom: "Directeur commercial (Sponsor)",
            role: "Valide les orientations stratégiques, arbitre les priorités, signe les livrables",
            implication: "Haute",
            canal: "Réunion mensuelle + email",
            order: 0,
          },
          {
            nom: "Chef de projet IT",
            role: "Interlocuteur technique principal, coordonne les aspects infra et intégration",
            implication: "Haute",
            canal: "Réunion hebdo + Slack/Teams",
            order: 1,
          },
          {
            nom: "Référents métier (1 par équipe)",
            role: "Fournissent les besoins métier, valident les user stories, testent les livrables",
            implication: "Moyenne",
            canal: "Réunion de sprint + email",
            order: 2,
          },
          {
            nom: "Commerciaux (utilisateurs finaux)",
            role: "Utilisateurs principaux du CRM, participent aux tests et retours",
            implication: "Faible (ponctuelle)",
            canal: "Démo de sprint + formation",
            order: 3,
          },
          {
            nom: "Thomas Bordier (Développeur)",
            role: "Cadrage, développement, déploiement, formation, suivi post-déploiement",
            implication: "Haute",
            canal: "Tous canaux",
            order: 4,
          },
        ],
      },

      // ─── RITUALS ───
      rituals: {
        create: [
          {
            rituel: "Point hebdomadaire",
            frequence: "Chaque lundi, 30 min",
            participants: "Thomas + Chef de projet IT",
            objectif: "Faire le point sur l'avancement du sprint, lever les blocages, ajuster les priorités si nécessaire.",
            format: "Visio (Teams/Google Meet)",
            livrable: "Compte-rendu email envoyé dans la journée",
            order: 0,
          },
          {
            rituel: "Sprint Review / Démo",
            frequence: "Toutes les 2-3 semaines (fin de sprint)",
            participants: "Thomas + Chef de projet IT + Référents métier + Sponsor",
            objectif: "Présenter les fonctionnalités développées pendant le sprint. Recueillir les retours. Valider ou ajuster.",
            format: "Visio ou présentiel (1h)",
            livrable: "Fonctionnalités démontrées + feedback documenté",
            order: 1,
          },
          {
            rituel: "Sprint Planning",
            frequence: "Début de chaque sprint",
            participants: "Thomas + Chef de projet IT + Référent métier concerné",
            objectif: "Définir le contenu du prochain sprint, valider les user stories, estimer l'effort.",
            format: "Visio (1h)",
            livrable: "Sprint Backlog validé",
            order: 2,
          },
          {
            rituel: "Comité de pilotage",
            frequence: "Mensuel",
            participants: "Thomas + Sponsor (Directeur commercial) + Chef de projet IT",
            objectif: "Vision macro du projet : avancement global, respect du planning et du budget, décisions stratégiques.",
            format: "Réunion formelle (1h)",
            livrable: "Dashboard projet + décisions documentées",
            order: 3,
          },
          {
            rituel: "Point ad hoc (urgences)",
            frequence: "À la demande",
            participants: "Thomas + interlocuteur concerné",
            objectif: "Résoudre un blocage technique ou fonctionnel urgent sans attendre le point hebdo.",
            format: "Appel Teams/Slack ou email urgent",
            livrable: "Résolution documentée dans le suivi de projet",
            order: 4,
          },
        ],
      },

      // ─── TEST CASES (42) ───
      testCases: {
        create: [
          // Sprint 1
          { id: "p11-spartcrm:R-001", us: "US-001", sprint: "Sprint 1", etape: "Liste clients", action: "Ouvrir la page /clients", attendu: "La liste affiche les clients avec pagination et tri.", obtenu: "Liste chargee correctement, tri operationnel.", statut: "OK", order: 0 },
          { id: "p11-spartcrm:R-002", us: "US-001", sprint: "Sprint 1", etape: "Tri", action: "Cliquer sur la colonne Dernier contact", attendu: "Le tri ascendant/descendant s'applique sans rechargement.", obtenu: "Tri effectif mais inversion lente sur gros volume.", statut: "A retester", order: 1 },
          { id: "p11-spartcrm:R-003", us: "US-002", sprint: "Sprint 1", etape: "Recherche", action: "Rechercher \"Durand\"", attendu: "Les clients correspondants sont filtres en moins de 1 seconde.", obtenu: "Resultat renvoye en 400 ms.", statut: "OK", order: 2 },
          { id: "p11-spartcrm:R-004", us: "US-002", sprint: "Sprint 1", etape: "Filtres", action: "Cumuler filtre statut + secteur", attendu: "Les deux filtres se combinent correctement.", obtenu: "Le filtre secteur est ignore apres reinitialisation.", statut: "KO", order: 3 },
          { id: "p11-spartcrm:R-005", us: "US-003", sprint: "Sprint 1", etape: "Fiche detail", action: "Ouvrir une fiche depuis la liste", attendu: "La fiche client affiche donnees, KPIs et onglets.", obtenu: "Affichage complet, aucun bloc manquant.", statut: "OK", order: 4 },
          { id: "p11-spartcrm:R-006", us: "US-004", sprint: "Sprint 1", etape: "Creation client", action: "Soumettre un nouveau client avec champs obligatoires", attendu: "Le client est cree et visible dans la liste.", obtenu: "Creation effectuee mais doublon email non bloque.", statut: "KO", order: 5 },
          { id: "p11-spartcrm:R-007", us: "US-005", sprint: "Sprint 1", etape: "Edition fiche", action: "Modifier le telephone puis enregistrer", attendu: "La nouvelle valeur est persistee et visible immediatement.", obtenu: "Valeur enregistree, rafraichissement necessaire.", statut: "A retester", order: 6 },
          { id: "p11-spartcrm:R-008", us: "US-006", sprint: "Sprint 1", etape: "Historique", action: "Ajouter un echange de type Appel", attendu: "L'echange apparait en tete de timeline.", obtenu: "Insertion correcte en ordre chronologique.", statut: "OK", order: 7 },
          { id: "p11-spartcrm:R-009", us: "US-006", sprint: "Sprint 1", etape: "Filtre interactions", action: "Filtrer sur Emails", attendu: "Seuls les emails restent affiches.", obtenu: "Filtre applique, 1 anomalie visuelle sur mobile.", statut: "A retester", order: 8 },
          { id: "p11-spartcrm:R-010", us: "Transversal", sprint: "Sprint 1", etape: "Responsive S1", action: "Verifier affichage tablette et mobile", attendu: "Aucune rupture de mise en page bloquante.", obtenu: "Affichage tablette OK, mobile a ajuster sur timeline.", statut: "A retester", order: 9 },
          // Sprint 2
          { id: "p11-spartcrm:R-011", us: "US-007", sprint: "Sprint 2", etape: "Vue Kanban", action: "Ouvrir la page /pipeline", attendu: "Le pipeline affiche 6 colonnes avec les opportunites et totaux par colonne.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 10 },
          { id: "p11-spartcrm:R-012", us: "US-007", sprint: "Sprint 2", etape: "Filtres pipeline", action: "Filtrer par commercial et par periode", attendu: "Les opportunites affichees correspondent aux filtres selectionnes.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 11 },
          { id: "p11-spartcrm:R-013", us: "US-008", sprint: "Sprint 2", etape: "Drag & drop", action: "Deplacer une carte de Qualifie vers Proposition", attendu: "La carte change de colonne et les totaux se recalculent en temps reel.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 12 },
          { id: "p11-spartcrm:R-014", us: "US-008", sprint: "Sprint 2", etape: "Feedback visuel", action: "Glisser une carte au-dessus d'une colonne", attendu: "La zone de depot est mise en surbrillance et un toast confirme le deplacement.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 13 },
          { id: "p11-spartcrm:R-015", us: "US-009", sprint: "Sprint 2", etape: "Creation opportunite", action: "Remplir le formulaire et valider", attendu: "L'opportunite apparait dans la bonne colonne du pipeline.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 14 },
          { id: "p11-spartcrm:R-016", us: "US-009", sprint: "Sprint 2", etape: "Lien client", action: "Chercher un client existant dans l'autocomplete", attendu: "Le client est lie a l'opportunite creee.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 15 },
          { id: "p11-spartcrm:R-017", us: "US-010", sprint: "Sprint 2", etape: "Detail opportunite", action: "Cliquer sur une carte dans le pipeline", attendu: "Le panneau detail affiche entreprise, montant, probabilite, historique.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 16 },
          { id: "p11-spartcrm:R-018", us: "US-010", sprint: "Sprint 2", etape: "Menu contextuel", action: "Clic droit ou bouton '...' sur une carte", attendu: "Menu affichant Modifier, Supprimer, Changer d'etape.", obtenu: "A tester lors du Sprint 2.", statut: "A tester", order: 17 },
          // Sprint 3
          { id: "p11-spartcrm:R-019", us: "US-011", sprint: "Sprint 3", etape: "Liste taches", action: "Ouvrir la page /taches", attendu: "Le tableau affiche les taches avec titre, client, priorite, echeance, statut.", obtenu: "A tester lors du Sprint 3.", statut: "A tester", order: 18 },
          { id: "p11-spartcrm:R-020", us: "US-011", sprint: "Sprint 3", etape: "Filtres taches", action: "Filtrer par priorite Haute et statut En cours", attendu: "Seules les taches correspondantes sont affichees.", obtenu: "A tester lors du Sprint 3.", statut: "A tester", order: 19 },
          { id: "p11-spartcrm:R-021", us: "US-012", sprint: "Sprint 3", etape: "Creation tache", action: "Creer une tache depuis le formulaire modal", attendu: "La tache est creee avec les bons champs et visible dans la liste.", obtenu: "A tester lors du Sprint 3.", statut: "A tester", order: 20 },
          { id: "p11-spartcrm:R-022", us: "US-012", sprint: "Sprint 3", etape: "Creation rapide", action: "Cliquer sur Ajouter une tache depuis la fiche client", attendu: "Le formulaire s'ouvre avec le client pre-rempli.", obtenu: "A tester lors du Sprint 3.", statut: "A tester", order: 21 },
          { id: "p11-spartcrm:R-023", us: "US-013", sprint: "Sprint 3", etape: "Rappel J-1", action: "Creer une tache echeance demain puis attendre le lendemain", attendu: "Une notification apparait dans le centre de notifications in-app.", obtenu: "A tester lors du Sprint 3.", statut: "A tester", order: 22 },
          { id: "p11-spartcrm:R-024", us: "US-013", sprint: "Sprint 3", etape: "Rappel email", action: "Verifier la boite mail apres le declenchement du rappel", attendu: "Un email de rappel est recu avec le lien vers la tache.", obtenu: "A tester lors du Sprint 3.", statut: "A tester", order: 23 },
          // Sprint 4
          { id: "p11-spartcrm:R-025", us: "US-014", sprint: "Sprint 4", etape: "Dashboard KPIs", action: "Ouvrir la page /dashboard", attendu: "Les 4 KPIs (CA pipeline, taux conversion, nb opportunites, taches en retard) s'affichent.", obtenu: "A tester lors du Sprint 4.", statut: "A tester", order: 24 },
          { id: "p11-spartcrm:R-026", us: "US-014", sprint: "Sprint 4", etape: "Graphiques", action: "Verifier les graphiques de performance", attendu: "Courbe evolution CA, camembert repartition, barres activite par commercial.", obtenu: "A tester lors du Sprint 4.", statut: "A tester", order: 25 },
          { id: "p11-spartcrm:R-027", us: "US-015", sprint: "Sprint 4", etape: "Rapports", action: "Generer un rapport avec filtres periode + commercial", attendu: "Le tableau affiche les donnees filtrees avec metriques de performance.", obtenu: "A tester lors du Sprint 4.", statut: "A tester", order: 26 },
          { id: "p11-spartcrm:R-028", us: "US-015", sprint: "Sprint 4", etape: "Filtres dynamiques", action: "Changer la periode et le commercial", attendu: "Les resultats se mettent a jour en temps reel.", obtenu: "A tester lors du Sprint 4.", statut: "A tester", order: 27 },
          { id: "p11-spartcrm:R-029", us: "US-016", sprint: "Sprint 4", etape: "Export Excel", action: "Cliquer sur Exporter en Excel", attendu: "Un fichier .xlsx est telecharge avec les donnees du rapport.", obtenu: "A tester lors du Sprint 4.", statut: "A tester", order: 28 },
          { id: "p11-spartcrm:R-030", us: "US-016", sprint: "Sprint 4", etape: "Export PDF", action: "Cliquer sur Exporter en PDF", attendu: "Un PDF formate avec en-tete, tableau et graphiques est genere.", obtenu: "A tester lors du Sprint 4.", statut: "A tester", order: 29 },
          // Sprint 5
          { id: "p11-spartcrm:R-031", us: "US-017", sprint: "Sprint 5", etape: "Sync emails", action: "Connecter le compte Outlook et ouvrir la fiche client", attendu: "Les emails echanges avec le contact apparaissent dans l'onglet Echanges.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 30 },
          { id: "p11-spartcrm:R-032", us: "US-017", sprint: "Sprint 5", etape: "Envoi email CRM", action: "Envoyer un email depuis la fiche client", attendu: "L'email est envoye via Outlook et visible dans la timeline.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 31 },
          { id: "p11-spartcrm:R-033", us: "US-018", sprint: "Sprint 5", etape: "Sync calendrier", action: "Creer un RDV depuis la fiche client", attendu: "L'evenement apparait dans le calendrier Outlook du commercial.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 32 },
          { id: "p11-spartcrm:R-034", us: "US-018", sprint: "Sprint 5", etape: "Vue agenda", action: "Ouvrir la vue agenda dans le CRM", attendu: "Les RDV synchronises depuis Outlook s'affichent avec lien vers la fiche client.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 33 },
          { id: "p11-spartcrm:R-035", us: "US-019", sprint: "Sprint 5", etape: "Import HubSpot", action: "Lancer l'import des leads depuis HubSpot", attendu: "Les contacts sont importes avec correspondance des champs. Doublons detectes.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 34 },
          { id: "p11-spartcrm:R-036", us: "US-019", sprint: "Sprint 5", etape: "Rapport import", action: "Verifier le rapport post-import", attendu: "Le rapport affiche le nombre importes, doublons ignores et erreurs.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 35 },
          { id: "p11-spartcrm:R-037", us: "US-020", sprint: "Sprint 5", etape: "Upload CSV", action: "Uploader un fichier CSV de 2500 comptes", attendu: "Le fichier est analyse, les colonnes detectees et un apercu affiche.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 36 },
          { id: "p11-spartcrm:R-038", us: "US-020", sprint: "Sprint 5", etape: "Migration complete", action: "Lancer l'import apres mapping des colonnes", attendu: "Les 2500 comptes et 10000 contacts sont importes. Rapport de migration genere.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 37 },
          { id: "p11-spartcrm:R-039", us: "US-021", sprint: "Sprint 5", etape: "Connexion SSO", action: "Cliquer sur Se connecter avec Microsoft", attendu: "Redirection vers Azure AD, retour au CRM avec session active.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 38 },
          { id: "p11-spartcrm:R-040", us: "US-021", sprint: "Sprint 5", etape: "Provisioning", action: "Premiere connexion d'un nouvel utilisateur SSO", attendu: "Le profil CRM est cree automatiquement avec le bon role.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 39 },
          { id: "p11-spartcrm:R-041", us: "US-022", sprint: "Sprint 5", etape: "Isolation donnees", action: "Se connecter en tant que Commercial A", attendu: "Seuls les clients assignes a Commercial A sont visibles.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 40 },
          { id: "p11-spartcrm:R-042", us: "US-022", sprint: "Sprint 5", etape: "Acces interdit", action: "Tenter d'acceder a la fiche d'un client non assigne", attendu: "Un message d'erreur 403 s'affiche, pas d'acces aux donnees.", obtenu: "A tester lors du Sprint 5.", statut: "A tester", order: 41 },
        ],
      },

      // ─── TECH WATCH CATEGORIES ───
      techWatchCategories: {
        create: [
          {
            titre: "Écosystème des plateformes Low-Code",
            miseAJour: "Février 2026",
            order: 0,
            themes: {
              create: [
                {
                  theme: "Nouvelles fonctionnalités des outils Low-Code",
                  description: "Annonces, mises à jour officielles des plateformes comme WeWeb, Xano, Bubble, FlutterFlow, Retool.",
                  avantages: "Permet de rester informé des nouvelles capacités et d'anticiper les évolutions techniques pour les projets clients.",
                  consultation: "Newsletter hebdomadaire WeWeb + check Xano Community chaque lundi matin.",
                  utiliseDansProjet: true,
                  apprentissage: "Découverte du système de composants réutilisables WeWeb 2.0, appliqué pour structurer les vues Contact et Pipeline de SpartCRM.",
                  order: 0,
                  sources: {
                    create: [
                      { nom: "WeWeb Blog", url: "https://www.weweb.io/blog", order: 0 },
                      { nom: "Xano Community", url: "https://community.xano.com", order: 1 },
                      { nom: "YouTube - WeWeb", url: "https://www.youtube.com/@weweb", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Évolutions des bonnes pratiques de développement Low-Code",
                  description: "Recommandations pour structurer les projets, organiser les workflows et assurer la maintenabilité.",
                  avantages: "Évite les anti-patterns et améliore la qualité des livrables Low-Code.",
                  consultation: "Veille passive via Slack + lecture Reddit 1x/semaine.",
                  order: 1,
                  sources: {
                    create: [
                      { nom: "No-Code / Low-Code France (Slack)", url: "https://nocode-france.slack.com", order: 0 },
                      { nom: "r/nocode (Reddit)", url: "https://www.reddit.com/r/nocode", order: 1 },
                      { nom: "Medium - Low Code", url: "https://medium.com/tag/low-code", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Nouvelles bibliothèques, plugins et intégrations",
                  description: "Extensions, connecteurs natifs et APIs externes pour enrichir les applications Low-Code.",
                  avantages: "Découvrir des outils qui font gagner du temps et enrichissent les projets sans développement custom.",
                  consultation: "Product Hunt Daily Digest (email quotidien) + check marketplace mensuel.",
                  order: 2,
                  sources: {
                    create: [
                      { nom: "Product Hunt", url: "https://www.producthunt.com", order: 0 },
                      { nom: "WeWeb Marketplace", url: "https://www.weweb.io/templates", order: 1 },
                      { nom: "RapidAPI Hub", url: "https://rapidapi.com/hub", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Sécurité des applications Low-Code",
                  description: "Menaces et bonnes pratiques pour protéger les données, gérer les rôles et assurer la conformité RGPD.",
                  avantages: "Garantir la sécurité des applications déployées et la conformité réglementaire.",
                  consultation: "Veille mensuelle OWASP + check CNIL lors de chaque nouveau projet.",
                  utiliseDansProjet: true,
                  apprentissage: "Application des recommandations OWASP pour le contrôle d'accès par rôles (RBAC) dans SpartCRM. Vérification RGPD pour le stockage des données contacts.",
                  order: 3,
                  sources: {
                    create: [
                      { nom: "OWASP Low-Code/No-Code Security", url: "https://owasp.org/www-project-citizen-development-top10-security-risks/", order: 0 },
                      { nom: "CNIL - RGPD", url: "https://www.cnil.fr", order: 1 },
                      { nom: "Xano Security Docs", url: "https://docs.xano.com/security", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Performance des applications Low-Code",
                  description: "Recommandations pour optimiser la vitesse, les requêtes API et les bases de données.",
                  avantages: "Livrer des applications rapides et améliorer l'expérience utilisateur finale.",
                  consultation: "Check web.dev lors du lancement d'un projet + vidéo Nocodelytics 1x/mois.",
                  utiliseDansProjet: true,
                  apprentissage: "Adoption de la pagination côté serveur (Xano) et du lazy loading pour les listes de contacts dans SpartCRM, suite aux benchmarks web.dev.",
                  order: 4,
                  sources: {
                    create: [
                      { nom: "Web.dev (Google)", url: "https://web.dev", order: 0 },
                      { nom: "Xano Performance Tips", url: "https://docs.xano.com", order: 1 },
                      { nom: "YouTube - Nocodelytics (recherche)", url: "https://www.youtube.com/results?search_query=nocodelytics", order: 2 },
                    ],
                  },
                },
              ],
            },
          },
          {
            titre: "Intelligence artificielle et automatisation",
            miseAJour: "Janvier 2026",
            order: 1,
            themes: {
              create: [
                {
                  theme: "Études de cas IA dans le développement Low-Code",
                  description: "Exemples concrets d'intégration de GPT ou autres IA pour automatiser des tâches ou améliorer l'UX.",
                  avantages: "Identifier des cas d'usage concrets pour proposer des fonctionnalités IA aux clients.",
                  consultation: "Newsletter The Rundown (quotidienne) + 1 vidéo/semaine.",
                  order: 0,
                  sources: {
                    create: [
                      { nom: "AI News (The Rundown)", url: "https://www.therundown.ai", order: 0 },
                      { nom: "YouTube - Liam Ottley", url: "https://www.youtube.com/@LiamOttley", order: 1 },
                      { nom: "Twitter/X - #AINoCode", url: "https://twitter.com/search?q=%23AINoCode", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Impact de l'IA sur le métier de développeur Low-Code",
                  description: "Impact des avancées IA sur les compétences attendues et l'évolution du rôle du développeur.",
                  avantages: "Anticiper les évolutions du métier et adapter ses compétences en conséquence.",
                  consultation: "Rapport Gartner annuel + veille LinkedIn passive.",
                  order: 1,
                  sources: {
                    create: [
                      { nom: "Gartner Insights", url: "https://www.gartner.com/en/topics/low-code", order: 0 },
                      { nom: "Forrester Blog", url: "https://www.forrester.com/blogs/", order: 1 },
                      { nom: "LinkedIn - Low Code Leaders", url: "https://www.linkedin.com/groups/13959187/", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Nouveaux outils d'automatisation",
                  description: "Make, Zapier, n8n et autres solutions pour connecter des services et automatiser des workflows.",
                  avantages: "Proposer des workflows automatisés aux clients pour réduire les tâches manuelles.",
                  consultation: "Blog Make et n8n bi-mensuel + vidéos à la demande.",
                  utiliseDansProjet: true,
                  apprentissage: "Choix de n8n comme outil d'automatisation pour les notifications CRM (relances automatiques, alertes pipeline) grâce à son modèle open-source et sa compatibilité Xano.",
                  order: 2,
                  sources: {
                    create: [
                      { nom: "Make (ex-Integromat)", url: "https://www.make.com/en/blog", order: 0 },
                      { nom: "n8n Blog", url: "https://blog.n8n.io", order: 1 },
                      { nom: "YouTube - Automation Town", url: "https://www.youtube.com/@AutomationTown", order: 2 },
                    ],
                  },
                },
              ],
            },
          },
          {
            titre: "Technologies utilisées dans les applications",
            miseAJour: "Février 2026",
            order: 2,
            themes: {
              create: [
                {
                  theme: "Intégration de paiements et transactions",
                  description: "APIs Stripe, PayPal pour gérer les paiements, abonnements et webhooks sécurisés.",
                  avantages: "Rester à jour sur les fonctionnalités de paiement pour les intégrer efficacement.",
                  consultation: "Changelog Stripe à chaque projet e-commerce + blog mensuel.",
                  order: 0,
                  sources: {
                    create: [
                      { nom: "Stripe Blog", url: "https://stripe.com/blog", order: 0 },
                      { nom: "Stripe Docs Changelog", url: "https://stripe.com/docs/changelog", order: 1 },
                      { nom: "Dev.to - #payments", url: "https://dev.to/t/payments", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Fonctionnalités d'emailing et de communication",
                  description: "Outils et bonnes pratiques pour les emails transactionnels et notifications.",
                  avantages: "Implémenter des systèmes de notifications et d'emailing fiables et performants.",
                  consultation: "Check documentation à chaque intégration email.",
                  utiliseDansProjet: true,
                  apprentissage: "Intégration de Brevo pour les emails transactionnels de SpartCRM (confirmation de compte, notifications de deals).",
                  order: 1,
                  sources: {
                    create: [
                      { nom: "Brevo (ex-Sendinblue) Blog", url: "https://www.brevo.com/blog/", order: 0 },
                      { nom: "SendGrid Docs", url: "https://docs.sendgrid.com/", order: 1 },
                      { nom: "Mailchimp Resources", url: "https://mailchimp.com/resources/", order: 2 },
                    ],
                  },
                },
                {
                  theme: "Gestion des utilisateurs et authentification",
                  description: "Solutions pour l'authentification avancée, les rôles et la personnalisation UX.",
                  avantages: "Sécuriser les applications et proposer des expériences de connexion modernes (SSO, OAuth).",
                  consultation: "Documentation Auth0 lors de la mise en place de l'auth sur un projet.",
                  utiliseDansProjet: true,
                  apprentissage: "Utilisation du système d'authentification natif WeWeb + Xano Auth pour gérer les rôles (admin, commercial, manager) dans SpartCRM.",
                  order: 2,
                  sources: {
                    create: [
                      { nom: "Auth0 Blog", url: "https://auth0.com/blog", order: 0 },
                      { nom: "WeWeb Auth Documentation", url: "https://docs.weweb.io", order: 1 },
                    ],
                  },
                },
                {
                  theme: "Gestion des bases de données et workflows",
                  description: "Mises à jour sur Xano, Airtable, Firebase pour structurer les données.",
                  avantages: "Exploiter les nouvelles fonctionnalités BDD pour optimiser les performances.",
                  consultation: "Changelog Xano à chaque mise à jour.",
                  utiliseDansProjet: true,
                  apprentissage: "Adoption des filtres natifs Xano plutôt qu'un endpoint custom pour les requêtes de recherche contacts, réduisant le temps de développement de 40%.",
                  order: 3,
                  sources: {
                    create: [
                      { nom: "Xano Changelog", url: "https://xano.com/changelog", order: 0 },
                      { nom: "Firebase Release Notes", url: "https://firebase.google.com/support/releases", order: 1 },
                    ],
                  },
                },
              ],
            },
          },
          {
            titre: "Gestion de projet",
            miseAJour: "Février 2026",
            order: 3,
            themes: {
              create: [
                {
                  theme: "Product management et priorisation du backlog en Low-Code",
                  description: "Méthodes pour organiser les fonctionnalités, définir les priorités et planifier les livraisons.",
                  avantages: "Améliorer la gestion de projet et la collaboration avec les clients.",
                  consultation: "Articles Mind the Product hebdo + vidéos Scrum Life à la demande.",
                  utiliseDansProjet: true,
                  apprentissage: "Adoption de la méthode MoSCoW pour la priorisation du backlog SpartCRM et découpage en 5 sprints de 2 semaines.",
                  order: 0,
                  sources: {
                    create: [
                      { nom: "Scrum.org Blog", url: "https://www.scrum.org/resources/blog", order: 0 },
                      { nom: "Mind the Product", url: "https://www.mindtheproduct.com", order: 1 },
                      { nom: "YouTube - Scrum Life", url: "https://www.youtube.com/@ScrumLife", order: 2 },
                    ],
                  },
                },
              ],
            },
          },
          {
            titre: "Analyse concurrentielle CRM",
            miseAJour: "Février 2026",
            order: 4,
            themes: {
              create: [
                {
                  theme: "Analyse des CRM concurrents (SaaS)",
                  description: "Benchmark des CRM leaders du marché (HubSpot, Pipedrive, Salesforce, Zoho) pour identifier leurs forces, faiblesses et justifier le développement d'un CRM sur-mesure.",
                  avantages: "Justifier le choix du sur-mesure et identifier les fonctionnalités clés à reproduire ou améliorer.",
                  consultation: "Analyse G2 trimestrielle + tests gratuits des concurrents lors du cadrage.",
                  utiliseDansProjet: true,
                  apprentissage: "L'analyse HubSpot/Pipedrive a révélé que les CRM SaaS sont surdimensionnés pour les TPE. SpartCRM se concentre sur 3 modules essentiels (Contacts, Pipeline, Activités) pour une adoption rapide.",
                  order: 0,
                  sources: {
                    create: [
                      { nom: "HubSpot Blog", url: "https://blog.hubspot.com", order: 0 },
                      { nom: "Pipedrive Blog", url: "https://www.pipedrive.com/en/blog", order: 1 },
                      { nom: "G2 - CRM Comparisons", url: "https://www.g2.com/categories/crm", order: 2 },
                    ],
                  },
                },
                {
                  theme: "CRM open-source et alternatives Low-Code",
                  description: "Analyse des CRM open-source (Twenty, Monica, SuiteCRM) et des CRM construits en Low-Code (Notion CRM, Airtable CRM).",
                  avantages: "Évaluer les approches alternatives et s'inspirer des meilleures UX du marché.",
                  consultation: "Veille GitHub (stars/releases) mensuelle + tests Notion/Airtable templates.",
                  utiliseDansProjet: true,
                  apprentissage: "L'UX de Twenty CRM (kanban pipeline) a inspiré le design du pipeline commercial de SpartCRM. Le modèle Notion CRM a validé le besoin d'une vue simplifiée pour les TPE.",
                  order: 1,
                  sources: {
                    create: [
                      { nom: "Twenty CRM (GitHub)", url: "https://github.com/twentyhq/twenty", order: 0 },
                      { nom: "SuiteCRM Resources", url: "https://suitecrm.com/resources/", order: 1 },
                      { nom: "Notion Templates - CRM", url: "https://www.notion.so/templates/category/crm", order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created p11-spartcrm project with all data");

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE PROJECT
  // ═══════════════════════════════════════════════════════════

  await prisma.project.create({
    data: {
      id: "template",
      name: "MonProjet",
      subtitle: "Cadrage Projet",
      isPublic: true,
      description:
        "Template de cadrage projet — Dupliquez ce projet et personnalisez-le.",
      author: "Votre Nom",
      organization: "Votre Organisation",
      color: "#8b5cf6",
      contextSummary:
        "Description du contexte projet. Présentez le client, son activité et le besoin auquel le projet répond. Ce template sert d'exemple — remplacez tout le contenu par les données de votre projet.",
      methodologyFramework: "Scrum",
      methodologyFrameworkDescription:
        "Le projet est découpé en sprints de 3 semaines avec des cérémonies adaptées : Sprint Planning, Daily Stand-up, Sprint Review et Rétrospective.",
      methodologyPrioritization: "MoSCoW",
      methodologyPrioritizationDescription:
        "Chaque User Story est classée selon la méthode MoSCoW pour garantir que le MVP livre un maximum de valeur métier.",

      kpis: {
        create: [
          { label: "Utilisateurs", value: "10", color: "#3b82f6", order: 0 },
          { label: "Budget", value: "50k", color: "#f59e0b", order: 1 },
          { label: "Mois", value: "4", color: "#22c55e", order: 2 },
          { label: "Modules", value: "3", color: "#8b5cf6", order: 3 },
        ],
      },

      stackItems: {
        create: [
          {
            name: "Frontend",
            tag: "Front-End",
            tagColorBg: "#dbeafe",
            tagColorText: "#3b82f6",
            description: "Décrivez la technologie front-end choisie et pourquoi.",
            order: 0,
          },
          {
            name: "Backend",
            tag: "Back-End",
            tagColorBg: "#fef3c7",
            tagColorText: "#f59e0b",
            description: "Décrivez la technologie back-end choisie et pourquoi.",
            order: 1,
          },
        ],
      },

      deliverables: {
        create: [
          { href: "/template/questionnaire", title: "Questionnaire de recueil de besoins", desc: "Formulaire de clarification des besoins envoyé au client.", status: "Livrable 1", order: 0 },
          { href: "/template/analyse", title: "Analyse des retours client", desc: "Synthèse structurée des réponses client.", status: "Livrable 2", order: 1 },
          { href: "/template/roadmap", title: "Roadmap produit", desc: "Plan de construction phase par phase avec priorités et dépendances.", status: "Livrable 3", order: 2 },
          { href: "/template/product-backlog", title: "Product Backlog", desc: "Backlog complet avec User Stories, critères d'acceptation et estimations.", status: "Livrable 4", order: 3 },
          { href: "/template/sprint-backlog", title: "Sprint Backlog", desc: "Détail des sprints avec tâches et suivi.", status: "Livrable 5", order: 4 },
          { href: "/template/recettage", title: "Template de recettage", desc: "Grille de recette avec suivi des tests par US.", status: "Livrable 6", order: 5 },
          { href: "/template/veille", title: "Tableau de veille", desc: "Système de veille technologique et métier.", status: "Livrable 7", order: 6 },
          { href: "/template/communication", title: "Plan de communication", desc: "Organisation du suivi : réunions, canaux, parties prenantes.", status: "Livrable 8", order: 7 },
        ],
      },

      navItems: {
        create: [
          { href: "/template", label: "Accueil", icon: "🏠", order: 0 },
          { href: "/template/questionnaire", label: "Questionnaire", icon: "📋", order: 1 },
          { href: "/template/analyse", label: "Analyse retours", icon: "🔍", order: 2 },
          { href: "/template/recettage", label: "Recettage", icon: "✅", order: 3 },
          { href: "/template/roadmap", label: "Roadmap", icon: "🗺️", order: 4 },
          { href: "/template/product-backlog", label: "Product Backlog", icon: "📦", order: 5 },
          { href: "/template/sprint-backlog", label: "Sprint Backlog", icon: "🏃", order: 6 },
          { href: "/template/veille", label: "Veille", icon: "📡", order: 7 },
          { href: "/template/communication", label: "Communication", icon: "💬", order: 8 },
        ],
      },

      skills: {
        create: [
          { name: "Recueillir et formaliser des besoins clients", order: 0 },
          { name: "Prioriser des fonctionnalités grâce à une roadmap", order: 1 },
          { name: "Élaborer et entretenir un Product Backlog", order: 2 },
          { name: "Créer un Sprint Backlog", order: 3 },
          { name: "Effectuer une veille générale sur son domaine professionnel", order: 4 },
          { name: "Communiquer en interne et externe sur le développement d'un produit", order: 5 },
          { name: "Élaborer un cadrage précis Front-End et Back-End d'un produit", order: 6 },
        ],
      },
    },
  });

  console.log("✅ Created template project");
  console.log("🌱 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
