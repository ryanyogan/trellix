import {
  Outlet,
  useFetcher,
  useFetchers,
  useLoaderData,
} from "@remix-run/react";
import { Link2, Loader, Pencil } from "lucide-react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Column } from "./column";
import { EditableText } from "./components";
import { NewColumn } from "./new-columns";
import { loader } from "./route";
import { INTENTS, RenderedItem } from "./types";

export function Board() {
  let { board } = useLoaderData<typeof loader>();

  let itemsById = new Map(board.items.map((item) => [item.id, item]));

  let pendingItems = usePendingItems();
  for (let pendingItem of pendingItems) {
    let item = itemsById.get(pendingItem.id);
    let merged = item
      ? { ...item, ...pendingItem }
      : {
          ...pendingItem,
          boardId: board.id,
          complete: false,
          accountId: null,
          content: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          choreType: null,
          choreTypeId: null,
          kidId: null,
        };

    itemsById.set(pendingItem.id, merged);
  }

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
    // Add filter here
    column.items.push(item);
  }

  let scrollContainerRef = useRef<HTMLDivElement>(null);
  function scrollRight() {
    invariant(scrollContainerRef.current, "no scroll container");
    scrollContainerRef.current.scrollLeft =
      scrollContainerRef.current.scrollWidth;
  }

  let editFetcher = useFetcher();
  let sharingFetcher = useFetcher();
  let isEditing = editFetcher.state !== "idle";
  let isSharing = sharingFetcher.state !== "idle";

  let [dialogOpen, setDialogOpen] = useState<boolean>(false);

  function onChange() {
    setDialogOpen(!dialogOpen);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex flex-row bg-slate-800/30 border-b border-slate-800 text-blue-300 items-center p-0 justify-start w-full">
        <div>
          <h1>
            <EditableText
              value={board.name}
              fieldName="name"
              inputClassName="mx-4 text-sm font-medium border border-slate-400 rounded-lg py-1 px-1 text-black"
              buttonClassName="mx-4 text-sm font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-blue-300"
              buttonLabel={`Edit board "${board.name}" name`}
              inputLabel="Edit board name"
            >
              <input
                type="hidden"
                name="intent"
                value={INTENTS.updateBoardName}
              />
              <input type="hidden" name="id" value={board.id} />
            </EditableText>
          </h1>
        </div>

        <div className="flex-1"></div>

        <div className="flex flex-row mr-2">
          {board.shareable ? (
            <div className="flex items-center justify-center">
              <a
                className="underline text-xs text-green-400 underline-offset-2"
                href={`https://choring.yogan.dev/sharing/${board.id}`}
                target="_BLANK"
              >
                Share Link
              </a>
            </div>
          ) : null}
          <div>
            <sharingFetcher.Form method="post">
              <input type="hidden" name="intent" value="updateBoardSharing" />
              <input type="hidden" name="boardId" value={board.id} />
              <input
                type="hidden"
                name="shareable"
                value={board.shareable === true ? "false" : "true"}
              />
              <Button type="submit" variant="link">
                {isSharing ? (
                  <Loader className="h-5 w-5 text-green-400 font-bold animate-spin duration-700" />
                ) : (
                  <Link2
                    className={cn(
                      "h-5 w-5 text-blue-300 font-bold",
                      board.shareable?.toString() === "true"
                        ? "text-green-400 font-bold"
                        : "",
                    )}
                  />
                )}
              </Button>
            </sharingFetcher.Form>
          </div>

          <Dialog open={dialogOpen} onOpenChange={onChange}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)} variant="link">
                <Pencil className="h-4 w-4 text-blue-300" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Board</DialogTitle>
                <DialogDescription className="text-md">
                  Edit your board here. Click update when you're complete.
                </DialogDescription>
              </DialogHeader>

              <editFetcher.Form method="post">
                <input type="hidden" name="intent" value="editBoard" />
                <input type="hidden" name="boardId" value={board.id} />
                <div>
                  <Label htmlFor="name">Board Name</Label>
                  <Input
                    name="name"
                    type="text"
                    defaultValue={board.name}
                    className="text-[16px] sm:text-base ring-0 ring-transparent focus:ring-transparent"
                    required
                  />
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <Label htmlFor="board-color">Board Color</Label>
                    <input
                      id="board-color"
                      name="color"
                      type="color"
                      defaultValue={board.color}
                      className="bg-transparent"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    type="submit"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    {isEditing ? "Upading..." : "Update"}
                  </Button>
                </div>
              </editFetcher.Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="h-full min-h-0 flex flex-col overflow-x-scroll mb-10"
      >
        <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4 pt-8 inset-0">
          {[...columns.values()].map((col) => (
            <Column
              color={board.color}
              key={col.id}
              name={col.name}
              columnId={col.id}
              items={col.items}
              boardId={board.id}
            />
          ))}

          <NewColumn
            boardId={board.id}
            onAdd={scrollRight}
            editInitially={board.columns.length === 0}
          />

          <div data-lol className="w-8 h-1 flex-shrink-0" />
        </div>
      </div>
      <Outlet />
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

function usePendingItems() {
  type PendingItem = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is PendingItem => {
      if (!fetcher.formData) return false;
      let intent = fetcher.formData.get("intent");
      return intent === INTENTS.createItem || intent === INTENTS.moveItem;
    })
    .map((fetcher) => {
      let columnId = String(fetcher.formData.get("columnId"));
      let title = String(fetcher.formData.get("title"));
      let content = String(fetcher.formData.get("content"));
      let id = String(fetcher.formData.get("id"));
      let order = Number(fetcher.formData.get("order"));
      let item: RenderedItem = {
        title,
        id,
        order,
        columnId,
        content,
        complete: false,
      };
      return item;
    });
}
