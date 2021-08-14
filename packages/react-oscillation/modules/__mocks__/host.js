import { jest } from '@jest/globals';

export default function instantiateMock() {
  let timestamp = 0;
  let performance = { now: jest.fn(() => timestamp) };
  let callbacks = {};
  let id = 0;
  let rAF = (cb) => {
    callbacks[id] = cb;
    return id++;
  };

  let cAF = (id) => {
    delete callbacks[id];
  };

  let step = (ms) => {
    let cbs = callbacks;
    callbacks = {};
    timestamp += ms;
    for (let k in cbs) {
      cbs[k](timestamp);
    }
  };

  let aAf = (steps, ms) => {
    for (var i = 0; i < steps; i++) {
      step(ms);
    }
  };

  global.performance = performance;
  global.requestAnimationFrame = jest.fn(rAF);
  global.cancelAnimationFrame = jest.fn(cAF);
  global.advanceAnimationFrame = aAf;
}
