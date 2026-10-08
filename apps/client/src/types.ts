export interface DialogueLine {
	speaker: string;
	text: string;
}

export type ConditionOperator =
	| "equals"
	| "not_equals"
	| "greater_than"
	| "less_than"
	| "greater_or_equal"
	| "less_or_equal";

export interface Condition {
	type: "flag" | "variable" | "relationship";

	key?: string;

	character?: string;

	operator: ConditionOperator;

	value: boolean | number;
}

export type EffectOperation = "set" | "add" | "subtract";

export interface Effect {
	type: "flag" | "variable" | "relationship";

	key?: string;

	character?: string;

	value: boolean | number;

	operation?: EffectOperation;
}

export interface Choice {
	id: string;

	text: string;

	conditions?: Condition[];

	effects?: Effect[];

	nextScene: string;
}

export interface Scene {
	id: string;

	title: string;

	description: string;

	location: string | null;

	characters: string[];

	dialogue: DialogueLine[];

	choices: Choice[];
}

export interface GameState {
	currentScene: string;

	flags: Record<string, boolean>;

	variables: Record<string, number>;

	relationships: Record<string, number>;

	inventory: string[];

	discoveredLocations: string[];

	completedEvents: string[];
}
