import type { SafeAuditLog } from "~/components/activity-item";

export const generateLogMessage = (log: SafeAuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case "CREATE":
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case "UPDATE":
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case "DELETE":
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    case "COMPLETE":
      return `completed ${entityType.toLowerCase()} "${entityTitle}"`;
    case "SHARING":
      return `sharing changed on ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
