import { auth } from "./auth";
import { prisma } from "./prisma";

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function requireProjectOwner(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  });

  if (!project) {
    return { error: "NOT_FOUND" as const, user: null };
  }

  // Only the demo project (p11-spartcrm) is allowed to be anonymous
  // All other projects require an authenticated owner
  if (!project.userId) {
    if (projectId === "p11-spartcrm") {
      const user = await getAuthenticatedUser();
      return { error: null, user };
    }
    // Legacy anonymous project — require auth to edit
    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: "UNAUTHORIZED" as const, user: null };
    }
    return { error: null, user };
  }

  // Owned projects require the owner to be authenticated
  const user = await getAuthenticatedUser();
  if (!user) {
    return { error: "UNAUTHORIZED" as const, user: null };
  }

  if (project.userId !== user.id) {
    return { error: "FORBIDDEN" as const, user: null };
  }

  return { error: null, user };
}
