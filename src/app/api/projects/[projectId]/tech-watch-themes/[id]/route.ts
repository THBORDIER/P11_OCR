import { prisma } from "@/lib/prisma";
import { createCrudHandlers, intId } from "@/lib/crud-route";

export const { PATCH, DELETE } = createCrudHandlers({
  parseId: intId,
  update: (id, data) => {
    const { sources, ...themeData } = data as Record<string, unknown>;
    return prisma.techWatchTheme.update({
      where: { id: id as number },
      data: themeData,
      include: { sources: true },
    });
  },
  remove: (id) => prisma.techWatchTheme.delete({ where: { id: id as number } }),
});
