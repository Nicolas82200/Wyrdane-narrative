import type { Relationship } from "./relationship.js";

export interface GameState {
  currentSceneId: string;

  flags: Record<string, boolean>;

  variables: Record<string, number | string>;

  relationships: Record<string, Relationship>;

  inventory: string[];

  discoveredLocations: string[];

  completedEvents: string[];
}