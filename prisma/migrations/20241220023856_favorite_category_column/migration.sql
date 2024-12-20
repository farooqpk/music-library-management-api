/*
  Warnings:

  - Added the required column `category` to the `favorites` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FavoriteCategory" AS ENUM ('ARTIST', 'ALBUM', 'TRACK');

-- AlterTable
ALTER TABLE "favorites" ADD COLUMN     "category" "FavoriteCategory" NOT NULL;
