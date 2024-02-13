import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import { ActivityItem } from "~/components/activity-item";
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
      <div className="w-full h-full p-6 flex justify-center">
        <ol className="space-y-4 mt-4">
          <p className="hidden last:block text-xs text-center text-muted-foreground">
            No activity found inside this organization
          </p>

          {auditLogs.map((log) => (
            <ActivityItem key={log.id} data={log} />
          ))}
        </ol>
      </div>
    </div>
  );
}
