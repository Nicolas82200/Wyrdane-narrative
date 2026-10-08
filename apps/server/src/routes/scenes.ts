import { readdir, readFile } from "node:fs/promises";

import path from "node:path";

import type { FastifyPluginAsync } from "fastify";

const scenesDirectory = path.resolve(process.cwd(), "../../data/scenes");

interface Scene {
	id: string;
	title: string;
	description: string;
	location: string | null;
	characters: string[];
	dialogue: {
		speaker: string;
		text: string;
	}[];
	choices: {
		id: string;
		text: string;
		conditions?: unknown[];
		effects?: unknown[];
		nextScene: string;
	}[];
}

const scenesRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get("/scenes", async () => {
		const scenes = await loadScenes(scenesDirectory);

		return {
			scenes,
		};
	});

	fastify.get("/scenes/:sceneId", async (request, reply) => {
		const { sceneId } = request.params as {
			sceneId: string;
		};

		const scenes = await loadScenes(scenesDirectory);

		const scene = scenes.find((item) => item.id === sceneId);

		if (!scene) {
			return reply.code(404).send({
				error: "SCENE_NOT_FOUND",
				message: `Scène introuvable : ${sceneId}`,
			});
		}

		return scene;
	});
};

async function loadScenes(directory: string): Promise<Scene[]> {
	const files = await findSceneFiles(directory);

	const scenes: Scene[] = [];

	for (const file of files) {
		const content = await readFile(file, "utf8");

		const scene = JSON.parse(content) as Scene;

		scenes.push(scene);
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

export default scenesRoutes;
