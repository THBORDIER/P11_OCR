import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware minimal — pas d'import de auth/prisma pour éviter
// le problème Edge Runtime + Node.js modules (pg, crypto).
// L'auth est vérifiée côté serveur dans les Server Components et API routes.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
