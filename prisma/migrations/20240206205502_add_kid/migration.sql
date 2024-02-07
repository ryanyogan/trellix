-- CreateTable
CREATE TABLE "Kid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "score" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "order" REAL NOT NULL,
    "complete" BOOLEAN DEFAULT false,
    "boardId" INTEGER NOT NULL,
    "columnId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "accountId" TEXT,
    "choreTypeId" TEXT,
    "kidId" TEXT,
    CONSTRAINT "Item_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_choreTypeId_fkey" FOREIGN KEY ("choreTypeId") REFERENCES "ChoreType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("accountId", "boardId", "choreTypeId", "columnId", "complete", "content", "createdAt", "id", "order", "title", "updatedAt") SELECT "accountId", "boardId", "choreTypeId", "columnId", "complete", "content", "createdAt", "id", "order", "title", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE INDEX "Item_complete_idx" ON "Item"("complete");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
