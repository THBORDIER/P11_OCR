import { prisma } from "@/lib/prisma";
import { createCrudHandlers, intId } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  parseId: intId,
  update: (id, data) => prisma.stakeholder.update({ where: { id: id as number }, data }),
  remove: (id) => prisma.stakeholder.delete({ where: { id: id as number } }),
});
