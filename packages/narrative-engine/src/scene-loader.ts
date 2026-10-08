import { readdir, readFile } from "node:fs/promises";

import path from "node:path";

import { sceneSchema } from "./scene-schema.js";

import type { Scene } from "./types.js";

export async function loadScenes(
	scenesDirectory: string,
): Promise<Map<string, Scene>> {
	const sceneFiles = await findSceneFiles(scenesDirectory);

	const scenes = new Map<string, Scene>();

	for (const sceneFile of sceneFiles) {
		const content = await readFile(sceneFile, "utf8");

		const rawData = JSON.parse(content);

		const scene = sceneSchema.parse(rawData);

		if (scenes.has(scene.id)) {
			throw new Error(`ID de scène dupliqué : ${scene.id}`);
		}

		scenes.set(scene.id, scene);
	}

	return scenes;
}

async function findSceneFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, {
		withFileTypes: true,
	});

	const files: string[] = [];

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await findSceneFiles(entryPath)));

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
