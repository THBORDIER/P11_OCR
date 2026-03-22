"use client";

import { useSession } from "next-auth/react";

export function useIsProjectOwner(projectUserId: string | null | undefined) {
  const { data: session } = useSession();
  if (!session?.user?.id || !projectUserId) return false;
  return session.user.id === projectUserId;
}
