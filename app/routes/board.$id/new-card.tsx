import { Form, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { CancelButton } from "./components";
import { INTENTS, ItemMutationFields } from "./types";

export function NewCard({
  columnId,
  nextOrder,
  onComplete,
  onAddCard,
}: {
  columnId: string;
  nextOrder: number;
  onComplete: () => void;
  onAddCard: () => void;
}) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let submit = useSubmit();

  return (
    <Form
      method="post"
      className="px-2 py-1 border-t-2 border-b-2 border-transparent"
      onSubmit={(event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let id = crypto.randomUUID();
        formData.set(ItemMutationFields.id.name, id);

        submit(formData, {
          method: "post",
          fetcherKey: `card:${id}`,
          navigate: false,
          unstable_flushSync: true,
        });

        invariant(textAreaRef.current);
        textAreaRef.current.value = "";
        onAddCard();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onComplete();
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createItem} />

      <input
        type="hidden"
        name={ItemMutationFields.columnId.name}
        value={columnId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={nextOrder}
      />

      <textarea
        name={ItemMutationFields.title.name}
        ref={textAreaRef}
        autoFocus
        required
        placeholder="Enter a title for this card"
        className="outline-none shadow text-[16px] sm:text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef.current, "expected button ref");
            buttonRef.current.click();
          }

          if (event.key === "Escape") {
            onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <div className="flex justify-between">
        <Button
          variant="ghost"
          className="bg-slate-900 text-slate-300"
          ref={buttonRef}
        >
          Save Card
        </Button>
        <CancelButton onClick={onComplete}>Cancel</CancelButton>
      </div>
    </Form>
  );
}
