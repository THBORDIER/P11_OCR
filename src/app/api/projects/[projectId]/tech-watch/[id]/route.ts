import { prisma } from "@/lib/prisma";
import { createCrudHandlers, intId } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  parseId: intId,
  update: (id, data) => prisma.techWatchCategory.update({ where: { id: id as number }, data }),
  remove: (id) => prisma.techWatchCategory.delete({ where: { id: id as number } }),
});
