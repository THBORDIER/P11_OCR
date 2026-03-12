"use client";

import { useState, useEffect, useCallback } from "react";

interface Task {
  id: string;
  userStory: string;
  titre: string;
  description: string;
  type: "Dev" | "Design" | "Test" | "Config";
  estimation: string;
  status: "A faire" | "En cours" | "En review" | "Termine";
  assignee: string;
}

interface SprintInfo {
  id: string;
  nom: string;
  objectif: string;
  objectifCourt: string;
  debut: string;
  fin: string;
  duree: string;
  velocite: string;
  userStories: string[];
}

const sprints: SprintInfo[] = [
  {
    id: "sprint-1",
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
  },
  {
    id: "sprint-2",
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
  },
  {
    id: "sprint-3",
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
  },
  {
    id: "sprint-4",
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
  },
  {
    id: "sprint-5",
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
  },
];

const usDescriptions: Record<string, string> = {
  "US-001": "Voir la liste des clients",
  "US-002": "Filtrer et rechercher des clients",
  "US-003": "Consulter la fiche client détaillée",
  "US-004": "Créer un nouveau client ou prospect",
  "US-005": "Modifier une fiche client",
  "US-006": "Voir l'historique des échanges",
  "US-007": "Voir le pipeline Kanban",
  "US-008": "Déplacer une opportunité (drag & drop)",
  "US-009": "Créer une nouvelle opportunité",
  "US-010": "Voir le détail d'une opportunité",
  "US-011": "Voir la liste des tâches",
  "US-012": "Créer une tâche",
  "US-013": "Recevoir des rappels automatiques",
  "US-014": "Voir le dashboard manager",
  "US-015": "Consulter les rapports de performance",
  "US-016": "Exporter des rapports",
  "US-017": "Synchroniser les emails Outlook",
  "US-018": "Synchroniser le calendrier Outlook",
  "US-019": "Importer les leads HubSpot",
  "US-020": "Importer les données historiques",
  "US-021": "Se connecter via SSO Outlook",
  "US-022": "Voir uniquement ses propres données",
};

