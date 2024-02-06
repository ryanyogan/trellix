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
        invariant(transfer.content, "missing content");

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
          ? "border-t-brand-red border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-brand-red border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >
      <div
        draggable
        className={cn(
          "shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative",
          complete ? "bg-green-200 text-green-800" : "bg-white",
        )}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            CONTENT_TYPES.card,
            JSON.stringify({ id, title, content: content || "" }),
          );
        }}
      >
        <h3 className="break-words mr-14">
          <Link
            className="underline underline-offset-2 text-slate-500 hover:text-slate-600"
            to={`/board/${boardId}/card/${id}`}
            prefetch="intent"
          >
            {title}
          </Link>
        </h3>

        <div className="mt-2">{content || <>&nbsp;</>}</div>

        {/* {!complete ? (
          <deleteFetcher.Form method="post">
            <input
              type="hidden"
              name="intent"
              value={INTENTS.markCardComplete}
            />
            <input type="hidden" name="itemId" value={id} />
            <button
              aria-label="Complete card"
              className="absolute top-4 text-green-600 right-10 hover:text-green-900"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Check className="h-5 w-5 mt-[2px]" />
            </button>
          </deleteFetcher.Form>
        ) : null} */}

        <deleteFetcher.Form method="post">
          <input type="hidden" name="intent" value={INTENTS.deleteCard} />
          <input type="hidden" name="itemId" value={id} />
          <button
            aria-label="Delete card"
            className="absolute top-2 right-2 hover:text-brand-red"
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
