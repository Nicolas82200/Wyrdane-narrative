import { readdir, readFile } from "node:fs/promises";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { sceneSchema } from "../packages/narrative-engine/src/scene-schema.ts";

const currentFile = fileURLToPath(import.meta.url);
const scriptsDirectory = path.dirname(currentFile);
const projectDirectory = path.resolve(scriptsDirectory, "..");

const scenesDirectory = path.join(projectDirectory, "data", "scenes");

const charactersDirectory = path.join(projectDirectory, "data", "characters");

const locationsDirectory = path.join(projectDirectory, "data", "locations");

interface ValidationError {
	file: string;
	message: string;
}

const errors: ValidationError[] = [];

const sceneIds = new Set<string>();
const characterIds = new Set<string>();
const locationIds = new Set<string>();

const scenes: Array<{
	file: string;
	id: string;
	characters: string[];
	location: string | null;
	nextScenes: string[];
}> = [];

function addError(file: string, message: string): void {
	errors.push({
		file,
		message,
	});
}

function relativeFilePath(filePath: string): string {
	return path.relative(projectDirectory, filePath);
}

async function findJsonFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, {
		withFileTypes: true,
	});

	const files: string[] = [];

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await findJsonFiles(entryPath)));

			continue;
		}

		if (
			entry.isFile() &&
			entry.name.endsWith(".json") &&
			!entry.name.startsWith("_")
		) {
			files.push(entryPath);
		}
	}

	return files;
}

async function loadStaticIds(
	directory: string,
	type: "character" | "location",
): Promise<Set<string>> {
	const ids = new Set<string>();

	const files = await findJsonFiles(directory);

	for (const file of files) {
		const displayFile = relativeFilePath(file);

		let data: unknown;

		try {
			data = JSON.parse(await readFile(file, "utf8"));
		} catch (error) {
			addError(displayFile, `JSON invalide : ${getErrorMessage(error)}`);

			continue;
		}

		if (typeof data !== "object" || data === null) {
			addError(displayFile, "Le fichier JSON doit contenir un objet.");

			continue;
		}

		const record = data as Record<string, unknown>;

		const slug = record.slug;

		if (typeof slug !== "string" || slug.length === 0) {
			addError(displayFile, `Le champ "slug" est obligatoire pour ce ${type}.`);

			continue;
		}

		if (ids.has(slug)) {
			addError(displayFile, `Slug dupliqué : "${slug}".`);

			continue;
		}

		ids.add(slug);
	}

	return ids;
}

async function loadScenes(): Promise<void> {
	const files = await findJsonFiles(scenesDirectory);

	for (const file of files) {
		const displayFile = relativeFilePath(file);

		let rawData: unknown;

		try {
			rawData = JSON.parse(await readFile(file, "utf8"));
		} catch (error) {
			addError(displayFile, `JSON invalide : ${getErrorMessage(error)}`);

			continue;
		}

		const result = sceneSchema.safeParse(rawData);

		if (!result.success) {
			const formattedErrors = result.error.issues
				.map(
					(issue) => `${issue.path.join(".") || "(racine)"} : ${issue.message}`,
				)
				.join("; ");

			addError(displayFile, `Structure de scène invalide : ${formattedErrors}`);

			continue;
		}

		const scene = result.data;

		if (sceneIds.has(scene.id)) {
			addError(displayFile, `ID de scène dupliqué : "${scene.id}".`);
		} else {
			sceneIds.add(scene.id);
		}

		scenes.push({
			file: displayFile,
			id: scene.id,
			characters: scene.characters,
			location: scene.location,
			nextScenes: scene.choices.map((choice) => choice.nextScene),
		});
	}
}

function validateSceneReferences(): void {
	for (const scene of scenes) {
		for (const nextScene of scene.nextScenes) {
			if (!sceneIds.has(nextScene)) {
				addError(
					scene.file,
					`La scène "${scene.id}" référence la scène inexistante "${nextScene}".`,
				);
			}
		}

		for (const character of scene.characters) {
			if (!characterIds.has(character)) {
				addError(
					scene.file,
					`La scène "${scene.id}" référence le personnage inexistant "${character}".`,
				);
			}
		}

		if (scene.location !== null && !locationIds.has(scene.location)) {
			addError(
				scene.file,
				`La scène "${scene.id}" référence le lieu inexistant "${scene.location}".`,
			);
		}
	}
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

async function main(): Promise<void> {
	console.log("========================================");

	console.log("   Wyrdane - Validation du contenu");

	console.log("========================================");

	console.log();

	console.log("→ Chargement des personnages...");

	const loadedCharacterIds = await loadStaticIds(
		charactersDirectory,
		"character",
	);

	for (const id of loadedCharacterIds) {
		characterIds.add(id);
	}

	console.log(`  ${characterIds.size} personnages trouvés`);

	console.log();

	console.log("→ Chargement des lieux...");

	const loadedLocationIds = await loadStaticIds(locationsDirectory, "location");

	for (const id of loadedLocationIds) {
		locationIds.add(id);
	}

	console.log(`  ${locationIds.size} lieux trouvés`);

	console.log();

	console.log("→ Validation des scènes...");

	await loadScenes();

	console.log(`  ${scenes.length} scènes trouvées`);

	console.log();

	console.log("→ Vérification des références...");

	validateSceneReferences();

	console.log();

	if (errors.length > 0) {
		console.error(`✗ Validation échouée : ${errors.length} erreur(s)`);

		console.error();

		for (const error of errors) {
			console.error(`  ✗ ${error.file}`);

			console.error(`    ${error.message}`);

			console.error();
		}

		process.exitCode = 1;
		return;
	}

	console.log("✓ Validation réussie !");

	console.log();

	console.log(`  Personnages : ${characterIds.size}`);

	console.log(`  Lieux       : ${locationIds.size}`);

	console.log(`  Scènes      : ${scenes.length}`);

	console.log();

	console.log("Aucune erreur détectée.");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
