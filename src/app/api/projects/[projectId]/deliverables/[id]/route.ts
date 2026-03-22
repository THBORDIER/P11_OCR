import { prisma } from "@/lib/prisma";
import { createCrudHandlers, intId } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  parseId: intId,
  update: (id, data) => prisma.deliverable.update({ where: { id: id as number }, data }),
  remove: (id) => prisma.deliverable.delete({ where: { id: id as number } }),
});
