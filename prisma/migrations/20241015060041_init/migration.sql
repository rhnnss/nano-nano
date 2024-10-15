-- DropForeignKey
ALTER TABLE `Posts` DROP FOREIGN KEY `Posts_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
