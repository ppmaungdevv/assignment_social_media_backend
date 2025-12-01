/*
  Warnings:

  - You are about to drop the column `revoked` on the `RevokedToken` table. All the data in the column will be lost.
  - Added the required column `expireAt` to the `RevokedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RevokedToken` DROP COLUMN `revoked`,
    ADD COLUMN `expireAt` DATETIME(3) NOT NULL;
