import { prisma } from "~/db/prisma";

export async function getKidsForHouse() {
  return prisma.kid.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      emoji: true,
    },
  });
}

export async function createKid({
  name,
  color,
  emoji,
}: {
  name: string;
  color: string;
  emoji: string;
}) {
  return prisma.kid.create({
    data: {
      name,
      color,
      emoji,
    },
  });
}
