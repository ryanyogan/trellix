import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { notFound } from "~/http/bad-request";
import { getSharedBoardById } from "../board.$id/queries";
import { ShareColumn } from "../board.$id/share-column";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "Missing board ID");
  let id = Number(params.id);

  let board = await getSharedBoardById(id);
  if (!board) throw notFound();

  return { board };
}

export default function Board() {
  let { board } = useLoaderData<typeof loader>();

  let itemsById = new Map(board.items.map((item) => [item.id, item]));

  type Column = (typeof board.columns)[number];

  type ColumnWithItems = Column & { items: typeof board.items };
  let columns = new Map<string, ColumnWithItems>();
  for (let column of board.columns) {
    columns.set(column.id, { ...column, items: [] });
  }

  for (let item of itemsById.values()) {
    let columnId = item.columnId;
    let column = columns.get(columnId);
    invariant(column, "missing column");
    column.items.push(item);
  }

  return (
    <div className="h-full flex flex-col">
      <div
        style={{ backgroundColor: board.color }}
        className="h-full relative min-h-0 flex flex-col gap-10 overflow-x-scroll pt-10"
      >
        <h1 className="absolute pl-6 text-xs font-bold text-orange-600 underline right-6 top-2">
          You are currently viewing this in shared mode, you may not make edits.
        </h1>
        <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
          {[...columns.values()].map((col) => (
            <ShareColumn
              key={col.id}
              name={col.name}
              columnId={col.id}
              items={col.items}
            />
          ))}

          <div data-lol className="w-8 h-1 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
