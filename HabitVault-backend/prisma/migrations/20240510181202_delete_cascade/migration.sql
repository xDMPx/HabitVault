-- DropForeignKey
ALTER TABLE `Habit` DROP FOREIGN KEY `Habit_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HabitRecord` DROP FOREIGN KEY `HabitRecord_habitId_fkey`;

-- DropForeignKey
ALTER TABLE `HabitRecord` DROP FOREIGN KEY `HabitRecord_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Habit` ADD CONSTRAINT `Habit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HabitRecord` ADD CONSTRAINT `HabitRecord_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HabitRecord` ADD CONSTRAINT `HabitRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
