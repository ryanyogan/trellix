import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import { requireAuthCookie } from "~/auth/auth";
import { NewBoard } from "~/components/new-board";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { badRequest } from "~/http/bad-request";
import { createAuditLog } from "~/lib/create-audit-log";
import { triggerCreateBoardEvent } from "../board.$id/events";
import { INTENTS } from "../board.$id/types";
import {
  createBoard,
  deleteBoard,
  getHomeData,
  getRecentEvents,
} from "./queries";

export const meta = () => {
  return [{ title: "Boards" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userId = await requireAuthCookie(request);
  let boards = await getHomeData(userId);
  let events = await getRecentEvents(userId);

  return { boards, events };
}

export async function action({ request }: ActionFunctionArgs) {
  let accountId = await requireAuthCookie(request);
  let formData = await request.formData();
  let intent = String(formData.get("intent"));

  switch (intent) {
    case INTENTS.createBoard: {
      let name = String(formData.get("name") || "");
      let color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad Request");

      let [board] = await Promise.all([
        createBoard(accountId, name, color),
        triggerCreateBoardEvent(accountId),
      ]);

      await createAuditLog({
        entityTitle: board.name,
        entityId: String(board.id),
        entityType: "BOARD",
        action: "CREATE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return redirect(`/board/${board.id}`);
    }

    case INTENTS.deleteBoard: {
      let boardId = Number(formData.get("boardId"));
      if (!boardId) throw badRequest("Missing board");
      const board = await deleteBoard(boardId, accountId);

      await createAuditLog({
        entityTitle: board.name,
        entityId: String(board.id),
        entityType: "BOARD",
        action: "DELETE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}

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
  let { boards } = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
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
        </nav>
      )}
    </div>
  );
}

function Board({
  name,
  color,
  id,
  itemCount,
  shareable,
}: {
  name: string;
  id: number;
  color: string;
  itemCount: number;
  shareable?: boolean | null;
}) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.state !== "idle";

  return isDeleting ? null : (
    <Link
      to={`/board/${id}`}
      className="w-full h-28 sm:h-40 p-4 block rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      style={{ borderLeftColor: color }}
    >
      <div className="font-semibold text-ellipsis text-blue-400">{name}</div>

      <div className="absolute bottom-2">
        <div className="text-slate-600 text-xs sm:text-sm">
          <span className="text-blue-500">{itemCount}</span> Items
        </div>
      </div>

      {shareable ? (
        <div className="absolute bottom-2 right-2">
          <div className="text-green-300 text-xs">Sharing</div>
        </div>
      ) : null}

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-4 right-4"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="deleteBoard" />
                <input type="hidden" name="boardId" value={id} />
                <button
                  aria-label="Delete board"
                  type="submit"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  Delete
                </button>
              </fetcher.Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}
