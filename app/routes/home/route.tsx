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
    <div className="h-full">
      <div className="flex flex-row items-center justify-between mt-8">
        <h1 className="font-bold text-3xl text-slate-800 ml-8">My Boards</h1>
        <div className="pr-6 text-right">
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
        <div className="text-slate-600 text-sm">
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
        <Button variant="default">
          <Plus className="h-5 w-5" />
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
