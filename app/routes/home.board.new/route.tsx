import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { Modal } from "~/components/modal";
import { Portal } from "~/components/portal";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { badRequest } from "~/http/bad-request";
import { createAuditLog } from "~/lib/create-audit-log";
import { INTENTS } from "../board.$id/types";
import { createBoard } from "../home/queries";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountId = await requireAuthCookie(request);
  const intent = String(formData.get("intent"));
  invariant(accountId, "Unauthenticated");
  invariant(intent, "intent is missing");

  switch (intent) {
    case INTENTS.createBoard: {
      const name = String(formData.get("name") || "");
      const color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad Request");

      try {
        const board = await createBoard(accountId, name, color);

        await createAuditLog({
          entityTitle: board.name,
          entityId: String(board.id),
          entityType: "BOARD",
          action: "CREATE",
          authorEmail: "hello@jk.com",
          authorId: accountId,
        });

        return redirect(`/board/${board.id}`);
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

  return null;
}

export default function ItemDetail() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Portal wrapperId="new-board">
      <Modal
        backTo={`/home`}
        isOpen={true}
        className="w-full m-2 sm:m-0 sm:w-2/3 sm:p-6"
      >
        <h1 className="text-lg font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-blue-400">
          New Board
        </h1>

        <div className="flex mx-2 mb-4">
          <Separator className="bg-slate-700" />
        </div>

        <Form method="post">
          <input type="hidden" name="intent" value={INTENTS.createBoard} />

          <div className="mx-2 flex flex-col space-y-4">
            <Label className="text-blue-400">Title</Label>
            <Textarea
              name="name"
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
            <div className="w-full">
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

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="link"
              type="button"
              className="text-orange-400 font-bold px-3 py-2"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/home`);
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
              {isLoading ? "Creating..." : "Create Board"}
            </Button>
          </div>
        </Form>
      </Modal>
    </Portal>
  );
}
