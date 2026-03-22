import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[àâäáã]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[ïîí]/g, "i")
    .replace(/[ôöòóõ]/g, "o")
    .replace(/[üûùú]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  const session = await auth();

  const body = await request.json();
  const { name, subtitle, description, color, organization, githubRepo } = body;

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Le nom du projet est requis" },
      { status: 400 }
    );
  }

  const id = slugify(name);

  if (!id) {
    return NextResponse.json(
      { error: "Le nom du projet ne produit pas un identifiant valide" },
      { status: 400 }
    );
  }

  // Check if project ID already exists
  const existing = await prisma.project.findUnique({ where: { id } });
  if (existing) {
    return NextResponse.json(
      { error: "Un projet avec cet identifiant existe déjà" },
      { status: 409 }
    );
  }

  const project = await prisma.project.create({
    data: {
      id,
      name: name.trim(),
      subtitle: subtitle?.trim() || "",
      description: description?.trim() || "",
      color: color || "#3b82f6",
      author: session?.user?.name || "",
      organization: organization?.trim() || "",
      githubRepo: githubRepo?.trim() || null,
      isPublic: !session?.user?.id,
      contextSummary: "",
      methodologyFramework: "Scrum",
      methodologyFrameworkDescription:
        "Cadre agile avec des sprints itératifs, des cérémonies (Planning, Review, Rétrospective) et une livraison incrémentale de valeur.",
      methodologyPrioritization: "MoSCoW",
      methodologyPrioritizationDescription:
        "Chaque fonctionnalité est classée Must / Should / Could / Won't pour garantir que le MVP livre un maximum de valeur.",
      userId: session?.user?.id || undefined,
      // Navigation par défaut
      navItems: {
        create: [
          { href: `/${id}`, label: "Accueil", icon: "🏠", order: 0 },
          { href: `/${id}/questionnaire`, label: "Questionnaire", icon: "📋", order: 1 },
          { href: `/${id}/analyse`, label: "Analyse", icon: "🔍", order: 2 },
          { href: `/${id}/recettage`, label: "Recettage", icon: "✅", order: 3 },
          { href: `/${id}/roadmap`, label: "Roadmap", icon: "🗺️", order: 4 },
          { href: `/${id}/product-backlog`, label: "Product Backlog", icon: "📦", order: 5 },
          { href: `/${id}/sprint-backlog`, label: "Sprint Backlog", icon: "🏃", order: 6 },
          { href: `/${id}/github`, label: "GitHub", icon: "🔗", order: 7 },
          { href: `/${id}/rapports`, label: "Rapports", icon: "📊", order: 8 },
          { href: `/${id}/communication`, label: "Communication", icon: "💬", order: 9 },
          { href: `/${id}/settings`, label: "Paramètres", icon: "⚙️", order: 10 },
        ],
      },
      // Questionnaire de cadrage par défaut
      questionnaireSections: {
        create: [
          {
            title: "Contexte et objectifs",
            description: "Comprendre le contexte business et les objectifs du projet.",
            pourquoi: "Ces informations permettent de cadrer le périmètre et d'aligner les attentes.",
            order: 0,
            questions: {
              create: [
                { id: `${id}:q1_1`, label: "Décrivez votre activité et votre marché.", type: "textarea", options: [], required: true, order: 0 },
                { id: `${id}:q1_2`, label: "Quel problème ce projet doit-il résoudre ?", type: "textarea", options: [], required: true, order: 1 },
                { id: `${id}:q1_3`, label: "Quels sont les objectifs principaux du projet ?", type: "textarea", options: [], required: true, order: 2 },
                { id: `${id}:q1_4`, label: "Qui sont les utilisateurs finaux ?", type: "textarea", options: [], required: false, order: 3 },
                { id: `${id}:q1_5`, label: "Quel est le budget estimé ?", type: "select", options: ["< 10k €", "10k - 50k €", "50k - 100k €", "100k - 500k €", "> 500k €"], required: false, order: 4 },
              ],
            },
          },
          {
            title: "Contraintes et existant",
            description: "Identifier les contraintes techniques, organisationnelles et les outils existants.",
            pourquoi: "Connaître l'existant évite les doublons et permet une intégration fluide.",
            order: 1,
            questions: {
              create: [
                { id: `${id}:q2_1`, label: "Quels outils utilisez-vous actuellement ?", type: "textarea", options: [], required: false, order: 0 },
                { id: `${id}:q2_2`, label: "Quelles sont les principales contraintes (délais, technique, réglementaire) ?", type: "textarea", options: [], required: false, order: 1 },
                { id: `${id}:q2_3`, label: "Y a-t-il des intégrations nécessaires avec des systèmes existants ?", type: "textarea", options: [], required: false, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  return NextResponse.json(project, { status: 201 });
}
