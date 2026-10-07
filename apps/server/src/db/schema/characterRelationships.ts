import {
	boolean,
	int,
	mysqlTable,
	timestamp,
	varchar,
	uniqueIndex,
} from "drizzle-orm/mysql-core";

import { characters } from "./characters.js";

export const characterRelationships = mysqlTable(
	"character_relationships",
	{
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

		score: int("score").notNull().default(0),

		hasMet: boolean("has_met").notNull().default(false),

		description: varchar("description", {
			length: 255,
		}),

		createdAt: timestamp("created_at").defaultNow().notNull(),

		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},

	(table) => ({
		relationshipUnique: uniqueIndex("character_relationship_unique").on(
			table.characterId,
			table.relatedCharacterId,
		),
	}),
);
