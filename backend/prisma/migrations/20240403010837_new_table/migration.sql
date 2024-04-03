/*
  Warnings:

  - You are about to drop the `_NotesToTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `favorite` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteId` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_NotesToTags" DROP CONSTRAINT "_NotesToTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_NotesToTags" DROP CONSTRAINT "_NotesToTags_B_fkey";

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "favorite" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "noteId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_NotesToTags";

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
