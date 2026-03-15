"use client";

import { useState } from "react";

/* ───────────────────────── Types ───────────────────────── */
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

/* ───────────────────────── Données ───────────────────────── */
const categories: Categorie[] = [
  {
    titre: "Écosystème des plateformes Low-Code",
    miseAJour: "Février 2026",
    items: [
      {
        theme: "Nouvelles fonctionnalités des outils Low-Code",
        description:
          "Annonces, mises à jour officielles des plateformes comme WeWeb, Xano, Bubble, FlutterFlow, Retool.",
        sources: [
          { nom: "WeWeb Blog", url: "https://www.weweb.io/blog" },
          { nom: "Xano Community", url: "https://community.xano.com" },
          { nom: "YouTube - WeWeb", url: "https://www.youtube.com/@weweb" },
        ],
        avantages:
          "Permet de rester informé des nouvelles capacités et d'anticiper les évolutions techniques pour les projets clients.",
        consultation:
          "Newsletter hebdomadaire WeWeb + check Xano Community chaque lundi matin.",
        utiliseDansProjet: true,
        apprentissage:
          "Découverte du système de composants réutilisables WeWeb 2.0, appliqué pour structurer les vues Contact et Pipeline de SpartCRM.",
      },
      {
        theme: "Évolutions des bonnes pratiques de développement Low-Code",
        description:
          "Recommandations pour structurer les projets, organiser les workflows et assurer la maintenabilité.",
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
          "Évite les anti-patterns et améliore la qualité des livrables Low-Code.",
        consultation: "Veille passive via Slack + lecture Reddit 1x/semaine.",
      },
      {
        theme: "Nouvelles bibliothèques, plugins et intégrations",
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
          "Découvrir des outils qui font gagner du temps et enrichissent les projets sans développement custom.",
        consultation:
          "Product Hunt Daily Digest (email quotidien) + check marketplace mensuel.",
      },
      {
        theme: "Sécurité des applications Low-Code",
        description:
          "Menaces et bonnes pratiques pour protéger les données, gérer les rôles et assurer la conformité RGPD.",
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
          "Garantir la sécurité des applications déployées et la conformité réglementaire.",
        consultation:
          "Veille mensuelle OWASP + check CNIL lors de chaque nouveau projet.",
        utiliseDansProjet: true,
        apprentissage:
          "Application des recommandations OWASP pour le contrôle d'accès par rôles (RBAC) dans SpartCRM. Vérification RGPD pour le stockage des données contacts.",
      },
      {
        theme: "Performance des applications Low-Code",
        description:
          "Recommandations pour optimiser la vitesse, les requêtes API et les bases de données.",
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
          "Livrer des applications rapides et améliorer l'expérience utilisateur finale.",
        consultation:
          "Check web.dev lors du lancement d'un projet + vidéo Nocodelytics 1x/mois.",
        utiliseDansProjet: true,
        apprentissage:
          "Adoption de la pagination côté serveur (Xano) et du lazy loading pour les listes de contacts dans SpartCRM, suite aux benchmarks web.dev.",
      },
    ],
  },
  {
    titre: "Intelligence artificielle et automatisation",
    miseAJour: "Janvier 2026",
    items: [
      {
        theme: "Études de cas IA dans le développement Low-Code",
        description:
          "Exemples concrets d'intégration de GPT ou autres IA pour automatiser des tâches ou améliorer l'UX.",
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
          "Identifier des cas d'usage concrets pour proposer des fonctionnalités IA aux clients.",
        consultation:
          "Newsletter The Rundown (quotidienne) + 1 vidéo/semaine.",
      },
      {
        theme: "Impact de l'IA sur le métier de développeur Low-Code",
        description:
          "Impact des avancées IA sur les compétences attendues et l'évolution du rôle du développeur.",
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
          "Anticiper les évolutions du métier et adapter ses compétences en conséquence.",
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
          "Proposer des workflows automatisés aux clients pour réduire les tâches manuelles.",
        consultation: "Blog Make et n8n bi-mensuel + vidéos à la demande.",
        utiliseDansProjet: true,
        apprentissage:
          "Choix de n8n comme outil d'automatisation pour les notifications CRM (relances automatiques, alertes pipeline) grâce à son modèle open-source et sa compatibilité Xano.",
      },
    ],
  },
  {
    titre: "Technologies utilisées dans les applications",
    miseAJour: "Février 2026",
    items: [
      {
        theme: "Intégration de paiements et transactions",
        description:
          "APIs Stripe, PayPal pour gérer les paiements, abonnements et webhooks sécurisés.",
        sources: [
          { nom: "Stripe Blog", url: "https://stripe.com/blog" },
          {
            nom: "Stripe Docs Changelog",
            url: "https://stripe.com/docs/changelog",
          },
          { nom: "Dev.to - #payments", url: "https://dev.to/t/payments" },
        ],
        avantages:
          "Rester à jour sur les fonctionnalités de paiement pour les intégrer efficacement.",
        consultation:
          "Changelog Stripe à chaque projet e-commerce + blog mensuel.",
      },
      {
        theme: "Fonctionnalités d'emailing et de communication",
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
          "Implémenter des systèmes de notifications et d'emailing fiables et performants.",
        consultation: "Check documentation à chaque intégration email.",
        utiliseDansProjet: true,
        apprentissage:
          "Intégration de Brevo pour les emails transactionnels de SpartCRM (confirmation de compte, notifications de deals).",
      },
      {
        theme: "Gestion des utilisateurs et authentification",
        description:
          "Solutions pour l'authentification avancée, les rôles et la personnalisation UX.",
        sources: [
          { nom: "Auth0 Blog", url: "https://auth0.com/blog" },
          {
            nom: "WeWeb Auth Documentation",
            url: "https://docs.weweb.io",
          },
        ],
        avantages:
          "Sécuriser les applications et proposer des expériences de connexion modernes (SSO, OAuth).",
        consultation:
          "Documentation Auth0 lors de la mise en place de l'auth sur un projet.",
        utiliseDansProjet: true,
        apprentissage:
          "Utilisation du système d'authentification natif WeWeb + Xano Auth pour gérer les rôles (admin, commercial, manager) dans SpartCRM.",
      },
      {
        theme: "Gestion des bases de données et workflows",
        description:
          "Mises à jour sur Xano, Airtable, Firebase pour structurer les données.",
        sources: [
          { nom: "Xano Changelog", url: "https://xano.com/changelog" },
          {
            nom: "Firebase Release Notes",
            url: "https://firebase.google.com/support/releases",
          },
        ],
        avantages:
          "Exploiter les nouvelles fonctionnalités BDD pour optimiser les performances.",
        consultation:
          "Changelog Xano à chaque mise à jour.",
        utiliseDansProjet: true,
        apprentissage:
          "Adoption des filtres natifs Xano plutôt qu'un endpoint custom pour les requêtes de recherche contacts, réduisant le temps de développement de 40%.",
      },
    ],
  },
  {
    titre: "Gestion de projet",
    miseAJour: "Février 2026",
    items: [
      {
        theme:
          "Product management et priorisation du backlog en Low-Code",
        description:
          "Méthodes pour organiser les fonctionnalités, définir les priorités et planifier les livraisons.",
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
          "Améliorer la gestion de projet et la collaboration avec les clients.",
        consultation:
          "Articles Mind the Product hebdo + vidéos Scrum Life à la demande.",
        utiliseDansProjet: true,
        apprentissage:
          "Adoption de la méthode MoSCoW pour la priorisation du backlog SpartCRM et découpage en 5 sprints de 2 semaines.",
      },
    ],
  },
  {
    titre: "Analyse concurrentielle CRM",
    miseAJour: "Février 2026",
    items: [
      {
        theme: "Analyse des CRM concurrents (SaaS)",
        description:
          "Benchmark des CRM leaders du marché (HubSpot, Pipedrive, Salesforce, Zoho) pour identifier leurs forces, faiblesses et justifier le développement d'un CRM sur-mesure.",
        sources: [
          { nom: "HubSpot Blog", url: "https://blog.hubspot.com" },
          { nom: "Pipedrive Blog", url: "https://www.pipedrive.com/en/blog" },
          {
            nom: "G2 - CRM Comparisons",
            url: "https://www.g2.com/categories/crm",
          },
        ],
        avantages:
          "Justifier le choix du sur-mesure et identifier les fonctionnalités clés à reproduire ou améliorer.",
        consultation:
          "Analyse G2 trimestrielle + tests gratuits des concurrents lors du cadrage.",
        utiliseDansProjet: true,
        apprentissage:
          "L'analyse HubSpot/Pipedrive a révélé que les CRM SaaS sont surdimensionnés pour les TPE. SpartCRM se concentre sur 3 modules essentiels (Contacts, Pipeline, Activités) pour une adoption rapide.",
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
          "Évaluer les approches alternatives et s'inspirer des meilleures UX du marché.",
        consultation:
          "Veille GitHub (stars/releases) mensuelle + tests Notion/Airtable templates.",
        utiliseDansProjet: true,
        apprentissage:
          "L'UX de Twenty CRM (kanban pipeline) a inspiré le design du pipeline commercial de SpartCRM. Le modèle Notion CRM a validé le besoin d'une vue simplifiée pour les TPE.",
      },
    ],
  },
];

