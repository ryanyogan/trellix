import { LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { BackButton } from "~/components/back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
      <div className="flex flex-row bg-slate-900 items-center p-1 justify-between w-full">
        <div>
          <h1 className="mx-3 text-sm font-medium block text-left py-1 px-2 text-slate-400">
            {board.name}
          </h1>
        </div>

        <div className="flex flex-row mr-4">
          <h1 className="text-xs font-bold text-green-400">
            Viewing in shared mode, you may not make edits.
          </h1>
        </div>
      </div>

      <div
        style={{ backgroundColor: board.color }}
        className="h-full relative min-h-0 flex flex-col gap-10 overflow-x-scroll pt-14"
      >
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center p-10">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Page Not Found</CardTitle>
            <CardDescription>
              The resource you are looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 text-sm font-semibold">
              Please contact the owner of this board, they may not have sharing
              enabled, or this board may not exist.
            </p>
          </CardContent>
          <CardFooter className="flex flex-row justify-end w-full">
            <BackButton href="/home" label="Back Home" />
          </CardFooter>
        </Card>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
