import { prisma } from "@/lib/prisma";
import { createCrudHandlers } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  update: (id, data) => prisma.testCase.update({ where: { id: id as string }, data }),
  remove: (id) => prisma.testCase.delete({ where: { id: id as string } }),
});
