import { useEffect, useMemo, useState } from "react";

import type { Choice, Condition, Effect, GameState, Scene } from "./types";

import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const STARTING_SCENE = "arven-retour-thelmere";

function createInitialGameState(): GameState {
	return {
		currentScene: STARTING_SCENE,

		flags: {},

		variables: {
			money: 0,
			arven_end_day_location: 1,
		},

		relationships: {
			"elira-veyr": 0,
			"neria-sol": 0,
			"nolen-veyr": 0,
		},

		inventory: [],

		discoveredLocations: ["valecendre"],

		completedEvents: [],
	};
}

export default function App() {
	const [scenes, setScenes] = useState<Map<string, Scene>>(new Map());

	const [state, setState] = useState<GameState>(createInitialGameState());

	const [dialogueIndex, setDialogueIndex] = useState(0);

	const [dialogueFinished, setDialogueFinished] = useState(false);

	const [loading, setLoading] = useState(true);

	const [error, setError] = useState<string | null>(null);

	/*
	 * Charge toutes les scènes
	 * depuis le serveur.
	 */
	useEffect(() => {
		void loadScenes();
	}, []);

	/*
	 * Chaque fois que la scène change,
	 * on revient au premier dialogue.
	 */
	useEffect(() => {
		setDialogueIndex(0);

		const scene = scenes.get(state.currentScene);

		setDialogueFinished(!scene || scene.dialogue.length === 0);
	}, [state.currentScene, scenes]);

	async function loadScenes() {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_URL}/api/scenes`);

			if (!response.ok) {
				throw new Error(`Erreur HTTP ${response.status}`);
			}

			const data = (await response.json()) as {
				scenes: Scene[];
			};

			const sceneMap = new Map<string, Scene>();

			for (const scene of data.scenes) {
				sceneMap.set(scene.id, scene);
			}

			setScenes(sceneMap);
		} catch (err) {
			console.error(err);

			setError(
				err instanceof Error
					? err.message
					: "Impossible de charger les scènes.",
			);
		} finally {
			setLoading(false);
		}
	}

	const currentScene = scenes.get(state.currentScene);

	/*
	 * Détermine les choix disponibles
	 * en fonction du GameState.
	 */
	const availableChoices = useMemo(() => {
		if (!currentScene) {
			return [];
		}

		return currentScene.choices.filter((choice) =>
			areConditionsMet(choice.conditions ?? [], state),
		);
	}, [currentScene, state]);

	/*
	 * Dialogue actuellement affiché.
	 */
	const currentDialogue =
		currentScene && currentScene.dialogue.length > 0
			? currentScene.dialogue[dialogueIndex]
			: null;

	/*
	 * Avance le dialogue.
	 */
	function advanceDialogue() {
		if (!currentScene) {
			return;
		}

		if (currentScene.dialogue.length === 0) {
			setDialogueFinished(true);
			return;
		}

		const isLastDialogue = dialogueIndex >= currentScene.dialogue.length - 1;

		if (isLastDialogue) {
			setDialogueFinished(true);
			return;
		}

		setDialogueIndex((currentIndex) => currentIndex + 1);
	}

	/*
	 * Le joueur sélectionne un choix.
	 */
	function choose(choice: Choice) {
		const nextState = cloneGameState(state);

		/*
		 * Applique tous les effets
		 * du choix.
		 */
		for (const effect of choice.effects ?? []) {
			applyEffect(effect, nextState);
		}

		/*
		 * Change de scène.
		 */
		nextState.currentScene = choice.nextScene;

		setState(nextState);

		/*
		 * Le useEffect lié à
		 * currentScene remettra
		 * automatiquement le dialogue
		 * à zéro.
		 */
	}

	/*
	 * Recommencer la partie.
	 */
	function restart() {
		setState(createInitialGameState());

		setDialogueIndex(0);

		setDialogueFinished(false);
	}

	/*
	 * Écran de chargement.
	 */
	if (loading) {
		return (
			<main className="game">
				<div className="loading">Chargement de Wyrdane...</div>
			</main>
		);
	}

	/*
	 * Erreur serveur.
	 */
	if (error) {
		return (
			<main className="game">
				<div className="error">
					<h1>Impossible de charger Wyrdane</h1>

					<p>{error}</p>

					<button
						type="button"
						onClick={() => {
							void loadScenes();
						}}
					>
						Réessayer
					</button>
				</div>
			</main>
		);
	}

	/*
	 * Scène inexistante.
	 */
	if (!currentScene) {
		return (
			<main className="game">
				<div className="error">
					<h1>Scène introuvable</h1>

					<p>{state.currentScene}</p>

					<button type="button" onClick={restart}>
						Recommencer
					</button>
				</div>
			</main>
		);
	}

	/*
	 * La zone de dialogue est cliquable
	 * uniquement lorsqu'un dialogue
	 * est affiché.
	 */
	const dialogueVisible = currentDialogue !== null && !dialogueFinished;

	return (
		<main className="game">
			<div className="game-shell">
				{/* HEADER */}

				<header className="game-header">
					<div>
						<span className="eyebrow">WYRDANE</span>

						<h1>{currentScene.title}</h1>
					</div>

					<button type="button" className="restart-button" onClick={restart}>
						Recommencer
					</button>
				</header>

				{/* SCENE */}

				<section className="scene">
					{/* DESCRIPTION */}

					<div className="scene-description">{currentScene.description}</div>

					{/* ZONE DE DIALOGUE */}

					{dialogueVisible && (
						<button
							type="button"
							className={`dialogue-area ${
								currentDialogue.speaker === "arven-veyr"
									? "dialogue-arven"
									: "dialogue-other"
							}`}
							onClick={advanceDialogue}
							aria-label="Continuer la conversation"
						>
							<div
								className={`dialogue-box ${
									currentDialogue.speaker === "arven-veyr"
										? "dialogue-box-left"
										: "dialogue-box-right"
								}`}
							>
								<div className="speaker">
									{formatCharacterName(currentDialogue.speaker)}
								</div>

								<div className="dialogue-text">{currentDialogue.text}</div>

								<div className="continue-indicator">
									{isLastDialogue(currentScene, dialogueIndex)
										? "Cliquer pour continuer"
										: "Cliquer pour continuer"}
								</div>
							</div>
						</button>
					)}

					{/* CHOIX */}

					{dialogueFinished && (
						<div className="choices-container">
							{availableChoices.length > 0 ? (
								<>
									<div className="choices-title">Que faire ?</div>

									<div className="choices">
										{availableChoices.map((choice) => (
											<button
												type="button"
												className="choice"
												key={choice.id}
												onClick={() => choose(choice)}
											>
												{choice.text}
											</button>
										))}
									</div>
								</>
							) : (
								<div className="end-scene">
									<p>Fin de cette séquence.</p>

									<button type="button" onClick={restart}>
										Recommencer l'histoire
									</button>
								</div>
							)}
						</div>
					)}
				</section>

				{/* DEBUG */}

				<DebugPanel
					state={state}
					scene={currentScene}
					dialogueIndex={dialogueIndex}
				/>
			</div>
		</main>
	);
}

function isLastDialogue(scene: Scene, index: number): boolean {
	return index >= scene.dialogue.length - 1;
}

/*
 * CONDITIONS
 */

function areConditionsMet(conditions: Condition[], state: GameState): boolean {
	return conditions.every((condition) => checkCondition(condition, state));
}

function checkCondition(condition: Condition, state: GameState): boolean {
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

/*
 * EFFECTS
 */

function applyEffect(effect: Effect, state: GameState): void {
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
		return;
	}

	if (typeof effect.value !== "boolean") {
		return;
	}

	state.flags[effect.key] = effect.value;
}

function applyVariableEffect(effect: Effect, state: GameState): void {
	if (!effect.key) {
		return;
	}

	if (typeof effect.value !== "number") {
		return;
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
		return;
	}

	if (typeof effect.value !== "number") {
		return;
	}

	const current = state.relationships[effect.character] ?? 0;

	switch (effect.operation ?? "set") {
		case "set":
			state.relationships[effect.character] = clampRelationship(effect.value);
			break;

		case "add":
			state.relationships[effect.character] = clampRelationship(
				current + effect.value,
			);
			break;

		case "subtract":
			state.relationships[effect.character] = clampRelationship(
				current - effect.value,
			);
			break;
	}
}

function clampRelationship(value: number): number {
	return Math.max(-100, Math.min(100, value));
}

/*
 * GAME STATE
 */

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

/*
 * NOMS DES PERSONNAGES
 */

function formatCharacterName(slug: string): string {
	const names: Record<string, string> = {
		"arven-veyr": "Arven Veyr",

		"elira-veyr": "Elira Veyr",

		"nolen-veyr": "Nolen Veyr",

		"mara-veyr": "Mara Veyr",

		"neria-sol": "Neria Sol",

		"elda-renn": "Elda Renn",

		"bram-kell": "Bram Kell",

		"oren-solmar": "Oren Solmar",

		"taren-solmar": "Taren Solmar",
	};

	if (names[slug]) {
		return names[slug];
	}

	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

/*
 * DEBUG
 */

function DebugPanel({
	state,
	scene,
	dialogueIndex,
}: {
	state: GameState;
	scene: Scene;
	dialogueIndex: number;
}) {
	const locationNames: Record<number, string> = {
		1: "Valecendre",
		2: "Caldrath",
		3: "Maison",
	};

	return (
		<aside className="debug-panel">
			<div>
				<strong>DEBUG</strong>
			</div>

			<div>Scène : {scene.id}</div>

			<div>
				Dialogue :{" "}
				{scene.dialogue.length > 0
					? `${dialogueIndex + 1}/${scene.dialogue.length}`
					: "Aucun"}
			</div>

			<div>Argent : {state.variables.money}</div>

			<div>
				Position :{" "}
				{locationNames[state.variables.arven_end_day_location] ?? "Inconnue"}
			</div>

			<div className="debug-relations">
				<strong>Relations</strong>

				<span>Elira : {state.relationships["elira-veyr"] ?? 0}</span>

				<span>Neria : {state.relationships["neria-sol"] ?? 0}</span>

				<span>Nolen : {state.relationships["nolen-veyr"] ?? 0}</span>
			</div>
		</aside>
	);
}
