import { Form, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Icon } from "~/icons/icons";
import { CancelButton } from "./components";
import { INTENTS } from "./types";

export function NewColumn({
  boardId,
  onAdd,
  editInitially,
}: {
  boardId: number;
  onAdd: () => void;
  editInitially: boolean;
}) {
  const [editing, setEditing] = useState(editInitially);
  const submit = useSubmit();
  const inputRef = useRef<HTMLInputElement>(null);

  return editing ? (
    <Form
      method="post"
      navigate={false}
      className="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-80 border rounded-xl shadow bg-slate-100"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("id", crypto.randomUUID());
        submit(formData, {
          navigate: false,
          method: "post",
          unstable_flushSync: true,
        });
        onAdd();
        invariant(inputRef.current, "missing input ref");
        inputRef.current.value = "";
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setEditing(false);
        }
      }}
    >
      <input type="hidden" name="intent" value={INTENTS.createColumn} />
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="content" value="" />
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        required
        ref={inputRef}
        type="text"
        name="name"
        className="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
      />

      <div className="flex justify-between">
        <Button variant="ghost" className="bg-slate-900 text-slate-300">
          Save Card
        </Button>
        <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
      </div>
    </Form>
  ) : (
    <button
      onClick={() => {
        flushSync(() => {
          setEditing(true);
        });
        onAdd();
      }}
      aria-label="add new column"
      className="flex-shrink-0 flex justify-center h-16 w-16 bg-black hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-xl"
    >
      <Icon name="plus" size="xl" />
    </button>
  );
}
