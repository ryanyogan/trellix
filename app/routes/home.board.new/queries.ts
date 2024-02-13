import { prisma } from "~/db/prisma";

export async function createChore({
  accountId,
  title,
  description,
  color,
}: {
  accountId: string;
  title: string;
  description: string;
  color: string;
}) {
  return prisma.chore.create({
    data: {
      accountId,
      title,
      description,
      color,
    },
  });
}
