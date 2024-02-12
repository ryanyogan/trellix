import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { INTENTS } from "../board.$id/types";
import Chores from "./chores";
import {
  completeChore,
  createChore,
  createChoreType,
  deleteChore,
  getChoreTypes,
  getChores,
} from "./queries";

export const meta = () => {
  return [{ title: "Choring - Chores" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountId = await requireAuthCookie(request);
  const intent = String(formData.get("intent"));
  invariant(accountId, "Unauthenticated");
  invariant(intent, "intent is missing");

  switch (intent) {
    case INTENTS.createChoreType: {
      const name = String(formData.get("name") ?? "");
      invariant(name, "Name is required.");

      await createChoreType({ name });

      return redirect("/chores");
    }

    case "deleteChore": {
      const id = String(formData.get("choreId"));
      invariant(id, "missing id");

      await deleteChore({ accountId, id });
      return json({ ok: true, error: null }, 201);
    }

    case INTENTS.completeChore: {
      const choreId = String(formData.get("choreId"));
      invariant(choreId, "choreId missing");
      try {
        await completeChore({ accountId, id: choreId });
        return json({ ok: true, error: null }, 201);
      } catch (error) {
        return json({ ok: false, error }, 500);
      }
    }

    case INTENTS.createChore: {
      const title = String(formData.get("title") ?? "");
      const description = String(formData.get("description") ?? "");
      const choreTypeId = String(formData.get("choreTypeId"));
      const color = String(formData.get("color"));
      let dueDate = String(formData.get("dueDate")) || null;

      invariant(choreTypeId, "missing chore type id");
      invariant(color, "missing chore type id");

      if (dueDate) {
        dueDate = new Date(dueDate).toISOString();
      }

      try {
        await createChore({
          accountId,
          title,
          description,
          choreTypeId,
          color,
          dueDate,
        });

        return json({ ok: true, error: null }, 201);
      } catch (error) {
        return json({ ok: false, error }, 500);
      }
    }

    default: {
      return json({ ok: false, error: "Unknown Intent" }, 400);
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request);
  invariant(accountId, "Unauthorized");

  const [chores, categories] = await Promise.all([
    getChores({ accountId }),
    getChoreTypes(),
  ]);

  return { chores, categories };
}

export { Chores as default };
