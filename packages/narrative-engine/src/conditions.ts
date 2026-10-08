import type { Condition, GameState } from "./types.js";

export function areConditionsMet(
	conditions: Condition[],
	state: GameState,
): boolean {
	return conditions.every((condition) => checkCondition(condition, state));
}

export function checkCondition(
	condition: Condition,
	state: GameState,
): boolean {
	let currentValue: boolean | number | undefined;

	switch (condition.type) {
		case "flag":
			currentValue = state.flags[condition.key ?? ""];
			break;

		case "variable":
			currentValue = state.variables[condition.key ?? ""];
			break;

		case "relationship":
			currentValue = state.relationships[condition.character ?? ""];
			break;
	}

	switch (condition.operator) {
		case "equals":
			return currentValue === condition.value;

		case "not_equals":
			return currentValue !== condition.value;

		case "greater_than":
			return (
				typeof currentValue === "number" &&
				typeof condition.value === "number" &&
				currentValue > condition.value
			);

		case "less_than":
			return (
				typeof currentValue === "number" &&
				typeof condition.value === "number" &&
				currentValue < condition.value
			);

		case "greater_or_equal":
			return (
				typeof currentValue === "number" &&
				typeof condition.value === "number" &&
				currentValue >= condition.value
			);

		case "less_or_equal":
			return (
				typeof currentValue === "number" &&
				typeof condition.value === "number" &&
				currentValue <= condition.value
			);
	}
}
