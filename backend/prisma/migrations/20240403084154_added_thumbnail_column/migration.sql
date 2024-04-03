/*
  Warnings:

  - A unique constraint covering the columns `[thumbnail]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "thumbnail" TEXT NOT NULL DEFAULT 'no thumbnail';

-- CreateIndex
CREATE UNIQUE INDEX "Images_thumbnail_key" ON "Images"("thumbnail");
