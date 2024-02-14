import crypto from "crypto";
import { prisma } from "~/db/prisma";

export async function accountExists(email: string) {
  const account = await prisma.account.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(account);
}

export async function createAccount(email: string, password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1_000, 64, "sha256")
    .toString("hex");

  return prisma.account.create({
    data: {
      email,
      password: {
        create: { hash, salt },
      },
    },
  });
}
