import { prisma } from "~/db/prisma";

export async function createChore({
  accountId,
  title,
  description,
  choreTypeId,
  color,
}: {
  accountId: string;
  title: string;
  description: string;
  choreTypeId: string;
  color: string;
}) {
  return prisma.chore.create({
    data: {
      accountId,
      title,
      description,
      choreTypeId,
      color,
    },
  });
}

export async function getChoreTypes() {
  return prisma.choreType.findMany();
}
