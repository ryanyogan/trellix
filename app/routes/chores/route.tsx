import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { ChevronDown, Clock, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { CompleteChoreModal } from "~/components/complete-chore-modal";
import { NavigationLinks } from "~/components/navigation-links";
import NewChoreModal from "~/components/new-chore-modal";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { INTENTS } from "../board.$id/types";
import {
  completeChore,
  createChore,
  createChoreType,
  deleteChore,
  getChoreTypes,
  getChores,
} from "./queries";

export const meta = () => {
  return [{ title: "Boards" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountId = await requireAuthCookie(request);
  const intent = String(formData.get("intent"));
  invariant(accountId, "Unauthenticated");
  invariant(intent, "intent is missing");

  switch (intent) {
    case INTENTS.createChoreType: {
      const name = String(formData.get("name") ?? "");
      invariant(name, "Name is required.");

      await createChoreType({ name });

      return redirect("/chores");
    }

    case "deleteChore": {
      const id = String(formData.get("choreId"));
      invariant(id, "missing id");

      await deleteChore({ accountId, id });
      return json({ ok: true, error: null }, 201);
    }

    case INTENTS.completeChore: {
      const choreId = String(formData.get("choreId"));
      invariant(choreId, "choreId missing");
      try {
        await completeChore({ accountId, id: choreId });
        return json({ ok: true, error: null }, 201);
      } catch (error) {
        return json({ ok: false, error }, 500);
      }
    }

    case INTENTS.createChore: {
      const title = String(formData.get("title") ?? "");
      const description = String(formData.get("description") ?? "");
      const choreTypeId = String(formData.get("choreTypeId"));
      const color = String(formData.get("color"));
      invariant(choreTypeId, "missing chore type id");
      invariant(color, "missing chore type id");

      try {
        await createChore({
          accountId,
          title,
          description,
          choreTypeId,
          color,
        });

        return json({ ok: true, error: null }, 201);
      } catch (error) {
        return json({ ok: false, error: "Error Occurred" }, 500);
      }
    }

    default: {
      return json({ ok: false, error: "Unknown Intent" }, 400);
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request);
  invariant(accountId, "Unauthorized");

  const [chores, categories] = await Promise.all([
    getChores({ accountId }),
    getChoreTypes(),
  ]);

  return { chores, categories };
}

export default function Projects() {
  return (
    <div className="h-full flex flex-col">
      <NavigationLinks />

      <Boards />

      <div className="fixed bottom-0 left-2 right-2 bg-slate-800/50 border-slate-700 border rounded-tr-lg rounded-tl-lg">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="flex flex-row items-center justify-center">
              <Button variant="link" className="text-slate-500">
                Create New Category
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <Form method="post">
              <input
                type="hidden"
                name="intent"
                value={INTENTS.createChoreType}
              />
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Create Category</DrawerTitle>
                  <DrawerDescription>
                    Chore categories allow you to group chores by similiar
                    function or expected outcome.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input required name="name" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button type="submit">Create</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </Form>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

function Boards() {
  const { chores } = useLoaderData<typeof loader>();
  const [choreId, setChoreId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (choreId) {
      setModalOpen(true);
    }
  }, [choreId]);

  const completedChores = chores.filter((chore) => chore.complete);
  const todaysChores = chores.filter((chore) => !chore.complete);

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex flex-row items-end justify-between w-full">
          <h1 className="text-blue-400">Today</h1>
          <h1 className="text-slate-600 text-sm">
            {format(new Date(), "MMM, d yyyy")}
          </h1>
        </div>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {todaysChores.map((chore) => (
            <Chore
              setChoreId={setChoreId}
              key={chore.id}
              description={chore.description}
              name={chore.title}
              id={chore.id}
              complete={chore.complete}
              color={chore.color}
            />
          ))}
        </nav>
      </div>

      <div>
        <h1 className="text-blue-400 ">Completed Chores</h1>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
        <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {completedChores.map((chore) => (
            <Chore
              setChoreId={setChoreId}
              key={chore.id}
              description={chore.description}
              name={chore.title}
              id={chore.id}
              complete={chore.complete}
              color={chore.color}
            />
          ))}
        </nav>
      </div>

      <div>
        <h1 className="text-blue-400 ">All Chores</h1>
        <Separator className="bg-slate-700/50 mt-2 mb-8" />
      </div>
      <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <NewChore />
      </nav>

      <CompleteChoreModal
        choreId={choreId!}
        isOpen={modalOpen}
        setClose={() => {
          setModalOpen(false);
          setChoreId(null);
        }}
      />
    </div>
  );
}

function NewChore() {
  const { categories } = useLoaderData<typeof loader>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function toggleModal() {
    setModalOpen((current) => !current);
  }

  return (
    <>
      <div
        onClick={toggleModal}
        className="flex w-full h-28 sm:h-40 p-4 justify-center items-center cursor-pointer rounded-sm border-slate-700/50 border shadow text-slate-700 hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      >
        <div className="">
          <PlusIcon className="h-20 w-20" />
        </div>
      </div>
      <NewChoreModal
        isOpen={modalOpen}
        categories={categories}
        setClose={() => setModalOpen(false)}
      />
    </>
  );
}

function Chore({
  name,
  id,
  description,
  color,
  setChoreId,
  complete = false,
}: {
  name: string;
  id: string;
  description: string;
  color: string;
  setChoreId: (choreId: string) => void;
  complete: boolean;
}) {
  const fetcher = useFetcher();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div
      style={{ borderLeftColor: color }}
      className="w-full cursor-pointer h-28 sm:h-40 p-4 block rounded-sm border-l-2 border-slate-700/50 border shadow hover:shadow-xl bg-slate-800/50 relative hover:bg-slate-800/80"
      onClick={() => setChoreId(id)}
    >
      <div className="font-semibold text-ellipsis text-blue-400">{name}</div>
      <div className="text-slate-500 text-xs sm:text-sm mt-2 text-ellipsis mr-6 sm:mr-0">
        {description}
      </div>

      <div className="absolute sm:bottom-4 sm:right-4 bottom-2 right-2">
        <Clock
          className={cn(
            "text-slate-700 w-6 h-6 sm:h-10 sm:w-10",
            complete && "text-green-400",
          )}
        />
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-2 right-2"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ChevronDown className="w-4 h-4 text-blue-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="deleteChore" />
                <input type="hidden" name="choreId" value={id} />
                <button
                  aria-label="Delete Chore"
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
    </div>
  );
}
