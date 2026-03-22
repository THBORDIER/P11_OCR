import { prisma } from "./prisma";

// ─── PROJETS ─────────────────────────────────────────────

export async function getProjects(userId?: string | null) {
  return prisma.project.findMany({
    where: userId
      ? { OR: [{ userId }, { isPublic: true }] }
      : { isPublic: true },
    include: { kpis: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAllPublicProjects() {
  return prisma.project.findMany({
    where: { isPublic: true },
    include: { kpis: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      kpis: { orderBy: { order: "asc" } },
      stackItems: { orderBy: { order: "asc" } },
      phases: { orderBy: { order: "asc" } },
      deliverables: { orderBy: { order: "asc" } },
      navItems: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } },
    },
  });
}

// ─── PRODUCT BACKLOG ─────────────────────────────────────

export async function getUserStories(projectId: string) {
  return prisma.userStory.findMany({
    where: { projectId },
  });
}

export async function validateUserStory(id: string) {
  return prisma.userStory.update({
    where: { id },
    data: { validatedAt: new Date() },
  });
}

export async function unvalidateUserStory(id: string) {
  return prisma.userStory.update({
    where: { id },
    data: { validatedAt: null },
  });
}

// ─── SPRINT BACKLOG ──────────────────────────────────────

export async function getSprints(projectId: string) {
  return prisma.sprint.findMany({
    where: { projectId },
    include: {
      tasks: true,
    },
  });
}

export async function updateTaskStatus(id: string, status: string) {
  return prisma.task.update({
    where: { id },
    data: { status },
  });
}

// ─── ROADMAP ─────────────────────────────────────────────

export async function getPhases(projectId: string) {
  return prisma.phase.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}

// ─── QUESTIONNAIRE ───────────────────────────────────────

export async function getQuestionnaireSections(projectId: string) {
  return prisma.questionnaireSection.findMany({
    where: { projectId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });
}

export async function getQuestionnaireResponses(projectId: string) {
  return prisma.questionnaireResponse.findMany({
    where: { projectId },
  });
}

export async function saveQuestionnaireResponse(
  projectId: string,
  questionId: string,
  value: string
) {
  return prisma.questionnaireResponse.upsert({
    where: {
      projectId_questionId: { projectId, questionId },
    },
    update: { value },
    create: { projectId, questionId, value },
  });
}

// ─── ANALYSE ─────────────────────────────────────────────

export async function getPersonas(projectId: string) {
  return prisma.persona.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}

// ─── COMMUNICATION ───────────────────────────────────────

export async function getStakeholders(projectId: string) {
  return prisma.stakeholder.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}

export async function getRituals(projectId: string) {
  return prisma.ritual.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}

// ─── VEILLE ──────────────────────────────────────────────

export async function getTechWatchCategories(projectId: string) {
  return prisma.techWatchCategory.findMany({
    where: { projectId },
    include: {
      themes: {
        orderBy: { order: "asc" },
        include: {
          sources: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { order: "asc" },
  });
}

// ─── RECETTAGE ───────────────────────────────────────────

export async function getTestCases(projectId: string) {
  return prisma.testCase.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
  });
}

export async function updateTestCaseStatus(id: string, statut: string) {
  return prisma.testCase.update({
    where: { id },
    data: { statut },
  });
}

export async function resetTestCaseStatuses(projectId: string) {
  return prisma.testCase.updateMany({
    where: { projectId },
    data: { statut: "A tester" },
  });
}
