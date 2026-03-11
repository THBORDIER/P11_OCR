"use client";

import { useState } from "react";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type Source = { nom: string; url: string };
type Theme = {
  theme: string;
  description: string;
  sources: Source[];
  avantages: string;
  consultation: string;
  utiliseDansProjet?: boolean;
  apprentissage?: string;
};
type Categorie = {
  titre: string;
  miseAJour: string;
  items: Theme[];
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ DonnÃ©es â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const categories: Categorie[] = [
  {
    titre: "Ã‰cosystÃ¨me des plateformes Low-Code",
    miseAJour: "FÃ©vrier 2026",
    items: [
      {
        theme: "Nouvelles fonctionnalitÃ©s des outils Low-Code",
        description:
          "Annonces, mises Ã  jour officielles des plateformes comme WeWeb, Xano, Bubble, FlutterFlow, Retool.",
        sources: [
          { nom: "WeWeb Blog", url: "https://www.weweb.io/blog" },
          { nom: "Xano Community", url: "https://community.xano.com" },
          { nom: "YouTube - WeWeb", url: "https://www.youtube.com/@weweb" },
        ],
        avantages:
          "Permet de rester informÃ© des nouvelles capacitÃ©s et d'anticiper les Ã©volutions techniques pour les projets clients.",
        consultation:
          "Newsletter hebdomadaire WeWeb + check Xano Community chaque lundi matin.",
        utiliseDansProjet: true,
        apprentissage:
          "DÃ©couverte du systÃ¨me de composants rÃ©utilisables WeWeb 2.0, appliquÃ© pour structurer les vues Contact et Pipeline de SpartCRM.",
      },
      {
        theme: "Ã‰volutions des bonnes pratiques de dÃ©veloppement Low-Code",
        description:
          "Recommandations pour structurer les projets, organiser les workflows et assurer la maintenabilitÃ©.",
        sources: [
          {
            nom: "No-Code / Low-Code France (Slack)",
            url: "https://nocode-france.slack.com",
          },
          { nom: "r/nocode (Reddit)", url: "https://www.reddit.com/r/nocode" },
          {
            nom: "Medium - Low Code",
            url: "https://medium.com/tag/low-code",
          },
        ],
        avantages:
          "Ã‰vite les anti-patterns et amÃ©liore la qualitÃ© des livrables Low-Code.",
        consultation: "Veille passive via Slack + lecture Reddit 1x/semaine.",
      },
      {
        theme: "Nouvelles bibliothÃ¨ques, plugins et intÃ©grations",
        description:
          "Extensions, connecteurs natifs et APIs externes pour enrichir les applications Low-Code.",
        sources: [
          { nom: "Product Hunt", url: "https://www.producthunt.com" },
          {
            nom: "WeWeb Marketplace",
            url: "https://www.weweb.io/templates",
          },
          { nom: "RapidAPI Hub", url: "https://rapidapi.com/hub" },
        ],
        avantages:
          "DÃ©couvrir des outils qui font gagner du temps et enrichissent les projets sans dÃ©veloppement custom.",
        consultation:
          "Product Hunt Daily Digest (email quotidien) + check marketplace mensuel.",
      },
      {
        theme: "SÃ©curitÃ© des applications Low-Code",
        description:
          "Menaces et bonnes pratiques pour protÃ©ger les donnÃ©es, gÃ©rer les rÃ´les et assurer la conformitÃ© RGPD.",
        sources: [
          {
            nom: "OWASP Low-Code/No-Code Security",
            url: "https://owasp.org/www-project-citizen-development-top10-security-risks/",
          },
          { nom: "CNIL - RGPD", url: "https://www.cnil.fr" },
          {
            nom: "Xano Security Docs",
            url: "https://docs.xano.com/security",
          },
        ],
        avantages:
          "Garantir la sÃ©curitÃ© des applications dÃ©ployÃ©es et la conformitÃ© rÃ©glementaire.",
        consultation:
          "Veille mensuelle OWASP + check CNIL lors de chaque nouveau projet.",
        utiliseDansProjet: true,
        apprentissage:
          "Application des recommandations OWASP pour le contrÃ´le d'accÃ¨s par rÃ´les (RBAC) dans SpartCRM. VÃ©rification RGPD pour le stockage des donnÃ©es contacts.",
      },
      {
        theme: "Performance des applications Low-Code",
        description:
          "Recommandations pour optimiser la vitesse, les requÃªtes API et les bases de donnÃ©es.",
        sources: [
          { nom: "Web.dev (Google)", url: "https://web.dev" },
          {
            nom: "Xano Performance Tips",
            url: "https://docs.xano.com",
          },
          {
            nom: "YouTube - Nocodelytics (recherche)",
            url: "https://www.youtube.com/results?search_query=nocodelytics",
          },
        ],
        avantages:
          "Livrer des applications rapides et amÃ©liorer l'expÃ©rience utilisateur finale.",
        consultation:
          "Check web.dev lors du lancement d'un projet + vidÃ©o Nocodelytics 1x/mois.",
        utiliseDansProjet: true,
        apprentissage:
          "Adoption de la pagination cÃ´tÃ© serveur (Xano) et du lazy loading pour les listes de contacts dans SpartCRM, suite aux benchmarks web.dev.",
      },
    ],
  },
  {
    titre: "Intelligence artificielle et automatisation",
    miseAJour: "Janvier 2026",
    items: [
      {
        theme: "Ã‰tudes de cas IA dans le dÃ©veloppement Low-Code",
        description:
          "Exemples concrets d'intÃ©gration de GPT ou autres IA pour automatiser des tÃ¢ches ou amÃ©liorer l'UX.",
        sources: [
          {
            nom: "AI News (The Rundown)",
            url: "https://www.therundown.ai",
          },
          {
            nom: "YouTube - Liam Ottley",
            url: "https://www.youtube.com/@LiamOttley",
          },
          {
            nom: "Twitter/X - #AINoCode",
            url: "https://twitter.com/search?q=%23AINoCode",
          },
        ],
        avantages:
          "Identifier des cas d'usage concrets pour proposer des fonctionnalitÃ©s IA aux clients.",
        consultation:
          "Newsletter The Rundown (quotidienne) + 1 vidÃ©o/semaine.",
      },
      {
        theme: "Impact de l'IA sur le mÃ©tier de dÃ©veloppeur Low-Code",
        description:
          "Impact des avancÃ©es IA sur les compÃ©tences attendues et l'Ã©volution du rÃ´le du dÃ©veloppeur.",
        sources: [
          {
            nom: "Gartner Insights",
            url: "https://www.gartner.com/en/topics/low-code",
          },
          {
            nom: "Forrester Blog",
            url: "https://www.forrester.com/blogs/",
          },
          {
            nom: "LinkedIn - Low Code Leaders",
            url: "https://www.linkedin.com/groups/13959187/",
          },
        ],
        avantages:
          "Anticiper les Ã©volutions du mÃ©tier et adapter ses compÃ©tences en consÃ©quence.",
        consultation: "Rapport Gartner annuel + veille LinkedIn passive.",
      },
      {
        theme: "Nouveaux outils d'automatisation",
        description:
          "Make, Zapier, n8n et autres solutions pour connecter des services et automatiser des workflows.",
        sources: [
          {
            nom: "Make (ex-Integromat)",
            url: "https://www.make.com/en/blog",
          },
          { nom: "n8n Blog", url: "https://blog.n8n.io" },
          {
            nom: "YouTube - Automation Town",
            url: "https://www.youtube.com/@AutomationTown",
          },
        ],
        avantages:
          "Proposer des workflows automatisÃ©s aux clients pour rÃ©duire les tÃ¢ches manuelles.",
        consultation: "Blog Make et n8n bi-mensuel + vidÃ©os Ã  la demande.",
        utiliseDansProjet: true,
        apprentissage:
          "Choix de n8n comme outil d'automatisation pour les notifications CRM (relances automatiques, alertes pipeline) grÃ¢ce Ã  son modÃ¨le open-source et sa compatibilitÃ© Xano.",
      },
    ],
  },
  {
    titre: "Technologies utilisÃ©es dans les applications",
    miseAJour: "FÃ©vrier 2026",
    items: [
      {
        theme: "IntÃ©gration de paiements et transactions",
        description:
          "APIs Stripe, PayPal pour gÃ©rer les paiements, abonnements et webhooks sÃ©curisÃ©s.",
        sources: [
          { nom: "Stripe Blog", url: "https://stripe.com/blog" },
          {
            nom: "Stripe Docs Changelog",
            url: "https://stripe.com/docs/changelog",
          },
          { nom: "Dev.to - #payments", url: "https://dev.to/t/payments" },
        ],
        avantages:
          "Rester Ã  jour sur les fonctionnalitÃ©s de paiement pour les intÃ©grer efficacement.",
        consultation:
          "Changelog Stripe Ã  chaque projet e-commerce + blog mensuel.",
      },
      {
        theme: "FonctionnalitÃ©s d'emailing et de communication",
        description:
          "Outils et bonnes pratiques pour les emails transactionnels et notifications.",
        sources: [
          {
            nom: "Brevo (ex-Sendinblue) Blog",
            url: "https://www.brevo.com/blog/",
          },
          { nom: "SendGrid Docs", url: "https://docs.sendgrid.com/" },
          {
            nom: "Mailchimp Resources",
            url: "https://mailchimp.com/resources/",
          },
        ],
        avantages:
          "ImplÃ©menter des systÃ¨mes de notifications et d'emailing fiables et performants.",
        consultation: "Check documentation Ã  chaque intÃ©gration email.",
        utiliseDansProjet: true,
        apprentissage:
          "IntÃ©gration de Brevo pour les emails transactionnels de SpartCRM (confirmation de compte, notifications de deals).",
      },
      {
        theme: "Gestion des utilisateurs et authentification",
        description:
          "Solutions pour l'authentification avancÃ©e, les rÃ´les et la personnalisation UX.",
        sources: [
          { nom: "Auth0 Blog", url: "https://auth0.com/blog" },
          {
            nom: "WeWeb Auth Documentation",
            url: "https://docs.weweb.io",
          },
        ],
        avantages:
          "SÃ©curiser les applications et proposer des expÃ©riences de connexion modernes (SSO, OAuth).",
        consultation:
          "Documentation Auth0 lors de la mise en place de l'auth sur un projet.",
        utiliseDansProjet: true,
        apprentissage:
          "Utilisation du systÃ¨me d'authentification natif WeWeb + Xano Auth pour gÃ©rer les rÃ´les (admin, commercial, manager) dans SpartCRM.",
      },
      {
        theme: "Gestion des bases de donnÃ©es et workflows",
        description:
          "Mises Ã  jour sur Xano, Airtable, Firebase pour structurer les donnÃ©es.",
        sources: [
          { nom: "Xano Changelog", url: "https://xano.com/changelog" },
          {
            nom: "Firebase Release Notes",
            url: "https://firebase.google.com/support/releases",
          },
        ],
        avantages:
          "Exploiter les nouvelles fonctionnalitÃ©s BDD pour optimiser les performances.",
        consultation:
          "Changelog Xano Ã  chaque mise Ã  jour.",
        utiliseDansProjet: true,
        apprentissage:
          "Adoption des filtres natifs Xano plutÃ´t qu'un endpoint custom pour les requÃªtes de recherche contacts, rÃ©duisant le temps de dÃ©veloppement de 40%.",
      },
    ],
  },
  {
    titre: "Gestion de projet",
    miseAJour: "FÃ©vrier 2026",
    items: [
      {
        theme:
          "Product management et priorisation du backlog en Low-Code",
        description:
          "MÃ©thodes pour organiser les fonctionnalitÃ©s, dÃ©finir les prioritÃ©s et planifier les livraisons.",
        sources: [
          {
            nom: "Scrum.org Blog",
            url: "https://www.scrum.org/resources/blog",
          },
          {
            nom: "Mind the Product",
            url: "https://www.mindtheproduct.com",
          },
          {
            nom: "YouTube - Scrum Life",
            url: "https://www.youtube.com/@ScrumLife",
          },
        ],
        avantages:
          "AmÃ©liorer la gestion de projet et la collaboration avec les clients.",
        consultation:
          "Articles Mind the Product hebdo + vidÃ©os Scrum Life Ã  la demande.",
        utiliseDansProjet: true,
        apprentissage:
          "Adoption de la mÃ©thode MoSCoW pour la priorisation du backlog SpartCRM et dÃ©coupage en 5 sprints de 2 semaines.",
      },
    ],
  },
  {
    titre: "Analyse concurrentielle CRM",
    miseAJour: "FÃ©vrier 2026",
    items: [
      {
        theme: "Analyse des CRM concurrents (SaaS)",
        description:
          "Benchmark des CRM leaders du marchÃ© (HubSpot, Pipedrive, Salesforce, Zoho) pour identifier leurs forces, faiblesses et justifier le dÃ©veloppement d'un CRM sur-mesure.",
        sources: [
          { nom: "HubSpot Blog", url: "https://blog.hubspot.com" },
          { nom: "Pipedrive Blog", url: "https://www.pipedrive.com/en/blog" },
          {
            nom: "G2 - CRM Comparisons",
            url: "https://www.g2.com/categories/crm",
          },
        ],
        avantages:
          "Justifier le choix du sur-mesure et identifier les fonctionnalitÃ©s clÃ©s Ã  reproduire ou amÃ©liorer.",
        consultation:
          "Analyse G2 trimestrielle + tests gratuits des concurrents lors du cadrage.",
        utiliseDansProjet: true,
        apprentissage:
          "L'analyse HubSpot/Pipedrive a rÃ©vÃ©lÃ© que les CRM SaaS sont surdimensionnÃ©s pour les TPE. SpartCRM se concentre sur 3 modules essentiels (Contacts, Pipeline, ActivitÃ©s) pour une adoption rapide.",
      },
      {
        theme: "CRM open-source et alternatives Low-Code",
        description:
          "Analyse des CRM open-source (Twenty, Monica, SuiteCRM) et des CRM construits en Low-Code (Notion CRM, Airtable CRM).",
        sources: [
          { nom: "Twenty CRM (GitHub)", url: "https://github.com/twentyhq/twenty" },
          {
            nom: "SuiteCRM Resources",
            url: "https://suitecrm.com/resources/",
          },
          {
            nom: "Notion Templates - CRM",
            url: "https://www.notion.so/templates/category/crm",
          },
        ],
        avantages:
          "Ã‰valuer les approches alternatives et s'inspirer des meilleures UX du marchÃ©.",
        consultation:
          "Veille GitHub (stars/releases) mensuelle + tests Notion/Airtable templates.",
        utiliseDansProjet: true,
        apprentissage:
          "L'UX de Twenty CRM (kanban pipeline) a inspirÃ© le design du pipeline commercial de SpartCRM. Le modÃ¨le Notion CRM a validÃ© le besoin d'une vue simplifiÃ©e pour les TPE.",
      },
    ],
  },
];

const articlesRecents = [
  {
    titre:
      "WeWeb 2.0 : les nouvelles fonctionnalitÃ©s qui changent la donne pour les dÃ©veloppeurs Low-Code",
    source: "WeWeb Blog",
    date: "18 fÃ©vrier 2026",
    url: "https://www.weweb.io/blog",
    categorie: "Low-Code",
  },
  {
    titre:
      "Comment l'IA gÃ©nÃ©rative transforme le dÃ©veloppement d'applications CRM en 2026",
    source: "Gartner Insights",
    date: "5 fÃ©vrier 2026",
    url: "https://www.gartner.com/en/topics/low-code",
    categorie: "IA",
  },
  {
    titre:
      "Xano dÃ©voile son nouveau moteur de requÃªtes : performances multipliÃ©es par 3",
    source: "Xano Community",
    date: "22 janvier 2026",
    url: "https://community.xano.com",
    categorie: "Technologies",
  },
  {
    titre:
      "RGPD et Low-Code : les 10 erreurs les plus frÃ©quentes Ã  Ã©viter en 2026",
    source: "CNIL - Guide pratique",
    date: "10 janvier 2026",
    url: "https://www.cnil.fr",
    categorie: "Low-Code",
  },
  {
    titre:
      "n8n vs Make en 2026 : quel outil d'automatisation choisir pour vos workflows CRM ?",
    source: "n8n Blog",
    date: "3 janvier 2026",
    url: "https://blog.n8n.io",
    categorie: "Automatisation",
  },
  {
    titre:
      "Stripe lance de nouvelles APIs pour simplifier l'intÃ©gration des paiements rÃ©currents",
    source: "Stripe Blog",
    date: "12 dÃ©cembre 2025",
    url: "https://stripe.com/blog",
    categorie: "Technologies",
  },
  {
    titre:
      "HubSpot vs Pipedrive en 2026 : quel CRM choisir pour une startup ?",
    source: "G2 Blog",
    date: "28 fÃ©vrier 2026",
    url: "https://www.g2.com/categories/crm",
    categorie: "CRM",
  },
  {
    titre:
      "Twenty CRM atteint 10k stars GitHub : l'alternative open-source qui monte",
    source: "GitHub Trending",
    date: "15 fÃ©vrier 2026",
    url: "https://github.com/twentyhq/twenty",
    categorie: "CRM",
  },
  {
    titre:
      "Auth0 simplifie l'intÃ©gration SSO pour les applications Low-Code",
    source: "Auth0 Blog",
    date: "8 fÃ©vrier 2026",
    url: "https://auth0.com/blog",
    categorie: "Technologies",
  },
  {
    titre:
      "Scrum pour les projets Low-Code : adapter la mÃ©thodologie aux cycles courts",
    source: "Scrum.org",
    date: "20 janvier 2026",
    url: "https://www.scrum.org/resources/blog",
    categorie: "Gestion de projet",
  },
  {
    titre:
      "Brevo dÃ©ploie son API v4 : emails transactionnels plus rapides et webhooks amÃ©liorÃ©s",
    source: "Brevo Blog",
    date: "5 dÃ©cembre 2025",
    url: "https://www.brevo.com/blog/",
    categorie: "Technologies",
  },
];

const outilsVeille = [
  {
    nom: "Feedly",
    usage: "AgrÃ©gation des flux RSS (blogs WeWeb, Xano, Stripe, n8n, Scrum.org)",
    url: "https://feedly.com",
  },
  {
    nom: "Pocket",
    usage: "Sauvegarde et lecture diffÃ©rÃ©e des articles pertinents",
    url: "https://getpocket.com",
  },
  {
    nom: "Google Alerts",
    usage: "Alertes sur les mots-clÃ©s 'Low-Code CRM', 'WeWeb update', 'Xano changelog'",
    url: "https://www.google.com/alerts",
  },
  {
    nom: "GitHub Watch",
    usage: "Suivi des releases de Twenty CRM, n8n, Supabase",
    url: "https://github.com",
  },
  {
    nom: "LinkedIn",
    usage: "Veille passive via les groupes Low-Code Leaders et Product Management",
    url: "https://www.linkedin.com",
  },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const catColors: Record<string, string> = {
  "Low-Code": "bg-[#dbeafe] text-[#1d4ed8]",
  IA: "bg-[#fae8ff] text-[#9333ea]",
  Automatisation: "bg-[#fef3c7] text-[#b45309]",
  Technologies: "bg-[#d1fae5] text-[#047857]",
  "Gestion de projet": "bg-[#e0e7ff] text-[#4338ca]",
  CRM: "bg-[#ffe4e6] text-[#be123c]",
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function VeillePage() {
  const [tableOpen, setTableOpen] = useState(true);

  /* Build flat list with numbering */
  const allThemes: (Theme & { numero: number; categorie: string })[] = [];
  let counter = 0;
  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      counter++;
      allThemes.push({ ...item, numero: counter, categorie: cat.titre });
    });
  });

  const totalThemes = allThemes.length;
  const themesUtilises = allThemes.filter((t) => t.utiliseDansProjet).length;
  const totalSources = allThemes.reduce(
    (acc, t) => acc + t.sources.length,
    0
  );

  return (
    <div>
      {/* â”€â”€ Header â”€â”€ */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Tableau de veille technologique
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 6 â€” SystÃ¨me de veille mÃ©tier et technique pour le
          domaine Low-Code / CRM
        </p>
      </div>

      {/* â”€â”€ Dashboard global â”€â”€ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#3b82f6]">{totalThemes}</p>
          <p className="text-xs text-[#64748b] mt-1">ThÃ¨mes surveillÃ©s</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{themesUtilises}</p>
          <p className="text-xs text-[#64748b] mt-1">
            AppliquÃ©s au projet
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#8b5cf6]">{totalSources}</p>
          <p className="text-xs text-[#64748b] mt-1">Sources actives</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#f59e0b]">
            {articlesRecents.length}
          </p>
          <p className="text-xs text-[#64748b] mt-1">Articles lus</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center col-span-2 md:col-span-1">
          <p className="text-sm font-bold text-[#1e293b]">FÃ©vrier 2026</p>
          <p className="text-xs text-[#64748b] mt-1">
            DerniÃ¨re mise Ã  jour
          </p>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">
            Prochaine revue : Mars 2026
          </p>
        </div>
      </div>

      {/* â”€â”€ Objectif â”€â”€ */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold mb-2">Objectif de la veille</h2>
        <p className="text-sm text-[#475569]">
          Maintenir une veille active sur les technologies Low-Code, les outils
          CRM, l'IA et l'automatisation, ainsi que les bonnes pratiques de
          gestion de projet. Cette veille permet de rester compÃ©titif,
          d'anticiper les Ã©volutions du marchÃ© et de proposer des solutions Ã 
          jour aux clients.
        </p>
      </div>

      {/* â”€â”€ Tableau synthÃ©tique rÃ©capitulatif â”€â”€ */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] mb-6 overflow-hidden">
        <button
          onClick={() => setTableOpen(!tableOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors text-left"
        >
          <h2 className="text-base font-semibold text-[#1e293b] flex items-center gap-2">
            <span className="text-lg">&#128202;</span> Tableau rÃ©capitulatif des
            thÃ¨mes
          </h2>
          <span className="text-[#94a3b8] text-sm">
            {tableOpen ? "â–² RÃ©duire" : "â–¼ DÃ©plier"}
          </span>
        </button>
        {tableOpen && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc] border-t border-[#e2e8f0]">
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    #
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    ThÃ¨me
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    CatÃ©gorie
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    Sources
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    FrÃ©quence
                  </th>
                  <th className="text-center px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    Projet
                  </th>
                </tr>
              </thead>
              <tbody>
                {allThemes.map((t) => (
                  <tr
                    key={t.numero}
                    className="border-t border-[#f1f5f9] hover:bg-[#fafbfd]"
                  >
                    <td className="px-4 py-2 text-[#94a3b8] font-mono text-xs">
                      {t.numero}
                    </td>
                    <td className="px-4 py-2 text-[#334155] font-medium max-w-[260px]">
                      {t.theme}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] whitespace-nowrap">
                        {t.categorie.length > 25
                          ? t.categorie.slice(0, 22) + "..."
                          : t.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {t.sources.map((s, i) => (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#3b82f6] hover:underline"
                          >
                            {s.nom}
                            {i < t.sources.length - 1 ? "," : ""}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs text-[#64748b] max-w-[180px]">
                      {t.consultation.split("+")[0].trim()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {t.utiliseDansProjet ? (
                        <span
                          className="inline-block text-xs"
                          title="UtilisÃ© dans SpartCRM"
                        >
                          &#127919;
                        </span>
                      ) : (
                        <span className="text-[#d1d5db]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* â”€â”€ CatÃ©gories dÃ©taillÃ©es â”€â”€ */}
      {(() => {
        let runningCounter = 0;
        return categories.map((cat, ci) => (
          <div key={ci} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                {cat.titre}
              </h2>
              <span className="text-xs text-[#94a3b8] bg-[#f1f5f9] px-3 py-1 rounded-full">
                DerniÃ¨re mise Ã  jour : {cat.miseAJour}
              </span>
            </div>
            <div className="space-y-4">
              {cat.items.map((item, ii) => {
                runningCounter++;
                const currentNumber = runningCounter;
                return (
                  <div
                    key={ii}
                    className={`bg-white rounded-lg border p-5 ${
                      item.utiliseDansProjet
                        ? "border-[#86efac] border-l-4 border-l-[#22c55e]"
                        : "border-[#e2e8f0]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#3b82f6]">
                            ThÃ¨me {currentNumber}
                          </span>
                          {item.utiliseDansProjet && (
                            <span className="text-[10px] bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-full font-medium">
                              &#127919; UtilisÃ© dans le projet
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-[#334155] mt-1">
                          {item.theme}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-[#64748b] mb-4">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                          Sources
                        </h4>
                        <ul className="space-y-1">
                          {item.sources.map((s, si) => (
                            <li key={si}>
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#3b82f6] hover:underline hover:text-[#2563eb] transition-colors"
                              >
                                {s.nom} &rarr;
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                          Avantages
                        </h4>
                        <p className="text-sm text-[#475569]">
                          {item.avantages}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#64748b] uppercase mb-2">
                          Mode de consultation
                        </h4>
                        <p className="text-sm text-[#475569]">
                          {item.consultation}
                        </p>
                      </div>
                    </div>

                    {/* Apprentissage */}
                    {item.apprentissage && (
                      <div className="mt-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-md p-3">
                        <h4 className="text-xs font-bold text-[#15803d] uppercase mb-1">
                          &#128161; Apprentissage appliquÃ© Ã  SpartCRM
                        </h4>
                        <p className="text-sm text-[#166534]">
                          {item.apprentissage}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ));
      })()}

      {/* â”€â”€ SynthÃ¨se des apprentissages â”€â”€ */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
          Ce que j'en retire pour SpartCRM
        </h2>
        <div className="bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] rounded-lg border border-[#bbf7d0] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                decision: "Stack technique WeWeb + Xano",
                justification:
                  "La veille sur les plateformes Low-Code a confirmÃ© que le couple WeWeb (front) + Xano (back) est le plus adaptÃ© pour un CRM sur-mesure : flexibilitÃ© front-end, API robuste, sÃ©curitÃ© RBAC native.",
              },
              {
                decision: "3 modules essentiels (Contacts, Pipeline, ActivitÃ©s)",
                justification:
                  "L'analyse concurrentielle a montrÃ© que les CRM SaaS sont surdimensionnÃ©s pour les TPE. SpartCRM se concentre sur l'essentiel pour maximiser l'adoption.",
              },
              {
                decision: "Automatisation des relances via n8n",
                justification:
                  "La comparaison n8n vs Make a orientÃ© le choix vers n8n (open-source, self-hosted) pour les workflows de notifications et relances automatiques.",
              },
              {
                decision: "Authentification WeWeb Auth + Xano RBAC",
                justification:
                  "La veille sur Auth0 et Supabase a permis de valider que le systÃ¨me natif WeWeb/Xano couvre les besoins (rÃ´les admin/commercial/manager) sans dÃ©pendance externe.",
              },
              {
                decision: "Pagination serveur + lazy loading",
                justification:
                  "Les bonnes pratiques web.dev et les tips Xano ont guidÃ© l'optimisation des performances pour les listes de contacts volumineuses.",
              },
              {
                decision: "MÃ©thode MoSCoW + sprints de 2 semaines",
                justification:
                  "La veille Scrum/Product Management a validÃ© cette approche pour un projet Low-Code oÃ¹ les cycles de dÃ©veloppement sont plus courts qu'en code traditionnel.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-md border border-[#d1fae5] p-4"
              >
                <h4 className="text-sm font-semibold text-[#15803d] mb-1">
                  &#10003; {item.decision}
                </h4>
                <p className="text-xs text-[#475569]">
                  {item.justification}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ Articles rÃ©cents â”€â”€ */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
          Articles rÃ©cents ({articlesRecents.length})
        </h2>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
          <p className="text-sm text-[#64748b] mb-4">
            SÃ©lection d'articles et publications rÃ©cents en lien avec la
            veille technologique Low-Code, CRM et IA.
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
                    <span className="text-xs text-[#3b82f6]">
                      {article.source}
                    </span>
                    <span className="text-xs text-[#94a3b8]">&bull;</span>
                    <span className="text-xs text-[#94a3b8]">
                      {article.date}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        catColors[article.categorie] ||
                        "bg-[#f1f5f9] text-[#64748b]"
                      }`}
                    >
                      {article.categorie}
                    </span>
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

      {/* â”€â”€ Outils de veille utilisÃ©s â”€â”€ */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>
          Outils de veille utilisÃ©s
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {outilsVeille.map((outil, idx) => (
            <a
              key={idx}
              href={outil.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg border border-[#e2e8f0] p-4 hover:border-[#3b82f6] hover:shadow-sm transition-all group"
            >
              <h4 className="text-sm font-semibold text-[#334155] group-hover:text-[#3b82f6] transition-colors">
                {outil.nom}
              </h4>
              <p className="text-xs text-[#64748b] mt-1">{outil.usage}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
