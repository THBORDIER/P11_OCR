"use client";

import { useState, useEffect, useCallback } from "react";

interface UserStory {
  id: string;
  epic: string;
  titre: string;
  enTantQue: string;
  jeSouhaite: string;
  afinDe: string;
  criteres: string[];
  estimation: number;
  priorite: "Must" | "Should" | "Could" | "Won't";
  sprint: string;
}

const backlog: UserStory[] = [
  // Epic: Gestion des Clients
  {
    id: "US-001",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 1",
  },
  {
    id: "US-002",
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
    estimation: 3,
    priorite: "Must",
    sprint: "Sprint 1",
  },
  {
    id: "US-003",
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
    estimation: 8,
    priorite: "Must",
    sprint: "Sprint 1",
  },
  {
    id: "US-004",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 1",
  },
  {
    id: "US-005",
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
    estimation: 3,
    priorite: "Must",
    sprint: "Sprint 1",
  },
  {
    id: "US-006",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 1",
  },

  // Epic: Pipeline Commercial
  {
    id: "US-007",
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
    estimation: 8,
    priorite: "Must",
    sprint: "Sprint 2",
  },
  {
    id: "US-008",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 2",
  },
  {
    id: "US-009",
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
    estimation: 3,
    priorite: "Must",
    sprint: "Sprint 2",
  },
  {
    id: "US-010",
    epic: "Pipeline Commercial",
    titre: "Voir le détail d'une opportunité",
    enTantQue: "Manager",
    jeSouhaite: "consulter le détail d'une carte d'opportunité (montant, probabilité, historique)",
    afinDe: "évaluer la qualité d'une affaire et décider des priorités",
    criteres: [
      "La carte affiche : entreprise, contact assigné, montant, date, probabilité, prochaine action",
      "Menu contextuel pour modifier ou supprimer",
    ],
    estimation: 3,
    priorite: "Must",
    sprint: "Sprint 2",
  },

  // Epic: Tâches et Rappels
  {
    id: "US-011",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Sprint 3",
  },
  {
    id: "US-012",
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
    estimation: 3,
    priorite: "Must",
    sprint: "Sprint 3",
  },
  {
    id: "US-013",
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
    estimation: 5,
    priorite: "Should",
    sprint: "Sprint 3",
  },

  // Epic: Tableau de bord
  {
    id: "US-014",
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
    estimation: 8,
    priorite: "Must",
    sprint: "Sprint 4",
  },
  {
    id: "US-015",
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
    estimation: 8,
    priorite: "Should",
    sprint: "Sprint 4",
  },
  {
    id: "US-016",
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
    estimation: 3,
    priorite: "Should",
    sprint: "Sprint 3",
  },

  // Epic: Intégrations
  {
    id: "US-017",
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
    estimation: 8,
    priorite: "Could",
    sprint: "Sprint 5",
  },
  {
    id: "US-018",
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
    estimation: 5,
    priorite: "Could",
    sprint: "Sprint 5",
  },
  {
    id: "US-019",
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
    estimation: 5,
    priorite: "Could",
    sprint: "Sprint 4",
  },
  {
    id: "US-020",
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
    estimation: 8,
    priorite: "Must",
    sprint: "Sprint 5",
  },

  // Epic: Sécurité
  {
    id: "US-021",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Phase 0",
  },
  {
    id: "US-022",
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
    estimation: 5,
    priorite: "Must",
    sprint: "Phase 0",
  },
];

const epics = [...new Set(backlog.map((us) => us.epic))];
const sprints = ["Phase 0", "Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];
const priorityColors = {
  Must: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
  Should: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]",
  Could: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]",
  "Won't": "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]",
};

