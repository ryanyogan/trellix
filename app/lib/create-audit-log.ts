import { prisma } from "~/db/prisma";

interface Props {
  entityId: string;
  entityType: string;
  entityTitle: string;
  action: string;
  authorId: string;
  authorEmail: string;
}

export async function createAuditLog({
  entityId,
  entityTitle,
  entityType,
  authorId,
  authorEmail,
  action,
}: Props) {
  if (!authorId || !entityId) {
    throw new Error("User Not Found");
  }

  try {
    await prisma.auditLog.create({
      data: {
        entityId,
        entityTitle,
        entityType,
        authorEmail,
        authorId,
        action,
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_FAILED]", error);
  }
}
