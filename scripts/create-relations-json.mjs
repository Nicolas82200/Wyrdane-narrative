import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("data/relations");

const relationships = [
	{
		character: "arven-veyr",
		relatedCharacter: "elira-veyr",
		type: "époux",
		score: 85,
		description:
			"Arven et Elira sont mariés et entretiennent une relation stable et profondément attachée.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "nolen-veyr",
		type: "père",
		score: 95,
		description:
			"Arven est le père de Nolen et entretient avec lui une relation très proche.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "mara-veyr",
		type: "fils",
		score: 80,
		description:
			"Arven est le fils de Mara et reste proche de sa mère malgré leurs différences de caractère.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "edric-veyr",
		type: "oncle",
		score: 65,
		description:
			"Edric est l'oncle paternel d'Arven et lui a appris une grande partie de ce qu'il sait du commerce.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "maela-veyr",
		type: "tante_par_alliance",
		score: 55,
		description:
			"Maela est la tante par alliance d'Arven. Ils entretiennent une relation familiale cordiale.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "tomas-veyr",
		type: "cousin",
		score: 55,
		description:
			"Arven et Tomas sont cousins. Leur relation est cordiale mais leurs ambitions commerciales peuvent parfois les opposer.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "lysa-veyr",
		type: "cousin",
		score: 60,
		description:
			"Arven et Lysa sont cousins et entretiennent une relation familiale cordiale.",
	},

	{
		character: "arven-veyr",
		relatedCharacter: "taren-solmar",
		type: "beau_frère",
		score: 70,
		description:
			"Taren est le frère d'Elira et le beau-frère d'Arven. Les deux hommes entretiennent une relation proche.",
	},
];

await mkdir(outputDirectory, {
	recursive: true,
});

// Supprime les anciens JSON afin d'éviter
// de conserver les anciennes relations inversées.
const existingFiles = await readdir(outputDirectory);

for (const file of existingFiles) {
	if (file.endsWith(".json")) {
		await rm(path.join(outputDirectory, file));
	}
}

for (const relationship of relationships) {
	const filename = `${relationship.character}-${relationship.relatedCharacter}.json`;

	const filePath = path.join(outputDirectory, filename);

	await writeFile(
		filePath,
		JSON.stringify(relationship, null, 2) + "\n",
		"utf8",
	);

	console.log(`✓ ${filename}`);
}

console.log();
console.log(`✓ ${relationships.length} relations créées`);