const articlesRecents = [
  {
    titre:
      "WeWeb 2.0 : les nouvelles fonctionnalités qui changent la donne pour les développeurs Low-Code",
    source: "WeWeb Blog",
    date: "18 février 2026",
    url: "https://www.weweb.io/blog",
    categorie: "Low-Code",
  },
  {
    titre:
      "Comment l'IA générative transforme le développement d'applications CRM en 2026",
    source: "Gartner Insights",
    date: "5 février 2026",
    url: "https://www.gartner.com/en/topics/low-code",
    categorie: "IA",
  },
  {
    titre:
      "Xano dévoile son nouveau moteur de requêtes : performances multipliées par 3",
    source: "Xano Community",
    date: "22 janvier 2026",
    url: "https://community.xano.com",
    categorie: "Technologies",
  },
  {
    titre:
      "RGPD et Low-Code : les 10 erreurs les plus fréquentes à éviter en 2026",
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
      "Stripe lance de nouvelles APIs pour simplifier l'intégration des paiements récurrents",
    source: "Stripe Blog",
    date: "12 décembre 2025",
    url: "https://stripe.com/blog",
    categorie: "Technologies",
  },
  {
    titre:
      "HubSpot vs Pipedrive en 2026 : quel CRM choisir pour une startup ?",
    source: "G2 Blog",
    date: "28 février 2026",
    url: "https://www.g2.com/categories/crm",
    categorie: "CRM",
  },
  {
    titre:
      "Twenty CRM atteint 10k stars GitHub : l'alternative open-source qui monte",
    source: "GitHub Trending",
    date: "15 février 2026",
    url: "https://github.com/twentyhq/twenty",
    categorie: "CRM",
  },
  {
    titre:
      "Auth0 simplifie l'intégration SSO pour les applications Low-Code",
    source: "Auth0 Blog",
    date: "8 février 2026",
    url: "https://auth0.com/blog",
    categorie: "Technologies",
  },
  {
    titre:
      "Scrum pour les projets Low-Code : adapter la méthodologie aux cycles courts",
    source: "Scrum.org",
    date: "20 janvier 2026",
    url: "https://www.scrum.org/resources/blog",
    categorie: "Gestion de projet",
  },
  {
    titre:
      "Brevo déploie son API v4 : emails transactionnels plus rapides et webhooks améliorés",
    source: "Brevo Blog",
    date: "5 décembre 2025",
    url: "https://www.brevo.com/blog/",
    categorie: "Technologies",
  },
];

