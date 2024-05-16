/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Habit` DROP FOREIGN KEY `Habit_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HabitRecord` DROP FOREIGN KEY `HabitRecord_userId_fkey`;

-- AlterTable
ALTER TABLE `Habit` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `HabitRecord` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`username`);

-- AddForeignKey
ALTER TABLE `Habit` ADD CONSTRAINT `Habit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HabitRecord` ADD CONSTRAINT `HabitRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
