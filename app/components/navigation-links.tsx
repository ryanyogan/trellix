import { NavLink } from "@remix-run/react";

export function NavigationLinks() {
  return (
    <div className="flex flex-row bg-slate-800/30 shadow-md p-0 pb-3 justify-between border-b border-slate-700/50">
      <div className="ml-4 flex flex-row items-center">
        <NavLink
          to="/home"
          prefetch="intent"
          className={({ isActive }) =>
            `text-sm font-medium underline-offset-2 text-left text-blue-300 px-2 py-1 ${isActive && "underline"}`
          }
        >
          Boards
        </NavLink>
        <NavLink
          to="/chores"
          prefetch="intent"
          className={({ isActive }) =>
            `text-sm font-medium underline-offset-2 text-left text-blue-300 px-2 py-1 ${isActive && "underline"}`
          }
        >
          Chores
        </NavLink>
        <NavLink
          to="/activity"
          prefetch="intent"
          className={({ isActive }) =>
            `text-sm font-medium underline-offset-2 text-left text-blue-300 px-2 py-1 ${isActive && "underline"}`
          }
        >
          Activity
        </NavLink>
        <NavLink
          to="/settings"
          prefetch="intent"
          className={({ isActive }) =>
            `text-sm font-medium underline-offset-2 text-left text-blue-300 px-2 py-1 ${isActive && "underline"}`
          }
        >
          Settings
        </NavLink>
      </div>
    </div>
  );
}
