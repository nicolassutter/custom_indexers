/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_hash_key" ON "Item"("hash");
