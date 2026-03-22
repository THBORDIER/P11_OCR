/**
 * Pick only allowed keys from an object.
 * Prevents mass assignment attacks by filtering user input.
 */
export function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: string[]
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result as Partial<T>;
}

// ── Allowed fields per model (from Prisma schema) ────────────

export const ALLOWED_FIELDS = {
  sprint: ["id", "nom", "objectif", "objectifCourt", "debut", "fin", "duree", "velocite", "userStories"],
  task: ["id", "userStory", "titre", "description", "type", "estimation", "status", "assignee", "sprintId"],
  testCase: ["id", "us", "sprint", "etape", "action", "attendu", "obtenu", "statut", "order"],
  persona: ["initials", "nom", "age", "role", "contexte", "besoinPrincipal", "frustration", "objectif", "order"],
  phase: ["phase", "title", "objectif", "fonctionnalites", "horsPerimetre", "utilisateurs", "dependances", "ressources", "periode", "budget", "color", "bg", "order"],
  deliverable: ["href", "title", "desc", "status", "order"],
  projectKpi: ["label", "value", "color", "order"],
  stakeholder: ["nom", "role", "implication", "canal", "order"],
  ritual: ["rituel", "frequence", "participants", "objectif", "format", "livrable", "order"],
  stackItem: ["name", "tag", "tagColorBg", "tagColorText", "description", "order"],
  navItem: ["href", "label", "icon", "order"],
  skill: ["name", "order"],
  techWatchCategory: ["titre", "miseAJour", "order"],
} as const;
