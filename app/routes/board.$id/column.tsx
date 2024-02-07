import { useFetcher, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import invariant from "tiny-invariant";
import { Icon } from "~/icons/icons";
import { Card } from "./card";
import { EditableText } from "./components";
import { NewCard } from "./new-card";
import { CONTENT_TYPES, INTENTS, ItemMutation, RenderedItem } from "./types";

interface ColumnProps {
  name: string;
  columnId: string;
  items: RenderedItem[];
  boardId: number;
  color: string;
}

export function Column({ name, columnId, items, boardId, color }: ColumnProps) {
  const [acceptDrop, setAcceptDrop] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const submit = useSubmit();
  const deleteFetcher = useFetcher();

  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop - listRef.current.scrollHeight;
  }

  return (
    <div
      className={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 bg-slate-900 rounded-sm border-t border-slate-700/50 border shadow-xl bg-slate-800/50" +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      style={{ borderTopColor: color }}
      onDragOver={(event) => {
        if (
          items.length === 0 &&
          event.dataTransfer.types.includes(CONTENT_TYPES.card)
        ) {
          event.preventDefault();
          setAcceptDrop(true);
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false);
      }}
      onDrop={(event) => {
        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );
        invariant(transfer.id, "missing transfer.id");
        invariant(transfer.title, "missing transfer.title");
        invariant(transfer.content, "missing transfer.content");

        let mutation: ItemMutation = {
          order: 1,
          columnId,
          id: transfer.id,
          title: transfer.title,
          content: transfer.content,
        };

        submit(
          { ...mutation, intent: INTENTS.moveItem },
          {
            method: "post",
            navigate: false,
            fetcherKey: `card:${transfer.id}`,
          },
        );

        setAcceptDrop(false);
      }}
    >
      <div className="p-2 relative">
        <EditableText
          fieldName="name"
          value={name}
          inputLabel="Edit column name"
          buttonLabel={`Edit column "${name}" name`}
          inputClassName="border border-slate-400  rounded-lg py-1 px-2 font-medium text-black"
          buttonClassName="block rounded-lg text-left border border-transparent py-1 px-2 font-medium text-blue-300"
        >
          <input type="hidden" name="intent" value={INTENTS.updateColumn} />
          <input type="hidden" name="columnId" value={columnId} />
        </EditableText>

        {items.length === 0 ? (
          <deleteFetcher.Form method="post">
            <input type="hidden" name="intent" value={INTENTS.deleteColumn} />
            <input type="hidden" name="columnId" value={columnId} />
            <button
              disabled={items.length !== 0}
              aria-label="Delete card"
              className="absolute top-4 right-4 hover:text-brand-red"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Icon name="trash" />
            </button>
          </deleteFetcher.Form>
        ) : null}
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, index, items) => (
            <Card
              boardId={boardId}
              key={item.id}
              title={item.title}
              content={item.content}
              id={item.id}
              order={item.order}
              complete={item.complete}
              columnId={columnId}
              previousOrder={items[index - 1] ? items[index - 1].order : 0}
              nextOrder={
                items[index + 1] ? items[index + 1].order : item.order + 1
              }
            />
          ))}
      </ul>

      {edit ? (
        <NewCard
          columnId={columnId}
          nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2">
          <button
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });

              scrollList();
            }}
            className="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-800 focus:bg-slate-800"
          >
            <Icon name="plus" /> Add a card
          </button>
        </div>
      )}
    </div>
  );
}
