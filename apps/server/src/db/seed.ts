import { db } from "./index.js";
import {
	characterRelationships,
	characters,
	locations,
} from "./schema/index.js";

import {
	loadCharacterRelationships,
	loadCharacters,
	loadLocations,
} from "./seed-loader.js";

async function seed() {
	console.log("=================================");
	console.log(" Wyrdane Narrative - Database Seed");
	console.log("=================================");
	console.log();

	console.log("Chargement des données JSON...");

	const locationData = await loadLocations();
	const characterData = await loadCharacters();
	const relationshipData = await loadCharacterRelationships();

	console.log(`✓ ${locationData.length} lieu(x) chargé(s)`);

	console.log(`✓ ${characterData.length} personnage(s) chargé(s)`);

	console.log(`✓ ${relationshipData.length} relation(s) chargée(s)`);

	console.log();
	console.log("Validation des références...");

	const locationSlugs = new Set(locationData.map((location) => location.slug));

	const characterSlugs = new Set(
		characterData.map((character) => character.slug),
	);

	for (const character of characterData) {
		if (!locationSlugs.has(character.location)) {
			throw new Error(
				`Le personnage "${character.slug}" référence le lieu inexistant "${character.location}".`,
			);
		}
	}

	for (const relationship of relationshipData) {
		if (!characterSlugs.has(relationship.character)) {
			throw new Error(
				`Relation invalide : personnage "${relationship.character}" inexistant.`,
			);
		}

		if (!characterSlugs.has(relationship.relatedCharacter)) {
			throw new Error(
				`Relation invalide : personnage "${relationship.relatedCharacter}" inexistant.`,
			);
		}
	}

	console.log("✓ Toutes les références sont valides");
	console.log();

	await db.transaction(async (tx) => {
		console.log("Import des lieux...");

		for (const location of locationData) {
			await tx
				.insert(locations)
				.values({
					slug: location.slug,
					name: location.name,
					type: location.type,
					kingdom: location.kingdom,
					population: location.population,
					description: location.description,
				})
				.onDuplicateKeyUpdate({
					set: {
						name: location.name,
						type: location.type,
						kingdom: location.kingdom,
						population: location.population,
						description: location.description,
					},
				});
		}

		console.log(`✓ ${locationData.length} lieu(x) importé(s)`);

		console.log("Import des personnages...");

		const locationRows = await tx.select().from(locations);

		const locationIds = new Map(
			locationRows.map((location) => [location.slug, location.id]),
		);

		for (const character of characterData) {
			const locationId = locationIds.get(character.location);

			if (!locationId) {
				throw new Error(
					`Impossible de trouver l'ID du lieu "${character.location}".`,
				);
			}

			await tx
				.insert(characters)
				.values({
					slug: character.slug,
					name: character.name,
					age: character.age,
					race: character.race,
					kingdom: character.kingdom,
					occupation: character.occupation,
					locationId,
					description: character.description,
				})
				.onDuplicateKeyUpdate({
					set: {
						name: character.name,
						age: character.age,
						race: character.race,
						kingdom: character.kingdom,
						occupation: character.occupation,
						locationId,
						description: character.description,
					},
				});
		}

		console.log(`✓ ${characterData.length} personnage(s) importé(s)`);

		console.log("Import des relations...");

		const characterRows = await tx.select().from(characters);

		const characterIds = new Map(
			characterRows.map((character) => [character.slug, character.id]),
		);

		for (const relationship of relationshipData) {
			const characterId = characterIds.get(relationship.character);

			const relatedCharacterId = characterIds.get(
				relationship.relatedCharacter,
			);

			if (!characterId || !relatedCharacterId) {
				throw new Error(
					`Impossible de résoudre la relation "${relationship.character}" → "${relationship.relatedCharacter}".`,
				);
			}
			const firstCharacterId = Math.min(characterId, relatedCharacterId);

			const secondCharacterId = Math.max(characterId, relatedCharacterId);
			await tx
				.insert(characterRelationships)
				.values({
					characterId: firstCharacterId,
					relatedCharacterId: secondCharacterId,
					type: relationship.type,
					score: relationship.score,
					hasMet: relationship.hasMet,
					description: relationship.description,
				})
				.onDuplicateKeyUpdate({
					set: {
						type: relationship.type,
						score: relationship.score,
						hasMet: relationship.hasMet,
						description: relationship.description,
					},
				});
		}

		console.log(`✓ ${relationshipData.length} relation(s) importée(s)`);
	});

	console.log();
	console.log("=================================");
	console.log(" ✓ Seed terminé avec succès");
	console.log("=================================");
}

seed().catch((error) => {
	console.error();
	console.error("✗ Échec du seed");
	console.error();

	console.error(error);

	process.exit(1);
});
