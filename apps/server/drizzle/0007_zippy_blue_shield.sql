ALTER TABLE `character_relationships` ADD `score` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `character_relationships` DROP COLUMN `base_score`;--> statement-breakpoint
ALTER TABLE `character_relationships` DROP COLUMN `current_score`;