import type { Effect, GameState } from "./types.js";

export function applyEffect(effect: Effect, state: GameState): void {
	switch (effect.type) {
		case "flag":
			applyFlagEffect(effect, state);
			return;

		case "variable":
			applyVariableEffect(effect, state);
			return;

		case "relationship":
			applyRelationshipEffect(effect, state);
			return;
	}
}

function applyFlagEffect(effect: Effect, state: GameState): void {
	if (!effect.key) {
		throw new Error("Un effet de type flag nécessite une clé.");
	}

	if (typeof effect.value !== "boolean") {
		throw new Error(
			`La valeur de la flag "${effect.key}" doit être un booléen.`,
		);
	}

	state.flags[effect.key] = effect.value;
}

function applyVariableEffect(effect: Effect, state: GameState): void {
	if (!effect.key) {
		throw new Error("Un effet de type variable nécessite une clé.");
	}

	if (typeof effect.value !== "number") {
		throw new Error(
			`La variable "${effect.key}" doit recevoir une valeur numérique.`,
		);
	}

	const current = state.variables[effect.key] ?? 0;

	switch (effect.operation ?? "set") {
		case "set":
			state.variables[effect.key] = effect.value;
			break;

		case "add":
			state.variables[effect.key] = current + effect.value;
			break;

		case "subtract":
			state.variables[effect.key] = current - effect.value;
			break;
	}
}

function applyRelationshipEffect(effect: Effect, state: GameState): void {
	if (!effect.character) {
		throw new Error("Un effet de relation nécessite un personnage.");
	}

	if (typeof effect.value !== "number") {
		throw new Error("Une relation doit recevoir une valeur numérique.");
	}

	const character = effect.character;

	const current = state.relationships[character] ?? 0;

	switch (effect.operation ?? "set") {
		case "set":
			state.relationships[character] = clampRelationship(effect.value);
			break;

		case "add":
			state.relationships[character] = clampRelationship(
				current + effect.value,
			);
			break;

		case "subtract":
			state.relationships[character] = clampRelationship(
				current - effect.value,
			);
			break;
	}
}

function clampRelationship(value: number): number {
	return Math.max(-100, Math.min(100, value));
}
