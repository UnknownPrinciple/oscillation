const MS_PER_FRAME = 1000 / 60;
const SEC_PER_FRAME = 1 / 60;
const MAX_SKIP_FRAME = 10;

// TODO resolve first frame issue (the first render in normal conditions suppose to start with initial state)

/**
 * @template {ArrayLike<number>} T
 * @param {T} start
 * @param {T} destination
 * @param {AbortSignal} signal
 * @param {(values: T) => void} callback
 */
export function motion(start, destination, signal, callback) {
  let current = Float64Array.from(start);
  let velocity = new Float64Array(current.length);
  let interpolated = current.slice();
  let config = spring(springs.noWobble);

  let accumulatedMs = 0;
  /** @param {number} delta */
  function update(delta) {
    // check for accumulated time since we don't fully own the render cycle
    accumulatedMs += delta;

    // if accumulated time is increasingly huge, probably the window was suspended
    // restarting the loop allows resuming animation when the window is active again
    if (accumulatedMs > MS_PER_FRAME * MAX_SKIP_FRAME) {
      accumulatedMs = 0;
      return false;
    }

    // rendering cycle is not consistent and we need to take this into account
    while (accumulatedMs >= MS_PER_FRAME) {
      accumulatedMs -= MS_PER_FRAME;
      for (let i = 0, t; i < current.length; i++) {
        t = step(current[i], velocity[i], destination[i], config);
        current[i] = t[0];
        velocity[i] = t[1];
      }
    }

    for (let i = 0, t, completion = accumulatedMs / MS_PER_FRAME; i < current.length; i++) {
      t = step(current[i], velocity[i], destination[i], config);
      interpolated[i] = current[i] + (t[0] - current[i]) * completion;
    }

    return true;
  }

  let lastTimestamp = performance.now();
  requestAnimationFrame(function loop(timestamp) {
    if (signal.aborted || complete(current, velocity, destination)) return;
    if (update(timestamp - lastTimestamp)) callback(interpolated);
    lastTimestamp = timestamp;
    requestAnimationFrame(loop);
  });
}

function complete(x, vx, dx) {
  for (let i = 0; i < x.length; i++) {
    if (vx[i] !== 0 || x[i] !== dx[i]) return false;
  }
  return true;
}

let springs = {
  noWobble: { damping: 0.997, frequency: 0.4818, precision: 0.01 },
  gentle: { damping: 0.639, frequency: 0.5735, precision: 0.01 },
  wobbly: { damping: 0.4472, frequency: 0.4683, precision: 0.01 },
  stiff: { damping: 0.69, frequency: 0.4335, precision: 0.01 },
};

function spring(config = springs.noWobble) {
  let damping = (4 * Math.PI * config.damping) / config.frequency;
  let stiffness = ((2 * Math.PI) / config.frequency) ** 2;
  return { damping, stiffness, precision: config.precision };
}

// step function is assumed to be returning a tuple which values are immediately extracted
// given how often this function is called, saving some precious memory by reusing the same tuple
// even though it doesn't use much memory, it is GC that we should be afraid of
let tuple = new Float64Array(2);
function step(x, v, destX, config) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  let Fspring = -config.stiffness * (x - destX);

  // Damping, in kg / s
  let Fdamper = -config.damping * v;

  // (Fspring + Fdamper) / mass
  let a = Fspring + Fdamper;

  let newV = v + a * SEC_PER_FRAME;
  let newX = x + newV * SEC_PER_FRAME;

  if (Math.abs(newV) < config.precision && Math.abs(newX - destX) < config.precision) {
    tuple[0] = destX;
    tuple[1] = 0;
    return tuple;
  }

  tuple[0] = newX;
  tuple[1] = newV;
  return tuple;
}
