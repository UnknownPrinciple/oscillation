/**
 * Starts an animation and calls the callback with updated values on each frame.
 * Provided motion defition is a single motion object.
 *
 * ```js
 * motion(spring(0, 100), (value) => {
 *   // value gets animated from 0 to 100
 * });
 * ```
 */
export function motion<Value extends Motion<any>>(
  defs: Value,
  callback: (state: Value extends Motion<infer V> ? V : never) => void,
  options?: { signal: AbortSignal },
): void;
/**
 * Starts an animation and calls the callback with updated values on each frame.
 * Provided motion defition is a single motion object.
 *
 * ```js
 * motion({ x: spring(0, 100), y: spring(-50, 50) }, ({ x, y }) => {
 *   // callback receives an object which shape follows motion definition
 *   // x and y animated simultaneously
 * });
 * ```
 */
export function motion<Dict extends { [k: string]: Motion<any> }>(
  defs: Dict,
  callback: (state: { [k in keyof Dict]: Dict[k] extends Motion<infer V> ? V : never }) => void,
  options?: { signal: AbortSignal },
): void;
/**
 * Starts an animation and calls the callback with updated values on each frame.
 * Provided motion defition is a single motion object.
 *
 * ```js
 * motion([
 *   spring([0, 0, 0], [255, 128, 0]),
 *   spring(0, 360),
 * ], ([color, rotation]) => {
 *   // callback receives an array which elements follow the motion definition
 * });
 * ```
 */
export function motion<List extends [Motion<any>, ...Motion<any>[]]>(
  defs: List,
  callback: (state: { [k in keyof List]: List[k] extends Motion<infer V> ? V : never }) => void,
  options?: { signal: AbortSignal },
): void;

export type Motion<Value> = {
  update(): void;
  complete(): boolean;
  interpolate(t: number): Value;
};

/** Creates a spring-based motion between source and destination values. */
export function spring<
  Value =
    | number
    | Float64Array
    | Float32Array
    | Uint32Array
    | Int32Array
    | Uint16Array
    | Int16Array
    | Uint8Array
    | Int8Array
    | Array<number>,
>(
  source: Value,
  destination: Value,
  config?: { damping: number; frequency: number; precision: number },
): Motion<Value>;
