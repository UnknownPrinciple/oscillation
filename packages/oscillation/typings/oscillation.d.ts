export function requestMotion<State extends { [k: string]: number }>(
  initialState: State,
  destinationValues: { [k in keyof State]: number | Spring },
  callback: (state: State, complete: boolean) => void,
): string;

export function cancelMotion(motionId: string): void;

export type SpringConfig = {
  damping: number;
  frequency: number;
  precision: number;
  velocity: number;
};

export type Spring = { value: number } & SpringConfig;

export function spring(value: number, config?: SpringConfig): Spring;

export var springs: {
  noWobble: SpringConfig;
  gentle: SpringConfig;
  wobbly: SpringConfig;
  stiff: SpringConfig;
};
