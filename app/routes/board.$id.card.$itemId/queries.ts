import { prisma } from "~/db/prisma";

export async function updateCardTitle({
  itemId,
  title,
}: {
  itemId: string;
  title: string;
}) {
  return prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      title,
    },
  });
}

export async function updateCard({
  itemId,
  content,
  complete,
}: {
  itemId: string;
  content: string;
  complete: boolean;
}) {
  return prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      content,
      complete,
    },
  });
}
