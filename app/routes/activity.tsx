import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { requireAuthCookie } from "~/auth/auth";
import { ActivityItem } from "~/components/activity-item";
import { Separator } from "~/components/ui/separator";
import { prisma } from "~/db/prisma";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request);

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return { auditLogs };
}

export default function ActivityPage() {
  const { auditLogs } = useLoaderData<typeof loader>();

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-8">
        <div>
          <div className="flex flex-row items-end justify-between w-full">
            <h1 className="text-blue-400">Activity</h1>
            <h1 className="text-slate-600 text-sm">
              {format(new Date(), "MMM, d yyyy")}
            </h1>
          </div>
          <Separator className="bg-slate-700/50 mt-2 mb-8" />
          <ol className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <p className="hidden last:block text-xs text-center text-muted-foreground">
              No activity found inside this organization
            </p>

            {auditLogs.map((log) => (
              <ActivityItem key={log.id} data={log} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