const allTasks: Record<string, Task[]> = {
  // ─── Sprint 1 ───
  "sprint-1": [
    // US-001 : Liste des clients (4 tâches)
    { id: "T-001", userStory: "US-001", titre: "Créer la table Clients dans Xano", description: "Modéliser la table clients avec tous les champs : nom, contact, email, téléphone, secteur, statut, étape, valeur, dernier contact, adresse, taille, site web, date création.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-002", userStory: "US-001", titre: "Créer l'endpoint API GET /clients", description: "API Xano pour récupérer la liste des clients avec pagination, tri et filtres.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-003", userStory: "US-001", titre: "Construire la vue tableau clients dans WeWeb", description: "Page liste clients avec colonnes : avatar, nom, contact, secteur, statut (tag coloré), étape, valeur, dernier contact.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-004", userStory: "US-001", titre: "Ajouter le tri par colonne", description: "Permettre le clic sur chaque en-tête de colonne pour trier par ordre croissant/décroissant.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-002 : Filtres et recherche (3 tâches)
    { id: "T-005", userStory: "US-002", titre: "Implémenter la barre de recherche", description: "Recherche en temps réel par nom, entreprise ou email. Debounce de 300ms.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-006", userStory: "US-002", titre: "Ajouter les filtres statut et secteur", description: "Deux selects : filtre par statut (Tous/Actif/Prospect) et par secteur. Combinables avec la recherche.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-007", userStory: "US-002", titre: "Implémenter la pagination des résultats", description: "Navigation par pages avec 25 résultats par défaut. Affichage du nombre total de résultats.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-003 : Fiche client détaillée (4 tâches)
    { id: "T-008", userStory: "US-003", titre: "Créer la page fiche client (layout)", description: "En-tête avec avatar, nom, statut, secteur. Bloc KPIs (4 cartes). Système d'onglets.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-009", userStory: "US-003", titre: "Implémenter l'onglet Aperçu", description: "Afficher les informations de contact (email, tél, adresse) et les détails entreprise (secteur, taille, site, date client depuis).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-010", userStory: "US-003", titre: "Implémenter l'onglet Affaires", description: "Liste des opportunités liées au client avec statut, montant, probabilité.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-011", userStory: "US-003", titre: "Créer l'endpoint API GET /clients/:id", description: "API Xano retournant le détail complet d'un client avec ses relations (affaires, échanges, tâches).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-004 : Créer un client (3 tâches)
    { id: "T-012", userStory: "US-004", titre: "Créer le formulaire de création client", description: "Formulaire modal ou pleine page : nom, contact, email, téléphone, secteur, taille, adresse. Champs obligatoires marqués.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-013", userStory: "US-004", titre: "Créer l'endpoint API POST /clients", description: "API de création avec validation serveur (email unique, champs obligatoires).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-014", userStory: "US-004", titre: "Implémenter la détection de doublons", description: "À la saisie de l'email, vérifier si un client existe déjà et afficher une alerte.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-005 : Modifier un client (3 tâches)
    { id: "T-015", userStory: "US-005", titre: "Rendre la fiche client éditable", description: "Bouton Modifier qui passe les champs en mode édition. Bouton Enregistrer avec confirmation.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-016", userStory: "US-005", titre: "Créer l'endpoint API PUT /clients/:id", description: "API de modification avec historique des changements (champ modifié, ancienne valeur, nouvelle valeur, date, auteur).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-017", userStory: "US-005", titre: "Ajouter la validation côté client", description: "Vérification des champs obligatoires, format email, format téléphone avant envoi au serveur.", type: "Dev", estimation: "1h", status: "A faire", assignee: "Thomas B." },

    // US-006 : Historique des échanges (3 tâches)
    { id: "T-018", userStory: "US-006", titre: "Créer la table Échanges dans Xano", description: "Table : type (Appel/Email/Réunion), titre, description, date, participants, client_id (relation).", type: "Config", estimation: "1h", status: "A faire", assignee: "Thomas B." },
    { id: "T-019", userStory: "US-006", titre: "Implémenter la timeline des échanges", description: "Onglet Échanges dans la fiche client : timeline chronologique avec icônes par type, titre, description, date.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-020", userStory: "US-006", titre: "Ajouter le filtre par type d'interaction", description: "Boutons filtres : Tous, Appels, Emails, Réunions.", type: "Dev", estimation: "1h", status: "A faire", assignee: "Thomas B." },

    // Transversal Sprint 1
    { id: "T-021", userStory: "Transversal", titre: "Tests fonctionnels du module Clients", description: "Tester tous les parcours : création, modification, recherche, filtres, navigation fiche, timeline. Vérifier les rôles.", type: "Test", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-022", userStory: "Transversal", titre: "Design responsive du module", description: "Vérifier et ajuster l'affichage tablette et mobile de la liste clients et de la fiche détail.", type: "Design", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-023", userStory: "Transversal", titre: "Tests de permissions RBAC", description: "Vérifier que chaque rôle (commercial, manager, support) voit uniquement les données autorisées.", type: "Test", estimation: "2h", status: "A faire", assignee: "Thomas B." },
  ],

  // ─── Sprint 2 ───
  "sprint-2": [
    // US-007 : Pipeline Kanban (3 tâches)
    { id: "T-024", userStory: "US-007", titre: "Créer la table Opportunités dans Xano", description: "Table : titre, entreprise, contact, montant, probabilité, étape (Nouveau/Qualifié/Proposition/Négociation/Gagné/Perdu), date création.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-025", userStory: "US-007", titre: "Construire la vue Kanban dans WeWeb", description: "6 colonnes correspondant aux étapes du pipeline. Cartes affichant entreprise, montant, probabilité. Totaux par colonne.", type: "Dev", estimation: "5h", status: "A faire", assignee: "Thomas B." },
    { id: "T-026", userStory: "US-007", titre: "Créer l'endpoint API GET /opportunites", description: "API retournant les opportunités groupées par étape avec filtres (commercial, période, montant minimum).", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },

    // US-008 : Drag & drop (3 tâches)
    { id: "T-027", userStory: "US-008", titre: "Implémenter le drag & drop entre colonnes", description: "Utilisation d'une librairie de DnD. Déplacement visuel fluide avec indicateur de zone de dépôt.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-028", userStory: "US-008", titre: "Créer l'endpoint API PATCH /opportunites/:id/etape", description: "API de mise à jour de l'étape avec recalcul automatique des totaux par colonne.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-029", userStory: "US-008", titre: "Ajouter les animations et feedback visuel", description: "Animation de glissement, highlight de la colonne cible, toast de confirmation après déplacement.", type: "Design", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-009 : Créer une opportunité (3 tâches)
    { id: "T-030", userStory: "US-009", titre: "Créer le formulaire d'ajout d'opportunité", description: "Modal avec champs : titre, entreprise (autocomplete), contact, montant, probabilité, étape initiale, notes.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-031", userStory: "US-009", titre: "Créer l'endpoint API POST /opportunites", description: "API de création avec validation (montant positif, entreprise existante, champs obligatoires).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-032", userStory: "US-009", titre: "Lier l'opportunité à un client existant", description: "Autocomplete sur le champ entreprise qui recherche dans la base clients. Liaison automatique.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-010 : Détail opportunité (3 tâches)
    { id: "T-033", userStory: "US-010", titre: "Créer la vue détail d'une opportunité", description: "Page ou panneau latéral affichant : entreprise, contact, montant, probabilité, étape, historique des changements.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-034", userStory: "US-010", titre: "Implémenter le menu contextuel", description: "Clic droit ou bouton '...' sur la carte : Modifier, Supprimer, Changer d'étape, Ajouter une note.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-035", userStory: "US-010", titre: "Afficher l'historique des modifications", description: "Timeline des changements d'étape et de montant avec date, auteur et ancienne/nouvelle valeur.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // Transversal Sprint 2
    { id: "T-036", userStory: "Transversal", titre: "Tests fonctionnels du pipeline", description: "Tester le drag & drop, la création, le détail. Vérifier la cohérence des totaux par colonne.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-037", userStory: "Transversal", titre: "Tests de performance Kanban", description: "Vérifier la fluidité avec 100+ opportunités. Optimiser le rendu si nécessaire.", type: "Test", estimation: "2h", status: "A faire", assignee: "Thomas B." },
  ],

  // ─── Sprint 3 ───
  "sprint-3": [
    // US-011 : Liste des tâches (3 tâches)
    { id: "T-038", userStory: "US-011", titre: "Créer la table Tâches dans Xano", description: "Table : titre, description, statut (À faire/En cours/Terminé), priorité, date échéance, assigné, client_id, opportunite_id.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-039", userStory: "US-011", titre: "Construire la vue liste des tâches", description: "Page avec tableau triable : titre, client lié, priorité (tag coloré), échéance, statut. Filtres par statut et priorité.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-040", userStory: "US-011", titre: "Créer l'endpoint API GET /taches", description: "API avec filtres (statut, priorité, assigné, échéance) et pagination. Inclure les relations client et opportunité.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-012 : Créer une tâche (3 tâches)
    { id: "T-041", userStory: "US-012", titre: "Créer le formulaire d'ajout de tâche", description: "Modal : titre, description, priorité, date échéance, assignation, lien client/opportunité. Validation des champs.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-042", userStory: "US-012", titre: "Créer l'endpoint API POST /taches", description: "API de création avec validation et notification au membre assigné.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-043", userStory: "US-012", titre: "Implémenter la création rapide depuis la fiche client", description: "Bouton 'Ajouter une tâche' dans la fiche client qui pré-remplit le lien client.", type: "Dev", estimation: "1h", status: "A faire", assignee: "Thomas B." },

    // US-013 : Rappels automatiques (3 tâches)
    { id: "T-044", userStory: "US-013", titre: "Configurer le système de notifications", description: "Service de notification dans Xano : vérification des échéances, génération des alertes, envoi par email.", type: "Config", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-045", userStory: "US-013", titre: "Créer le centre de notifications in-app", description: "Icône cloche dans le header avec badge. Panneau déroulant listant les rappels avec lien vers la tâche.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-046", userStory: "US-013", titre: "Implémenter les règles de rappel", description: "Rappel J-1 et J-0 pour les tâches à échéance. Rappel si tâche en retard. Paramètres personnalisables.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // Transversal Sprint 3
    { id: "T-047", userStory: "Transversal", titre: "Tests fonctionnels tâches et rappels", description: "Tester création, modification, suppression de tâches. Vérifier le déclenchement des rappels.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
  ],

  // ─── Sprint 4 ───
  "sprint-4": [
    // US-014 : Dashboard manager (3 tâches)
    { id: "T-048", userStory: "US-014", titre: "Créer la page dashboard manager", description: "Layout avec KPIs en haut (CA pipeline, taux conversion, nb opportunités, tâches en retard) et zone graphiques en dessous.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-049", userStory: "US-014", titre: "Implémenter les graphiques de performance", description: "Graphiques : évolution CA pipeline (courbe), répartition par étape (camembert), activité par commercial (barres).", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-050", userStory: "US-014", titre: "Créer les endpoints API d'agrégation", description: "APIs calculant les KPIs et données graphiques : /stats/pipeline, /stats/activite, /stats/conversion.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },

    // US-015 : Rapports de performance (3 tâches)
    { id: "T-051", userStory: "US-015", titre: "Créer la page rapports", description: "Interface avec filtres (période, commercial, secteur) et tableau de résultats détaillé.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-052", userStory: "US-015", titre: "Implémenter les filtres dynamiques", description: "Filtres combinables avec mise à jour en temps réel des résultats. Sélecteur de période personnalisable.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-053", userStory: "US-015", titre: "Créer l'endpoint API GET /rapports", description: "API avec filtres multiples retournant données tabulaires : commercial, nb clients, nb opportunités, CA, taux conversion.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-016 : Export rapports (3 tâches)
    { id: "T-054", userStory: "US-016", titre: "Implémenter l'export Excel", description: "Bouton 'Exporter en Excel' générant un fichier .xlsx avec les données filtrées du rapport.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-055", userStory: "US-016", titre: "Implémenter l'export PDF", description: "Bouton 'Exporter en PDF' générant un rapport formaté avec en-tête, tableau et graphiques.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-056", userStory: "US-016", titre: "Ajouter l'envoi par email programmé", description: "Option d'envoi automatique du rapport par email chaque lundi matin au manager.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // Transversal Sprint 4
    { id: "T-057", userStory: "Transversal", titre: "Tests fonctionnels dashboard et rapports", description: "Vérifier les calculs KPIs, la cohérence des graphiques et le bon fonctionnement des exports.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
  ],

  // ─── Sprint 5 ───
  "sprint-5": [
    // US-017 : Sync emails Outlook (3 tâches)
    { id: "T-058", userStory: "US-017", titre: "Configurer le connecteur Microsoft Graph API", description: "Inscription de l'app dans Azure AD, configuration des scopes (Mail.Read, Mail.Send), gestion du token OAuth2.", type: "Config", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-059", userStory: "US-017", titre: "Implémenter la synchronisation bidirectionnelle", description: "Récupération des emails liés à un contact CRM. Envoi d'emails depuis la fiche client via Graph API.", type: "Dev", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-060", userStory: "US-017", titre: "Afficher les emails dans l'onglet Échanges", description: "Intégration des emails synchronisés dans la timeline existante avec icône dédiée et aperçu.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-018 : Sync calendrier (3 tâches)
    { id: "T-061", userStory: "US-018", titre: "Connecter le calendrier Outlook via Graph API", description: "Scope Calendar.ReadWrite. Récupération des événements liés aux contacts CRM.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-062", userStory: "US-018", titre: "Créer la vue agenda dans le CRM", description: "Vue semaine/mois affichant les rendez-vous synchronisés avec lien vers la fiche client.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-063", userStory: "US-018", titre: "Implémenter la création de RDV depuis le CRM", description: "Bouton 'Planifier un RDV' dans la fiche client créant l'événement dans Outlook automatiquement.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-019 : Import leads HubSpot (3 tâches)
    { id: "T-064", userStory: "US-019", titre: "Créer le connecteur API HubSpot", description: "Authentification OAuth2 HubSpot, récupération des contacts et deals via l'API v3.", type: "Config", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-065", userStory: "US-019", titre: "Implémenter le mapping et import des leads", description: "Correspondance champs HubSpot → CRM. Import par lot avec gestion des doublons (email unique).", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-066", userStory: "US-019", titre: "Créer l'interface d'import avec rapport", description: "Page d'import : sélection source, aperçu des données, lancement, rapport (importés/doublons/erreurs).", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-020 : Import données historiques (3 tâches)
    { id: "T-067", userStory: "US-020", titre: "Créer le module d'upload CSV/Excel", description: "Interface drag & drop pour upload de fichiers. Détection automatique des colonnes et aperçu des données.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-068", userStory: "US-020", titre: "Implémenter le mapping de colonnes", description: "Interface de correspondance colonnes fichier → champs CRM avec détection intelligente des noms similaires.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-069", userStory: "US-020", titre: "Créer le processus d'import par lot", description: "Import asynchrone avec barre de progression. Gestion des erreurs ligne par ligne. Rapport final téléchargeable.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },

    // US-021 : SSO Outlook (3 tâches)
    { id: "T-070", userStory: "US-021", titre: "Configurer l'authentification SSO Azure AD", description: "Configuration du fournisseur d'identité Azure AD dans Xano. Gestion du flux OAuth2/OIDC.", type: "Config", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-071", userStory: "US-021", titre: "Créer la page de connexion SSO", description: "Bouton 'Se connecter avec Microsoft' redirigeant vers Azure AD. Gestion du callback et création de session.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },
    { id: "T-072", userStory: "US-021", titre: "Gérer le provisioning automatique des comptes", description: "À la première connexion SSO, créer automatiquement le profil utilisateur CRM avec le bon rôle.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // US-022 : Données par rôle (3 tâches)
    { id: "T-073", userStory: "US-022", titre: "Implémenter le système RBAC dans Xano", description: "Middleware vérifiant le rôle de l'utilisateur sur chaque endpoint. 4 rôles : Commercial, Account Manager, Support, Direction.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-074", userStory: "US-022", titre: "Filtrer les données côté API selon le rôle", description: "Commercial : ses clients uniquement. Manager : son équipe. Direction : tout. Support : clients assignés.", type: "Dev", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-075", userStory: "US-022", titre: "Adapter l'interface selon les permissions", description: "Masquer les boutons/menus non autorisés. Afficher un message si l'utilisateur accède à une ressource interdite.", type: "Dev", estimation: "2h", status: "A faire", assignee: "Thomas B." },

    // Transversal Sprint 5
    { id: "T-076", userStory: "Transversal", titre: "Tests d'intégration Microsoft 365", description: "Tester la sync email, calendrier et SSO de bout en bout avec un compte de test Azure AD.", type: "Test", estimation: "4h", status: "A faire", assignee: "Thomas B." },
    { id: "T-077", userStory: "Transversal", titre: "Tests de migration de données", description: "Importer les ~2500 comptes et ~10000 contacts de test. Vérifier la cohérence et les doublons.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
    { id: "T-078", userStory: "Transversal", titre: "Tests de sécurité RBAC complets", description: "Vérifier l'isolation des données par rôle sur toutes les pages. Tester les tentatives d'accès non autorisé.", type: "Test", estimation: "3h", status: "A faire", assignee: "Thomas B." },
  ],
};

const statusColors: Record<string, string> = {
  "A faire": "bg-[#f1f5f9] text-[#64748b]",
  "En cours": "bg-[#eff6ff] text-[#3b82f6]",
  "En review": "bg-[#fff7ed] text-[#ea580c]",
  Termine: "bg-[#f0fdf4] text-[#22c55e]",
};

const statusDisplayLabels: Record<string, string> = {
  "A faire": "À faire",
  "En cours": "En cours",
  "En review": "En review",
  Termine: "Terminé",
};

const typeColors: Record<string, string> = {
  Dev: "bg-[#eff6ff] text-[#3b82f6]",
  Config: "bg-[#f5f3ff] text-[#8b5cf6]",
  Test: "bg-[#fff7ed] text-[#ea580c]",
  Design: "bg-[#fdf2f8] text-[#ec4899]",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const statusFlow: Task["status"][] = ["A faire", "En cours", "En review", "Termine"];

export default function SprintBacklogPage() {
  const [selectedSprint, setSelectedSprint] = useState("sprint-1");
  const [statusFilter, setStatusFilter] = useState("all");
  const [liveTasks, setLiveTasks] = useState<Record<string, Task[]>>(allTasks);

  const sprint = sprints.find((s) => s.id === selectedSprint)!;
  const currentTasks = liveTasks[selectedSprint] || [];

  // Load saved statuses from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spartcrm-sprint-statuses-v2");
      if (saved) {
        const savedStatuses: Record<string, Record<string, Task["status"]>> = JSON.parse(saved);
        const restored: Record<string, Task[]> = {};
        for (const [sprintId, tasks] of Object.entries(allTasks)) {
          const sprintStatuses = savedStatuses[sprintId] || {};
          restored[sprintId] = tasks.map((t) => ({
            ...t,
            status: sprintStatuses[t.id] || t.status,
          }));
        }
        setLiveTasks(restored);
      }
    } catch {}
  }, []);

  const saveStatuses = useCallback((updated: Record<string, Task[]>) => {
    try {
      const statuses: Record<string, Record<string, string>> = {};
      for (const [sprintId, tasks] of Object.entries(updated)) {
        statuses[sprintId] = {};
        tasks.forEach((t) => { statuses[sprintId][t.id] = t.status; });
      }
      localStorage.setItem("spartcrm-sprint-statuses-v2", JSON.stringify(statuses));
    } catch {}
  }, []);

  const cycleStatus = (taskId: string) => {
    setLiveTasks((prev) => {
      const updated = {
        ...prev,
        [selectedSprint]: prev[selectedSprint].map((t) => {
          if (t.id !== taskId) return t;
          const currentIndex = statusFlow.indexOf(t.status);
          const nextIndex = (currentIndex + 1) % statusFlow.length;
          return { ...t, status: statusFlow[nextIndex] };
        }),
      };
      saveStatuses(updated);
      return updated;
    });
  };

  const resetAllStatuses = () => {
    setLiveTasks((prev) => {
      const updated = {
        ...prev,
        [selectedSprint]: allTasks[selectedSprint].map((t) => ({ ...t, status: "A faire" as Task["status"] })),
      };
      saveStatuses(updated);
      return updated;
    });
  };

  const filtered = statusFilter === "all"
    ? currentTasks
    : currentTasks.filter((t) => t.status === statusFilter);

  const grouped = sprint.userStories.concat(["Transversal"]).map((us) => ({
    us,
    tasks: filtered.filter((t) => t.userStory === us),
  })).filter((g) => g.tasks.length > 0);

  const totalHeures = currentTasks.reduce((sum, t) => sum + parseInt(t.estimation), 0);

  const statusCounts = {
    "A faire": currentTasks.filter((t) => t.status === "A faire").reduce((s, t) => s + parseInt(t.estimation), 0),
    "En cours": currentTasks.filter((t) => t.status === "En cours").reduce((s, t) => s + parseInt(t.estimation), 0),
    "En review": currentTasks.filter((t) => t.status === "En review").reduce((s, t) => s + parseInt(t.estimation), 0),
    Termine: currentTasks.filter((t) => t.status === "Termine").reduce((s, t) => s + parseInt(t.estimation), 0),
  };

  const pct = (hours: number) => totalHeures > 0 ? Math.round((hours / totalHeures) * 100) : 0;
  const completedPct = pct(statusCounts["Termine"]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Sprint Backlog</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 5 — Détail des sprints et découpage en tâches
        </p>
      </div>

      {/* Sprint selector tabs */}
      <div className="flex gap-1 mb-6 bg-[#f1f5f9] rounded-lg p-1 overflow-x-auto">
        {sprints.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSelectedSprint(s.id); setStatusFilter("all"); }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSprint === s.id
                ? "bg-white text-[#1e293b] shadow-sm"
                : "text-[#64748b] hover:text-[#334155] hover:bg-white/50"
            }`}
          >
            {s.id.replace("sprint-", "Sprint ")}
          </button>
        ))}
      </div>

      {/* Sprint Goal Banner */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-lg p-6 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">&#127919;</span>
          <div>
            <h2 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-1">
              Objectif du {sprint.id.replace("sprint-", "Sprint ")}
            </h2>
            <p className="text-white text-lg font-semibold leading-relaxed">
              &laquo; {sprint.objectifCourt} &raquo;
            </p>
          </div>
        </div>
      </div>

      {/* Sprint info */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#1e293b] mb-2">
          {sprint.nom}
        </h2>
        <p className="text-sm text-[#475569] mb-4">{sprint.objectif}</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#1e293b]">{sprint.debut} - {sprint.fin}</div>
            <div className="text-xs text-[#64748b]">Période</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#3b82f6]">{sprint.velocite}</div>
            <div className="text-xs text-[#64748b]">Points d&apos;effort</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#8b5cf6]">{sprint.userStories.length} US</div>
            <div className="text-xs text-[#64748b]">User Stories</div>
          </div>
          <div className="bg-[#f1f5f9] rounded p-3 text-center">
            <div className="text-lg font-bold text-[#f59e0b]">{totalHeures}h</div>
            <div className="text-xs text-[#64748b]">Estimation totale</div>
          </div>
        </div>

        {/* Team Capacity - Sprint 1 only for detail */}
        {selectedSprint === "sprint-1" && (
          <div className="mt-6 border-t border-[#e2e8f0] pt-5">
            <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-base">&#128101;</span> Capacité de l&apos;équipe
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
                <div className="text-xs text-[#64748b] mb-1">Développeur</div>
                <div className="text-sm font-semibold text-[#1e293b]">Thomas Bordier</div>
                <div className="text-xs text-[#475569] mt-0.5">5j/semaine, 7h/jour = 35h/semaine</div>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
                <div className="text-xs text-[#64748b] mb-1">Capacité brute</div>
                <div className="text-sm font-semibold text-[#1e293b]">105 heures</div>
                <div className="text-xs text-[#475569] mt-0.5">Sprint de 3 semaines (35h × 3)</div>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
                <div className="text-xs text-[#64748b] mb-1">Facteur de focus</div>
                <div className="text-sm font-semibold text-[#f59e0b]">80% → 84h disponibles</div>
                <div className="text-xs text-[#475569] mt-0.5">Réunions, imprévus, apprentissage</div>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3">
                <div className="text-xs text-[#64748b] mb-1">Charge planifiée</div>
                <div className="text-sm font-semibold text-[#22c55e]">50h → taux d&apos;occupation 60%</div>
                <div className="text-xs text-[#475569] mt-0.5">Marge pour imprévus et dette technique</div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Standup */}
        <div className="mt-5 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-3 flex items-start gap-2.5">
          <span className="text-base mt-0.5">&#128172;</span>
          <div>
            <div className="text-xs font-bold text-[#1e40af] mb-0.5">Rituel quotidien</div>
            <p className="text-xs text-[#1e40af]">
              Standup asynchrone via Slack (<span className="font-mono font-semibold">#spartcrm-daily</span>) — Qu&apos;ai-je fait hier ? Que vais-je faire aujourd&apos;hui ? Ai-je des blocages ?
            </p>
          </div>
        </div>
      </div>

      {/* Sprint Selection Criteria - Sprint 1 only */}
      {selectedSprint === "sprint-1" && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-3 flex items-center gap-2">
            <span className="text-base">&#128203;</span> Pourquoi ces 6 User Stories dans le Sprint 1 ?
          </h2>
          <div className="space-y-2.5">
            {[
              { icon: "\u{1F534}", text: "Toutes sont des US « Must Have » (priorité MoSCoW la plus haute)" },
              { icon: "\u{1F9E9}", text: "Elles forment un ensemble fonctionnel complet et autonome (module Clients)" },
              { icon: "\u{1F4CA}", text: "29 points d'effort respectent la vélocité cible de l'équipe" },
              { icon: "\u{1F3D7}\uFE0F", text: "Elles constituent le socle de données nécessaire aux sprints suivants (Pipeline, Tâches)" },
              { icon: "\u2705", text: "Le client a validé ce périmètre lors du Sprint Planning" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-[#334155]">
                <span className="mt-0.5 shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Burndown / Progress chart */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Progression du sprint
        </h2>
        <div className="mb-3">
          <div className="flex w-full h-8 rounded-lg overflow-hidden">
            {statusCounts["Termine"] > 0 && (
              <div
                className="bg-[#22c55e] h-full flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ width: `${completedPct}%` }}
              >
                {completedPct}%
              </div>
            )}
            {statusCounts["En review"] > 0 && (
              <div
                className="bg-[#f97316] h-full transition-all"
                style={{ width: `${pct(statusCounts["En review"])}%` }}
              />
            )}
            {statusCounts["En cours"] > 0 && (
              <div
                className="bg-[#3b82f6] h-full transition-all"
                style={{ width: `${pct(statusCounts["En cours"])}%` }}
              />
            )}
            {statusCounts["A faire"] > 0 && (
              <div
                className="bg-[#cbd5e1] h-full transition-all"
                style={{ width: `${pct(statusCounts["A faire"])}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-[#475569]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#22c55e] inline-block" />
            Terminé — {statusCounts["Termine"]}h
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#f97316] inline-block" />
            En review — {statusCounts["En review"]}h
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#3b82f6] inline-block" />
            En cours — {statusCounts["En cours"]}h
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#cbd5e1] inline-block" />
            À faire — {statusCounts["A faire"]}h
          </div>
          <div className="ml-auto font-semibold text-[#1e293b]">
            {completedPct}% complété ({statusCounts["Termine"]}h / {totalHeures}h)
          </div>
        </div>
      </div>

      {/* Status filter + reset */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "A faire", "En cours", "En review", "Termine"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              statusFilter === s
                ? "bg-[#3b82f6] text-white"
                : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]"
            }`}
          >
            {s === "all" ? "Toutes" : statusDisplayLabels[s] || s} ({s === "all" ? currentTasks.length : currentTasks.filter((t) => t.status === s).length})
          </button>
        ))}
        <button
          onClick={resetAllStatuses}
          className="ml-auto px-3 py-2 rounded-lg text-xs border border-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444] transition-colors"
          title="Réinitialiser tous les statuts"
        >
          ↺ Réinitialiser
        </button>
      </div>

      {/* Tasks grouped by US */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.us}>
            <h3 className="text-sm font-bold text-[#64748b] uppercase mb-3 flex items-center gap-2">
              <span className="bg-[#3b82f6] text-white px-2 py-0.5 rounded text-xs">
                {group.us}
              </span>
              {group.us !== "Transversal" && (
                <span className="font-normal normal-case text-[#475569]">
                  {usDescriptions[group.us] || group.us}
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {group.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg border border-[#e2e8f0] p-4 flex items-start gap-4"
                >
                  <span className="text-xs font-mono text-[#94a3b8] w-12 mt-0.5">
                    {task.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${typeColors[task.type]}`}>
                    {task.type}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#334155]">
                      {task.titre}
                    </h4>
                    <p className="text-xs text-[#64748b] mt-1">
                      {task.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#3b82f6]">
                    {task.estimation}
                  </span>
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e0e7ff] text-[#4338ca] text-[10px] font-bold shrink-0"
                    title={task.assignee}
                  >
                    {getInitials(task.assignee)}
                  </span>
                  <button
                    onClick={() => cycleStatus(task.id)}
                    className={`text-xs font-medium px-2 py-1 rounded cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 hover:ring-[#3b82f6] ${statusColors[task.status]}`}
                    title="Cliquer pour changer le statut"
                  >
                    {statusDisplayLabels[task.status] || task.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Definition of Done */}
      <div className="bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-6 mt-8">
        <h2 className="text-lg font-semibold text-[#166534] mb-3">
          Definition of Done (DoD)
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-[#166534]">
          {[
            "Le code est déployé sur l'environnement de staging",
            "Les tests fonctionnels sont passés avec succès",
            "L'affichage est responsive (desktop + tablette)",
            "Les permissions par rôle sont respectées",
            "La fonctionnalité a été démontrée au Product Owner",
            "Aucun bug bloquant ou critique n'est ouvert",
          ].map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5">&#10003;</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