const outilsVeille = [
  {
    nom: "Feedly",
    usage: "Agrégation des flux RSS (blogs WeWeb, Xano, Stripe, n8n, Scrum.org)",
    url: "https://feedly.com",
  },
  {
    nom: "Pocket",
    usage: "Sauvegarde et lecture différée des articles pertinents",
    url: "https://getpocket.com",
  },
  {
    nom: "Google Alerts",
    usage: "Alertes sur les mots-clés 'Low-Code CRM', 'WeWeb update', 'Xano changelog'",
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

/* ───────────────────────── Helpers ───────────────────────── */
const catColors: Record<string, string> = {
  "Low-Code": "bg-[#dbeafe] text-[#1d4ed8]",
  IA: "bg-[#fae8ff] text-[#9333ea]",
  Automatisation: "bg-[#fef3c7] text-[#b45309]",
  Technologies: "bg-[#d1fae5] text-[#047857]",
  "Gestion de projet": "bg-[#e0e7ff] text-[#4338ca]",
  CRM: "bg-[#ffe4e6] text-[#be123c]",
};

/* ───────────────────────── Synthèse décisions ───────────────────────── */
const syntheseDecisions = [
  {
    decision: "Stack technique WeWeb + Xano",
    justification:
      "La veille sur les plateformes Low-Code a confirmé que le couple WeWeb (front) + Xano (back) est le plus adapté pour un CRM sur-mesure : flexibilité front-end, API robuste, sécurité RBAC native.",
  },
  {
    decision: "3 modules essentiels (Contacts, Pipeline, Activités)",
    justification:
      "L'analyse concurrentielle a montré que les CRM SaaS sont surdimensionnés pour les TPE. SpartCRM se concentre sur l'essentiel pour maximiser l'adoption.",
  },
  {
    decision: "Automatisation des relances via n8n",
    justification:
      "La comparaison n8n vs Make a orienté le choix vers n8n (open-source, self-hosted) pour les workflows de notifications et relances automatiques.",
  },
  {
    decision: "Authentification WeWeb Auth + Xano RBAC",
    justification:
      "La veille sur Auth0 et Supabase a permis de valider que le système natif WeWeb/Xano couvre les besoins (rôles admin/commercial/manager) sans dépendance externe.",
  },
  {
    decision: "Pagination serveur + lazy loading",
    justification:
      "Les bonnes pratiques web.dev et les tips Xano ont guidé l'optimisation des performances pour les listes de contacts volumineuses.",
  },
  {
    decision: "Méthode MoSCoW + sprints de 2 semaines",
    justification:
      "La veille Scrum/Product Management a validé cette approche pour un projet Low-Code où les cycles de développement sont plus courts qu'en code traditionnel.",
  },
];

/* ───────────────────────── Component ───────────────────────── */
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

  /* ── Export PDF ── */
  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const marginX = 40;
    const marginTop = 44;
    const lineHeight = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - marginX * 2;
    const pageBottom = pageHeight - 40;

    let y = marginTop;

    const checkPage = (needed = lineHeight) => {
      if (y + needed > pageBottom) {
        doc.addPage();
        y = marginTop;
      }
    };

    const writeLines = (
      input: string,
      font: "normal" | "bold" = "normal",
      size = 10
    ) => {
      doc.setFont("helvetica", font);
      doc.setFontSize(size);
      const wrapped = doc.splitTextToSize(input, maxWidth) as string[];
      for (const line of wrapped) {
        checkPage();
        doc.text(line, marginX, y);
        y += lineHeight;
      }
    };

    const writeLinesIndent = (
      input: string,
      indent = 15,
      font: "normal" | "bold" = "normal",
      size = 10
    ) => {
      doc.setFont("helvetica", font);
      doc.setFontSize(size);
      const wrapped = doc.splitTextToSize(
        input,
        maxWidth - indent
      ) as string[];
      for (const line of wrapped) {
        checkPage();
        doc.text(line, marginX + indent, y);
        y += lineHeight;
      }
    };

    const drawHr = () => {
      checkPage();
      doc.setDrawColor(200);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 8;
    };

    // ── Titre
    writeLines("Tableau de veille technologique - SpartCRM", "bold", 16);
    y += 2;
    writeLines(
      `Genere le ${new Date().toLocaleDateString("fr-FR")} | ${totalThemes} themes | ${themesUtilises} appliques au projet | ${totalSources} sources`,
      "normal",
      9
    );
    y += 10;
    drawHr();

    // ── Tableau récapitulatif
    writeLines("TABLEAU RECAPITULATIF", "bold", 13);
    y += 4;

    // En-tete tableau
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setFillColor(241, 245, 249);
    checkPage(18);
    doc.rect(marginX, y - 10, maxWidth, 16, "F");
    doc.text("#", marginX + 4, y);
    doc.text("Theme", marginX + 24, y);
    doc.text("Categorie", marginX + 250, y);
    doc.text("Sources", marginX + 370, y);
    doc.text("Projet", marginX + 480, y);
    y += 12;

    // Lignes
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    for (const t of allThemes) {
      checkPage(14);
      doc.text(String(t.numero), marginX + 4, y);
      const themeTrunc =
        t.theme.length > 42 ? t.theme.slice(0, 39) + "..." : t.theme;
      doc.text(themeTrunc, marginX + 24, y);
      const catTrunc =
        t.categorie.length > 20
          ? t.categorie.slice(0, 17) + "..."
          : t.categorie;
      doc.text(catTrunc, marginX + 250, y);
      doc.text(String(t.sources.length), marginX + 370, y);
      doc.text(t.utiliseDansProjet ? "Oui" : "-", marginX + 480, y);
      y += 12;
    }

    y += 10;
    drawHr();

    // ── Détail par catégorie
    writeLines("DETAIL PAR CATEGORIE", "bold", 13);
    y += 6;

    for (const cat of categories) {
      checkPage(30);
      writeLines(`${cat.titre}  (MAJ: ${cat.miseAJour})`, "bold", 11);
      y += 2;

      for (const item of cat.items) {
        checkPage(40);
        const prefix = item.utiliseDansProjet ? "[PROJET] " : "";
        writeLines(`${prefix}${item.theme}`, "bold", 10);

        writeLinesIndent(`Description: ${item.description}`);

        writeLinesIndent(
          `Sources: ${item.sources.map((s) => `${s.nom} (${s.url})`).join(" | ")}`
        );

        writeLinesIndent(`Avantages: ${item.avantages}`);
        writeLinesIndent(`Consultation: ${item.consultation}`);

        if (item.apprentissage) {
          doc.setTextColor(21, 128, 61);
          writeLinesIndent(
            `-> Apprentissage SpartCRM: ${item.apprentissage}`,
            15,
            "bold"
          );
          doc.setTextColor(0, 0, 0);
        }

        y += 6;
      }

      y += 4;
    }

    drawHr();

    // ── Synthèse des apprentissages
    writeLines("SYNTHESE : CE QUE J'EN RETIRE POUR SPARTCRM", "bold", 13);
    y += 6;

    for (const item of syntheseDecisions) {
      checkPage(30);
      doc.setTextColor(21, 128, 61);
      writeLines(`> ${item.decision}`, "bold", 10);
      doc.setTextColor(0, 0, 0);
      writeLinesIndent(item.justification);
      y += 6;
    }

    drawHr();

    // ── Articles récents
    writeLines("ARTICLES RECENTS", "bold", 13);
    y += 4;

    for (const article of articlesRecents) {
      checkPage(20);
      writeLines(`- ${article.titre}`, "normal", 9);
      writeLinesIndent(
        `${article.source} | ${article.date} | ${article.categorie}`,
        15,
        "normal",
        8
      );
      y += 2;
    }

    drawHr();

    // ── Outils de veille
    writeLines("OUTILS DE VEILLE UTILISES", "bold", 13);
    y += 4;

    for (const outil of outilsVeille) {
      checkPage(16);
      writeLines(`- ${outil.nom}: ${outil.usage}`, "normal", 9);
    }

    doc.save(
      `veille-technologique-spartcrm-${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">
            Tableau de veille technologique
          </h1>
          <p className="text-[#64748b] mt-2">
            Livrable 6 — Système de veille métier et technique pour le
            domaine Low-Code / CRM
          </p>
        </div>
        <button
          onClick={exportPdf}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors shadow-sm"
        >
          <span>&#128196;</span> Exporter PDF
        </button>
      </div>

      {/* ── Dashboard global ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#3b82f6]">{totalThemes}</p>
          <p className="text-xs text-[#64748b] mt-1">Thèmes surveillés</p>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{themesUtilises}</p>
          <p className="text-xs text-[#64748b] mt-1">
            Appliqués au projet
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
          <p className="text-sm font-bold text-[#1e293b]">Février 2026</p>
          <p className="text-xs text-[#64748b] mt-1">
            Dernière mise à jour
          </p>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">
            Prochaine revue : Mars 2026
          </p>
        </div>
      </div>

      {/* ── Objectif ── */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold mb-2">Objectif de la veille</h2>
        <p className="text-sm text-[#475569]">
          Maintenir une veille active sur les technologies Low-Code, les outils
          CRM, l'IA et l'automatisation, ainsi que les bonnes pratiques de
          gestion de projet. Cette veille permet de rester compétitif,
          d'anticiper les évolutions du marché et de proposer des solutions à
          jour aux clients.
        </p>
      </div>

      {/* ── Tableau synthétique récapitulatif ── */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] mb-6 overflow-hidden">
        <button
          onClick={() => setTableOpen(!tableOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#f8fafc] transition-colors text-left"
        >
          <h2 className="text-base font-semibold text-[#1e293b] flex items-center gap-2">
            <span className="text-lg">&#128202;</span> Tableau récapitulatif des
            thèmes
          </h2>
          <span className="text-[#94a3b8] text-sm">
            {tableOpen ? "▲ Réduire" : "▼ Déplier"}
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
                    Thème
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    Catégorie
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    Sources
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[#475569] text-xs">
                    Fréquence
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
                          title="Utilisé dans SpartCRM"
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

      {/* ── Catégories détaillées ── */}
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
                Dernière mise à jour : {cat.miseAJour}
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
                            Thème {currentNumber}
                          </span>
                          {item.utiliseDansProjet && (
                            <span className="text-[10px] bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-full font-medium">
                              &#127919; Utilisé dans le projet
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
                          &#128161; Apprentissage appliqué à SpartCRM
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

      {/* ── Synthèse des apprentissages ── */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
          Ce que j'en retire pour SpartCRM
        </h2>
        <div className="bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] rounded-lg border border-[#bbf7d0] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syntheseDecisions.map((item, idx) => (
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

      {/* ── Articles récents ── */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
          Articles récents ({articlesRecents.length})
        </h2>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
          <p className="text-sm text-[#64748b] mb-4">
            Sélection d'articles et publications récents en lien avec la
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

      {/* ── Outils de veille utilisés ── */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>
          Outils de veille utilisés
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


