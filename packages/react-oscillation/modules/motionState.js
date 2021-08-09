export function serializeMotionState(state) {
  let serialized = Object.create(state);
  for (let key in state) {
    let target = state[key];
    serialized[key] = isMotionConfig(target) ? target.value : target;
  }
  return serialized;
}

export function isMotionConfig(target) {
  return target != null && typeof target.update === 'function';
}
