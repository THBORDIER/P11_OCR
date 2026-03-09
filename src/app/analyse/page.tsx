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

      {/* Retours fictifs */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1e293b]">Retours client fictifs recus</h2>
            <p className="text-sm text-[#64748b] mt-1">
              Cette section simule des retours recueillis apres envoi du questionnaire pour illustrer la demarche d'analyse.
            </p>
          </div>
          <span className="text-xs font-semibold bg-[#eff6ff] text-[#1d4ed8] px-2 py-1 rounded">
            Donnees simulees - Exercice P11
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <p className="text-xs text-[#64748b] mb-1">Priorites citees</p>
            <p className="text-2xl font-bold text-[#1e293b]">63%</p>
            <p className="text-xs text-[#475569]">des retours orientent le Sprint 1 sur la centralisation client.</p>
          </div>
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <p className="text-xs text-[#64748b] mb-1">Satisfaction percue (avant projet)</p>
            <p className="text-2xl font-bold text-[#1e293b]">2.4 / 5</p>
            <p className="text-xs text-[#475569]">sur les outils actuels (Excel + email + notes).</p>
          </div>
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <p className="text-xs text-[#64748b] mb-1">Irritants frequents</p>
            <p className="text-2xl font-bold text-[#1e293b]">71%</p>
            <p className="text-xs text-[#475569]">signalent pertes d'information et doublons de suivi.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <h3 className="font-semibold text-[#334155] text-sm mb-2">Synthese qualitative</h3>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li>&ldquo;On perd du temps a reconstruire le contexte d'un client avant chaque appel.&rdquo;</li>
              <li>&ldquo;Le pipeline actuel est incomplet, impossible de fiabiliser le forecast.&rdquo;</li>
              <li>&ldquo;On veut une interface simple, utilisable sans formation longue.&rdquo;</li>
            </ul>
          </div>
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <h3 className="font-semibold text-[#334155] text-sm mb-2">Besoins non couverts identifies</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-[#475569]">
              <li>Historique unifie (emails, appels, reunions) visible en un ecran.</li>
              <li>Rappels de relance automatiques sur les opportunites inactives.</li>
              <li>Vue manager avec indicateurs de conversion par commercial.</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
          <h3 className="font-semibold text-[#166534] text-sm mb-2">Decisions prises suite aux retours</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#166534]">
            <li>Maintien du module Clients en priorite absolue sur le Sprint 1.</li>
            <li>Ajout d'un critere d'acceptation sur la fiabilite du pipeline (mise a jour en temps reel).</li>
            <li>Renforcement des scenarios de recette sur recherche, doublons et historique.</li>
          </ul>
        </div>
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

      {/* Personas */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-2">
          Personas utilisateurs
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          Trois profils types représentatifs des futurs utilisateurs du CRM, construits à partir des entretiens et du questionnaire.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {/* Persona 1 */}
          <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-xl font-bold text-[#2563eb]">
                MD
              </div>
              <div>
                <p className="font-semibold text-[#1e293b]">Marc Duval</p>
                <p className="text-xs text-[#64748b]">35 ans — Commercial terrain</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[#334155]">Contexte : </span>
                <span className="text-[#475569]">Passe 80% de son temps en déplacement chez les clients. Utilise principalement son smartphone entre deux rendez-vous.</span>
              </div>
              <div>
                <span className="font-medium text-[#334155]">Besoin principal : </span>
                <span className="text-[#475569]">Saisie rapide d'un prospect sur mobile après un RDV, accès immédiat aux fiches clients avant un meeting.</span>
              </div>
              <div>
                <span className="font-medium text-[#dc2626]">Frustration : </span>
                <span className="text-[#475569]">Perd des informations entre deux RDV car il note sur papier ou dans des SMS. Oublie de relancer faute de rappel.</span>
              </div>
              <div>
                <span className="font-medium text-[#166534]">Objectif : </span>
                <span className="text-[#475569]">Ne plus perdre aucun prospect et gagner du temps sur la saisie administrative.</span>
              </div>
            </div>
          </div>
          {/* Persona 2 */}
          <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#fce7f3] flex items-center justify-center text-xl font-bold text-[#db2777]">
                SM
              </div>
              <div>
                <p className="font-semibold text-[#1e293b]">Sophie Martin</p>
                <p className="text-xs text-[#64748b]">42 ans — Directrice commerciale</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[#334155]">Contexte : </span>
                <span className="text-[#475569]">Pilote une équipe de 10 commerciaux. Doit rendre compte au CODIR chaque semaine avec des prévisions fiables.</span>
              </div>
              <div>
                <span className="font-medium text-[#334155]">Besoin principal : </span>
                <span className="text-[#475569]">Vision pipeline en temps réel, forecast consolidé et indicateurs de performance par commercial.</span>
              </div>
              <div>
                <span className="font-medium text-[#dc2626]">Frustration : </span>
                <span className="text-[#475569]">Prépare ses comités commerciaux dans Excel en agrégeant manuellement les données de chaque commercial. Prend une demi-journée.</span>
              </div>
              <div>
                <span className="font-medium text-[#166534]">Objectif : </span>
                <span className="text-[#475569]">Avoir un tableau de bord fiable et automatisé pour piloter la performance commerciale.</span>
              </div>
            </div>
          </div>
          {/* Persona 3 */}
          <div className="bg-[#f8fafc] rounded-lg border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-xl font-bold text-[#059669]">
                LP
              </div>
              <div>
                <p className="font-semibold text-[#1e293b]">Lucas Petit</p>
                <p className="text-xs text-[#64748b]">28 ans — Support client</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-[#334155]">Contexte : </span>
                <span className="text-[#475569]">Traite 30 à 40 demandes clients par jour. Doit comprendre rapidement le contexte de chaque client pour résoudre les problèmes.</span>
              </div>
              <div>
                <span className="font-medium text-[#334155]">Besoin principal : </span>
                <span className="text-[#475569]">Accès rapide à l'historique complet du client (interactions, contrat, tickets passés) depuis un seul écran.</span>
              </div>
              <div>
                <span className="font-medium text-[#dc2626]">Frustration : </span>
                <span className="text-[#475569]">Doit demander aux commerciaux le contexte d'un client par email ou Slack avant de pouvoir répondre. Temps de réponse allongé.</span>
              </div>
              <div>
                <span className="font-medium text-[#166534]">Objectif : </span>
                <span className="text-[#475569]">Réduire le temps de résolution en ayant toutes les informations client accessibles instantanément.</span>
              </div>
            </div>
          </div>
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

      {/* Matrice Impact / Effort */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-2">
          Matrice Impact / Effort — Priorisation des fonctionnalités
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          Classification des fonctionnalités identifiées selon leur impact business et l'effort de mise en œuvre. Cette matrice guide la priorisation du backlog et le séquençage des sprints.
        </p>
        <div className="grid grid-cols-2 gap-0 border border-[#e2e8f0] rounded-lg overflow-hidden">
          {/* Axe labels */}
          <div className="col-span-2 flex items-center justify-center bg-[#f1f5f9] py-2 border-b border-[#e2e8f0]">
            <span className="text-xs font-semibold text-[#475569] tracking-wide uppercase">Effort faible &larr;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&rarr; Effort élevé</span>
          </div>
          {/* Quick Wins - High Impact / Low Effort */}
          <div className="bg-[#f0fdf4] p-5 border-r border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span>
              <h3 className="font-semibold text-[#166534] text-sm">Quick Wins</h3>
              <span className="text-xs text-[#166534] opacity-70 ml-auto">Impact élevé / Effort faible</span>
            </div>
            <ul className="space-y-2 text-sm text-[#166534]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#10003;</span>
                <span>Fiches clients &amp; recherche</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#10003;</span>
                <span>Pipeline Kanban</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#10003;</span>
                <span>Filtres et tri</span>
              </li>
            </ul>
            <p className="text-xs text-[#166534] mt-3 opacity-70 italic">Priorité maximale — Sprint 1</p>
          </div>
          {/* High Impact / High Effort */}
          <div className="bg-[#fff7ed] p-5 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-3 h-3 rounded-full bg-[#f97316]"></span>
              <h3 className="font-semibold text-[#9a3412] text-sm">Projets stratégiques</h3>
              <span className="text-xs text-[#9a3412] opacity-70 ml-auto">Impact élevé / Effort élevé</span>
            </div>
            <ul className="space-y-2 text-sm text-[#9a3412]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#9679;</span>
                <span>Intégrations Outlook</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#9679;</span>
                <span>Tableau de bord &amp; KPIs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#9679;</span>
                <span>Migration données</span>
              </li>
            </ul>
            <p className="text-xs text-[#9a3412] mt-3 opacity-70 italic">Planifier soigneusement — Sprints 2-3</p>
          </div>
          {/* Low Impact / Low Effort */}
          <div className="bg-[#f0f9ff] p-5 border-r border-[#e2e8f0]">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]"></span>
              <h3 className="font-semibold text-[#1e40af] text-sm">Bonus rapides</h3>
              <span className="text-xs text-[#1e40af] opacity-70 ml-auto">Impact faible / Effort faible</span>
            </div>
            <ul className="space-y-2 text-sm text-[#1e40af]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#9679;</span>
                <span>Export CSV</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#9679;</span>
                <span>Tags et labels personnalisés</span>
              </li>
            </ul>
            <p className="text-xs text-[#1e40af] mt-3 opacity-70 italic">Si le temps le permet — Sprint 3+</p>
          </div>
          {/* Low Impact / High Effort */}
          <div className="bg-[#f8fafc] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-3 h-3 rounded-full bg-[#94a3b8]"></span>
              <h3 className="font-semibold text-[#475569] text-sm">À éviter / reporter</h3>
              <span className="text-xs text-[#475569] opacity-70 ml-auto">Impact faible / Effort élevé</span>
            </div>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#10007;</span>
                <span>BI avancée</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">&#10007;</span>
                <span>Intégration SAP</span>
              </li>
            </ul>
            <p className="text-xs text-[#475569] mt-3 opacity-70 italic">Hors scope MVP — Évolution future</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-[#94a3b8]">
          <span>&#8593; Impact élevé &nbsp;|&nbsp; &#8595; Impact faible</span>
          <span>Lecture : les Quick Wins sont développés en premier pour maximiser la valeur livrée rapidement.</span>
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
          {/* Wireframe 1 — Vue liste clients */}
          <div className="border-2 border-[#cbd5e1] rounded-lg bg-[#f8fafc] overflow-hidden">
            <div className="bg-[#e2e8f0] px-4 py-2 border-b border-[#cbd5e1]">
              <p className="text-sm font-semibold text-[#334155]">Capture 1 — Vue liste clients</p>
            </div>
            <div className="p-4">
              <pre className="text-[11px] text-[#475569] font-mono leading-relaxed whitespace-pre">{`┌─────────────────────────────────────────────┐
│  [Logo]  SpartCRM    Clients | Pipeline | TB │
├─────────────────────────────────────────────┤
│  🔍 Recherche client...    [+ Nouveau]      │
│  Filtre: Statut ▼  Secteur ▼  Commercial ▼  │
├──────┬──────────┬────────┬─────────┬────────┤
│ Nom  │ Société  │ Statut │ Dernier │ Action │
│      │          │        │ contact │        │
├──────┼──────────┼────────┼─────────┼────────┤
│ Dupont│ TechCo  │ ● Actif│ 02/03   │ [Voir] │
│ Moreau│ DataSA  │ ○ Lead │ 28/02   │ [Voir] │
│ Leroy │ WebInc  │ ● Actif│ 01/03   │ [Voir] │
├──────┴──────────┴────────┴─────────┴────────┤
│  ◀ 1 2 3 ... 12 ▶    Afficher: 25 ▼        │
└─────────────────────────────────────────────┘`}</pre>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Barre de recherche</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Filtres multi-critères</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Tags de statut</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Pagination</span>
              </div>
            </div>
          </div>
          {/* Wireframe 2 — Fiche client détaillée */}
          <div className="border-2 border-[#cbd5e1] rounded-lg bg-[#f8fafc] overflow-hidden">
            <div className="bg-[#e2e8f0] px-4 py-2 border-b border-[#cbd5e1]">
              <p className="text-sm font-semibold text-[#334155]">Capture 2 — Fiche client détaillée</p>
            </div>
            <div className="p-4">
              <pre className="text-[11px] text-[#475569] font-mono leading-relaxed whitespace-pre">{`┌─────────────────────────────────────────────┐
│  ← Retour   Fiche client : TechCo SAS       │
├──────────────┬──────────────────────────────┤
│  INFOS       │  KPIs client                  │
│  Nom: TechCo │  ┌────┐ ┌────┐ ┌────┐        │
│  Secteur: IT │  │ CA │ │Opp.│ │Sat.│        │
│  Taille: PME │  │45k€│ │ 3  │ │4.2 │        │
│  Tél: 01...  │  └────┘ └────┘ └────┘        │
│  Email: ...  │                               │
├──────────────┴──────────────────────────────┤
│ [Infos] [Historique] [Opportunités] [Notes]  │
├─────────────────────────────────────────────┤
│  📞 02/03 — Appel commercial (Marc D.)       │
│  📧 28/02 — Email relance envoyé             │
│  📅 25/02 — RDV sur site (compte-rendu)      │
└─────────────────────────────────────────────┘`}</pre>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">KPIs en haut</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Navigation par onglets</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Timeline interactions</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Infos de contact</span>
              </div>
            </div>
          </div>
          {/* Wireframe 3 — Pipeline Kanban */}
          <div className="border-2 border-[#cbd5e1] rounded-lg bg-[#f8fafc] overflow-hidden">
            <div className="bg-[#e2e8f0] px-4 py-2 border-b border-[#cbd5e1]">
              <p className="text-sm font-semibold text-[#334155]">Capture 3 — Pipeline Kanban</p>
            </div>
            <div className="p-4">
              <pre className="text-[11px] text-[#475569] font-mono leading-relaxed whitespace-pre">{`┌─────────────────────────────────────────────┐
│  Pipeline commercial     Total: 245 000 €    │
├────────┬────────┬────────┬────────┬─────────┤
│Prospec.│Qualif. │Propos. │Négo.   │Gagné    │
│  (12)  │  (8)   │  (5)   │  (3)   │  (15)   │
├────────┼────────┼────────┼────────┼─────────┤
│┌──────┐│┌──────┐│┌──────┐│┌──────┐│┌───────┐│
││WebInc ││DataSA ││TechCo ││BigCo  ││InfoPME ││
││ 15k€ ││ 25k€ ││ 45k€ ││ 80k€ ││ 30k€  ││
││ Marc  ││Sophie ││ Marc  ││Sophie ││ Lucas  ││
│└──────┘│└──────┘│└──────┘│└──────┘│└───────┘│
│┌──────┐│┌──────┐│        │        │┌───────┐│
││NewCo  ││StartX ││        │        ││OldCo   ││
││ 10k€ ││ 20k€ ││        │        ││ 45k€  ││
│└──────┘│└──────┘│        │        │└───────┘│
└────────┴────────┴────────┴────────┴─────────┘`}</pre>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">5 colonnes d'étapes</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Drag &amp; drop</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Montant par carte</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Total pipeline</span>
              </div>
            </div>
          </div>
          {/* Wireframe 4 — Tableau de bord */}
          <div className="border-2 border-[#cbd5e1] rounded-lg bg-[#f8fafc] overflow-hidden">
            <div className="bg-[#e2e8f0] px-4 py-2 border-b border-[#cbd5e1]">
              <p className="text-sm font-semibold text-[#334155]">Capture 4 — Tableau de bord</p>
            </div>
            <div className="p-4">
              <pre className="text-[11px] text-[#475569] font-mono leading-relaxed whitespace-pre">{`┌─────────────────────────────────────────────┐
│  Tableau de bord — Mars 2026                 │
├───────────┬───────────┬───────────┬─────────┤
│ CA Mois   │ Pipe actif│ Tx conv.  │ RDV/sem │
│  125k€    │  245k€    │  34%      │  48     │
│  ▲ +12%   │  ▲ +8%    │  ▼ -2pts  │  ▲ +5   │
├───────────┴───────────┴───────────┴─────────┤
│  📊 Évolution CA mensuel                     │
│  ┌──────────────────────────────────┐        │
│  │    ▄▄                            │        │
│  │  ▄▄██▄▄  ▄▄                      │        │
│  │▄▄██████▄▄██▄▄▄▄██               │        │
│  └──────────────────────────────────┘        │
│  Jan  Fév  Mar  Avr  Mai                     │
├─────────────────────────────────────────────┤
│  Forecast Q2: 380k€   Objectif: 400k€       │
│  [Exporter CSV]  [Exporter PDF]              │
└─────────────────────────────────────────────┘`}</pre>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">4 KPIs principaux</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Graphique CA</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Forecast</span>
                <span className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded">Exports</span>
              </div>
            </div>
          </div>
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
                "Stack technique retenue : WeWeb (front) + Xano (back + BDD)",
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

      {/* Traçabilité Questionnaire → Analyse */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-2">
          Traçabilité Questionnaire → Analyse
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          Correspondance entre les questions posées lors du recueil des besoins et les décisions d'analyse qui en découlent. Cette traçabilité garantit que chaque choix est justifié par une donnée terrain.
        </p>
        <div className="space-y-3">
          {[
            {
              question: "Q1.3",
              label: "Volume de clients/prospects gérés",
              response: "~2 500 comptes, ~10 000 contacts",
              arrow: "→",
              decision: "Dimensionnement BDD",
              detail: "Xano configurée pour 2 500 comptes et 10 000 contacts avec index de recherche optimisés.",
              color: "bg-[#f0f9ff] border-[#bae6fd]",
            },
            {
              question: "Q2.2",
              label: "Difficultés actuelles dans le suivi client",
              response: "Données dispersées (Excel, emails, carnets)",
              arrow: "→",
              decision: "Priorité P1 sur la centralisation des données",
              detail: "La gestion des fiches clients et l'historique des interactions sont classés en priorité maximale (P1) dans le backlog.",
              color: "bg-[#fef2f2] border-[#fecaca]",
            },
            {
              question: "Q3.4",
              label: "Échelle de priorisation des fonctionnalités",
              response: "Pipeline Kanban noté 9/10, Fiches clients 10/10",
              arrow: "→",
              decision: "Priorisation MoSCoW : Pipeline Kanban = Must Have",
              detail: "Les fonctionnalités les mieux notées par le client sont classées Must Have et planifiées dans le Sprint 1 du MVP.",
              color: "bg-[#f0fdf4] border-[#bbf7d0]",
            },
            {
              question: "Q4.1",
              label: "Budget et contraintes financières",
              response: "120 000 EUR tout compris",
              arrow: "→",
              decision: "Choix stack low-code (WeWeb + Xano)",
              detail: "Le budget contraint oriente vers une stack low-code pour réduire les coûts de développement tout en gardant la flexibilité.",
              color: "bg-[#fff7ed] border-[#fed7aa]",
            },
            {
              question: "Q4.5",
              label: "Exigences RGPD et sécurité des données",
              response: "Conformité RGPD obligatoire, données sensibles",
              arrow: "→",
              decision: "Hébergement Europe, conformité RGPD",
              detail: "Hébergement des données exclusivement en Europe (Xano EU), chiffrement, droits d'accès par rôle et politique de rétention.",
              color: "bg-[#faf5ff] border-[#e9d5ff]",
            },
          ].map((item, i) => (
            <div key={i} className={`rounded-lg border p-4 ${item.color}`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-[45%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-[#1e293b] text-white px-2 py-0.5 rounded">
                      {item.question}
                    </span>
                    <span className="text-sm font-medium text-[#334155]">{item.label}</span>
                  </div>
                  <p className="text-xs text-[#64748b] italic ml-1">Réponse : &ldquo;{item.response}&rdquo;</p>
                </div>
                <div className="shrink-0 flex items-center justify-center text-xl text-[#94a3b8] font-bold mt-1">
                  {item.arrow}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#334155] mb-1">{item.decision}</p>
                  <p className="text-xs text-[#64748b]">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#f1f5f9] rounded-lg p-3 mt-4 text-xs text-[#475569]">
          <strong>Note :</strong> Les numéros de questions (Q1.3, Q2.2, etc.) correspondent au questionnaire de recueil des besoins administré lors de la phase de cadrage. Le questionnaire complet est disponible dans le livrable 1.
        </div>
      </div>
    </div>
  );
}
