import { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import { ActivityItem } from "~/components/activity-item";
import { NewBoard } from "~/components/new-board";
import { prisma } from "~/db/prisma";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request);

  const auditLogs = await prisma.auditLog.findMany({
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
      <div className="bg-slate-900 flex flex-col border-b border-slate-800 justify-between items-center">
        <div className="flex w-full flex-row items-center px-6 mb-3 mt-2.5">
          <span className="text-xs font-semibold text-green-500 mr-2">10</span>
          <div className="w-full h-2 bg-slate-700 rounded-md">
            <div
              style={{ width: `20%` }}
              className="h-2 rounded-md bg-green-400"
            ></div>
          </div>
          <span className="text-xs text-indigo-400 ml-2">{200}</span>
        </div>
      </div>
      <div className="flex flex-row bg-slate-900 shadow-md p-0 justify-between">
        <div className="ml-4 flex flex-row items-center">
          <NavLink
            to="/home"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-slate-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Boards
          </NavLink>
          <NavLink
            to="/activity"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-slate-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Activity
          </NavLink>
          <NavLink
            to="/settings"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-slate-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Settings
          </NavLink>
        </div>
        <NewBoard />
      </div>

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