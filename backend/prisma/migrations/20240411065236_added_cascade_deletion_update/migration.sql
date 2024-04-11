-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_noteId_fkey";

-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_noteId_fkey";

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
