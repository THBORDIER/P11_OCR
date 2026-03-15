export default function CommunicationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Plan de communication client
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 7 — Organisation du suivi professionnel avec Spart tout au long du projet
        </p>
      </div>

      {/* Parties prenantes */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Parties prenantes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Partie prenante</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Rôle dans le projet</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Implication</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Canal préféré</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  nom: "Directeur commercial (Sponsor)",
                  role: "Valide les orientations stratégiques, arbitre les priorités, signe les livrables",
                  implication: "Haute",
                  canal: "Réunion mensuelle + email",
                },
                {
                  nom: "Chef de projet IT",
                  role: "Interlocuteur technique principal, coordonne les aspects infra et intégration",
                  implication: "Haute",
                  canal: "Réunion hebdo + Slack/Teams",
                },
                {
                  nom: "Référents métier (1 par équipe)",
                  role: "Fournissent les besoins métier, valident les user stories, testent les livrables",
                  implication: "Moyenne",
                  canal: "Réunion de sprint + email",
                },
                {
                  nom: "Commerciaux (utilisateurs finaux)",
                  role: "Utilisateurs principaux du CRM, participent aux tests et retours",
                  implication: "Faible (ponctuelle)",
                  canal: "Démo de sprint + formation",
                },
                {
                  nom: "Thomas Bordier (Développeur)",
                  role: "Cadrage, développement, déploiement, formation, suivi post-déploiement",
                  implication: "Haute",
                  canal: "Tous canaux",
                },
              ].map((p, i) => (
                <tr key={i} className="border-b border-[#f1f5f9]">
                  <td className="py-3 px-4 font-medium text-[#334155]">{p.nom}</td>
                  <td className="py-3 px-4 text-[#475569]">{p.role}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      p.implication === "Haute"
                        ? "bg-[#fef2f2] text-[#dc2626]"
                        : p.implication === "Moyenne"
                        ? "bg-[#fff7ed] text-[#ea580c]"
                        : "bg-[#f0f9ff] text-[#0284c7]"
                    }`}>
                      {p.implication}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">{p.canal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rituels de communication */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Rituels de communication
        </h2>
        <div className="space-y-4">
          {[
            {
              rituel: "Point hebdomadaire",
              frequence: "Chaque lundi, 30 min",
              participants: "Thomas + Chef de projet IT",
              objectif: "Faire le point sur l'avancement du sprint, lever les blocages, ajuster les priorités si nécessaire.",
              format: "Visio (Teams/Google Meet)",
              livrable: "Compte-rendu email envoyé dans la journée",
            },
            {
              rituel: "Sprint Review / Démo",
              frequence: "Toutes les 2-3 semaines (fin de sprint)",
              participants: "Thomas + Chef de projet IT + Référents métier + Sponsor",
              objectif: "Présenter les fonctionnalités développées pendant le sprint. Recueillir les retours. Valider ou ajuster.",
              format: "Visio ou présentiel (1h)",
              livrable: "Fonctionnalités démontrées + feedback documenté",
            },
            {
              rituel: "Sprint Planning",
              frequence: "Début de chaque sprint",
              participants: "Thomas + Chef de projet IT + Référent métier concerné",
              objectif: "Définir le contenu du prochain sprint, valider les user stories, estimer l'effort.",
              format: "Visio (1h)",
              livrable: "Sprint Backlog validé",
            },
            {
              rituel: "Comité de pilotage",
              frequence: "Mensuel",
              participants: "Thomas + Sponsor (Directeur commercial) + Chef de projet IT",
              objectif: "Vision macro du projet : avancement global, respect du planning et du budget, décisions stratégiques.",
              format: "Réunion formelle (1h)",
              livrable: "Dashboard projet + décisions documentées",
            },
            {
              rituel: "Point ad hoc (urgences)",
              frequence: "À la demande",
              participants: "Thomas + interlocuteur concerné",
              objectif: "Résoudre un blocage technique ou fonctionnel urgent sans attendre le point hebdo.",
              format: "Appel Teams/Slack ou email urgent",
              livrable: "Résolution documentée dans le suivi de projet",
            },
          ].map((r, i) => (
            <div key={i} className="bg-[#f8fafc] rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#334155]">{r.rituel}</h3>
                <span className="text-xs bg-[#eff6ff] text-[#3b82f6] px-3 py-1 rounded-full font-medium">
                  {r.frequence}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-bold text-[#64748b] uppercase">Participants</span>
                  <p className="text-[#475569] mt-1">{r.participants}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#64748b] uppercase">Format</span>
                  <p className="text-[#475569] mt-1">{r.format}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#64748b] uppercase">Objectif</span>
                  <p className="text-[#475569] mt-1">{r.objectif}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#64748b] uppercase">Livrable</span>
                  <p className="text-[#475569] mt-1">{r.livrable}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canaux de communication */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Canaux de communication
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              canal: "Email",
              usage: "Communication formelle, comptes-rendus, validations, partage de documents.",
              regle: "Réponse sous 24h ouvrables. Objet clair avec préfixe [SpartCRM].",
            },
            {
              canal: "Teams / Slack",
              usage: "Échanges rapides, questions ponctuelles, partage de liens, coordination quotidienne.",
              regle: "Canal dédié #spartcrm-projet. Pas de décisions importantes par chat (confirmer par email).",
            },
            {
              canal: "Visio (Teams / Google Meet)",
              usage: "Points hebdo, sprint reviews, sprint planning, comités de pilotage.",
              regle: "Invitation envoyée 48h à l'avance avec ordre du jour. Enregistrement si accord.",
            },
            {
              canal: "Outil de gestion de projet (Notion)",
              usage: "Suivi du backlog, roadmap, documentation technique, base de connaissances.",
              regle: "Source de vérité unique pour le suivi de projet. Mis à jour en continu.",
            },
          ].map((c, i) => (
            <div key={i} className="bg-[#f8fafc] rounded-lg p-4">
              <h3 className="font-semibold text-[#334155] mb-2">{c.canal}</h3>
              <p className="text-sm text-[#475569] mb-2">{c.usage}</p>
              <p className="text-xs text-[#64748b] italic">{c.regle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendrier de communication — Phase de cadrage */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Calendrier de communication — Phase de cadrage (Mois 1)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Semaine</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Action</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Avec qui</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Livrable</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  semaine: "S1",
                  action: "Réunion de lancement (kickoff)",
                  avec: "Sponsor + Chef de projet IT + Référents",
                  livrable: "CR kickoff + planning validé",
                },
                {
                  semaine: "S1",
                  action: "Envoi du questionnaire de recueil de besoins",
                  avec: "Sponsor",
                  livrable: "Questionnaire (lien + PDF)",
                },
                {
                  semaine: "S2",
                  action: "Réception et analyse des retours client",
                  avec: "Thomas (interne)",
                  livrable: "Document d'analyse structuré",
                },
                {
                  semaine: "S2",
                  action: "Réunion de validation des besoins",
                  avec: "Sponsor + Chef de projet IT",
                  livrable: "Besoins validés + points clarifiés",
                },
                {
                  semaine: "S3",
                  action: "Présentation de la roadmap et du Product Backlog",
                  avec: "Sponsor + Chef de projet IT + Référents",
                  livrable: "Roadmap + Product Backlog validés",
                },
                {
                  semaine: "S3-4",
                  action: "Sprint Planning Sprint 1",
                  avec: "Chef de projet IT + Référent métier",
                  livrable: "Sprint Backlog Sprint 1",
                },
                {
                  semaine: "S4",
                  action: "Comité de pilotage M1",
                  avec: "Sponsor + Chef de projet IT",
                  livrable: "Bilan phase cadrage + lancement dév",
                },
              ].map((e, i) => (
                <tr key={i} className="border-b border-[#f1f5f9]">
                  <td className="py-3 px-4 font-bold text-[#3b82f6]">{e.semaine}</td>
                  <td className="py-3 px-4 font-medium text-[#334155]">{e.action}</td>
                  <td className="py-3 px-4 text-[#475569]">{e.avec}</td>
                  <td className="py-3 px-4 text-[#475569]">{e.livrable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendrier de communication — Phase de développement */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Calendrier de communication — Phase de développement (Mois 2-6)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Période</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Action</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Avec qui</th>
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Livrable</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  periode: "M2",
                  action: "Sprint 1 Planning — Module Clients & Prospects",
                  avec: "Chef de projet IT + Référent métier",
                  livrable: "Sprint Backlog Sprint 1 validé",
                },
                {
                  periode: "M2",
                  action: "Sprint 1 Review / Démo",
                  avec: "Sponsor + Chef de projet IT + Référents métier",
                  livrable: "Module Clients livré + feedback documenté",
                },
                {
                  periode: "M3",
                  action: "Sprint 2 Planning — Pipeline commercial (Kanban)",
                  avec: "Chef de projet IT + Référent métier",
                  livrable: "Sprint Backlog Sprint 2 validé",
                },
                {
                  periode: "M3",
                  action: "Sprint 2 Review / Démo + Comité de pilotage M3",
                  avec: "Sponsor + Chef de projet IT + Référents métier",
                  livrable: "Pipeline Kanban livré + dashboard projet",
                },
                {
                  periode: "M3-4",
                  action: "Sprint 3 Planning — Tâches & Rappels",
                  avec: "Chef de projet IT + Référent métier",
                  livrable: "Sprint Backlog Sprint 3 validé",
                },
                {
                  periode: "M4",
                  action: "Sprint 3 Review / Démo — MVP atteint",
                  avec: "Sponsor + Chef de projet IT + Référents métier + Utilisateurs pilotes",
                  livrable: "MVP validé + décision déploiement pilote",
                },
                {
                  periode: "M4-5",
                  action: "Sprint 4 Planning & Review — Tableau de bord & Reporting",
                  avec: "Sponsor + Chef de projet IT + Direction",
                  livrable: "Dashboard & reporting livrés + feedback",
                },
                {
                  periode: "M5",
                  action: "Sprint 5 Planning — Intégrations & Migration",
                  avec: "Chef de projet IT + Référents métier",
                  livrable: "Sprint Backlog Sprint 5 validé",
                },
                {
                  periode: "M5-6",
                  action: "Sprint 5 Review + Déploiement pilote (20 utilisateurs)",
                  avec: "Sponsor + Chef de projet IT + Utilisateurs pilotes",
                  livrable: "Intégrations livrées + retours pilote documentés",
                },
                {
                  periode: "M6",
                  action: "Formation utilisateurs + Généralisation + Bilan final",
                  avec: "Sponsor + Chef de projet IT + Tous utilisateurs",
                  livrable: "Supports de formation + PV de recette + bilan de projet",
                },
              ].map((e, i) => (
                <tr key={i} className="border-b border-[#f1f5f9]">
                  <td className="py-3 px-4 font-bold text-[#8b5cf6]">{e.periode}</td>
                  <td className="py-3 px-4 font-medium text-[#334155]">{e.action}</td>
                  <td className="py-3 px-4 text-[#475569]">{e.avec}</td>
                  <td className="py-3 px-4 text-[#475569]">{e.livrable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gestion des escalades */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Gestion des escalades
        </h2>
        <div className="space-y-3">
          {[
            {
              niveau: "Niveau 1",
              type: "Blocage opérationnel",
              action: "Point direct avec le Chef de projet IT via Teams/Slack.",
              delai: "Résolution sous 24h",
              color: "border-l-[#22c55e]",
            },
            {
              niveau: "Niveau 2",
              type: "Blocage fonctionnel ou décision métier",
              action: "Réunion d'arbitrage avec le Chef de projet IT + Référent métier concerné.",
              delai: "Résolution sous 48h",
              color: "border-l-[#f59e0b]",
            },
            {
              niveau: "Niveau 3",
              type: "Blocage stratégique ou budgétaire",
              action: "Escalade au Sponsor (Directeur commercial). Réunion exceptionnelle si nécessaire.",
              delai: "Résolution sous 1 semaine",
              color: "border-l-[#ef4444]",
            },
          ].map((e, i) => (
            <div key={i} className={`bg-[#f8fafc] rounded-lg border-l-4 ${e.color} p-4`}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-[#64748b]">{e.niveau}</span>
                <span className="font-medium text-[#334155] text-sm">{e.type}</span>
              </div>
              <p className="text-sm text-[#475569]">{e.action}</p>
              <p className="text-xs text-[#94a3b8] mt-1">{e.delai}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conduite du changement */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Conduite du changement
        </h2>
        <div className="space-y-4">
          {[
            {
              phase: "Phase 1 — Sensibilisation",
              periode: "M1-M2",
              actions: [
                "Communication sur le projet auprès de toutes les équipes",
                "Présentation des bénéfices attendus (gain de temps, vision 360° client, pilotage commercial)",
                "Identification des ambassadeurs par équipe (1 référent par service)",
              ],
              color: "border-l-[#3b82f6]",
            },
            {
              phase: "Phase 2 — Accompagnement",
              periode: "M3-M4",
              actions: [
                "Formations par rôle : commerciaux (saisie, pipeline), managers (reporting, KPIs), support (tickets, FAQ)",
                "Documentation utilisateur : guides pas-à-pas, vidéos courtes, fiches réflexes",
                "FAQ en ligne mise à jour en continu sur Notion",
              ],
              color: "border-l-[#8b5cf6]",
            },
            {
              phase: "Phase 3 — Déploiement progressif",
              periode: "M4-M5",
              actions: [
                "Pilote avec 20 utilisateurs volontaires sur le périmètre MVP",
                "Collecte de feedback structuré (questionnaire + entretiens courts)",
                "Ajustements UX et fonctionnels avant généralisation",
              ],
              color: "border-l-[#f59e0b]",
            },
            {
              phase: "Phase 4 — Généralisation",
              periode: "M5-M6",
              actions: [
                "Déploiement à tous les utilisateurs (formation collective + accès progressif)",
                "Support renforcé pendant 2 semaines (permanence Teams, hotline dédiée)",
                "Suivi du taux d'adoption et accompagnement des retardataires",
              ],
              color: "border-l-[#22c55e]",
            },
          ].map((p, i) => (
            <div key={i} className={`bg-[#f8fafc] rounded-lg border-l-4 ${p.color} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#334155]">{p.phase}</h3>
                <span className="text-xs bg-[#eff6ff] text-[#3b82f6] px-3 py-1 rounded-full font-medium">
                  {p.periode}
                </span>
              </div>
              <ul className="space-y-1.5">
                {p.actions.map((a, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#475569]">
                    <span className="text-[#94a3b8] mt-0.5">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* KPIs de conduite du changement */}
        <div className="mt-5 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-4">
          <h3 className="text-sm font-semibold text-[#166534] mb-3">
            KPIs de conduite du changement
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                kpi: "Taux d'adoption",
                cible: "90% à M+3",
                detail: "Pourcentage d'utilisateurs actifs sur le CRM",
              },
              {
                kpi: "Satisfaction utilisateur",
                cible: "> 4/5",
                detail: "Score moyen sur questionnaire de satisfaction post-déploiement",
              },
              {
                kpi: "Tickets de support",
                cible: "-50%",
                detail: "Réduction de 50% des tickets de support entre M+1 et M+3",
              },
            ].map((k, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-bold text-[#166534]">{k.cible}</p>
                <p className="text-sm font-medium text-[#334155]">{k.kpi}</p>
                <p className="text-xs text-[#64748b] mt-1">{k.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processus de validation (DoD / Acceptation) */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Processus de validation des livrables
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          Chaque livrable suit un processus de validation en 3 étapes avant d'être considéré comme terminé.
        </p>
        <div className="space-y-4">
          {[
            {
              etape: "1",
              titre: "Revue interne (Thomas)",
              description: "Vérification technique, exécution des tests unitaires et d'intégration, contrôle qualité du code, vérification de la documentation.",
              criteres: "Code reviewé, tests passés (couverture > 80%), pas de régression, documentation technique à jour",
              color: "bg-[#dbeafe] text-[#2563eb]",
            },
            {
              etape: "2",
              titre: "Validation fonctionnelle (Chef de projet IT + Référent métier)",
              description: "Vérification de la conformité aux critères d'acceptation définis dans les user stories. Tests sur environnement de staging.",
              criteres: "Tous les critères d'acceptation validés, parcours utilisateur testé, performance acceptable",
              color: "bg-[#fef3c7] text-[#d97706]",
            },
            {
              etape: "3",
              titre: "Approbation finale (Sponsor)",
              description: "Validation formelle du livrable après démonstration en sprint review. Signature du PV de recette si applicable.",
              criteres: "Démo réalisée, feedback intégré, PV de recette signé, livrable accepté formellement",
              color: "bg-[#fef2f2] text-[#dc2626]",
            },
          ].map((e, i) => (
            <div key={i} className="bg-[#f8fafc] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${e.color}`}>
                  {e.etape}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#334155] mb-1">{e.titre}</h3>
                  <p className="text-sm text-[#475569] mb-2">{e.description}</p>
                  <div className="bg-white rounded border border-[#e2e8f0] px-3 py-2">
                    <span className="text-xs font-bold text-[#64748b] uppercase">Critères</span>
                    <p className="text-xs text-[#475569] mt-0.5">{e.criteres}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Definition of Done */}
        <div className="mt-5 bg-[#faf5ff] rounded-lg border border-[#e9d5ff] p-4">
          <h3 className="text-sm font-semibold text-[#7c3aed] mb-3">
            Definition of Done (DoD) des livrables
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#6b21a8]">
            {[
              "Documentation à jour (technique + utilisateur)",
              "Tests passés (unitaires, intégration, acceptance)",
              "Démo réalisée en sprint review",
              "Feedback client intégré ou priorisé dans le backlog",
              "Code mergé sur la branche principale",
              "Déployé sur l'environnement de staging",
              "Critères d'acceptation validés par le référent métier",
              "Pas de bug bloquant ou majeur ouvert",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5">&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cycle de communication visuel */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Cycle de communication projet
        </h2>
        <p className="text-sm text-[#64748b] mb-5">
          Le projet suit un cycle itératif Agile où chaque sprint génère un flux de communication continu entre les parties prenantes.
        </p>
        <div className="flex items-center justify-center flex-wrap gap-2 py-4">
          {[
            { label: "Besoin identifié", color: "bg-[#dbeafe] text-[#2563eb] border-[#93c5fd]" },
            { label: "Backlog", color: "bg-[#fef3c7] text-[#d97706] border-[#fcd34d]" },
            { label: "Sprint Planning", color: "bg-[#ede9fe] text-[#7c3aed] border-[#c4b5fd]" },
            { label: "Développement", color: "bg-[#fce7f3] text-[#db2777] border-[#f9a8d4]" },
            { label: "Sprint Review", color: "bg-[#d1fae5] text-[#059669] border-[#6ee7b7]" },
            { label: "Feedback", color: "bg-[#ffedd5] text-[#ea580c] border-[#fdba74]" },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold ${step.color}`}>
                {step.label}
              </div>
              <span className="text-[#94a3b8] text-lg font-bold">
                {i < arr.length - 1 ? "→" : "→"}
              </span>
            </div>
          ))}
          <div className="px-4 py-2 rounded-lg border-2 text-sm font-semibold bg-[#fef3c7] text-[#d97706] border-[#fcd34d]">
            Backlog
          </div>
          <span className="text-xs text-[#64748b] font-medium ml-2">(cycle)</span>
        </div>
        <div className="mt-4 bg-[#f8fafc] rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs font-bold text-[#64748b] uppercase">Entrée du cycle</span>
              <p className="text-[#475569] mt-1">Nouveau besoin ou retour utilisateur identifié lors d'une réunion, d'un test ou d'un échange.</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748b] uppercase">Boucle de feedback</span>
              <p className="text-[#475569] mt-1">Chaque sprint review génère du feedback qui alimente le backlog pour le sprint suivant.</p>
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748b] uppercase">Amélioration continue</span>
              <p className="text-[#475569] mt-1">Le cycle garantit que les priorités sont ajustées en continu selon les retours des parties prenantes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matrice RACI */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
          Matrice RACI
        </h2>
        <p className="text-sm text-[#64748b] mb-4">
          <strong>R</strong> = Responsable (réalise) · <strong>A</strong> = Accountable (approuve) · <strong>C</strong> = Consulté · <strong>I</strong> = Informé
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="text-left py-3 px-4 font-medium text-[#64748b]">Activité</th>
                <th className="text-center py-3 px-4 font-medium text-[#64748b]">Thomas Bordier</th>
                <th className="text-center py-3 px-4 font-medium text-[#64748b]">Sponsor</th>
                <th className="text-center py-3 px-4 font-medium text-[#64748b]">Chef de projet IT</th>
                <th className="text-center py-3 px-4 font-medium text-[#64748b]">Référents métier</th>
                <th className="text-center py-3 px-4 font-medium text-[#64748b]">Utilisateurs</th>
              </tr>
            </thead>
            <tbody>
              {[
                { activite: "Cadrage des besoins", thomas: "R", sponsor: "A", chef: "C", referents: "C", utilisateurs: "I" },
                { activite: "Développement", thomas: "R", sponsor: "I", chef: "A", referents: "C", utilisateurs: "I" },
                { activite: "Tests fonctionnels", thomas: "R", sponsor: "I", chef: "A", referents: "R", utilisateurs: "C" },
                { activite: "Validation des livrables", thomas: "C", sponsor: "A", chef: "R", referents: "C", utilisateurs: "I" },
                { activite: "Formation", thomas: "R", sponsor: "I", chef: "A", referents: "C", utilisateurs: "R" },
                { activite: "Déploiement", thomas: "R", sponsor: "A", chef: "R", referents: "I", utilisateurs: "I" },
                { activite: "Support post-go-live", thomas: "R", sponsor: "I", chef: "A", referents: "C", utilisateurs: "C" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#f1f5f9]">
                  <td className="py-3 px-4 font-medium text-[#334155]">{row.activite}</td>
                  {[row.thomas, row.sponsor, row.chef, row.referents, row.utilisateurs].map((val, j) => (
                    <td key={j} className="py-3 px-4 text-center">
                      <span className={`inline-block w-7 h-7 leading-7 rounded-full text-xs font-bold ${
                        val === "R"
                          ? "bg-[#dbeafe] text-[#2563eb]"
                          : val === "A"
                          ? "bg-[#fef2f2] text-[#dc2626]"
                          : val === "C"
                          ? "bg-[#fff7ed] text-[#ea580c]"
                          : "bg-[#f1f5f9] text-[#94a3b8]"
                      }`}>
                        {val}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Règles de communication */}
      <div className="bg-[#eff6ff] rounded-lg border border-[#bfdbfe] p-6">
        <h2 className="text-lg font-semibold text-[#1e40af] mb-4">
          Règles de communication
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm text-[#1e40af]">
          {[
            "Toute décision importante est confirmée par écrit (email ou Notion)",
            "Les comptes-rendus sont envoyés sous 24h après chaque réunion",
            "Le Product Backlog est la source de vérité pour le périmètre fonctionnel",
            "Tout changement de périmètre passe par le Chef de projet IT avant arbitrage",
            "Les retours sur les démos sont documentés et priorisés dans le backlog",
            "Le préfixe [SpartCRM] est utilisé dans tous les emails du projet",
            "Les accès aux outils (Notion, staging) sont partagés dès le kickoff",
            "Un rapport d'avancement visuel est partagé avant chaque comité de pilotage",
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5">&#10003;</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
