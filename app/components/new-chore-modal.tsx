import { useFetcher, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { Modal } from "~/components/modal";
import { Portal } from "~/components/portal";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { INTENTS } from "~/routes/board.$id/types";

export default function NewChoreModal({
  isOpen,
  setClose,
}: {
  isOpen: boolean;
  setClose: () => void;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: boolean }>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  let buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (fetcher?.data?.ok) {
      setClose();
    }
  }, [fetcher]);

  return (
    <Portal wrapperId="new-chore">
      <Modal
        triggerClose={setClose}
        isOpen={isOpen}
        className="w-full m-2 sm:m-0 sm:w-2/3 sm:p-6"
      >
        <h1 className="text-lg font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-blue-400">
          New Chore
        </h1>

        <div className="flex mx-2 mb-4">
          <Separator className="bg-slate-700" />
        </div>

        <fetcher.Form method="post" action="/chores">
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
              }}
            />
            <div className="w-full">
              <div className="space-y-2 flex flex-row items-end justify-start gap-x-4">
                <div className="flex flex-col items-start justify-start gap-y-1">
                  <Label className="text-blue-400">Due Date</Label>
                  <div className="bg-slate-800 mt-2 w-full p-1 flex flex-row items-center rounded-md border border-slate-700">
                    <Input
                      className="px-2 bg-slate-800 cursor-pointer text-blue-300 border-0"
                      id="due-date"
                      name="dueDate"
                      type="date"
                    />
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
                setClose();
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
        </fetcher.Form>
      </Modal>
    </Portal>
  );
}
