import { prisma } from "~/db/prisma";

export async function getKidsForHouse() {
  return prisma.kid.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}
