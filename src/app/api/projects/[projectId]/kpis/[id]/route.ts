import { prisma } from "@/lib/prisma";
import { createCrudHandlers, intId } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  parseId: intId,
  update: (id, data) => prisma.projectKpi.update({ where: { id: id as number }, data }),
  remove: (id) => prisma.projectKpi.delete({ where: { id: id as number } }),
});
