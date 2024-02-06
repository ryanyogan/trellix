import { Link, useFetcher, useSubmit } from "@remix-run/react";
import { useState } from "react";

import { Icon } from "~/icons/icons";

import invariant from "tiny-invariant";
import { cn } from "~/lib/utils";
import { CONTENT_TYPES, INTENTS, ItemMutation } from "./types";

interface CardProps {
  title: string;
  content: string | null;
  id: string;
  columnId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
  complete: boolean | null;
  boardId: number;
}

export function Card({
  title,
  content,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
  complete,
  boardId,
}: CardProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");

  return deleteFetcher.state !== "idle" ? null : (
    <li
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        let rect = event.currentTarget.getBoundingClientRect();
        let midpoint = (rect.top + rect.bottom) / 2;
        setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(event) => {
        event.stopPropagation();

        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );

        invariant(transfer.id, "missing cardId");
        invariant(transfer.title, "missing title");

        let droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
        let moveOrder = (droppedOrder + order) / 2;

        let mutation: ItemMutation = {
          order: moveOrder,
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

        setAcceptDrop("none");
      }}
      className={
        "border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 " +
        (acceptDrop === "top"
          ? "border-t-slate-500 border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-slate-500 border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >
      <div
        draggable
        className={cn(
          "bg-slate-900 text-sm border-b border-slate-800 w-full py-1 px-2 relative",
        )}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            CONTENT_TYPES.card,
            JSON.stringify({ id, title, content }),
          );
        }}
      >
        <h3 className="break-words mr-14">
          <Link
            className="text-blue-500 hover:text-blue-400 font-semibold"
            to={`/board/${boardId}/card/${id}`}
            prefetch="intent"
          >
            {title}
          </Link>
        </h3>

        <div className="mt-2 text-blue-300 mb-2">{content || <>&nbsp;</>}</div>

        <deleteFetcher.Form method="post">
          <input type="hidden" name="intent" value={INTENTS.deleteCard} />
          <input type="hidden" name="itemId" value={id} />
          <button
            aria-label="Delete card"
            className="absolute top-0 right-0 text-slate-600 hover:text-slate-500"
            type="submit"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Icon name="trash" />
          </button>
        </deleteFetcher.Form>
      </div>
    </li>
  );
}
