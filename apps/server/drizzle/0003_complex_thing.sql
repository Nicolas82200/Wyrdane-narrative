CREATE TABLE `character_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`character_id` int NOT NULL,
	`related_character_id` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`description` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `character_relationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `character_relationships` ADD CONSTRAINT `character_relationships_character_id_characters_id_fk` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character_relationships` ADD CONSTRAINT `character_relationships_related_character_id_characters_id_fk` FOREIGN KEY (`related_character_id`) REFERENCES `characters`(`id`) ON DELETE no action ON UPDATE no action;