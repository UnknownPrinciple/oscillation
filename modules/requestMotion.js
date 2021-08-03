import { MotionValue, isMotionConfig } from './MotionValue';

const MS_PER_FRAME = 1000 / 60;

let timers = new Map();
let motionCounter = 0;

export function requestMotion(initial, destination, callback) {
  // instantiate fresh destination since the effect is restarted based on the input data
  let values = [];
  for (let key in destination) {
    let target = destination[key];
    if (isMotionConfig(target)) {
      values.push(new MotionValue(key, initial[key], target.value, target));
    }
  }

  // main animation loop starts here
  let accumulatedMs = 0;
  let lastTimestamp = performance.now();
  function performMotion(timestamp) {
    // check for accumulated time since we don't fully own the render cycle
    accumulatedMs += timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // if accumulated time is increasingly huge, probably the window was suspended
    // restarting the loop allows resuming animation when the window is active again
    if (accumulatedMs > MS_PER_FRAME * 10) {
      accumulatedMs = 0;
      return;
    }

    // rendering cycle is not consistent and we need to take this into account
    while (accumulatedMs >= MS_PER_FRAME) {
      accumulatedMs -= MS_PER_FRAME;
      for (let i = 0; i < values.length; i++) {
        values[i].update();
      }
    }

    // for smooth experince, let's interpolate final state accordingly to frame's completion
    let state = Object.create(destination);
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      state[value.key] = value.interpolate(accumulatedMs / MS_PER_FRAME);
    }

    // flushing updated state via React state setter
    callback(state);
  }

  if (shouldContinueMotion(values)) {
    // whenever a motion value gets destination point, start the animation loop
    let timerId = requestAnimationFrame(function loop(timestamp) {
      performMotion(timestamp);

      if (shouldContinueMotion(values)) {
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
  return values.some((value) => value.v !== 0 || value.x !== value.destX);
}
