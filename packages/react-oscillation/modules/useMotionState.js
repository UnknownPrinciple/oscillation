import { useState, useRef, useCallback } from "react";
import { requestMotion, cancelMotion } from "oscillation";
import { isMotionConfig } from "./motionState.js";

export function useMotionState(initialValue) {
  let [state, setState] = useState(initialValue);

  // ref for saving motion id so the setter can cancel current animaiton
  // before starting a new one
  let idRef = useRef(null);

  let setMotionState = useCallback((values) => {
    cancelMotion(idRef.current);

    setState((state) => {
      // in the same way as setState(), this setter can receive a callback to determine
      // the next value based on the current one
      let nextValues = typeof values === "function" ? values(state) : values;

      // if any of new values require motion, trigger animaitons and save the id
      for (let key in nextValues) {
        if (isMotionConfig(nextValues[key])) {
          idRef.current = requestMotion(state, nextValues, setState);
          return state;
        }
      }

      // otherwise, assume immediate state change
      return nextValues;
    });
  }, []);

  return [state, setMotionState];
}
