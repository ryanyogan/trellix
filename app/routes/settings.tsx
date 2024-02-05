import { NavLink } from "@remix-run/react";
import { NewBoard } from "~/components/new-board";

export default function SettingsPage() {
  return (
    <div className="h-full flex flex-col">
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
    </div>
  );
}
