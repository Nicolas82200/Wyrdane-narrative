import "dotenv/config";
import { eq } from "drizzle-orm";

import { db } from "./index.js";
import { characterRelationships, characters } from "./schema/index.js";

type SeedRelationship = {
	characterSlug: string;
	relatedCharacterSlug: string;
	type: string;
	description: string | null;
};

const relationships: SeedRelationship[] = [
	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "elira-veyr",
		type: "spouse",
		description: "Arven's wife.",
	},
	{
		characterSlug: "elira-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "spouse",
		description: "Elira's husband.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "nolen-veyr",
		type: "parent",
		description: "Arven's son.",
	},
	{
		characterSlug: "nolen-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "child",
		description: "Nolen's father.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "mara-veyr",
		type: "child",
		description: "Arven's mother.",
	},
	{
		characterSlug: "mara-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "parent",
		description: "Mara's son.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "edric-veyr",
		type: "nephew",
		description: "Arven's paternal uncle.",
	},
	{
		characterSlug: "edric-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "uncle",
		description: "Edric's nephew.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "maela-veyr",
		type: "nephew_by_marriage",
		description: "Arven's aunt by marriage.",
	},
	{
		characterSlug: "maela-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "aunt_by_marriage",
		description: "Maela's nephew by marriage.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "tomas-veyr",
		type: "cousin",
		description: "Arven's cousin.",
	},
	{
		characterSlug: "tomas-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "cousin",
		description: "Tomas's cousin.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "lysa-veyr",
		type: "cousin",
		description: "Arven's cousin.",
	},
	{
		characterSlug: "lysa-veyr",
		relatedCharacterSlug: "arven-veyr",
		type: "cousin",
		description: "Lysa's cousin.",
	},

	{
		characterSlug: "arven-veyr",
		relatedCharacterSlug: "taren-solmar",
		type: "brother_in_law",
		description: "Elira's brother and Arven's brother-in-law.",
	},
	{
		characterSlug: "taren-solmar",
		relatedCharacterSlug: "arven-veyr",
		type: "brother_in_law",
		description: "Taren's brother-in-law.",
	},
];

const getCharacterId = async (slug: string) => {
	const result = await db
		.select({
			id: characters.id,
		})
		.from(characters)
		.where(eq(characters.slug, slug));

	if (result.length === 0) {
		throw new Error(`Character not found: ${slug}`);
	}

	return result[0].id;
};

const main = async () => {
	for (const relationship of relationships) {
		const characterId = await getCharacterId(relationship.characterSlug);

		const relatedCharacterId = await getCharacterId(
			relationship.relatedCharacterSlug,
		);

		const existing = await db
			.select()
			.from(characterRelationships)
			.where(eq(characterRelationships.characterId, characterId));

		const alreadyExists = existing.some(
			(item) =>
				item.relatedCharacterId === relatedCharacterId &&
				item.type === relationship.type,
		);

		if (alreadyExists) {
			console.log(
				`Relationship already exists: ${relationship.characterSlug} -> ${relationship.relatedCharacterSlug}`,
			);
			continue;
		}

		await db.insert(characterRelationships).values({
			characterId,
			relatedCharacterId,
			type: relationship.type,
			description: relationship.description,
		});

		console.log(
			`Relationship created: ${relationship.characterSlug} -> ${relationship.relatedCharacterSlug}`,
		);
	}

	console.log("Relationship seed completed successfully.");
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
