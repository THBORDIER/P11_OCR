import { prisma } from "@/lib/prisma";
import { createCrudHandlers } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  update: (id, data) => prisma.sprint.update({ where: { id: id as string }, data }),
  remove: (id) => prisma.sprint.delete({ where: { id: id as string } }),
});
