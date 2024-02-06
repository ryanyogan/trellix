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
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { prisma } from "~/db/prisma";
import { EditableText } from "../board.$id/components";
import { INTENTS } from "../board.$id/types";
import { updateCard, updateCardTitle } from "./queries";

export async function loader({ params }: LoaderFunctionArgs) {
  const item = await prisma.item.findUnique({
    where: {
      id: params.itemId,
    },
  });

  if (!item) {
    throw redirect(`board/${params.id}`);
  }

  return json({ item }, 200);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountId = await requireAuthCookie(request);
  const intent = String(formData.get("intent"));
  const itemId = String(formData.get("id"));

  invariant(accountId, "Unauthenticated");
  invariant(itemId, "itemId is required");
  invariant(intent, "intent must be passed, what you doing?");

  switch (intent) {
    case INTENTS.updateCardTitle: {
      const title = String(formData.get("name") ?? "");
      invariant(title, "name is required");
      try {
        await updateCardTitle({ itemId, title });
        return { ok: true };
      } catch (error: any) {
        console.log(error);
      }
    }

    case INTENTS.updateCard: {
      const content = String(formData.get("content") ?? "");
      const boardId = String(formData.get("boardId") ?? "");
      // const complete = Boolean(formData.get("complete") ?? false);
      const complete = false;

      invariant(content, "missing content");
      invariant(boardId, "id is required");

      try {
        await updateCard({ itemId, content, complete });
        return redirect(`/board/${boardId}`);
      } catch (error: any) {
        console.log(error);
      }
    }

    default: {
      return { error: "Missing Intent" };
    }
  }
}

export default function ItemDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  let buttonRef = useRef<HTMLButtonElement>(null);

  const { item } = useLoaderData<typeof loader>();

  return (
    <Portal wrapperId="modal">
      <Modal
        backTo={`/board/${params.id}`}
        isOpen={true}
        className="w-full m-2 sm:m-0 sm:w-2/3 sm:p-6"
      >
        <EditableText
          value={item?.title ?? ""}
          fieldName="name"
          inputClassName="text-lg font-medium border border-slate-400 rounded-lg py-1 px-1 text-black"
          buttonClassName="text-lg font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-blue-400"
          buttonLabel={`Edit board "foo" name`}
          inputLabel="Edit board name"
        >
          <input type="hidden" name="intent" value={INTENTS.updateCardTitle} />
          <input type="hidden" name="id" value={item.id} />
        </EditableText>

        <div className="flex mx-2 mb-4">
          <Separator className="bg-slate-700" />
        </div>

        <Form method="post">
          <input type="hidden" name="intent" value={INTENTS.updateCard} />
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="boardId" value={params.id} />
          <input type="hidden" name="complete" value="false" />

          <div className="mx-2">
            <Label className="text-blue-400">Card Content</Label>
            <Textarea
              name="content"
              defaultValue={item?.content ?? ""}
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

            <div className="w-full space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex flex-col items-start gap-y-1">
                  <Label className="text-blue-400">Mark Complete</Label>
                  <div className="bg-slate-800 mt-1 w-full p-2 flex flex-row items-center rounded-md border border-slate-700">
                    <Switch
                      checked={Boolean(item.complete)}
                      onCheckedChange={() => {}}
                      aria-readonly
                      name="complete"
                    />
                    <div className="text-orange-400 ml-2 text-xs">
                      {item.complete ? "Completed" : "Not Completed"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex flex-col items-start gap-y-1">
                  <Label className="text-blue-400">Due Date</Label>
                  <div className="bg-slate-800 mt-1 w-full p-2 flex flex-row items-center rounded-md border border-slate-700">
                    <Input
                      className="bg-slate-800 border-transparent text-blue-300"
                      type="date"
                      name="dueDate"
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
                navigate(`/board/${params.id}`);
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
              {isLoading ? "Upading..." : "Update"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Portal>
  );
}
