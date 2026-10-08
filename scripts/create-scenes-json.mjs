import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const scenesDirectory = path.resolve("data/scenes");

const sourceFiles = [];

async function findSceneSources(directory) {
	const entries = await readdir(directory, { withFileTypes: true });

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			await findSceneSources(entryPath);
			continue;
		}

		if (entry.isFile() && entry.name === "_scenes.json") {
			sourceFiles.push(entryPath);
		}
	}
}

async function removeGeneratedFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			await removeGeneratedFiles(entryPath);
			continue;
		}

		if (
			entry.isFile() &&
			entry.name.endsWith(".json") &&
			entry.name !== "_scenes.json"
		) {
			await rm(entryPath);
		}
	}
}

await mkdir(scenesDirectory, {
	recursive: true,
});

await findSceneSources(scenesDirectory);

if (sourceFiles.length === 0) {
	throw new Error("Aucun fichier _scenes.json trouvé dans data/scenes.");
}

await removeGeneratedFiles(scenesDirectory);

let totalScenes = 0;

for (const sourceFile of sourceFiles) {
	const scenes = JSON.parse(await readFile(sourceFile, "utf8"));

	if (!Array.isArray(scenes)) {
		throw new Error(`${sourceFile} doit contenir un tableau de scènes.`);
	}

	const outputDirectory = path.dirname(sourceFile);

	for (const scene of scenes) {
		if (!scene.id) {
			throw new Error(
				`Une scène dans ${sourceFile} ne possède pas d'identifiant.`,
			);
		}

		const fileName = `${scene.id}.json`;

		const filePath = path.join(outputDirectory, fileName);

		await writeFile(filePath, JSON.stringify(scene, null, 2) + "\n", "utf8");

		console.log(`✓ ${path.relative(process.cwd(), filePath)}`);

		totalScenes++;
	}
}

console.log();
console.log(`✓ ${totalScenes} scènes créées`);
