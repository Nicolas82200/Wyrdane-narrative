import { areConditionsMet } from "./conditions.js";

import { applyEffect } from "./effects.js";

import type { Choice, GameState, Scene } from "./types.js";

export class SceneEngine {
	constructor(private readonly scenes: Map<string, Scene>) {}

	getScene(sceneId: string): Scene {
		const scene = this.scenes.get(sceneId);

		if (!scene) {
			throw new Error(`Scène introuvable : ${sceneId}`);
		}

		return scene;
	}

	getAvailableChoices(scene: Scene, state: GameState): Choice[] {
		return scene.choices.filter((choice) =>
			areConditionsMet(choice.conditions ?? [], state),
		);
	}

	choose(choiceId: string, state: GameState): GameState {
		const scene = this.getScene(state.currentScene);

		const choice = scene.choices.find((item) => item.id === choiceId);

		if (!choice) {
			throw new Error(`Choix introuvable : ${choiceId}`);
		}

		if (!areConditionsMet(choice.conditions ?? [], state)) {
			throw new Error(`Le choix "${choiceId}" n'est pas disponible.`);
		}

		this.getScene(choice.nextScene);

		const nextState = cloneGameState(state);

		for (const effect of choice.effects ?? []) {
			applyEffect(effect, nextState);
		}

		nextState.currentScene = choice.nextScene;

		return nextState;
	}
}

function cloneGameState(state: GameState): GameState {
	return {
		currentScene: state.currentScene,

		flags: {
			...state.flags,
		},

		variables: {
			...state.variables,
		},

		relationships: {
			...state.relationships,
		},

		inventory: [...state.inventory],

		discoveredLocations: [...state.discoveredLocations],

		completedEvents: [...state.completedEvents],
	};
}
