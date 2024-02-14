import invariant from "tiny-invariant";
import type { ItemMutation } from "./types";
import { ItemMutationFields } from "./types";

export function parseItemMutation(formData: FormData): ItemMutation {
  const id = ItemMutationFields.id.type(formData.get("id"));
  invariant(id, "Missing item id");

  const columnId = ItemMutationFields.columnId.type(formData.get("columnId"));
  invariant(columnId, "Missing column id");

  const order = ItemMutationFields.order.type(formData.get("order"));
  invariant(typeof order === "number", "Missing order");

  const title = ItemMutationFields.title.type(formData.get("title"));
  invariant(title, "Missing title");

  return { id, columnId, order, title };
}
