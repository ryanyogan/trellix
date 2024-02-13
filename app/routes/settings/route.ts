import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireAuthCookie } from "~/auth/auth";
import { INTENTS } from "../board.$id/types";
import { createKid, getKidsForHouse } from "./queries";
import { SettingsPage } from "./settings";

export const meta = () => {
  return [{ title: "Choring - Boards" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthCookie(request);

  const kids = await getKidsForHouse();
  if (!kids) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ kids });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAuthCookie(request);
  let formData = await request.formData();
  let intent = String(formData.get("intent"));

  switch (intent) {
    case INTENTS.createKid: {
      let name = String(formData.get("name"));
      let color = String(formData.get("color"));
      const emoji = String(formData.get("emoji"));
      invariant(name, "expected name");
      invariant(color, "expected color");

      await createKid({ name, color, emoji });

      return json({ ok: true });
    }

    default: {
      console.log(intent);
    }
  }
}

export { SettingsPage as default };
