import { useState, useLayoutEffect } from "react";
import { requestMotion, cancelMotion } from "oscillation";
import { serializeMotionState } from "./motionState.js";

export function useMotion(factory, deps) {
  // initial state should be a snapshot of any values that factory() returns
  // this hook must synchronously return initial state
  let v = useState(() => serializeMotionState(factory()));

  // layout effect is used to schedule necessary animations immediately when
  // DOM elements are available
  // this effect directly uses `deps` as the source of dependencies and
  // intentionnaly omits tracking `state` since it will be up to date
  // every time the effect needs to be restarted
  useLayoutEffect(() => {
    let motionId = requestMotion(v[0], factory(), v[1]);
    return () => cancelMotion(motionId);
  }, deps);

  return v[0];
}
