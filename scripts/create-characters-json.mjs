import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceFile = path.resolve("data/characters/_characters.json");

const outputDirectory = path.resolve("data/characters");

const characters = JSON.parse(await readFile(sourceFile, "utf8"));

if (!Array.isArray(characters)) {
	throw new Error("_characters.json doit contenir un tableau de personnages.");
}

await mkdir(outputDirectory, {
	recursive: true,
});

const existingFiles = await readdir(outputDirectory);

for (const file of existingFiles) {
	if (file.endsWith(".json") && file !== "_characters.json") {
		await rm(path.join(outputDirectory, file));
	}
}

for (const character of characters) {
	if (!character.slug) {
		throw new Error("Un personnage ne possède pas de slug.");
	}

	const fileName = `${character.slug}.json`;

	const filePath = path.join(outputDirectory, fileName);

	await writeFile(filePath, JSON.stringify(character, null, 2) + "\n", "utf8");

	console.log(`✓ ${fileName}`);
}

console.log();
console.log(`✓ ${characters.length} personnages créés`);
