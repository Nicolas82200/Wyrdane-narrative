import { z } from "zod";

export const characterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  age: z.number().int().positive().optional(),
  description: z.string().optional()
});

export const locationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional()
});

export const choiceConditionSchema = z.object({
  type: z.string().min(1),
  key: z.string().min(1),
  value: z.unknown().optional()
});

export const choiceEffectSchema = z.object({
  type: z.string().min(1),
  key: z.string().min(1),
  value: z.unknown().optional()
});

export const choiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  nextSceneId: z.string().optional(),
  conditions: z.array(choiceConditionSchema).optional(),
  effects: z.array(choiceEffectSchema).optional()
});

export const sceneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  locationId: z.string().optional(),
  characters: z.array(z.string()).optional(),
  choices: z.array(choiceSchema),
  nextSceneId: z.string().optional()
});

export const chapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  startingSceneId: z.string().min(1),
  sceneIds: z.array(z.string())
});

export const gameEventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  conditions: z.array(choiceConditionSchema).optional(),
  effects: z.array(choiceEffectSchema).optional()
});