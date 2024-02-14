/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RenderedItem {
  id: string;
  title: string;
  order: number;
  content: any;
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
  createChore: "createChore" as const,
  createChoreType: "createChoreType" as const,
  completeChore: "completeChore" as const,
  createKid: "createKid" as const,
} as const;

export const ItemMutationFields = {
  id: { type: String, name: "id" },
  columnId: { type: String, name: "columnId" },
  order: { type: Number, name: "order" },
  title: { type: String, name: "title" },
  content: { type: String, name: "content" },
} as const;

export type ItemMutation = {
  id: string;
  columnId: string;
  order: number;
  title: string;
  content?: string;
  kidId?: string;
};
