export let springs = {
  noWobble: { damping: 0.997, frequency: 0.4818, precision: 0.01 },
  gentle: { damping: 0.639, frequency: 0.5735, precision: 0.01 },
  wobbly: { damping: 0.4472, frequency: 0.4683, precision: 0.01 },
  stiff: { damping: 0.69, frequency: 0.4335, precision: 0.01 },
};

export function spring(source, destination, config = springs.noWobble) {
  let damping = (4 * Math.PI * config.damping) / config.frequency;
  let stiffness = ((2 * Math.PI) / config.frequency) ** 2;
  let precision = config.precision;

  if (Array.isArray(source)) {
    return multispring(Array.from(source), destination, damping, stiffness, precision);
  }

  if (ArrayBuffer.isView(source)) {
    return multispring(Float64Array.from(source), destination, damping, stiffness, precision);
  }

  return singlespring(source, destination, damping, stiffness, precision);
}

function singlespring(current, destination, damping, stiffness, precision) {
  let velocity = 0;
  return {
    update() {
      let tuple = step(current, velocity, destination, damping, stiffness, precision);
      current = tuple[0];
      velocity = tuple[1];
    },
    complete() {
      if (velocity !== 0 || current !== destination) return false;
      return true;
    },
    interpolate(t) {
      let next = step(current, velocity, destination, damping, stiffness, precision);
      return current + (next[0] - current) * t;
    },
  };
}

function multispring(current, destination, damping, stiffness, precision) {
  let velocity = new Float64Array(current.length);
  let interpolated = current.slice();
  return {
    update() {
      let tuple;
      for (let i = 0; i < current.length; i++) {
        tuple = step(current[i], velocity[i], destination[i], damping, stiffness, precision);
        current[i] = tuple[0];
        velocity[i] = tuple[1];
      }
    },
    complete() {
      for (let i = 0; i < current.length; i++) {
        if (velocity[i] !== 0 || current[i] !== destination[i]) return false;
      }
      return true;
    },
    interpolate() {
      let tuple;
      for (let i = 0; i < current.length; i++) {
        tuple = step(current[i], velocity[i], destination[i], damping, stiffness, precision);
        interpolated[i] = tuple[0];
      }
      return interpolated;
    },
  };
}

// step function is assumed to be returning a tuple which values are immediately extracted
// given how often this function is called, saving some precious memory by reusing the same tuple
// even though it doesn't use much memory, it is GC that we should be afraid of
let tuple = new Float64Array(2);
function step(x, v, destX, damping, stiffness, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  let Fspring = -stiffness * (x - destX);

  // Damping, in kg / s
  let Fdamper = -damping * v;

  // (Fspring + Fdamper) / mass
  let a = Fspring + Fdamper;

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
