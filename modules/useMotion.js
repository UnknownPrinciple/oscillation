import { useState, useLayoutEffect } from 'react';
import { MotionValue } from './MotionValue';

const MS_PER_FRAME = 1000 / 60;

export function useMotion(factory, deps) {
  let [state, setState] = useState(() => {
    let entities = factory();
    let state = Object.create(entities);
    for (let key in entities) {
      let target = entities[key];
      state[key] = isMotionConfig(target) ? target.value : target;
    }
    return state;
  });

  useLayoutEffect(() => {
    let accumulatedMs = 0;
    let lastTimestamp = 0;

    // instantiate fresh entities since the effect is restarted based on the input data
    let entities = factory();
    let newState = Object.create(entities);
    let values = [];
    for (let key in entities) {
      let target = entities[key];
      if (isMotionConfig(target)) {
        newState[key] = target.value;
        // read from currently rendered state but don't keep it in effect's deps
        values.push(new MotionValue(key, state[key], newState[key], target));
      } else {
        newState[key] = target;
      }
    }

    function performMotion(timestamp) {
      // check for accumulated time since we don't fully own the render cycle
      accumulatedMs += lastTimestamp ? timestamp - lastTimestamp : 0;
      lastTimestamp = timestamp;

      // it's been too long since no update, let's restart the whole thing
      if (accumulatedMs > MS_PER_FRAME * 10) {
        accumulatedMs = 0;
        return;
      }

      // rendering cycle is not consistent and we need to take this into account
      let framesToCatchUp = Math.floor(accumulatedMs / MS_PER_FRAME);

      for (let i = 0; i < framesToCatchUp; i++) {
        values.forEach((value) => value.update());
      }

      // motion values are up to date, ready to be rendered
      accumulatedMs -= framesToCatchUp * MS_PER_FRAME;

      // for smooth experince, let's interpolate final state accordingly to frame's completion
      let currentFrameCompletion = accumulatedMs / MS_PER_FRAME;
      values.forEach((value) => {
        newState[value.key] = value.interpolate(currentFrameCompletion);
      });

      // flushing updated state via React state setter
      setState(Object.create(newState));
    }

    // whenever a motion value gets destination point, start the animation loop
    let timerId = shouldContinueMotion(values)
      ? requestAnimationFrame(function loop(timestamp) {
          performMotion(timestamp);
          // keep iterating if any of motion values still hasn't reached the destination
          timerId = shouldContinueMotion(values) ? requestAnimationFrame(loop) : null;
        })
      : null;

    return () => {
      cancelAnimationFrame(timerId);
    };
  }, deps);

  return state;
}

function isMotionConfig(target) {
  return target != null && typeof target.step === 'function';
}

function shouldContinueMotion(values) {
  return values.some((value) => value.v !== 0 || value.x !== value.destX);
}
