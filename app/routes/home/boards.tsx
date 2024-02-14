import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Separator } from "~/components/ui/separator";
import { Board } from "./board";
import { NewBoard } from "./new-board";
import type { loader } from "./route";

export function Boards() {
  const { boards } = useLoaderData<typeof loader>();

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex flex-row items-end justify-between w-full">
          <h1 className="text-blue-400">All Boards</h1>
          <h1 className="text-slate-600 text-sm">
            {format(new Date(), "MMM, d yyyy")}
          </h1>
        </div>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {boards.map((board) => (
            <Board
              key={board.id}
              name={board.name}
              id={board.id}
              color={board.color}
              itemCount={board.items.length}
              shareable={board.shareable}
            />
          ))}
          <NewBoard />
        </nav>
      </div>
    </div>
  );
}
