export default function AnalysePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Analyse des retours client
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 2 — Synthèse structurée des réponses de Spart et de la maquette Figma
        </p>
      </div>

      {/* Document metadata */}
      <div className="bg-[#f1f5f9] rounded-lg px-4 py-2 mb-6 flex items-center gap-3 text-xs text-[#475569]">
        <span className="font-semibold text-[#334155]">Version 1.2</span>
        <span className="text-[#cbd5e1]">|</span>
        <span>Dernière mise à jour : 4 mars 2026</span>
        <span className="text-[#cbd5e1]">|</span>
        <span>Auteur : Thomas Bordier</span>
      </div>

      {/* Contexte et objectifs */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Contexte et objectifs du client
        </h2>
        <div className="space-y-3 text-sm text-[#475569]">
          <p>
            <strong>Société :</strong> Spart — Services B2B, accompagnement des
            PME dans l'adoption d'outils digitaux.
          </p>
          <p>
            <strong>Problème actuel :</strong> Données clients dispersées entre
            Excel, emails et carnets personnels. Perte d'informations, manque de
            visibilité, collaboration difficile.
          </p>
          <div className="bg-[#f1f5f9] rounded-lg p-4 mt-3">
            <h3 className="font-medium text-[#334155] mb-2">
              Objectifs confirmés par le client
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Centraliser toutes les données clients/prospects dans un seul outil</li>
              <li>Structurer et standardiser les processus de vente et de suivi</li>
              <li>Améliorer la collaboration entre commerciaux, support et direction</li>
              <li>Donner de la visibilité au management via des tableaux de bord temps réel</li>
              <li>Favoriser l'adoption avec un outil simple, intuitif et accessible</li>
            </ul>
          </div>
          <div className="bg-[#f0fdf4] rounded-lg p-4 mt-3">
            <h3 className="font-medium text-[#166534] mb-2">
              Critères de succès
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[#166534]">
              <li>90% d'utilisateurs actifs dans les 3 mois suivant le déploiement</li>
              <li>Pipeline commercial tenu à jour à 95% en temps réel</li>
              <li>Réduction de 30% du temps de préparation des comités commerciaux</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Utilisateurs */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Utilisateurs concernés — 21 personnes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Rôle</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Effectif</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Responsabilités</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Besoins CRM</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Droits d'accès</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#f1f5f9]">
                <td className="py-3 px-4 font-medium">Commerciaux</td>
                <td className="py-3 px-4">10</td>
                <td className="py-3 px-4">Prospection, suivi des opportunités, relances</td>
                <td className="py-3 px-4">Fiches prospects, pipeline, rappels</td>
                <td className="py-3 px-4">Accès à leurs comptes et opportunités</td>
              </tr>
              <tr className="border-b border-[#f1f5f9]">
                <td className="py-3 px-4 font-medium">Account Managers</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4">Suivi satisfaction, renouvellements, upsell, onboarding</td>
                <td className="py-3 px-4">Historique client, satisfaction, contrats</td>
                <td className="py-3 px-4">Vision consolidée de leur équipe</td>
              </tr>
              <tr className="border-b border-[#f1f5f9]">
                <td className="py-3 px-4 font-medium">Support client</td>
                <td className="py-3 px-4">4</td>
                <td className="py-3 px-4">Réponse aux problèmes/questions clients</td>
                <td className="py-3 px-4">Accès rapide à l'historique client</td>
                <td className="py-3 px-4">Accès partiel selon besoin</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Direction</td>
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">Pilotage global, prévisions, objectifs</td>
                <td className="py-3 px-4">Tableaux de bord, KPIs, rapports</td>
                <td className="py-3 px-4">Vision globale</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fonctionnalites */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Fonctionnalités attendues (par priorité)
        </h2>
        <div className="space-y-4">
          {[
            {
              priority: "P1",
              color: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
              title: "Gestion des données clients",
              items: [
                "Fiches comptes et contacts (coordonnées, secteur, taille, historique)",
                "Déduplication et recherche avancée",
                "Historique complet des interactions (emails, appels, RDV, tickets)",
              ],
            },
            {
              priority: "P1",
              color: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
              title: "Pipeline des opportunités",
              items: [
                "Pipeline visuel Kanban (prospection, qualification, proposition, négociation, gagné/perdu)",
                "Probabilité de closing par étape",
                "Relances et rappels configurables",
              ],
            },
            {
              priority: "P2",
              color: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]",
              title: "Activités et tâches",
              items: [
                "Création de tâches et rappels automatiques",
                "Notifications email et push mobile",
                "Synchronisation bidirectionnelle avec Outlook (emails + agenda)",
              ],
            },
            {
              priority: "P2",
              color: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]",
              title: "Reporting et tableaux de bord",
              items: [
                "Tableau de bord commercial : CA, opportunités, taux de conversion",
                "Reporting activité : appels, emails, RDV par commercial",
                "Forecast mensuel consolidé, exports CSV/Excel",
              ],
            },
            {
              priority: "P3",
              color: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]",
              title: "Intégrations externes",
              items: [
                "Outlook (email et calendrier)",
                "Outil de facturation interne (API disponible)",
                "Zendesk (support)",
                "HubSpot (marketing automation — import leads)",
              ],
            },
            {
              priority: "P3",
              color: "bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]",
              title: "Sécurité et conformité",
              items: [
                "Authentification SSO via Outlook",
                "Droits par rôle et visibilité restreinte",
                "Sauvegardes quotidiennes",
                "Conformité RGPD (hébergement en Europe)",
              ],
            },
          ].map((f, i) => (
            <div key={i} className={`rounded-lg border p-4 ${f.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-current/10">
                  {f.priority}
                </span>
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm opacity-80">
                {f.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Maquette Figma */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Maquette Figma — Captures annotées
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          Captures écran de la maquette Figma, annotées pour le développement. Cliquer pour agrandir.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Capture 1 — Vue liste clients", desc: "Liste tabulaire avec filtres, recherche et tags de statut" },
            { label: "Capture 2 — Fiche client détaillée", desc: "Layout fiche avec onglets, KPIs et informations de contact" },
            { label: "Capture 3 — Pipeline Kanban", desc: "Vue Kanban des opportunités avec colonnes par étape" },
            { label: "Capture 4 — Tableau de bord", desc: "Dashboard direction avec KPIs, graphiques et prévisions" },
          ].map((capture, i) => (
            <div
              key={i}
              className="border-2 border-dashed border-[#cbd5e1] rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[160px] bg-[#f8fafc]"
            >
              <svg
                className="w-10 h-10 text-[#94a3b8] mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
              <p className="text-sm font-medium text-[#475569]">{capture.label}</p>
              <p className="text-xs text-[#94a3b8] mt-1">{capture.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contraintes */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Contraintes et planning
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f1f5f9] rounded-lg p-4">
            <h3 className="font-medium text-[#334155] text-sm mb-2">Budget</h3>
            <p className="text-2xl font-bold text-[#1e293b]">120 000 EUR</p>
            <p className="text-xs text-[#64748b]">Licences + déploiement + formation</p>
          </div>
          <div className="bg-[#f1f5f9] rounded-lg p-4">
            <h3 className="font-medium text-[#334155] text-sm mb-2">Planning</h3>
            <div className="space-y-1 text-sm text-[#475569]">
              <p>Phase de cadrage : 1 mois</p>
              <p>Dev & config MVP : 3 mois</p>
              <p>Déploiement pilote (20 users) : M+4</p>
              <p>Généralisation : M+6</p>
            </div>
          </div>
          <div className="bg-[#f1f5f9] rounded-lg p-4">
            <h3 className="font-medium text-[#334155] text-sm mb-2">Migration</h3>
            <div className="space-y-1 text-sm text-[#475569]">
              <p>~2 500 comptes clients/prospects</p>
              <p>~10 000 contacts à importer</p>
              <p>Sources : Excel, Outlook, ERP</p>
              <p>Historique 2 dernières années</p>
            </div>
          </div>
          <div className="bg-[#f1f5f9] rounded-lg p-4">
            <h3 className="font-medium text-[#334155] text-sm mb-2">Ressources</h3>
            <div className="space-y-1 text-sm text-[#475569]">
              <p>1 sponsor : Directeur commercial</p>
              <p>1 chef de projet IT (temps partiel)</p>
              <p>1 référent métier par équipe</p>
              <p>Accompagnement externe attendu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risques */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Risques et points d'attention
        </h2>
        <div className="space-y-3">
          {[
            {
              risk: "Adoption par les utilisateurs",
              mitigation: "Prévoir une conduite du changement, formation, et un outil simple/intuitif.",
              level: "Élevé",
              color: "text-[#dc2626]",
            },
            {
              risk: "Qualité des données sources",
              mitigation: "Nettoyage prévu avant import. Déduplication et normalisation nécessaires.",
              level: "Moyen",
              color: "text-[#ea580c]",
            },
            {
              risk: "Gestion des intégrations techniques",
              mitigation: "Valider les APIs disponibles (Outlook, Zendesk, HubSpot) en amont.",
              level: "Moyen",
              color: "text-[#ea580c]",
            },
            {
              risk: "Surcharge fonctionnelle",
              mitigation: "Rester simple et utilisable. Ne pas alourdir l'outil.",
              level: "Faible",
              color: "text-[#0284c7]",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-4 bg-[#f8fafc] rounded-lg p-4">
              <span className={`text-xs font-bold ${r.color} whitespace-nowrap mt-0.5`}>
                {r.level}
              </span>
              <div>
                <p className="font-medium text-sm text-[#334155]">{r.risk}</p>
                <p className="text-sm text-[#64748b]">{r.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decisions validees vs a confirmer */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Décisions validées vs à confirmer
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Colonne gauche : Decisions validees */}
          <div className="bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-5">
            <h3 className="font-semibold text-[#166534] mb-3 flex items-center gap-2">
              <span>&#9989;</span> Décisions validées
            </h3>
            <div className="space-y-2 text-sm text-[#166534]">
              {[
                "Stack technique retenue : WeWeb (front) + Xano (back) + Supabase (BDD)",
                "Authentification SSO via Outlook confirmée",
                "Pipeline Kanban en 5 étapes validé avec le client",
                "Hébergement Europe (conformité RGPD) validé",
                "21 utilisateurs répartis en 4 rôles avec droits différenciés",
                "Budget global de 120 000 EUR approuvé par la direction",
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">&#10003;</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite : Points a confirmer */}
          <div className="bg-[#fffbeb] rounded-lg border border-[#fde68a] p-5">
            <h3 className="font-semibold text-[#92400e] mb-3 flex items-center gap-2">
              <span>&#9888;&#65039;</span> Points à confirmer
            </h3>
            <div className="space-y-2 text-sm text-[#92400e]">
              {[
                "Niveau de détail des rapports attendus",
                "Gestion documentaire (contrats, propositions)",
                "Détail du workflow d'onboarding client",
                "Processus exact de qualification des leads",
                "Priorité des intégrations (Zendesk vs HubSpot)",
                "Niveau de personnalisation des vues par rôle",
                "Fréquence et format des sauvegardes",
                "Plan de formation des équipes",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">&#9888;</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
