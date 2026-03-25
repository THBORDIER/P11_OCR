// TEMPORARY — dev only, remove before production
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const id = "test-projet-vide";

  // Delete if exists
  await prisma.project.deleteMany({ where: { id } });

  const project = await prisma.project.create({
    data: {
      id,
      name: "Mon Nouveau Projet",
      subtitle: "Projet de test",
      description: "Un projet créé pour tester l'expérience nouveau projet vide.",
      color: "#8b5cf6",
      author: "Thomas B.",
      organization: "",
      isPublic: false,
      contextSummary: "",
      methodologyFramework: "Scrum",
      methodologyFrameworkDescription:
        "Cadre agile avec des sprints itératifs, des cérémonies (Planning, Review, Rétrospective) et une livraison incrémentale de valeur.",
      methodologyPrioritization: "MoSCoW",
      methodologyPrioritizationDescription:
        "Chaque fonctionnalité est classée Must / Should / Could / Won't pour garantir que le MVP livre un maximum de valeur.",
      navItems: {
        create: [
          { href: `/${id}`, label: "Accueil", icon: "🏠", order: 0 },
          { href: `/${id}/questionnaire`, label: "Questionnaire", icon: "📋", order: 1 },
          { href: `/${id}/analyse`, label: "Analyse", icon: "🔍", order: 2 },
          { href: `/${id}/recettage`, label: "Recettage", icon: "✅", order: 3 },
          { href: `/${id}/roadmap`, label: "Roadmap", icon: "🗺️", order: 4 },
          { href: `/${id}/product-backlog`, label: "Product Backlog", icon: "📦", order: 5 },
          { href: `/${id}/sprint-backlog`, label: "Sprint Backlog", icon: "🏃", order: 6 },
          { href: `/${id}/veille`, label: "Veille", icon: "📡", order: 7 },
          { href: `/${id}/communication`, label: "Communication", icon: "💬", order: 8 },
          { href: `/${id}/settings`, label: "Paramètres", icon: "⚙️", order: 9 },
        ],
      },
      questionnaireSections: {
        create: [
          {
            title: "Contexte et objectifs",
            description: "Comprendre le contexte business et les objectifs du projet.",
            pourquoi: "Ces informations permettent de cadrer le périmètre.",
            order: 0,
            questions: {
              create: [
                { id: `${id}:q1_1`, label: "Décrivez votre activité et votre marché.", type: "textarea", options: [], required: true, order: 0 },
                { id: `${id}:q1_2`, label: "Quel problème ce projet doit-il résoudre ?", type: "textarea", options: [], required: true, order: 1 },
                { id: `${id}:q1_3`, label: "Quels sont les objectifs principaux ?", type: "textarea", options: [], required: true, order: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  return NextResponse.json({ ok: true, id: project.id });
}
