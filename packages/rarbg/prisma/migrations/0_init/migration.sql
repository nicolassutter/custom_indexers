-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dt" TEXT NOT NULL,
    "cat" TEXT NOT NULL,
    "size" BIGINT,
    "ext_id" TEXT,
    "imdb" TEXT
);

-- CreateIndex
CREATE INDEX "ix__ext_id" ON "Item"("ext_id");

-- CreateIndex
CREATE INDEX "ix__imdb" ON "Item"("imdb");

-- CreateIndex
CREATE INDEX "ix__cat" ON "Item"("cat");

