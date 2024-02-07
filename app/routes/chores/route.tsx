import { Link, NavLink } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { NewBoard } from "~/components/new-board";

export const meta = () => {
  return [{ title: "Boards" }];
};

export default function Projects() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row bg-slate-800/30 shadow-md p-0 justify-between border-b border-slate-800">
        <div className="ml-4 flex flex-row items-center">
          <NavLink
            to="/home"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-green-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Boards
          </NavLink>
          <NavLink
            to="/chores"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-green-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Chores
          </NavLink>
          <NavLink
            to="/activity"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-green-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Activity
          </NavLink>
          <NavLink
            to="/settings"
            prefetch="intent"
            className={({ isActive }) =>
              `text-sm font-medium underline-offset-2 text-left text-green-400 px-2 py-1 ${isActive && "underline"}`
            }
          >
            Settings
          </NavLink>
        </div>
        <NewBoard />
      </div>
      <Boards />
    </div>
  );
}

function Boards() {
  return (
    <div className="p-6">
      <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <NewChore />
        {/* {boards.map((board) => (
            <Board
              key={board.id}
              name={board.name}
              id={board.id}
              color={board.color}
              itemCount={board.items.length}
              shareable={board.shareable}
            />
          ))} */}
      </nav>
    </div>
  );
}

function NewChore({}: {}) {
  return (
    <Link
      to={`/board/`}
      className="flex w-full h-28 sm:h-40 p-4 justify-center items-center rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
    >
      <div className="font-semibold text-ellipsis text-blue-400">
        <PlusIcon className="h-20 w-20 text-slate-700" />
      </div>
    </Link>
  );
}
