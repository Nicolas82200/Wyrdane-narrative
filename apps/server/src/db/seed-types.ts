import { z } from "zod";

export const characterSchema = z.object({
	slug: z.string().min(1),
	name: z.string().min(1),
	age: z.number().int().nonnegative().nullable(),
	race: z.string().min(1),
	kingdom: z.string().nullable(),
	occupation: z.string().nullable(),
	location: z.string().min(1),
	description: z.string().min(1),
});

export const locationSchema = z.object({
	slug: z.string().min(1),
	name: z.string().min(1),
	type: z.string().min(1),
	kingdom: z.string().nullable(),
	population: z.number().int().nonnegative().nullable(),
	description: z.string().min(1),
});

export const characterRelationshipSchema = z.object({
	character: z.string().min(1),
	relatedCharacter: z.string().min(1),
	type: z.string().min(1),
	score: z.number().int().min(-100).max(100),
	hasMet: z.boolean(),
	description: z.string().nullable(),
});

export type CharacterData = z.infer<typeof characterSchema>;
export type LocationData = z.infer<typeof locationSchema>;
export type CharacterRelationshipData = z.infer<
	typeof characterRelationshipSchema
>;
