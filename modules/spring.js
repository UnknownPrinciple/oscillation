// TODO make it possible to pass initial velocity
export function spring(value, config = springs.noWobble, precision = 0.01) {
  return { value, config, precision, step };
}

export let springs = {
  noWobble: { mass: 1, stiffness: 170, damping: 26 },
  gentle: { mass: 1, stiffness: 120, damping: 14 },
  wobbly: { mass: 1, stiffness: 180, damping: 12 },
  stiff: { mass: 1, stiffness: 210, damping: 20 },
};

let tuple = [0, 0];
let secPerFrame = 1 / 60;
function step(x, v, destX, config, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  let Fspring = -config.stiffness * (x - destX);

  // Damping, in kg / s
  let Fdamper = -config.damping * v;

  let a = (Fspring + Fdamper) / config.mass;

  let newV = v + a * secPerFrame;
  let newX = x + newV * secPerFrame;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    tuple[0] = destX;
    tuple[1] = 0;
    return tuple;
  }

  tuple[0] = newX;
  tuple[1] = newV;
  return tuple;
}
