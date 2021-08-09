import { useState, useRef, useCallback } from 'react';
import { requestMotion, cancelMotion } from 'oscillation';
import { isMotionConfig } from './motionState';

export function useMotionState(initialValue) {
  let [state, setState] = useState(initialValue);

  // ref for saving motion id so the setter can cancel current animaiton
  // before starting a new one
  let idRef = useRef(null);

  // to avoid setter callback invalidation, tracking the state as a ref
  // so at any time, calling the setter still use proper inital state for motion
  let stateRef = useRef(null);
  stateRef.current = state;

  let setMotionState = useCallback((values) => {
    cancelMotion(idRef.current);

    // in the same way as setState(), this setter can receive a callback to determine
    // the next value based on the current one
    let nextValues = typeof values === 'function' ? values(stateRef.current) : values;

    // if any of new values require motion, trigger animaitons and save the id
    for (let key in nextValues) {
      if (isMotionConfig(nextValues[key])) {
        idRef.current = requestMotion(stateRef.current, nextValues, setState);
        return;
      }
    }

    // otherwise, assume immediate state change
    setState(nextValues);
  }, []);

  return [state, setMotionState];
}
