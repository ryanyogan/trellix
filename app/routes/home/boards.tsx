import { useLoaderData } from "@remix-run/react";
import { Board } from "./board";
import { NewBoard } from "./new-board";
import { loader } from "./route";

export function Boards() {
  let { boards } = useLoaderData<typeof loader>();

  return (
    <div className="p-6 mb-10">
      {boards.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <h2 className="text-slate-500 text-2xl">
            You have yet to create any boards, click the plus sign and get
            started!
          </h2>
        </div>
      ) : (
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
      )}
    </div>
  );
}
