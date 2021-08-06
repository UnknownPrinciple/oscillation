export function spring(value, config = springs.noWobble) {
  let damping = (4 * Math.PI * config.damping) / config.frequency;
  let stiffness = ((2 * Math.PI) / config.frequency) ** 2;
  return {
    value,
    damping,
    stiffness,
    precision: config.precision,
    velocity: config.velocity,
    update,
    interpolate,
  };
}

export let springs = {
  noWobble: { damping: 0.997, frequency: 0.4818, precision: 0.01, velocity: 0 },
  gentle: { damping: 0.639, frequency: 0.5735, precision: 0.01, velocity: 0 },
  wobbly: { damping: 0.4472, frequency: 0.4683, precision: 0.01, velocity: 0 },
  stiff: { damping: 0.69, frequency: 0.4335, precision: 0.01, velocity: 0 },
};

const SEC_PER_FRAME = 1 / 60;

// step function is assumed to be returning a tuple which values are immediately extracted
// given how often this function is called, saving some precious memory by reusing the same tuple
// even though it doesn't use much memory, it is GC that we should be afraid of
let tuple = [0, 0];
function update(x, v, destX, config) {
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

function interpolate(x0, x1, k) {
  return x0 + (x1 - x0) * k;
}
