import {
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

import { locations } from "./locations.js";

export const characters = mysqlTable("characters", {
	id: int("id").autoincrement().primaryKey(),

	slug: varchar("slug", {
		length: 100,
	})
		.notNull()
		.unique(),

	name: varchar("name", {
		length: 100,
	}).notNull(),

	age: int("age"),

	race: varchar("race", {
		length: 50,
	}).notNull(),

	kingdom: varchar("kingdom", {
		length: 100,
	}),

	occupation: varchar("occupation", {
		length: 100,
	}),

	locationId: int("location_id").references(() => locations.id),

	description: text("description"),

	createdAt: timestamp("created_at").defaultNow().notNull(),

	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
