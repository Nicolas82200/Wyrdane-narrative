import {
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const locations = mysqlTable("locations", {
	id: int("id").autoincrement().primaryKey(),

	slug: varchar("slug", {
		length: 100,
	})
		.notNull()
		.unique(),

	name: varchar("name", {
		length: 100,
	}).notNull(),

	type: varchar("type", {
		length: 50,
	}).notNull(),

	kingdom: varchar("kingdom", {
		length: 100,
	}),

	population: int("population"),

	description: text("description"),

	createdAt: timestamp("created_at").defaultNow().notNull(),

	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
