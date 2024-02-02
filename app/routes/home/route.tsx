import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Plus } from "lucide-react";
import { requireAuthCookie } from "~/auth/auth";
import { Label } from "~/components/input";
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
import { badRequest } from "~/http/bad-request";
import { Icon } from "~/icons/icons";
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

      return redirect(`/board/${board.id}`);
    }

    case INTENTS.deleteBoard: {
      let boardId = Number(formData.get("boardId"));
      if (!boardId) throw badRequest("Missing board");
      await deleteBoard(boardId, accountId);

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
      <div className="bg-slate-900 shadow-lg flex flex-col justify-between items-center">
        <div className="flex w-full flex-row items-center px-8 mb-3 mt-2.5">
          <span className="text-xs font-semibold text-green-500 mr-2">10</span>
          <div className="w-full h-2 bg-slate-700 rounded-md">
            <div
              style={{ width: `20%` }}
              className="h-2 rounded-md bg-green-400"
            ></div>
          </div>
          <span className="text-xs text-indigo-400 ml-2">{200}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="bg-slate-900 shadow pb-2 rounded-br">
          <h1 className="mx-6 mt-1 text-lg font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-orange-500">
            My Boards
          </h1>
        </div>
        <div className="mr-2 mt-2">
          <NewBoard />
        </div>
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
        <nav className="grid grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Board
              key={board.id}
              name={board.name}
              id={board.id}
              color={board.color}
              itemCount={board.items.length}
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
}: {
  name: string;
  id: number;
  color: string;
  itemCount: number;
}) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.state !== "idle";

  return isDeleting ? null : (
    <Link
      to={`/board/${id}`}
      className="w-full h-28 sm:h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
      style={{ borderColor: color }}
    >
      <div className="font-semibold text-ellipsis">{name}</div>

      <div className="absolute bottom-2">
        <div className="text-slate-600 text-xs sm:text-sm">
          This board currently has{" "}
          <span className="text-blue-500">{itemCount}</span> items.
        </div>
      </div>

      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="deleteBoard" />
        <input type="hidden" name="boardId" value={id} />
        <button
          aria-label="Delete board"
          className="absolute top-4 right-4 hover:text-brand-red"
          type="submit"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Icon name="trash" />
        </button>
      </fetcher.Form>
    </Link>
  );
}

function NewBoard() {
  let navigation = useNavigation();
  let isCreating = navigation.formData?.get("intent") === "createBoard";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus className="h-6 w-6 font-bold" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Board</DialogTitle>
          <DialogDescription className="text-md">
            Create a new board here. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form method="post">
          <input type="hidden" name="intent" value="createBoard" />
          <div>
            <Label htmlFor="name">Board Name</Label>

            <Input
              name="name"
              type="text"
              autoCapitalize="true"
              className="text-[16px] sm:text-base"
              required
            />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex flex-col items-start gap-1">
              <Label htmlFor="color">Board Color</Label>
              <input
                id="board-color"
                name="color"
                type="color"
                defaultValue="#eaeaea"
                className="bg-transparent"
              />
            </div>
          </div>
          <div className="text-right">
            <Button type="submit">
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
