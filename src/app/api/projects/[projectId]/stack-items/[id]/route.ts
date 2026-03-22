import { prisma } from "@/lib/prisma";
import { createCrudHandlers, intId } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  parseId: intId,
  update: (id, data) => prisma.stackItem.update({ where: { id: id as number }, data }),
  remove: (id) => prisma.stackItem.delete({ where: { id: id as number } }),
});
