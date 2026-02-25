-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `provider_account_id` VARCHAR(255) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(50) NULL,
    `scope` VARCHAR(500) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(255) NULL,

    INDEX `accounts_user_id_idx`(`user_id`),
    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(500) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    INDEX `sessions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(255) NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `palaces` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `verse_ref` VARCHAR(100) NOT NULL,
    `verse_text` TEXT NOT NULL,
    `template_key` VARCHAR(50) NOT NULL,
    `narrative` TEXT NULL,
    `image_style` VARCHAR(30) NOT NULL DEFAULT 'watercolor',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `palaces_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `palace_loci` (
    `id` VARCHAR(191) NOT NULL,
    `palace_id` VARCHAR(191) NOT NULL,
    `locus_index` INTEGER NOT NULL,
    `locus_name` VARCHAR(50) NOT NULL,
    `segment_text` TEXT NULL,
    `keyword` VARCHAR(100) NULL,
    `image_description` TEXT NULL,
    `image_url` VARCHAR(1000) NULL,
    `image_prompt` TEXT NULL,
    `senses` TEXT NULL,

    INDEX `palace_loci_palace_id_idx`(`palace_id`),
    UNIQUE INDEX `palace_loci_palace_id_locus_index_key`(`palace_id`, `locus_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `palace_verses` (
    `id` VARCHAR(191) NOT NULL,
    `palace_id` VARCHAR(191) NOT NULL,
    `verse_id` INTEGER NOT NULL,
    `order_num` INTEGER NOT NULL,

    INDEX `palace_verses_palace_id_idx`(`palace_id`),
    INDEX `palace_verses_verse_id_idx`(`verse_id`),
    UNIQUE INDEX `palace_verses_palace_id_verse_id_key`(`palace_id`, `verse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `palace_id` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(20) NOT NULL DEFAULT 'moderate',
    `repetition_num` INTEGER NOT NULL DEFAULT 0,
    `ease_factor` DOUBLE NOT NULL DEFAULT 2.5,
    `interval_days` INTEGER NOT NULL DEFAULT 1,
    `next_review_at` DATETIME(3) NOT NULL,
    `last_reviewed_at` DATETIME(3) NULL,

    INDEX `review_schedules_user_id_next_review_at_idx`(`user_id`, `next_review_at`),
    UNIQUE INDEX `review_schedules_user_id_palace_id_key`(`user_id`, `palace_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `memorization_attempts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `palace_id` VARCHAR(191) NOT NULL,
    `user_text` TEXT NOT NULL,
    `score` DOUBLE NOT NULL,
    `quality` INTEGER NOT NULL,
    `feedback` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `memorization_attempts_user_id_palace_id_idx`(`user_id`, `palace_id`),
    INDEX `memorization_attempts_user_id_created_at_idx`(`user_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cell_groups` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `invite_code` VARCHAR(20) NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cell_groups_invite_code_key`(`invite_code`),
    INDEX `cell_groups_owner_id_idx`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cell_group_members` (
    `id` VARCHAR(191) NOT NULL,
    `group_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'member',
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `cell_group_members_user_id_idx`(`user_id`),
    UNIQUE INDEX `cell_group_members_group_id_user_id_key`(`group_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `badges` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `icon_emoji` VARCHAR(10) NOT NULL,
    `condition` VARCHAR(200) NOT NULL,
    `category` VARCHAR(30) NOT NULL DEFAULT 'memorization',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_badges` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `badge_id` VARCHAR(191) NOT NULL,
    `earned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_badges_user_id_idx`(`user_id`),
    UNIQUE INDEX `user_badges_user_id_badge_id_key`(`user_id`, `badge_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `palaces` ADD CONSTRAINT `palaces_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `palace_loci` ADD CONSTRAINT `palace_loci_palace_id_fkey` FOREIGN KEY (`palace_id`) REFERENCES `palaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `palace_verses` ADD CONSTRAINT `palace_verses_palace_id_fkey` FOREIGN KEY (`palace_id`) REFERENCES `palaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `palace_verses` ADD CONSTRAINT `palace_verses_verse_id_fkey` FOREIGN KEY (`verse_id`) REFERENCES `verses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_schedules` ADD CONSTRAINT `review_schedules_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_schedules` ADD CONSTRAINT `review_schedules_palace_id_fkey` FOREIGN KEY (`palace_id`) REFERENCES `palaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memorization_attempts` ADD CONSTRAINT `memorization_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memorization_attempts` ADD CONSTRAINT `memorization_attempts_palace_id_fkey` FOREIGN KEY (`palace_id`) REFERENCES `palaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cell_group_members` ADD CONSTRAINT `cell_group_members_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `cell_groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cell_group_members` ADD CONSTRAINT `cell_group_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_badge_id_fkey` FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
