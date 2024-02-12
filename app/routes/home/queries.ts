import { prisma } from "~/db/prisma";

export async function deleteBoard(boardId: number, accountId: string) {
  return prisma.board.delete({
    where: {
      id: boardId,
      accountId,
    },
  });
}

export async function createBoard(userId: string, name: string, color: string) {
  return prisma.board.create({
    data: {
      name,
      color,
      account: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getHomeData(userId: string) {
  return prisma.board.findMany({
    where: {
      accountId: userId,
    },
    include: {
      items: true,
    },
  });
}

export async function getCompleteItemCount(userId: string, boardId: number) {
  return prisma.item.count({
    where: {
      boardId,
      complete: true,
      board: {
        accountId: userId,
      },
    },
  });
}

export async function getItemCount(userId: string, boardId: number) {
  return prisma.item.count({
    where: {
      boardId,
      board: {
        accountId: userId,
      },
    },
  });
}
