-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Kid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "score" REAL,
    "color" TEXT NOT NULL DEFAULT '#93c1fd',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Kid" ("createdAt", "id", "name", "score", "updatedAt") SELECT "createdAt", "id", "name", "score", "updatedAt" FROM "Kid";
DROP TABLE "Kid";
ALTER TABLE "new_Kid" RENAME TO "Kid";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
