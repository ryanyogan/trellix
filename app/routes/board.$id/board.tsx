import { useFetchers, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Column } from "./column";
import { EditableText } from "./components";
import { NewColumn } from "./new-columns";
import { loader } from "./route";
import { INTENTS } from "./types";

export function Board() {
  let { board } = useLoaderData<typeof loader>();

  let itemsById = new Map(board.items.map((item) => [item.id, item]));

  let optAddingColumns = usePendingColumns();
  type Column =
    | (typeof board.columns)[number]
    | (typeof optAddingColumns)[number];

  type ColumnWithItems = Column & { items: typeof board.items };
  let columns = new Map<string, ColumnWithItems>();
  for (let column of [...board.columns, ...optAddingColumns]) {
    columns.set(column.id, { ...column, items: [] });
  }

  for (let item of itemsById.values()) {
    let columnId = item.columnId;
    let column = columns.get(columnId);
    invariant(column, "missing column");
    column.items.push(item);
  }

  return (
    <div
      style={{ backgroundColor: board.color }}
      className="h-full min-h-0 flex flex-col overflow-x-scroll"
    >
      <h1>
        <EditableText
          value={board.name}
          fieldName="name"
          inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
          buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
          buttonLabel={`Edit board "${board.name}" name`}
          inputLabel="Edit board name"
        >
          <input type="hidden" name="intent" value={INTENTS.updateBoardName} />
          <input type="hidden" name="id" value={board.id} />
        </EditableText>
      </h1>

      <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
        {[...columns.values()].map((col) => (
          <Column
            key={col.id}
            name={col.name}
            columnId={col.id}
            items={col.items}
          />
        ))}

        <NewColumn
          boardId={board.id}
          onAdd={() => {}}
          editInitially={board.columns.length === 0}
        />
      </div>
    </div>
  );
}

function usePendingColumns() {
  type CreateColumnFetcher = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is CreateColumnFetcher => {
      return fetcher.formData?.get("intent") === INTENTS.createColumn;
    })
    .map((fetcher) => {
      let name = String(fetcher.formData.get("name"));
      let id = String(fetcher.formData.get("id"));
      return { name, id };
    });
}
