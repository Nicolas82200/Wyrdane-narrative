import { fileURLToPath } from "node:url";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import {
	characterRelationshipSchema,
	characterSchema,
	locationSchema,
	type CharacterData,
	type CharacterRelationshipData,
	type LocationData,
} from "./seed-types.js";

const projectRoot = path.resolve(
	fileURLToPath(new URL("../../../../", import.meta.url)),
);

const dataDirectory = path.join(projectRoot, "data");

const charactersDirectory = path.join(dataDirectory, "characters");

const locationsDirectory = path.join(dataDirectory, "locations");

const relationsDirectory = path.join(dataDirectory, "relations");

async function loadJsonFiles<T>(
	directory: string,
	parser: (data: unknown) => T,
): Promise<T[]> {
	const files = (await readdir(directory))
		.filter((file) => file.endsWith(".json") && !file.startsWith("_"))
		.sort();

	const results: T[] = [];

	for (const file of files) {
		const filePath = path.join(directory, file);
		const content = await readFile(filePath, "utf8");

		let json: unknown;

		try {
			json = JSON.parse(content);
		} catch {
			throw new Error(`JSON invalide dans le fichier : ${filePath}`);
		}

		try {
			results.push(parser(json));
		} catch (error) {
			console.error(`Erreur de validation dans ${filePath}:`);

			if (error instanceof Error) {
				console.error(error.message);
			}

			throw error;
		}
	}

	return results;
}

export async function loadCharacters(): Promise<CharacterData[]> {
	return loadJsonFiles(charactersDirectory, (data) =>
		characterSchema.parse(data),
	);
}

export async function loadLocations(): Promise<LocationData[]> {
	return loadJsonFiles(locationsDirectory, (data) =>
		locationSchema.parse(data),
	);
}

export async function loadCharacterRelationships(): Promise<
	CharacterRelationshipData[]
> {
	return loadJsonFiles(relationsDirectory, (data) =>
		characterRelationshipSchema.parse(data),
	);
}

export {
	dataDirectory,
	charactersDirectory,
	locationsDirectory,
	relationsDirectory,
};
