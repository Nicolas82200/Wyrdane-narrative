import type { Choice } from "./choice.js";

export interface Scene {
  id: string;
  title: string;
  description: string;

  locationId?: string;

  characters?: string[];

  choices: Choice[];

  nextSceneId?: string;
}