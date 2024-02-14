import { Link, useFetcher, useSubmit } from "@remix-run/react";
import { useState } from "react";

import { Icon } from "~/icons/icons";

import invariant from "tiny-invariant";
import { cn } from "~/lib/utils";
import type { ItemMutation } from "./types";
import { CONTENT_TYPES, INTENTS } from "./types";

interface CardProps {
  title: string;
  content: string | null;
  id: string;
  columnId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
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
  boardId,
}: CardProps) {
  const submit = useSubmit();
  const deleteFetcher = useFetcher();

  const [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">(
    "none",
  );

  return deleteFetcher.state !== "idle" ? null : (
    <li
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const midpoint = (rect.top + rect.bottom) / 2;
        setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(event) => {
        event.stopPropagation();

        const transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card),
        );

        invariant(transfer.id, "missing cardId");
        invariant(transfer.title, "missing title");
        console.log(transfer);

        const droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
        const moveOrder = (droppedOrder + order) / 2;

        const mutation: ItemMutation = {
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
        className={cn("bg-slate-800/50 text-sm w-full py-1 px-2 relative")}
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
            className="text-indigo-400 hover:text-blue-400 font-semibold"
            to={`/board/${boardId}/card/${id}`}
            prefetch="intent"
          >
            {title}
          </Link>
        </h3>

        <div className="mt-2 text-slate-400 mb-2">{content || <>&nbsp;</>}</div>

        <deleteFetcher.Form method="post">
          <input type="hidden" name="intent" value={INTENTS.deleteCard} />
          <input type="hidden" name="itemId" value={id} />
          <button
            aria-label="Delete card"
            className="absolute top-2 right-2 text-slate-600 hover:text-slate-500"
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
