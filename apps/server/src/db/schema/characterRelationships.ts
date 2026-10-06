import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { characters } from "./characters.js";

export const characterRelationships = mysqlTable("character_relationships", {
	id: int("id").autoincrement().primaryKey(),

	characterId: int("character_id")
		.notNull()
		.references(() => characters.id),

	relatedCharacterId: int("related_character_id")
		.notNull()
		.references(() => characters.id),

	type: varchar("type", {
		length: 50,
	}).notNull(),

	description: varchar("description", {
		length: 255,
	}),

	createdAt: timestamp("created_at").defaultNow().notNull(),

	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
