import { Link, Outlet } from "@remix-run/react";
import { PlusIcon } from "lucide-react";

export function NewUserCard() {
  return (
    <>
      <Link
        to={`/home/board/new`}
        className="flex w-full h-28 sm:h-40 p-4 justify-center items-center rounded-sm border-slate-700/50 border shadow text-slate-700 hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      >
        <div className="">
          <PlusIcon className="h-20 w-20" />
        </div>
      </Link>
      <Outlet />
    </>
  );
}
