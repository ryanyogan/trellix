import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { Modal } from "~/components/modal";
import { Portal } from "~/components/portal";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { INTENTS } from "../board.$id/types";
import { createChore, getChoreTypes } from "./queries";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountId = await requireAuthCookie(request);
  const intent = String(formData.get("intent"));
  invariant(accountId, "Unauthenticated");
  invariant(intent, "intent is missing");

  switch (intent) {
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

        return redirect("/chores");
      } catch (error) {
        return json({ error: "Error Occurred" }, 500);
      }
    }

    default: {
      return json({ error: "Unknown Intent" }, 400);
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request);
  invariant(accountId, "Unauthorized");

  const categories = await getChoreTypes();

  return json({ categories }, 200);
}

export default function ItemDetail() {
  const { categories } = useLoaderData<typeof loader>();

  const params = useParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  let buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Portal wrapperId="new-chore">
      <Modal
        backTo={`/chores`}
        isOpen={true}
        className="w-full m-2 sm:m-0 sm:w-2/3 sm:p-6"
      >
        <h1 className="text-lg font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-blue-400">
          New Chore
        </h1>

        <div className="flex mx-2 mb-4">
          <Separator className="bg-slate-700" />
        </div>

        <Form method="post">
          <input type="hidden" name="intent" value={INTENTS.createChore} />

          <div className="mx-2 flex flex-col space-y-4">
            <Label className="text-blue-400">Title</Label>
            <Input
              name="title"
              defaultValue={""}
              required
              className="mt-1 resize-none text-[16px] bg-slate-800 border text-blue-300 border-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  invariant(buttonRef.current, "expected button ref");
                  buttonRef.current.click();
                }
              }}
            />

            <Label className="text-blue-400">Description</Label>
            <Textarea
              name="description"
              defaultValue={""}
              required
              className="mt-1 resize-none text-[16px] bg-slate-800 border text-blue-300 border-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  invariant(buttonRef.current, "expected button ref");
                  buttonRef.current.click();
                }

                if (event.key === "Escape") {
                  navigate(`/board/${params.id}`);
                }
              }}
            />
            <div className="w-full">
              <div className="space-y-2 flex flex-row items-end justify-between">
                <div className="flex flex-col items-start gap-y-1">
                  <Label className="text-blue-400">Category</Label>
                  <div className="bg-slate-800 mt-2 w-full p-1 flex flex-row items-center rounded-md border border-slate-700">
                    <Select required name="choreTypeId">
                      <SelectTrigger className="w-full bg-slate-800 border-0 text-blue-300">
                        <SelectValue placeholder="Please choose one" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Activies</SelectLabel>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start gap-y-1">
                  <Label className="text-blue-400">Color</Label>
                  <div className="bg-slate-800 mt-2 w-full p-1 flex flex-row items-center rounded-md border border-slate-700">
                    <Input
                      className="w-[100px] bg-slate-800 border-0"
                      id="board-color"
                      name="color"
                      type="color"
                      defaultValue="#3b82f6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="link"
              type="button"
              className="text-orange-400 font-bold px-3 py-2"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/chores`);
              }}
            >
              Cancel
            </Button>
            <Button
              ref={buttonRef}
              variant="link"
              type="submit"
              className="text-green-400 font-bold px-3 py-2"
            >
              {isLoading ? "Creating..." : "Create Chore"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Portal>
  );
}
