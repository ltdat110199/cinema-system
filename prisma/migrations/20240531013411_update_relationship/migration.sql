/*
  Warnings:

  - You are about to drop the column `userListId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userListId_fkey";

-- AlterTable
ALTER TABLE "Theater" ADD COLUMN     "movieId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userListId";

-- DropTable
DROP TABLE "UserList";

-- AddForeignKey
ALTER TABLE "Theater" ADD CONSTRAINT "Theater_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
