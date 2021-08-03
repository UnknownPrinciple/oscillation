export function spring(value, config = springs.noWobble, precision = 0.01, velocity = 0) {
  return { value, config, precision, velocity, step, interpolate };
}

export let springs = {
  noWobble: { mass: 1, stiffness: 170, damping: 26 },
  gentle: { mass: 1, stiffness: 120, damping: 14 },
  wobbly: { mass: 1, stiffness: 180, damping: 12 },
  stiff: { mass: 1, stiffness: 210, damping: 20 },
};

const SEC_PER_FRAME = 1 / 60;

// step function is assumed to be returning a tuple which values are immediately extracted
// given how often this function is called, saving some precious memory by reusing the same tuple
// even though it doesn't use much memory, it is GC that we should be afraid of
let tuple = [0, 0];
function step(x, v, destX, config, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  let Fspring = -config.stiffness * (x - destX);

  // Damping, in kg / s
  let Fdamper = -config.damping * v;

  let a = (Fspring + Fdamper) / config.mass;

  let newV = v + a * SEC_PER_FRAME;
  let newX = x + newV * SEC_PER_FRAME;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    tuple[0] = destX;
    tuple[1] = 0;
    return tuple;
  }

  tuple[0] = newX;
  tuple[1] = newV;
  return tuple;
}

function interpolate(x0, x1, k) {
  return x0 + (x1 - x0) * k;
}