export default function ProductBacklogPage() {
  const [filterEpic, setFilterEpic] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterSprint, setFilterSprint] = useState<string>("all");
  const [expandedUS, setExpandedUS] = useState<string | null>(null);
  // Store validation date (ISO string) or null if not validated
  const [validatedUS, setValidatedUS] = useState<Record<string, string | null>>({});

  // Load validated state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spartcrm-backlog-validated");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: convert old boolean format to date format
        const migrated: Record<string, string | null> = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (value === true) migrated[key] = new Date().toISOString();
          else if (typeof value === "string") migrated[key] = value;
          else migrated[key] = null;
        }
        setValidatedUS(migrated);
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  const saveValidation = useCallback((newState: Record<string, string | null>) => {
    setValidatedUS(newState);
    try {
      localStorage.setItem("spartcrm-backlog-validated", JSON.stringify(newState));
    } catch {}
  }, []);

  const toggleValidation = (id: string) => {
    const current = validatedUS[id];
    saveValidation({
      ...validatedUS,
      [id]: current ? null : new Date().toISOString(),
    });
  };

  const isUSValidated = (id: string) => !!validatedUS[id];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const validatedCount = backlog.filter((us) => isUSValidated(us.id)).length;

  const filtered = backlog.filter((us) => {
    if (filterEpic !== "all" && us.epic !== filterEpic) return false;
    if (filterPriority !== "all" && us.priorite !== filterPriority) return false;
    if (filterSprint !== "all" && us.sprint !== filterSprint) return false;
    return true;
  });

  const totalPoints = filtered.reduce((sum, us) => sum + us.estimation, 0);

  // Compute points per sprint for the filtered stories
  const sprintPoints: Record<string, number> = {};
  filtered.forEach((us) => {
    sprintPoints[us.sprint] = (sprintPoints[us.sprint] || 0) + us.estimation;
  });
  const sprintOrder = [
    "Phase 0",
    "Sprint 1",
    "Sprint 2",
    "Sprint 3",
    "Sprint 4",
    "Sprint 5",
  ];
  const sortedSprints = Object.keys(sprintPoints).sort(
    (a, b) => sprintOrder.indexOf(a) - sprintOrder.indexOf(b)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Product Backlog</h1>
        <p className="text-[#64748b] mt-2">
          Livrable 4 — {backlog.length} User Stories, {backlog.reduce((s, u) => s + u.estimation, 0)} points d'effort total
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#dc2626]">
            {backlog.filter((u) => u.priorite === "Must").length}
          </div>
          <div className="text-xs text-[#64748b]">Must Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#ea580c]">
            {backlog.filter((u) => u.priorite === "Should").length}
          </div>
          <div className="text-xs text-[#64748b]">Should Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#0284c7]">
            {backlog.filter((u) => u.priorite === "Could").length}
          </div>
          <div className="text-xs text-[#64748b]">Could Have</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#1e293b]">{epics.length}</div>
          <div className="text-xs text-[#64748b]">Epics</div>
        </div>
        <div className={`rounded-lg border p-4 text-center ${validatedCount === backlog.length ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-white border-[#e2e8f0]"}`}>
          <div className={`text-2xl font-bold ${validatedCount === backlog.length ? "text-[#22c55e]" : "text-[#f59e0b]"}`}>
            {validatedCount}/{backlog.length}
          </div>
          <div className="text-xs text-[#64748b]">Validées PO</div>
        </div>
      </div>

      {/* Points per Sprint — clickable to filter */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 mb-6">
        <h3 className="text-sm font-bold text-[#334155] mb-3">Points par sprint</h3>
        <div className="flex flex-wrap gap-3">
          {sortedSprints.map((sprint) => (
            <button
              key={sprint}
              onClick={() => setFilterSprint(filterSprint === sprint ? "all" : sprint)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all cursor-pointer ${
                filterSprint === sprint
                  ? "bg-[#3b82f6] border border-[#3b82f6] ring-2 ring-[#3b82f6]/30"
                  : "bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#3b82f6]"
              }`}
            >
              <span className={`text-xs font-medium ${filterSprint === sprint ? "text-white" : "text-[#475569]"}`}>
                {sprint}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                filterSprint === sprint
                  ? "bg-white/20 text-white"
                  : "text-[#3b82f6] bg-[#eff6ff]"
              }`}>
                {sprintPoints[sprint]} pts
              </span>
            </button>
          ))}
          {filterSprint !== "all" && (
            <button
              onClick={() => setFilterSprint("all")}
              className="text-xs text-[#94a3b8] hover:text-[#ef4444] px-2 py-2 transition-colors"
            >
              ✕ Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterEpic}
          onChange={(e) => setFilterEpic(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Toutes les Epics</option>
          {epics.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Toutes les priorités</option>
          <option value="Must">Must Have</option>
          <option value="Should">Should Have</option>
          <option value="Could">Could Have</option>
        </select>
        <select
          value={filterSprint}
          onChange={(e) => setFilterSprint(e.target.value)}
          className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Tous les sprints</option>
          {sprints.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="ml-auto text-sm text-[#64748b] flex items-center">
          {filtered.length} stories — {totalPoints} points
        </div>
      </div>

      {/* Backlog items */}
      <div className="space-y-3">
        {filtered.map((us) => {
          const enTantQuePreview = `En tant que ${us.enTantQue}, je souhaite ${us.jeSouhaite}`;
          const truncated =
            enTantQuePreview.length > 100
              ? enTantQuePreview.slice(0, 100) + "..."
              : enTantQuePreview;

          const isValidated = isUSValidated(us.id);
          const validationDate = validatedUS[us.id];

          return (
            <div
              key={us.id}
              className={`rounded-lg border overflow-hidden transition-all ${
                isValidated
                  ? "bg-[#f0fdf4] border-[#86efac] border-l-4 border-l-[#22c55e]"
                  : "bg-white border-[#e2e8f0]"
              }`}
            >
              <button
                onClick={() => setExpandedUS(expandedUS === us.id ? null : us.id)}
                className="w-full p-4 text-left hover:bg-[#f8fafc] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#94a3b8] w-16">{us.id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${priorityColors[us.priorite]}`}>
                    {us.priorite}
                  </span>
                  <span className="flex-1 font-medium text-sm text-[#334155]">{us.titre}</span>
                  {isValidated && (
                    <span className="text-xs font-bold text-[#22c55e] bg-[#dcfce7] px-2 py-0.5 rounded border border-[#86efac] flex items-center gap-1">
                      <span>&#10003;</span> Validée{validationDate ? ` le ${formatDate(validationDate)}` : ""}
                    </span>
                  )}
                  <span className="text-xs text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
                    {us.epic}
                  </span>
                  <span className="text-xs font-medium text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
                    {us.criteres.length} critère{us.criteres.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-xs font-bold text-[#3b82f6] bg-[#eff6ff] px-2 py-0.5 rounded">
                    {us.estimation} pts
                  </span>
                  <span className="text-xs text-[#94a3b8]">{us.sprint}</span>
                  <span className="text-[#94a3b8]">{expandedUS === us.id ? "▲" : "▼"}</span>
                </div>
                {expandedUS !== us.id && (
                  <div className="mt-1 ml-20 text-xs text-[#94a3b8] italic truncate">
                    {truncated}
                  </div>
                )}
              </button>

              {expandedUS === us.id && (
                <div className="border-t border-[#e2e8f0] p-4 bg-[#f8fafc]">
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <p className="text-sm text-[#475569]">
                      <strong>En tant que</strong> {us.enTantQue},
                      <strong> je souhaite</strong> {us.jeSouhaite},
                      <strong> afin de</strong> {us.afinDe}.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                      Critères d'acceptation
                    </h4>
                    <ul className="space-y-1">
                      {us.criteres.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#475569]">
                          <span className="text-[#22c55e] mt-0.5">&#10003;</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                    <div className="text-xs text-[#94a3b8]">
                      Sprint : {us.sprint} · Estimation : {us.estimation} pts
                      {isValidated && validationDate && (
                        <span className="ml-2 text-[#22c55e]">
                          · Validée le {formatDate(validationDate)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isValidated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleValidation(us.id);
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444] transition-all"
                        >
                          ✕ Dévalider
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValidation(us.id);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isValidated
                            ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                            : "bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#22c55e] hover:text-[#22c55e]"
                        }`}
                      >
                        {isValidated ? "✓ Validée par le PO" : "Valider cette US"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
