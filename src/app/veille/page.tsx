export default function VeillePage() {
  const categories = [
    {
      titre: "Écosystème des plateformes Low-Code",
      miseAJour: "Février 2026",
      items: [
        {
          theme: "Nouvelles fonctionnalités des outils Low-Code",
          description: "Annonces, mises à jour officielles des plateformes comme WeWeb, Xano, Bubble, FlutterFlow, Retool.",
          sources: [
            { nom: "WeWeb Blog", url: "https://www.weweb.io/blog" },
            { nom: "Xano Community", url: "https://community.xano.com" },
            { nom: "YouTube - WeWeb", url: "https://www.youtube.com/@weweb_io" },
          ],
          avantages: "Permet de rester informé des nouvelles capacités et d'anticiper les évolutions techniques pour les projets clients.",
          consultation: "Newsletter hebdomadaire WeWeb + check Xano Community chaque lundi matin.",
        },
        {
          theme: "Évolutions des bonnes pratiques de développement Low-Code",
          description: "Recommandations pour structurer les projets, organiser les workflows et assurer la maintenabilité.",
          sources: [
            { nom: "No-Code / Low-Code France (Slack)", url: "https://nocode-france.slack.com" },
            { nom: "r/nocode (Reddit)", url: "https://www.reddit.com/r/nocode" },
            { nom: "Medium - Low Code", url: "https://medium.com/tag/low-code" },
          ],
          avantages: "Évite les anti-patterns et améliore la qualité des livrables Low-Code.",
          consultation: "Veille passive via Slack + lecture Reddit 1x/semaine.",
        },
        {
          theme: "Nouvelles bibliothèques, plugins et intégrations",
          description: "Extensions, connecteurs natifs et APIs externes pour enrichir les applications Low-Code.",
          sources: [
            { nom: "Product Hunt", url: "https://www.producthunt.com" },
            { nom: "WeWeb Marketplace", url: "https://www.weweb.io/marketplace" },
            { nom: "RapidAPI Hub", url: "https://rapidapi.com/hub" },
          ],
          avantages: "Découvrir des outils qui font gagner du temps et enrichissent les projets sans développement custom.",
          consultation: "Product Hunt Daily Digest (email quotidien) + check marketplace mensuel.",
        },
        {
          theme: "Sécurité des applications Low-Code",
          description: "Menaces et bonnes pratiques pour protéger les données, gérer les rôles et assurer la conformité RGPD.",
          sources: [
            { nom: "OWASP Low-Code/No-Code Security", url: "https://owasp.org/www-project-top-10-low-code-no-code-security-risks/" },
            { nom: "CNIL - RGPD", url: "https://www.cnil.fr" },
            { nom: "Xano Security Docs", url: "https://docs.xano.com/security" },
          ],
          avantages: "Garantir la sécurité des applications déployées et la conformité réglementaire.",
          consultation: "Veille mensuelle OWASP + check CNIL lors de chaque nouveau projet.",
        },
        {
          theme: "Performance des applications Low-Code",
          description: "Recommandations pour optimiser la vitesse, les requêtes API et les bases de données.",
          sources: [
            { nom: "Web.dev (Google)", url: "https://web.dev" },
            { nom: "Xano Performance Tips", url: "https://docs.xano.com" },
            { nom: "YouTube - Nocodelytics", url: "https://www.youtube.com/@nocodelytics" },
          ],
          avantages: "Livrer des applications rapides et améliorer l'expérience utilisateur finale.",
          consultation: "Check web.dev lors du lancement d'un projet + vidéo Nocodelytics 1x/mois.",
        },
      ],
    },
    {
      titre: "Intelligence artificielle et automatisation",
      miseAJour: "Janvier 2026",
      items: [
        {
          theme: "Études de cas IA dans le développement Low-Code",
          description: "Exemples concrets d'intégration de GPT ou autres IA pour automatiser des tâches ou améliorer l'UX.",
          sources: [
            { nom: "AI News (The Rundown)", url: "https://www.therundown.ai" },
            { nom: "YouTube - Liam Ottley", url: "https://www.youtube.com/@LiamOttley" },
            { nom: "Twitter/X - #AINoCode", url: "https://twitter.com/search?q=%23AINoCode" },
          ],
          avantages: "Identifier des cas d'usage concrets pour proposer des fonctionnalités IA aux clients.",
          consultation: "Newsletter The Rundown (quotidienne) + 1 vidéo/semaine.",
        },
        {
          theme: "Impact de l'IA sur le métier de développeur Low-Code",
          description: "Impact des avancées IA sur les compétences attendues et l'évolution du rôle du développeur.",
          sources: [
            { nom: "Gartner Insights", url: "https://www.gartner.com/en/topics/low-code" },
            { nom: "Forrester Blog", url: "https://www.forrester.com/blogs/category/low-code/" },
            { nom: "LinkedIn - Low Code Leaders", url: "https://www.linkedin.com/groups/13959187/" },
          ],
          avantages: "Anticiper les évolutions du métier et adapter ses compétences en conséquence.",
          consultation: "Rapport Gartner annuel + veille LinkedIn passive.",
        },
        {
          theme: "Nouveaux outils d'automatisation",
          description: "Make, Zapier, n8n et autres solutions pour connecter des services et automatiser des workflows.",
          sources: [
            { nom: "Make (ex-Integromat)", url: "https://www.make.com/en/blog" },
            { nom: "n8n Blog", url: "https://blog.n8n.io" },
            { nom: "YouTube - Automation Town", url: "https://www.youtube.com/@AutomationTown" },
          ],
          avantages: "Proposer des workflows automatisés aux clients pour réduire les tâches manuelles.",
          consultation: "Blog Make et n8n bi-mensuel + vidéos à la demande.",
        },
      ],
    },
    {
      titre: "Technologies utilisées dans les applications",
      miseAJour: "Février 2026",
      items: [
        {
          theme: "Intégration de paiements et transactions",
          description: "APIs Stripe, PayPal pour gérer les paiements, abonnements et webhooks sécurisés.",
          sources: [
            { nom: "Stripe Blog", url: "https://stripe.com/blog" },
            { nom: "Stripe Docs Changelog", url: "https://stripe.com/docs/changelog" },
            { nom: "Dev.to - #payments", url: "https://dev.to/t/payments" },
          ],
          avantages: "Rester à jour sur les fonctionnalités de paiement pour les intégrer efficacement.",
          consultation: "Changelog Stripe à chaque projet e-commerce + blog mensuel.",
        },
        {
          theme: "Fonctionnalités d'emailing et de communication",
          description: "Outils et bonnes pratiques pour les emails transactionnels et notifications.",
          sources: [
            { nom: "Brevo (ex-Sendinblue) Blog", url: "https://www.brevo.com/blog/" },
            { nom: "SendGrid Docs", url: "https://docs.sendgrid.com/" },
            { nom: "Mailchimp Resources", url: "https://mailchimp.com/resources/" },
          ],
          avantages: "Implémenter des systèmes de notifications et d'emailing fiables et performants.",
          consultation: "Check documentation à chaque intégration email.",
        },
        {
          theme: "Gestion des utilisateurs et authentification",
          description: "Solutions pour l'authentification avancée, les rôles et la personnalisation UX.",
          sources: [
            { nom: "Auth0 Blog", url: "https://auth0.com/blog" },
            { nom: "Supabase Auth Docs", url: "https://supabase.com/docs/guides/auth" },
            { nom: "WeWeb Auth Documentation", url: "https://docs.weweb.io/auth" },
          ],
          avantages: "Sécuriser les applications et proposer des expériences de connexion modernes (SSO, OAuth).",
          consultation: "Documentation Auth0/Supabase lors de la mise en place de l'auth sur un projet.",
        },
        {
          theme: "Gestion des bases de données et workflows",
          description: "Mises à jour sur Xano, Supabase, Airtable, Firebase pour structurer les données.",
          sources: [
            { nom: "Xano Changelog", url: "https://xano.com/changelog" },
            { nom: "Supabase Blog", url: "https://supabase.com/blog" },
            { nom: "Firebase Release Notes", url: "https://firebase.google.com/support/releases" },
          ],
          avantages: "Exploiter les nouvelles fonctionnalités BDD pour optimiser les performances.",
          consultation: "Changelog Xano à chaque mise à jour + Supabase blog bi-mensuel.",
        },
      ],
    },
    {
      titre: "Gestion de projet",
      miseAJour: "Décembre 2025",
      items: [
        {
          theme: "Product management et priorisation du backlog en Low-Code",
          description: "Méthodes pour organiser les fonctionnalités, définir les priorités et planifier les livraisons.",
          sources: [
            { nom: "Scrum.org Blog", url: "https://www.scrum.org/resources/blog" },
            { nom: "Mind the Product", url: "https://www.mindtheproduct.com" },
            { nom: "YouTube - Scrum Life", url: "https://www.youtube.com/@ScrumLife" },
          ],
          avantages: "Améliorer la gestion de projet et la collaboration avec les clients.",
          consultation: "Articles Mind the Product hebdo + vidéos Scrum Life à la demande.",
        },
      ],
    },
  ];

  const articlesRecents = [
    {
      titre: "WeWeb 2.0 : les nouvelles fonctionnalités qui changent la donne pour les développeurs Low-Code",
      source: "WeWeb Blog",
      date: "18 février 2026",
      url: "https://www.weweb.io/blog",
    },
    {
      titre: "Comment l'IA générative transforme le développement d'applications CRM en 2026",
      source: "Gartner Insights",
      date: "5 février 2026",
      url: "https://www.gartner.com/en/topics/low-code",
    },
    {
      titre: "Xano dévoile son nouveau moteur de requêtes : performances multipliées par 3",
      source: "Xano Community",
      date: "22 janvier 2026",
      url: "https://community.xano.com",
    },
    {
      titre: "RGPD et Low-Code : les 10 erreurs les plus fréquentes à éviter en 2026",
      source: "CNIL - Guide pratique",
      date: "10 janvier 2026",
      url: "https://www.cnil.fr",
    },
    {
      titre: "n8n vs Make en 2026 : quel outil d'automatisation choisir pour vos workflows CRM ?",
      source: "n8n Blog",
      date: "3 janvier 2026",
      url: "https://blog.n8n.io",
    },
    {
      titre: "Stripe lance de nouvelles APIs pour simplifier l'intégration des paiements récurrents",
      source: "Stripe Blog",
      date: "12 décembre 2025",
      url: "https://stripe.com/blog",
    },
  ];

  // Build a running counter for theme numbering across all categories
  let themeCounter = 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Tableau de veille technologique
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 6 — Système de veille métier et technique pour le domaine Low-Code / CRM
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold mb-2">Objectif de la veille</h2>
        <p className="text-sm text-[#475569]">
          Maintenir une veille active sur les technologies Low-Code, les outils CRM,
          l'IA et l'automatisation, ainsi que les bonnes pratiques de gestion de projet.
          Cette veille permet de rester compétitif, d'anticiper les évolutions du marché
          et de proposer des solutions à jour aux clients.
        </p>
      </div>

      {categories.map((cat, ci) => (
        <div key={ci} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
              {cat.titre}
            </h2>
            <span className="text-xs text-[#94a3b8] bg-[#f1f5f9] px-3 py-1 rounded-full">
              Dernière mise à jour : {cat.miseAJour}
            </span>
          </div>
          <div className="space-y-4">
            {cat.items.map((item, ii) => {
              themeCounter++;
              const currentNumber = themeCounter;
              return (
                <div key={ii} className="bg-white rounded-lg border border-[#e2e8f0] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-[#3b82f6]">
                        Thème {currentNumber}
                      </span>
                      <h3 className="font-semibold text-[#334155] mt-1">
                        {item.theme}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748b] mb-4">{item.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                        Sources
                      </h4>
                      <ul className="space-y-1">
                        {item.sources.map((s, si) => (
                          <li key={si} className="text-sm text-[#3b82f6]">
                            {s.nom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                        Avantages
                      </h4>
                      <p className="text-sm text-[#475569]">{item.avantages}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                        Mode de consultation
                      </h4>
                      <p className="text-sm text-[#475569]">{item.consultation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Articles récents */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
          Articles récents
        </h2>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
          <p className="text-sm text-[#64748b] mb-4">
            Sélection d'articles et publications récents en lien avec la veille technologique Low-Code, CRM et IA.
          </p>
          <div className="space-y-3">
            {articlesRecents.map((article, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex-1">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#334155] hover:text-[#3b82f6] transition-colors"
                  >
                    {article.titre}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#3b82f6]">{article.source}</span>
                    <span className="text-xs text-[#94a3b8]">•</span>
                    <span className="text-xs text-[#94a3b8]">{article.date}</span>
                  </div>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#3b82f6] hover:text-[#2563eb] whitespace-nowrap ml-4 mt-1"
                >
                  Lire &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
