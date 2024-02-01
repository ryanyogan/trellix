import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { badRequest, notFound } from "~/http/bad-request";
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
  let accountId = await requireAuthCookie(request);

  invariant(params.id, "Missing board ID");
  let id = Number(params.id);

  let board = await getBoardData(id, accountId);
  if (!board) throw notFound();

  let completionCount = await getCompleteItemCount(accountId, board.id);
  let totalCount = await getItemCount(accountId, board.id);

  return { board, completionCount, totalCount };
}

export async function action({ request, params }: ActionFunctionArgs) {
  let accountId = await requireAuthCookie(request);
  let boardId = Number(params.id);
  invariant(boardId, "Missing Board ID");

  let formData = await request.formData();
  let intent = formData.get("intent");

  if (!intent) throw badRequest("Missing Intent");

  switch (intent) {
    case INTENTS.updateBoardName: {
      let name = String(formData.get("name") || "");
      invariant(name, "Missing Name");
      await updateBoardName({ boardId, accountId, name });
      return { ok: true };
    }

    case INTENTS.editBoard: {
      let { name, color } = Object.fromEntries(formData);
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
      let id = String(formData.get("itemId") || "");
      await deleteCard(id, accountId);
      return { ok: true };
    }

    case INTENTS.markCardComplete: {
      let id = String(formData.get("itemId") || "");
      await markCardComplete(id, accountId);
      return { ok: true };
    }

    case INTENTS.deleteColumn: {
      let id = String(formData.get("columnId") || "");
      await deleteColumn(id, accountId);
      return { ok: true };
    }

    case INTENTS.createColumn: {
      let { name, id } = Object.fromEntries(formData);
      invariant(name, "Missing Name");
      invariant(id, "Missing ID");
      await createColumn(boardId, String(name), String(id), accountId);
      return { ok: true };
    }

    case INTENTS.updateColumn: {
      let { name, columnId } = Object.fromEntries(formData);
      if (!name || !columnId) throw badRequest("Missing name or columndId");
      await updateColumnName(String(columnId), String(name), accountId);
      return { ok: true };
    }

    case INTENTS.moveItem:
    case INTENTS.createItem: {
      let mutation = parseItemMutation(formData);
      await upsertItem({ ...mutation, boardId }, accountId);
      return { ok: true };
    }

    default: {
      console.log(intent);
    }
  }
}

export { Board as default };
