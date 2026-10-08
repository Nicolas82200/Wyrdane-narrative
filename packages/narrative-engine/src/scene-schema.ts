import { z } from "zod";

export const dialogueLineSchema = z.object({
	speaker: z.string().min(1),
	text: z.string().min(1),
});

export const conditionSchema = z.object({
	type: z.enum(["flag", "variable", "relationship"]),

	key: z.string().optional(),

	character: z.string().optional(),

	operator: z.enum([
		"equals",
		"not_equals",
		"greater_than",
		"less_than",
		"greater_or_equal",
		"less_or_equal",
	]),

	value: z.union([z.boolean(), z.number()]),
});

export const effectSchema = z.object({
	type: z.enum(["flag", "variable", "relationship"]),

	key: z.string().optional(),

	character: z.string().optional(),

	value: z.union([z.boolean(), z.number()]),

	operation: z.enum(["set", "add", "subtract"]).optional(),
});

export const choiceSchema = z.object({
	id: z.string().min(1),

	text: z.string().min(1),

	conditions: z.array(conditionSchema).default([]),

	effects: z.array(effectSchema).default([]),

	nextScene: z.string().min(1),
});

export const sceneSchema = z.object({
	id: z.string().min(1),

	title: z.string().min(1),

	description: z.string().min(1),

	location: z.string().nullable(),

	characters: z.array(z.string().min(1)),

	dialogue: z.array(dialogueLineSchema),

	choices: z.array(choiceSchema),
});
