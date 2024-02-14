import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { badRequest } from "~/http/bad-request";
import { createAuditLog } from "~/lib/create-audit-log";
import { INTENTS } from "../board.$id/types";
import { Home } from "./home";
import { createBoard, deleteBoard, getHomeData } from "./queries";

export const meta = () => {
  return [{ title: "Choring - Boards" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request);
  const boards = await getHomeData(userId);

  return { boards };
}

export async function action({ request }: ActionFunctionArgs) {
  const accountId = await requireAuthCookie(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  switch (intent) {
    case INTENTS.createBoard: {
      const name = String(formData.get("name") || "");
      const color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad Request");

      const board = await createBoard(accountId, name, color);

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
      const boardId = Number(formData.get("boardId"));
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
