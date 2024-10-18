const MS_PER_FRAME = 1000 / 60;
const MAX_SKIP_FRAME = 10;

export function motion(defs, callback, options) {
  let updt = updateOf(defs);
  let intp = interpolateOf(defs);
  let cplt = completeOf(defs);
  let signal = options != null ? options.signal : null;
  let complete = signal != null ? () => signal.aborted || cplt() : cplt;
  let irm = options != null ? options.ignoreReducedMotion : false;
  let prm = irm ? { matches: false } : matchMedia("(prefers-reduced-motion: reduce)");

  let state;
  let accumulatedMs = 0;

  /** @param {number} delta */
  function update(delta) {
    if (prm.matches) {
      updt(-1);
      accumulatedMs = 0;
      state = intp(0);
      return true;
    }

    // check for accumulated time since we don't fully own the render cycle
    accumulatedMs += delta;

    // if accumulated time is increasingly huge, probably the window was suspended
    // restarting the loop allows resuming animation when the window is active again
    if (accumulatedMs > MS_PER_FRAME * MAX_SKIP_FRAME) {
      accumulatedMs = 0;
      return false;
    }

    updt((accumulatedMs / MS_PER_FRAME) | 0);
    accumulatedMs %= MS_PER_FRAME;
    state = intp(accumulatedMs / MS_PER_FRAME);
    return true;
  }

  let lastTimestamp = performance.now();
  requestAnimationFrame(function loop(timestamp) {
    if (!complete()) {
      if (update(timestamp - lastTimestamp)) callback(state);
      lastTimestamp = timestamp;
      requestAnimationFrame(loop);
    }
  });
}

function updateOf(defs) {
  if (typeof defs.update === "function") {
    // is single motion object
    return (n) => defs.update(n);
  }

  if (Array.isArray(defs)) {
    // is array of motion objects
    return (n) => {
      for (let index = 0; index < defs.length; index++) defs[index].update(n);
    };
  }

  // otherwise, assume dict of motion objects
  return (n) => {
    for (let key in defs) defs[key].update(n);
  };
}

function interpolateOf(defs) {
  if (typeof defs.interpolate === "function") {
    // is single motion object
    return (t) => defs.interpolate(t);
  }

  if (Array.isArray(defs)) {
    // is array of motion objects
    return (t) => defs.map((def) => def.interpolate(t));
  }

  // otherwise, assume dict of motion objects
  return (t) => {
    let v = Object.create(defs);
    for (let key in defs) v[key] = defs[key].interpolate(t);
    return v;
  };
}

function completeOf(defs) {
  if (typeof defs.complete === "function") {
    // is single motion object
    return () => defs.complete();
  }

  if (Array.isArray(defs)) {
    // is array of motion objects
    return () => defs.every((def) => def.complete());
  }

  // otherwise, assume dict of motion objects
  return () => {
    for (let key in defs) {
      if (!defs[key].complete()) return false;
    }
    return true;
  };
}
