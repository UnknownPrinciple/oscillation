export function requestAnimationFrame(cb) {
  return global.requestAnimationFrame(cb);
}

export function cancelAnimationFrame(id) {
  return global.cancelAnimationFrame(id);
}

export function getCurrentTimestamp() {
  return global.performance.now();
}
