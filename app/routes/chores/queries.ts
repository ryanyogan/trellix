import { prisma } from "~/db/prisma";

export async function getChores({ accountId }: { accountId: string }) {
  return prisma.chore.findMany({
    where: {
      accountId,
    },
    include: {
      child: true,
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

export async function completeChore({
  accountId,
  id,
}: {
  accountId: string;
  id: string;
}) {
  return prisma.chore.update({
    where: {
      accountId,
      id,
    },
    data: {
      complete: true,
    },
  });
}

export async function createChore({
  accountId,
  title,
  description,
  color,
  dueDate,
  kidId,
}: {
  accountId: string;
  title: string;
  description: string;
  color: string;
  dueDate: string | null;
  kidId?: string | null;
}) {
  return prisma.chore.create({
    data: {
      accountId,
      title,
      description,
      color,
      dueDate,
      ...(kidId?.length ? { kidId } : {}),
    },
  });
}
