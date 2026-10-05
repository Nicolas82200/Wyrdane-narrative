export interface Choice {
  id: string;
  text: string;

  nextSceneId?: string;

  conditions?: ChoiceCondition[];

  effects?: ChoiceEffect[];
}

export interface ChoiceCondition {
  type: string;
  key: string;
  value?: unknown;
}

export interface ChoiceEffect {
  type: string;
  key: string;
  value?: unknown;
}