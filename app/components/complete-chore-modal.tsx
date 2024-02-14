import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { Modal } from "~/components/modal";
import { Portal } from "~/components/portal";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { INTENTS } from "~/routes/board.$id/types";

export function CompleteChoreModal({
  choreId,
  isOpen,
  setClose,
}: {
  choreId: string;
  isOpen: boolean;
  setClose: () => void;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: boolean }>();
  const fetching = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher?.data?.ok) {
      setClose();
    }
  }, [fetcher, setClose]);

  return (
    <Portal wrapperId={`complete-chore-${choreId}`}>
      <Modal
        triggerClose={setClose}
        isOpen={isOpen}
        className="w-full m-2 sm:m-0 sm:w-2/3 sm:p-6 z-50"
      >
        <h1 className="text-lg font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-blue-400">
          Complete a chore
        </h1>

        <div className="flex mx-2 mb-4">
          <Separator className="bg-slate-700" />
        </div>

        <fetcher.Form method="post" action="/chores">
          <input type="hidden" name="intent" value={INTENTS.completeChore} />
          <input type="hidden" name="choreId" value={choreId} />

          <div className="flex gap-8 my-8 px-2 flex-row items-center justify-between w-full">
            <Button
              variant="link"
              type="button"
              className="p-10 w-full border-red-400 border bg-red-400/20 rounded-sm text-red-400"
              onClick={(event) => {
                event.stopPropagation();
                setClose();
              }}
            >
              Not Yet
            </Button>

            <Button
              variant="link"
              type="submit"
              className="p-10 w-full border-green-400 bg-green-400/20 border rounded-sm text-green-400"
            >
              {fetching ? "Completing..." : "Completed"}
            </Button>
          </div>
        </fetcher.Form>
      </Modal>
    </Portal>
  );
}
