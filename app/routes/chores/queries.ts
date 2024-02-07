import { prisma } from "~/db/prisma";

export async function createChoreType({ name }: { name: string }) {
  return prisma.choreType.create({
    data: {
      name,
    },
  });
}

export async function getChores({ accountId }: { accountId: string }) {
  return prisma.chore.findMany({
    where: {
      accountId,
    },
  });
}

export async function deleteChore({
  accountId,
  id,
}: {
  accountId: string;
  id: string;
}) {
  return prisma.chore.delete({
    where: {
      accountId,
      id,
    },
  });
}
