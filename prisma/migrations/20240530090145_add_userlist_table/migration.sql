-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userListId" INTEGER;

-- CreateTable
CREATE TABLE "UserList" (
    "id" SERIAL NOT NULL,
    "userCount" INTEGER NOT NULL,

    CONSTRAINT "UserList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userListId_fkey" FOREIGN KEY ("userListId") REFERENCES "UserList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
