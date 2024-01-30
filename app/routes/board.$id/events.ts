import { prisma } from "~/db/prisma";

export async function triggerCreateBoardEvent(accountId: string) {
  await recordEvent("BOARD", "CREATED", accountId);
}

async function recordEvent(type: string, action: string, accountId: string) {
  console.log(type, action, accountId);
  return prisma.event.create({
    data: {
      type,
      accountId,
      action,
    },
  });
}
