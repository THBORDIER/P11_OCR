const recettageRows = [
  {
    us: "US-001",
    etape: "Liste clients",
    action: "Ouvrir la page /clients",
    attendu: "La liste affiche les clients avec pagination et tri.",
    obtenu: "Liste chargee correctement, tri operationnel.",
    statut: "OK",
  },
  {
    us: "US-001",
    etape: "Tri",
    action: "Cliquer sur la colonne Dernier contact",
    attendu: "Le tri ascendant/descendant s'applique sans rechargement.",
    obtenu: "Tri effectif mais inversion lente sur gros volume.",
    statut: "A retester",
  },
  {
    us: "US-002",
    etape: "Recherche",
    action: "Rechercher \"Durand\"",
    attendu: "Les clients correspondants sont filtres en moins de 1 seconde.",
    obtenu: "Resultat renvoye en 400 ms.",
    statut: "OK",
  },
  {
    us: "US-002",
    etape: "Filtres",
    action: "Cumuler filtre statut + secteur",
    attendu: "Les deux filtres se combinent correctement.",
    obtenu: "Le filtre secteur est ignore apres reinitialisation.",
    statut: "KO",
  },
  {
    us: "US-003",
    etape: "Fiche detail",
    action: "Ouvrir une fiche depuis la liste",
    attendu: "La fiche client affiche donnees, KPIs et onglets.",
    obtenu: "Affichage complet, aucun bloc manquant.",
    statut: "OK",
  },
  {
    us: "US-004",
    etape: "Creation client",
    action: "Soumettre un nouveau client avec champs obligatoires",
    attendu: "Le client est cree et visible dans la liste.",
    obtenu: "Creation effectuee mais doublon email non bloque.",
    statut: "KO",
  },
  {
    us: "US-005",
    etape: "Edition fiche",
    action: "Modifier le telephone puis enregistrer",
    attendu: "La nouvelle valeur est persistee et visible immediatement.",
    obtenu: "Valeur enregistree, rafraichissement necessaire.",
    statut: "A retester",
  },
  {
    us: "US-006",
    etape: "Historique",
    action: "Ajouter un echange de type Appel",
    attendu: "L'echange apparait en tete de timeline.",
    obtenu: "Insertion correcte en ordre chronologique.",
    statut: "OK",
  },
  {
    us: "US-006",
    etape: "Filtre interactions",
    action: "Filtrer sur Emails",
    attendu: "Seuls les emails restent affiches.",
    obtenu: "Filtre applique, 1 anomalie visuelle sur mobile.",
    statut: "A retester",
  },
  {
    us: "Transversal",
    etape: "Responsive",
    action: "Verifier affichage tablette et mobile",
    attendu: "Aucune rupture de mise en page bloquante.",
    obtenu: "Affichage tablette OK, mobile a ajuster sur timeline.",
    statut: "A retester",
  },
];

const statusStyles: Record<string, string> = {
  OK: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  KO: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
  "A retester": "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
};

export default function RecettagePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">Template de recettage</h1>
        <p className="text-[#64748b] mt-2">
          Annexe soumission - Grille de recette Sprint 1 (US, etapes, resultats, statut)
        </p>
      </div>

      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-5 mb-6">
        <h2 className="text-base font-semibold text-[#92400e] mb-2">Mode d'emploi recettage</h2>
        <div className="text-sm text-[#92400e] space-y-1">
          <p>Comment remplir : une ligne = un test, lie a une US, avec action testee et ecart attendu/obtenu.</p>
          <p>Quand valider : en fin de sprint review apres demonstration et correction des points KO.</p>
          <p>Qui signe : Product Owner + representant client (sponsor ou referent metier).</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">US</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Etape</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Resultat attendu</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Resultat obtenu</th>
                <th className="text-left py-3 px-4 font-semibold text-[#475569]">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recettageRows.map((row, index) => (
                <tr key={`${row.us}-${index}`} className="border-b border-[#f1f5f9] align-top">
                  <td className="py-3 px-4 font-medium text-[#1e293b] whitespace-nowrap">{row.us}</td>
                  <td className="py-3 px-4 text-[#334155]">{row.etape}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.action}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.attendu}</td>
                  <td className="py-3 px-4 text-[#475569]">{row.obtenu}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border ${statusStyles[row.statut]}`}
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