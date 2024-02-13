import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { getKidsForHouse } from "./queries";
import { SettingsPage } from "./settings";

export const meta = () => {
  return [{ title: "Choring - Boards" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let accountId = await requireAuthCookie(request);

  const kids = await getKidsForHouse();
  if (!kids) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ kids });
}

export async function action({ request }: ActionFunctionArgs) {
  let accountId = await requireAuthCookie(request);
  let formData = await request.formData();
  let intent = String(formData.get("intent"));

  switch (intent) {
  }
}

export { SettingsPage as default };
