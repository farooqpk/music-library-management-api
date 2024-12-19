/*
  Warnings:

  - The `grammy` column on the `artists` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "artists" DROP COLUMN "grammy",
ADD COLUMN     "grammy" INTEGER NOT NULL DEFAULT 0;
