export interface GameEvent {
  id: string;
  type: string;

  conditions?: EventCondition[];

  effects?: EventEffect[];
}

export interface EventCondition {
  type: string;
  key: string;
  value?: unknown;
}

export interface EventEffect {
  type: string;
  key: string;
  value?: unknown;
}