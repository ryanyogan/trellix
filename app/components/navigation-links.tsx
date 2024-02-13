import { NavLink } from "@remix-run/react";

export function NavigationLinks() {
  return (
    <div className="flex flex-row justify-between">
      <div className="ml-4 flex flex-row items-center">
        <NavLink
          to="/home"
          prefetch="intent"
          className={({ isActive }) =>
            `text-xs sm:text-sm font-medium underline-offset-2 text-left text-blue-300 px-1 sm:px-2 py-1 ${isActive && "underline"}`
          }
        >
          Boards
        </NavLink>
        <NavLink
          to="/chores"
          prefetch="intent"
          className={({ isActive }) =>
            `text-xs sm:text-sm font-medium underline-offset-2 text-left text-blue-300 px-1 sm:px-2 py-1 ${isActive && "underline"}`
          }
        >
          Chores
        </NavLink>
        <NavLink
          to="/activity"
          prefetch="intent"
          className={({ isActive }) =>
            `text-xs sm:text-sm font-medium underline-offset-2 text-left text-blue-300 px-1 sm:px-2 py-1 ${isActive && "underline"}`
          }
        >
          Activity
        </NavLink>
        <NavLink
          to="/settings"
          prefetch="intent"
          className={({ isActive }) =>
            `text-xs sm:text-sm font-medium underline-offset-2 text-left text-blue-300 px-1 sm:px-2 py-1 ${isActive && "underline"}`
          }
        >
          Settings
        </NavLink>
      </div>
    </div>
  );
}
