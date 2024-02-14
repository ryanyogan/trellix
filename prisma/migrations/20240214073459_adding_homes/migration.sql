-- CreateTable
CREATE TABLE "Home" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#eaeaea',
    "accountId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Home_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#eaeaea',
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "accountId" TEXT,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "kidId" TEXT,
    "homeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Chore_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chore_kidId_fkey" FOREIGN KEY ("kidId") REFERENCES "Kid" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chore_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chore" ("accountId", "color", "complete", "completedAt", "createdAt", "description", "dueDate", "id", "kidId", "title", "updatedAt") SELECT "accountId", "color", "complete", "completedAt", "createdAt", "description", "dueDate", "id", "kidId", "title", "updatedAt" FROM "Chore";
DROP TABLE "Chore";
ALTER TABLE "new_Chore" RENAME TO "Chore";
CREATE TABLE "new_Kid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "score" REAL,
    "color" TEXT NOT NULL DEFAULT '#93c1fd',
    "emoji" TEXT NOT NULL DEFAULT '👶',
    "homeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Kid_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Kid" ("color", "createdAt", "emoji", "id", "name", "score", "updatedAt") SELECT "color", "createdAt", "emoji", "id", "name", "score", "updatedAt" FROM "Kid";
DROP TABLE "Kid";
ALTER TABLE "new_Kid" RENAME TO "Kid";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
