export interface RenderedItem {
  id: string;
  title: string;
  order: number;
  content: string | null;
  columnId: string;
  complete: boolean | null;
}

export const CONTENT_TYPES = {
  card: "application/remix-card",
  column: "application/remix-column",
};

export const INTENTS = {
  createBoard: "createBoard" as const,
  deleteBoard: "deleteBoard" as const,
  editBoard: "editBoard" as const,
  updateBoardName: "updateBoard" as const,
  createColumn: "createColumn" as const,
  updateColumn: "updateColumn" as const,
  createItem: "createItem" as const,
  moveItem: "createItem" as const,
  deleteCard: "deleteCard" as const,
  deleteColumn: "deleteColumn" as const,
  markCardComplete: "markCardComplete" as const,
  updateBoardSharing: "updateBoardSharing" as const,
  updateCardTitle: "updateCardTitle" as const,
  updateCard: "updateCard" as const,
};

export const ItemMutationFields = {
  id: { type: String, name: "id" },
  columnId: { type: String, name: "columnId" },
  order: { type: Number, name: "order" },
  title: { type: String, name: "title" },
} as const;

export type ItemMutation = MutationFromFields<typeof ItemMutationFields>;

////////////////////////////////////////////////////////////////////////////////
// Bonkers TypeScript
type ConstructorToType<T> = T extends typeof String
  ? string
  : T extends typeof Number
    ? number
    : never;

export type MutationFromFields<T extends Record<string, any>> = {
  [K in keyof T]: ConstructorToType<T[K]["type"]>;
};
