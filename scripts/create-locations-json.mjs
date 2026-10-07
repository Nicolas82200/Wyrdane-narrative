import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceFile = path.resolve("data/locations/_locations.json");

const outputDirectory = path.resolve("data/locations");

const locations = JSON.parse(await readFile(sourceFile, "utf8"));

if (!Array.isArray(locations)) {
	throw new Error("_locations.json doit contenir un tableau de lieux.");
}

await mkdir(outputDirectory, {
	recursive: true,
});

const existingFiles = await readdir(outputDirectory);

for (const file of existingFiles) {
	if (file.endsWith(".json") && file !== "_locations.json") {
		await rm(path.join(outputDirectory, file));
	}
}

for (const location of locations) {
	if (!location.slug) {
		throw new Error("Un lieu ne possède pas de slug.");
	}

	const fileName = `${location.slug}.json`;

	const filePath = path.join(outputDirectory, fileName);

	await writeFile(filePath, JSON.stringify(location, null, 2) + "\n", "utf8");

	console.log(`✓ ${fileName}`);
}

console.log();
console.log(`✓ ${locations.length} lieux créés`);
