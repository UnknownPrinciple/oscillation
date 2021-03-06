const MS_PER_FRAME = 1000 / 60;

let timers = new Map();
let motionCounter = 0;

export function requestMotion(initialState, destinationValues, callback) {
  let values = [];
  for (let key in destinationValues) {
    let target = destinationValues[key];
    if (isMotionConfig(target)) {
      values.push(createMotionValue(key, initialState[key], target));
    }
  }

  // main animation loop starts here
  let accumulatedMs = 0;
  function computeMotionState(timedelta) {
    // check for accumulated time since we don't fully own the render cycle
    accumulatedMs += timedelta;

    // if accumulated time is increasingly huge, probably the window was suspended
    // restarting the loop allows resuming animation when the window is active again
    if (accumulatedMs > MS_PER_FRAME * 10) {
      accumulatedMs = 0;
      return null;
    }

    // rendering cycle is not consistent and we need to take this into account
    while (accumulatedMs >= MS_PER_FRAME) {
      accumulatedMs -= MS_PER_FRAME;
      for (let i = 0; i < values.length; i++) {
        updateMotionValue(values[i]);
      }
    }

    // for smooth experince, let's interpolate final state accordingly to frame's completion
    let state = Object.create(destinationValues);
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      state[value.key] = interpolateMotionValue(value, accumulatedMs / MS_PER_FRAME);
    }

    return state;
  }

  if (shouldContinueMotion(values)) {
    // whenever a motion value gets destination point, start the animation loop
    let lastTimestamp = performance.now();
    let timerId = requestAnimationFrame(function loop(timestamp) {
      let state = computeMotionState(timestamp - lastTimestamp);
      let shouldContinue = shouldContinueMotion(values);
      lastTimestamp = timestamp;

      // yield to actual render
      if (state != null) {
        callback(state, !shouldContinue);
      }

      if (shouldContinue) {
        // keep iterating if any of motion values still hasn't reached the destination
        let nextTimerId = requestAnimationFrame(loop);
        timers.set(motionId, nextTimerId);
      } else {
        // otherwise, clean up the timer id to prevent unnecessary memory consumption
        timers.delete(motionId);
      }
    });

    // motionId allows API consumer to cancel existing motion animation at any point of time
    let motionId = motionCounter++;
    timers.set(motionId, timerId);
    return motionId;
  } else {
    // no work is scheduled, no motion id needed
    return null;
  }
}

export function cancelMotion(motionId) {
  if (timers.has(motionId)) {
    let timerId = timers.get(motionId);
    cancelAnimationFrame(timerId);
    timers.delete(motionId);
    return true;
  }
  return false;
}

function shouldContinueMotion(values) {
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    if (value.v !== 0 || value.x !== value.destX) {
      return true;
    }
  }
  return false;
}

function isMotionConfig(target) {
  return target != null && typeof target.update === "function";
}

function createMotionValue(key, initial, config) {
  return { key, x: initial, v: config.velocity, destX: config.value, config };
}

function updateMotionValue(value) {
  let update = value.config.update(value.x, value.v, value.destX, value.config);
  value.x = update[0];
  value.v = update[1];
}

function interpolateMotionValue(value, completion) {
  let r = value.config.update(value.x, value.v, value.destX, value.config);
  return value.config.interpolate(value.x, r[0], completion);
}
