/*
  Warnings:

  - You are about to drop the column `authCurrentToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `authTokenExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "authCurrentToken",
DROP COLUMN "authTokenExpiresAt",
ADD COLUMN     "session" TEXT;
