import { prisma } from "@/lib/prisma";
import { createCrudHandlers } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  update: (id, data) => prisma.userStory.update({ where: { id: id as string }, data }),
  remove: (id) => prisma.userStory.delete({ where: { id: id as string } }),
});
