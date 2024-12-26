-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrackList" (
    "trackId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "trackedOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrackList" ("productId", "trackId", "trackedOn", "updatedAt", "userId") SELECT "productId", "trackId", "trackedOn", "updatedAt", "userId" FROM "TrackList";
DROP TABLE "TrackList";
ALTER TABLE "new_TrackList" RENAME TO "TrackList";
CREATE UNIQUE INDEX "TrackList_userId_key" ON "TrackList"("userId");
CREATE UNIQUE INDEX "TrackList_productId_key" ON "TrackList"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
