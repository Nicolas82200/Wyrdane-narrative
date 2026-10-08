import { describe, expect, it } from "vitest";

import { SceneEngine, createInitialGameState } from "../index.js";

import type { Scene } from "../types.js";

const scenes = new Map<string, Scene>([
	[
		"start",
		{
			id: "start",
			title: "Départ",
			description: "Une scène de test.",
			location: "valecendre",
			characters: ["arven-veyr"],
			dialogue: [],
			choices: [
				{
					id: "go-home",
					text: "Rentrer chez soi.",
					conditions: [],
					effects: [
						{
							type: "flag",
							key: "went_home",
							value: true,
						},
					],
					nextScene: "home",
				},
			],
		},
	],
	[
		"home",
		{
			id: "home",
			title: "Maison",
			description: "La maison d'Arven.",
			location: "valecendre",
			characters: ["arven-veyr", "elira-veyr"],
			dialogue: [],
			choices: [],
		},
	],
]);

describe("SceneEngine", () => {
	it("récupère une scène", () => {
		const engine = new SceneEngine(scenes);

		const scene = engine.getScene("start");

		expect(scene.id).toBe("start");
	});

	it("refuse une scène inexistante", () => {
		const engine = new SceneEngine(scenes);

		expect(() => {
			engine.getScene("unknown");
		}).toThrow("Scène introuvable : unknown");
	});

	it("retourne les choix disponibles", () => {
		const engine = new SceneEngine(scenes);

		const state = createInitialGameState("start");

		const scene = engine.getScene("start");

		const choices = engine.getAvailableChoices(scene, state);

		expect(choices).toHaveLength(1);
		expect(choices[0].id).toBe("go-home");
	});

	it("change de scène", () => {
		const engine = new SceneEngine(scenes);

		const state = createInitialGameState("start");

		const nextState = engine.choose("go-home", state);

		expect(nextState.currentScene).toBe("home");
	});

	it("applique les effets", () => {
		const engine = new SceneEngine(scenes);

		const state = createInitialGameState("start");

		const nextState = engine.choose("go-home", state);

		expect(nextState.flags.went_home).toBe(true);
	});

	it("ne modifie pas l'ancien GameState", () => {
		const engine = new SceneEngine(scenes);

		const state = createInitialGameState("start");

		const nextState = engine.choose("go-home", state);

		expect(state.currentScene).toBe("start");

		expect(state.flags.went_home).toBeUndefined();

		expect(nextState.currentScene).toBe("home");
	});
});
