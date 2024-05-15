/*
  Warnings:

  - The primary key for the `Habit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HabitRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `HabitRecord` DROP FOREIGN KEY `HabitRecord_habitId_fkey`;

-- AlterTable
ALTER TABLE `Habit` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `HabitRecord` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `habitId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `HabitRecord` ADD CONSTRAINT `HabitRecord_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
