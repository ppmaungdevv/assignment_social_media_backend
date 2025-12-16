/*
  Warnings:

  - The primary key for the `RevokedToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RevokedToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `RevokedToken` table. All the data in the column will be lost.
  - Added the required column `jti` to the `RevokedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RevokedToken` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `token`,
    ADD COLUMN `jti` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`jti`);

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `replacedByToken` VARCHAR(191) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    UNIQUE INDEX `RefreshToken_replacedByToken_key`(`replacedByToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
