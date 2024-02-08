import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { badRequest } from "~/http/bad-request";
import { createAuditLog } from "~/lib/create-audit-log";
import { INTENTS } from "../board.$id/types";
import { Home } from "./home";
import {
  createBoard,
  deleteBoard,
  getHomeData,
  getRecentEvents,
} from "./queries";

export const meta = () => {
  return [{ title: "Boards" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userId = await requireAuthCookie(request);
  let boards = await getHomeData(userId);
  let events = await getRecentEvents(userId);

  return { boards, events };
}

export async function action({ request }: ActionFunctionArgs) {
  let accountId = await requireAuthCookie(request);
  let formData = await request.formData();
  let intent = String(formData.get("intent"));

  switch (intent) {
    case INTENTS.createBoard: {
      let name = String(formData.get("name") || "");
      let color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad Request");

      let board = await createBoard(accountId, name, color);

      await createAuditLog({
        entityTitle: board.name,
        entityId: String(board.id),
        entityType: "BOARD",
        action: "CREATE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return redirect(`/board/${board.id}`);
    }

    case INTENTS.deleteBoard: {
      let boardId = Number(formData.get("boardId"));
      if (!boardId) throw badRequest("Missing board");
      const board = await deleteBoard(boardId, accountId);

      await createAuditLog({
        entityTitle: board.name,
        entityId: String(board.id),
        entityType: "BOARD",
        action: "DELETE",
        authorEmail: "hello@jk.com",
        authorId: accountId,
      });

      return { ok: true };
    }

    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}

export { Home as default };
