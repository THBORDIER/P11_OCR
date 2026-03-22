import { NextRequest, NextResponse } from "next/server";
import { requireProjectOwner } from "@/lib/auth-helpers";

type RouteParams = { params: Promise<{ projectId: string; id: string }> };

function errorResponse(error: string) {
  const status = error === "UNAUTHORIZED" ? 401 : error === "NOT_FOUND" ? 404 : 403;
  return NextResponse.json({ error }, { status });
}

/**
 * Factory for standard CRUD (PATCH + DELETE) API route handlers.
 *
 * @param ops.update  - (parsedId, data) => prisma.model.update(...)
 * @param ops.remove  - (parsedId) => prisma.model.delete(...)
 */
export function createCrudHandlers(ops: {
  update: (id: string | number, data: Record<string, unknown>) => Promise<unknown>;
  remove: (id: string | number) => Promise<unknown>;
  parseId?: (id: string) => string | number;
}) {
  const parseId = ops.parseId ?? ((id: string) => id);

  async function PATCH(req: NextRequest, { params }: RouteParams) {
    const { projectId, id } = await params;
    const { error } = await requireProjectOwner(projectId);
    if (error) return errorResponse(error);

    const data = await req.json();
    const item = await ops.update(parseId(id), data);
    return NextResponse.json(item);
  }

  async function DELETE(req: NextRequest, { params }: RouteParams) {
    const { projectId, id } = await params;
    const { error } = await requireProjectOwner(projectId);
    if (error) return errorResponse(error);

    await ops.remove(parseId(id));
    return NextResponse.json({ success: true });
  }

  return { PATCH, DELETE };
}

/** Shorthand for parseInt-based IDs */
export const intId = (id: string) => parseInt(id);
