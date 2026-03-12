"use client";

import { useState } from "react";

interface RecettageRow {
  us: string;
  sprint: string;
  etape: string;
  action: string;
  attendu: string;
  obtenu: string;
  statut: string;
}

const recettageRows: RecettageRow[] = [
  // ─── Sprint 1 : Gestion des Clients ───
  { us: "US-001", sprint: "Sprint 1", etape: "Liste clients", action: "Ouvrir la page /clients", attendu: "La liste affiche les clients avec pagination et tri.", obtenu: "Liste chargee correctement, tri operationnel.", statut: "OK" },
  { us: "US-001", sprint: "Sprint 1", etape: "Tri", action: "Cliquer sur la colonne Dernier contact", attendu: "Le tri ascendant/descendant s'applique sans rechargement.", obtenu: "Tri effectif mais inversion lente sur gros volume.", statut: "A retester" },
  { us: "US-002", sprint: "Sprint 1", etape: "Recherche", action: "Rechercher \"Durand\"", attendu: "Les clients correspondants sont filtres en moins de 1 seconde.", obtenu: "Resultat renvoye en 400 ms.", statut: "OK" },
  { us: "US-002", sprint: "Sprint 1", etape: "Filtres", action: "Cumuler filtre statut + secteur", attendu: "Les deux filtres se combinent correctement.", obtenu: "Le filtre secteur est ignore apres reinitialisation.", statut: "KO" },
  { us: "US-003", sprint: "Sprint 1", etape: "Fiche detail", action: "Ouvrir une fiche depuis la liste", attendu: "La fiche client affiche donnees, KPIs et onglets.", obtenu: "Affichage complet, aucun bloc manquant.", statut: "OK" },
  { us: "US-004", sprint: "Sprint 1", etape: "Creation client", action: "Soumettre un nouveau client avec champs obligatoires", attendu: "Le client est cree et visible dans la liste.", obtenu: "Creation effectuee mais doublon email non bloque.", statut: "KO" },
  { us: "US-005", sprint: "Sprint 1", etape: "Edition fiche", action: "Modifier le telephone puis enregistrer", attendu: "La nouvelle valeur est persistee et visible immediatement.", obtenu: "Valeur enregistree, rafraichissement necessaire.", statut: "A retester" },
  { us: "US-006", sprint: "Sprint 1", etape: "Historique", action: "Ajouter un echange de type Appel", attendu: "L'echange apparait en tete de timeline.", obtenu: "Insertion correcte en ordre chronologique.", statut: "OK" },
  { us: "US-006", sprint: "Sprint 1", etape: "Filtre interactions", action: "Filtrer sur Emails", attendu: "Seuls les emails restent affiches.", obtenu: "Filtre applique, 1 anomalie visuelle sur mobile.", statut: "A retester" },
  { us: "Transversal", sprint: "Sprint 1", etape: "Responsive S1", action: "Verifier affichage tablette et mobile", attendu: "Aucune rupture de mise en page bloquante.", obtenu: "Affichage tablette OK, mobile a ajuster sur timeline.", statut: "A retester" },

  // ─── Sprint 2 : Pipeline Commercial ───
  { us: "US-007", sprint: "Sprint 2", etape: "Vue Kanban", action: "Ouvrir la page /pipeline", attendu: "Le pipeline affiche 6 colonnes avec les opportunites et totaux par colonne.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-007", sprint: "Sprint 2", etape: "Filtres pipeline", action: "Filtrer par commercial et par periode", attendu: "Les opportunites affichees correspondent aux filtres selectionnes.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-008", sprint: "Sprint 2", etape: "Drag & drop", action: "Deplacer une carte de Qualifie vers Proposition", attendu: "La carte change de colonne et les totaux se recalculent en temps reel.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-008", sprint: "Sprint 2", etape: "Feedback visuel", action: "Glisser une carte au-dessus d'une colonne", attendu: "La zone de depot est mise en surbrillance et un toast confirme le deplacement.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-009", sprint: "Sprint 2", etape: "Creation opportunite", action: "Remplir le formulaire et valider", attendu: "L'opportunite apparait dans la bonne colonne du pipeline.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-009", sprint: "Sprint 2", etape: "Lien client", action: "Chercher un client existant dans l'autocomplete", attendu: "Le client est lie a l'opportunite creee.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-010", sprint: "Sprint 2", etape: "Detail opportunite", action: "Cliquer sur une carte dans le pipeline", attendu: "Le panneau detail affiche entreprise, montant, probabilite, historique.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },
  { us: "US-010", sprint: "Sprint 2", etape: "Menu contextuel", action: "Clic droit ou bouton '...' sur une carte", attendu: "Menu affichant Modifier, Supprimer, Changer d'etape.", obtenu: "A tester lors du Sprint 2.", statut: "A tester" },

  // ─── Sprint 3 : Tâches & Rappels ───
  { us: "US-011", sprint: "Sprint 3", etape: "Liste taches", action: "Ouvrir la page /taches", attendu: "Le tableau affiche les taches avec titre, client, priorite, echeance, statut.", obtenu: "A tester lors du Sprint 3.", statut: "A tester" },
  { us: "US-011", sprint: "Sprint 3", etape: "Filtres taches", action: "Filtrer par priorite Haute et statut En cours", attendu: "Seules les taches correspondantes sont affichees.", obtenu: "A tester lors du Sprint 3.", statut: "A tester" },
  { us: "US-012", sprint: "Sprint 3", etape: "Creation tache", action: "Creer une tache depuis le formulaire modal", attendu: "La tache est creee avec les bons champs et visible dans la liste.", obtenu: "A tester lors du Sprint 3.", statut: "A tester" },
  { us: "US-012", sprint: "Sprint 3", etape: "Creation rapide", action: "Cliquer sur Ajouter une tache depuis la fiche client", attendu: "Le formulaire s'ouvre avec le client pre-rempli.", obtenu: "A tester lors du Sprint 3.", statut: "A tester" },
  { us: "US-013", sprint: "Sprint 3", etape: "Rappel J-1", action: "Creer une tache echeance demain puis attendre le lendemain", attendu: "Une notification apparait dans le centre de notifications in-app.", obtenu: "A tester lors du Sprint 3.", statut: "A tester" },
  { us: "US-013", sprint: "Sprint 3", etape: "Rappel email", action: "Verifier la boite mail apres le declenchement du rappel", attendu: "Un email de rappel est recu avec le lien vers la tache.", obtenu: "A tester lors du Sprint 3.", statut: "A tester" },

  // ─── Sprint 4 : Reporting & Dashboard ───
  { us: "US-014", sprint: "Sprint 4", etape: "Dashboard KPIs", action: "Ouvrir la page /dashboard", attendu: "Les 4 KPIs (CA pipeline, taux conversion, nb opportunites, taches en retard) s'affichent.", obtenu: "A tester lors du Sprint 4.", statut: "A tester" },
  { us: "US-014", sprint: "Sprint 4", etape: "Graphiques", action: "Verifier les graphiques de performance", attendu: "Courbe evolution CA, camembert repartition, barres activite par commercial.", obtenu: "A tester lors du Sprint 4.", statut: "A tester" },
  { us: "US-015", sprint: "Sprint 4", etape: "Rapports", action: "Generer un rapport avec filtres periode + commercial", attendu: "Le tableau affiche les donnees filtrees avec metriques de performance.", obtenu: "A tester lors du Sprint 4.", statut: "A tester" },
  { us: "US-015", sprint: "Sprint 4", etape: "Filtres dynamiques", action: "Changer la periode et le commercial", attendu: "Les resultats se mettent a jour en temps reel.", obtenu: "A tester lors du Sprint 4.", statut: "A tester" },
  { us: "US-016", sprint: "Sprint 4", etape: "Export Excel", action: "Cliquer sur Exporter en Excel", attendu: "Un fichier .xlsx est telecharge avec les donnees du rapport.", obtenu: "A tester lors du Sprint 4.", statut: "A tester" },
  { us: "US-016", sprint: "Sprint 4", etape: "Export PDF", action: "Cliquer sur Exporter en PDF", attendu: "Un PDF formate avec en-tete, tableau et graphiques est genere.", obtenu: "A tester lors du Sprint 4.", statut: "A tester" },

  // ─── Sprint 5 : Intégrations & Migration ───
  { us: "US-017", sprint: "Sprint 5", etape: "Sync emails", action: "Connecter le compte Outlook et ouvrir la fiche client", attendu: "Les emails echanges avec le contact apparaissent dans l'onglet Echanges.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-017", sprint: "Sprint 5", etape: "Envoi email CRM", action: "Envoyer un email depuis la fiche client", attendu: "L'email est envoye via Outlook et visible dans la timeline.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-018", sprint: "Sprint 5", etape: "Sync calendrier", action: "Creer un RDV depuis la fiche client", attendu: "L'evenement apparait dans le calendrier Outlook du commercial.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-018", sprint: "Sprint 5", etape: "Vue agenda", action: "Ouvrir la vue agenda dans le CRM", attendu: "Les RDV synchronises depuis Outlook s'affichent avec lien vers la fiche client.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-019", sprint: "Sprint 5", etape: "Import HubSpot", action: "Lancer l'import des leads depuis HubSpot", attendu: "Les contacts sont importes avec correspondance des champs. Doublons detectes.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-019", sprint: "Sprint 5", etape: "Rapport import", action: "Verifier le rapport post-import", attendu: "Le rapport affiche le nombre importes, doublons ignores et erreurs.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-020", sprint: "Sprint 5", etape: "Upload CSV", action: "Uploader un fichier CSV de 2500 comptes", attendu: "Le fichier est analyse, les colonnes detectees et un apercu affiche.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-020", sprint: "Sprint 5", etape: "Migration complete", action: "Lancer l'import apres mapping des colonnes", attendu: "Les 2500 comptes et 10000 contacts sont importes. Rapport de migration genere.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-021", sprint: "Sprint 5", etape: "Connexion SSO", action: "Cliquer sur Se connecter avec Microsoft", attendu: "Redirection vers Azure AD, retour au CRM avec session active.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-021", sprint: "Sprint 5", etape: "Provisioning", action: "Premiere connexion d'un nouvel utilisateur SSO", attendu: "Le profil CRM est cree automatiquement avec le bon role.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-022", sprint: "Sprint 5", etape: "Isolation donnees", action: "Se connecter en tant que Commercial A", attendu: "Seuls les clients assignes a Commercial A sont visibles.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
  { us: "US-022", sprint: "Sprint 5", etape: "Acces interdit", action: "Tenter d'acceder a la fiche d'un client non assigne", attendu: "Un message d'erreur 403 s'affiche, pas d'acces aux donnees.", obtenu: "A tester lors du Sprint 5.", statut: "A tester" },
];

const statusStyles: Record<string, string> = {
  OK: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  KO: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
  "A retester": "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
  "A tester": "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]",
};

const sprintOptions = ["Tous", "Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];

export default function RecettagePage() {
  const [sprintFilter, setSprintFilter] = useState("Tous");

  const filtered = sprintFilter === "Tous"
    ? recettageRows
    : recettageRows.filter((r) => r.sprint === sprintFilter);

  const countByStatus = (status: string) => filtered.filter((r) => r.statut === status).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Template de recettage</h1>
        <p className="text-[#64748b] mt-2">
          Annexe soumission — Grille de recette complète couvrant les 22 User Stories du backlog
        </p>
      </div>

      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-5 mb-6">
        <h2 className="text-base font-semibold text-[#92400e] mb-2">Mode d&apos;emploi recettage</h2>
        <div className="text-sm text-[#92400e] space-y-1">
          <p>Comment remplir : une ligne = un test, lie a une US, avec action testee et ecart attendu/obtenu.</p>
          <p>Quand valider : en fin de sprint review apres demonstration et correction des points KO.</p>
          <p>Qui signe : Product Owner + representant client (sponsor ou referent metier).</p>
        </div>
      </div>

      {/* Sprint filter + stats */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1">
          {sprintOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSprintFilter(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                sprintFilter === s
                  ? "bg-white text-[#1e293b] shadow-sm"
                  : "text-[#64748b] hover:text-[#334155]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-3 ml-auto text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block" />
            OK : {countByStatus("OK")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block" />
            KO : {countByStatus("KO")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] inline-block" />
            A retester : {countByStatus("A retester")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] inline-block" />
            A tester : {countByStatus("A tester")}
          </span>
          <span className="font-semibold text-[#334155]">
            Total : {filtered.length} tests
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">US</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Sprint</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Etape</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Resultat attendu</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Resultat obtenu</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => (
                <tr key={`${row.us}-${index}`} className="border-b border-[#f1f5f9] align-top">
                  <td className="py-3 px-4 font-medium text-[#1e293b] whitespace-nowrap">{row.us}</td>
                  <td className="py-3 px-4 text-[#64748b] whitespace-nowrap text-xs">{row.sprint}</td>
                  <td className="py-3 px-4 text-[#334155]">{row.etape}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.action}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.attendu}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.obtenu}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border ${statusStyles[row.statut] || ""}`}
                    >
                      {row.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
