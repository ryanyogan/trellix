-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#eaeaea',
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "accountId" TEXT,
    "choreTypeId" TEXT NOT NULL,
    "kidId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Chore_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chore_choreTypeId_fkey" FOREIGN KEY ("choreTypeId") REFERENCES "ChoreType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chore_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chore" ("accountId", "choreTypeId", "color", "createdAt", "description", "id", "kidId", "title", "updatedAt") SELECT "accountId", "choreTypeId", "color", "createdAt", "description", "id", "kidId", "title", "updatedAt" FROM "Chore";
DROP TABLE "Chore";
ALTER TABLE "new_Chore" RENAME TO "Chore";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
