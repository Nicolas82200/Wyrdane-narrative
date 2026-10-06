import "dotenv/config";
import { eq } from "drizzle-orm";

import { db } from "./index.js";
import { characters, locations } from "./schema/index.js";
import type { SeedCharacter } from "./seed-types.js";

const valecendre = {
	slug: "valecendre",
	name: "Valecendre",
	type: "Village",
	kingdom: "Aldrenia",
	description: "A village in Aldrenia where Arven Veyr lives with his family.",
};

const caldrath = {
	slug: "caldrath",
	name: "Caldrath",
	type: "City",
	kingdom: "Aldrenia",
	description:
		"The capital of Aldrenia and one of the most important cities in the kingdom. Caldrath is a major center of trade, politics and commerce.",
};

const arven: SeedCharacter = {
	slug: "arven-veyr",
	name: "Arven Veyr",
	age: 35,
	race: "Human",
	kingdom: "Aldrenia",
	occupation: "Merchant",
	description:
		"A pragmatic and hardworking merchant from Valecendre. Arven is patient, observant and sociable, but cautious with strangers. He is a loyal husband and father, a good negotiator, and has no particular interest in politics or violence.",
};

const familyCharacters: SeedCharacter[] = [
	{
		slug: "elira-veyr",
		name: "Elira Veyr",
		age: 33,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: "Artisan",
		description:
			"Arven's wife. She comes from an artisan family and helps manage the household accounts. Prudent and dependable, she provides stability to the Veyr family.",
	},
	{
		slug: "nolen-veyr",
		name: "Nolen Veyr",
		age: 9,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: null,
		description:
			"Arven and Elira's son. Curious and energetic, Nolen admires his father and often follows him around the village.",
	},
	{
		slug: "mara-veyr",
		name: "Mara Veyr",
		age: 62,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: null,
		description:
			"Arven's mother and a widow living in Valecendre. Traditional and direct, Mara has always remained close to her son and his family.",
	},
	{
		slug: "edric-veyr",
		name: "Edric Veyr",
		age: 58,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: "Merchant",
		description:
			"Arven's paternal uncle. He owns a permanent stall in Caldrath's market and taught Arven much of what he knows about trade.",
	},
	{
		slug: "maela-veyr",
		name: "Maela Veyr",
		age: 55,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: "Merchant",
		description:
			"Edric's wife, originally from Caldrath. She helps manage the family's accounts and purchases.",
	},
	{
		slug: "tomas-veyr",
		name: "Tomas Veyr",
		age: 29,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: "Merchant",
		description:
			"Arven's cousin and Edric's son. He works alongside his father in Caldrath and is ambitious about expanding the family business.",
	},
	{
		slug: "lysa-veyr",
		name: "Lysa Veyr",
		age: 24,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: "Craftswoman",
		description:
			"Arven's cousin and Edric's daughter. She works with the family and has a particular interest in fabrics and crafts.",
	},
	{
		slug: "taren-solmar",
		name: "Taren Solmar",
		age: 31,
		race: "Human",
		kingdom: "Aldrenia",
		occupation: "Blacksmith",
		description:
			"Elira's brother and Arven's brother-in-law. He works as a blacksmith and has a close relationship with Arven.",
	},
];

const upsertCharacter = async (
	character: SeedCharacter,
	locationId: number | null = null,
) => {
	const existing = await db
		.select()
		.from(characters)
		.where(eq(characters.slug, character.slug));

	if (existing.length > 0) {
		await db
			.update(characters)
			.set({
				...character,
				locationId,
			})
			.where(eq(characters.slug, character.slug));

		console.log(`${character.name} updated.`);
		return;
	}

	await db.insert(characters).values({
		...character,
		locationId,
	});

	console.log(`${character.name} created.`);
};

const main = async () => {
	// --------------------------------------------------
	// Location: Caldrath
	// --------------------------------------------------

	let [caldrathLocation] = await db
		.select()
		.from(locations)
		.where(eq(locations.slug, caldrath.slug));

	if (!caldrathLocation) {
		await db.insert(locations).values(caldrath);

		[caldrathLocation] = await db
			.select()
			.from(locations)
			.where(eq(locations.slug, caldrath.slug));

		if (!caldrathLocation) {
			throw new Error("Failed to create Caldrath.");
		}

		console.log("Caldrath created.");
	} else {
		console.log("Caldrath already exists.");
	}
	// --------------------------------------------------
	// Location: Valecendre
	// --------------------------------------------------

	let [location] = await db
		.select()
		.from(locations)
		.where(eq(locations.slug, valecendre.slug));

	if (!location) {
		await db.insert(locations).values(valecendre);

		[location] = await db
			.select()
			.from(locations)
			.where(eq(locations.slug, valecendre.slug));

		if (!location) {
			throw new Error("Failed to create Valecendre.");
		}

		console.log("Valecendre created.");
	} else {
		console.log("Valecendre already exists.");
	}

	// --------------------------------------------------
	// Characters
	// --------------------------------------------------

	await upsertCharacter(arven, location.id);

	const caldrathCharacters = new Set([
		"edric-veyr",
		"maela-veyr",
		"tomas-veyr",
		"lysa-veyr",
	]);

	for (const character of familyCharacters) {
		const characterLocation = caldrathCharacters.has(character.slug)
			? caldrathLocation.id
			: location.id;

		await upsertCharacter(character, characterLocation);
	}

	console.log("Seed completed successfully.");
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
