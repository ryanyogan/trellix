import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { badRequest, notFound } from "~/http/bad-request";
import { createAuditLog } from "~/lib/create-audit-log";
import { getCompleteItemCount, getItemCount } from "../home/queries";
import { Board } from "./board";
import {
  createColumn,
  deleteCard,
  deleteColumn,
  editBoard,
  getBoardData,
  markCardComplete,
  updateBoardName,
  updateBoardSharing,
  updateColumnName,
  upsertItem,
} from "./queries";
import { INTENTS } from "./types";
import { parseItemMutation } from "./utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Board" },
    { name: "description", content: "Projects for ADHD" },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request);

  invariant(params.id, "Missing board ID");
  const id = Number(params.id);

  const board = await getBoardData(id, accountId);
  if (!board) throw notFound();

  const completionCount = await getCompleteItemCount(accountId, board.id);
  const totalCount = await getItemCount(accountId, board.id);

  return { board, completionCount, totalCount };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const accountId = await requireAuthCookie(request);
  const boardId = Number(params.id);
  invariant(boardId, "Missing Board ID");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (!intent) throw badRequest("Missing Intent");

  switch (intent) {
    case INTENTS.updateBoardName: {
      const name = String(formData.get("name") || "");
      invariant(name, "Missing Name");
      await updateBoardName({ boardId, accountId, name });

      await createAuditLog({
        entityTitle: name,
        entityId: String(boardId),
        entityType: "BOARD",
        action: "UPDATE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    case INTENTS.updateBoardSharing: {
      const shareable = formData.get("shareable");
      invariant(shareable, "shareable");
      const board = await updateBoardSharing({
        boardId,
        accountId,
        shareable: shareable === "true" ? true : false,
      });

      await createAuditLog({
        entityTitle: board.name,
        entityId: String(boardId),
        entityType: "BOARD",
        action: "SHARING",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });
      return { ok: true };
    }

    case INTENTS.editBoard: {
      const { name, color } = Object.fromEntries(formData);
      invariant(name, "Missing Name");
      invariant(color, "Missing Name");
      await editBoard({
        boardId,
        accountId,
        name: String(name),
        color: String(color),
      });

      return { ok: true };
    }

    case INTENTS.deleteCard: {
      const id = String(formData.get("itemId") || "");
      await deleteCard(id, accountId);
      return { ok: true };
    }

    case INTENTS.markCardComplete: {
      const id = String(formData.get("itemId") || "");
      const card = await markCardComplete(id, accountId);
      await createAuditLog({
        entityTitle: card.title,
        entityId: String(card.id),
        entityType: "CARD",
        action: "COMPLETE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    case INTENTS.deleteColumn: {
      const id = String(formData.get("columnId") || "");
      const col = await deleteColumn(id, accountId);

      await createAuditLog({
        entityTitle: col.name,
        entityId: String(col.id),
        entityType: "COLUMN",
        action: "DELETE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    case INTENTS.createColumn: {
      const { name, id } = Object.fromEntries(formData);
      invariant(name, "Missing Name");
      invariant(id, "Missing ID");
      const col = await createColumn(
        boardId,
        String(name),
        String(id),
        accountId,
      );

      await createAuditLog({
        entityTitle: col.name,
        entityId: String(col.id),
        entityType: "COLUMN",
        action: "CREATE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    case INTENTS.updateColumn: {
      const { name, columnId } = Object.fromEntries(formData);
      if (!name || !columnId) throw badRequest("Missing name or columndId");
      const col = await updateColumnName(
        String(columnId),
        String(name),
        accountId,
      );

      await createAuditLog({
        entityTitle: col.name,
        entityId: String(col.id),
        entityType: "COLUMN",
        action: "UPDATE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    case INTENTS.moveItem:
    case INTENTS.createItem: {
      const mutation = parseItemMutation(formData);
      await upsertItem({ ...mutation, boardId }, accountId);
      return { ok: true };
    }

    default: {
      console.log(intent);
    }
  }
}

export { Board as default };
