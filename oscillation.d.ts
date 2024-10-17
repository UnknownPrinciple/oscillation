type Series =
  | number
  | Float64Array
  | Float32Array
  | Uint32Array
  | Int32Array
  | Uint16Array
  | Int16Array
  | Uint8Array
  | Int8Array
  | Array<number>;

export function motion<Value extends Motion<any>>(
  defs: Value,
  callback: (state: Value extends Motion<infer V> ? V : never) => void,
  options?: { signal: AbortSignal },
): void;
export function motion<Dict extends { [k: string]: Motion<any> }>(
  defs: Dict,
  callback: (state: { [k in keyof Dict]: Dict[k] extends Motion<infer V> ? V : never }) => void,
  options?: { signal: AbortSignal },
): void;
export function motion<List extends Array<Motion<any>>>(
  defs: List,
  callback: (state: List extends Array<Motion<infer V>> ? Array<V> : never) => void,
  options?: { signal: AbortSignal },
): void;

type Motion<Value> = {
  update(): void;
  complete(): boolean;
  interpolate(t: number): Value;
};

type SpringConfig = { damping: number; frequency: number; precision: number };

export function spring<Value = Series>(
  source: Value,
  destination: Value,
  config?: SpringConfig,
): Motion<Value>;
