import { format } from "date-fns";
import { generateLogMessage } from "~/lib/generate-log-message";

export interface SafeAuditLog {
  id: string;
  action: string;
  entityId: string;
  entityType: string;
  entityTitle: string;
  authorId: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export function ActivityItem({ data }: { data: SafeAuditLog }) {
  return (
    <li className="flex items-center gap-x-2">
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">
            {data.authorEmail}
          </span>{" "}
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
}
