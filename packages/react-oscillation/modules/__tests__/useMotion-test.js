import { jest } from '@jest/globals';
import { createElement } from 'react';
import { create, act } from 'react-test-renderer';
import { useMotion } from '../useMotion';
import { useMotionState } from '../useMotionState';
import { spring } from '../spring';
import instantiateMock from '../__mocks__/host';

beforeEach(() => {
  instantiateMock();
});

test('proper react hooks data passing to the core library', () => {
  let snapshots = [];
  function Component({ value }) {
    let { number, constant } = useMotion(() => ({ number: spring(value), constant: 1 }), [value]);
    snapshots.push(number);
    return createElement('span', null, number, ', ', constant);
  }
  let renderer = create(createElement(Component, { value: 0 }));
  expect(renderer.toJSON().children).toEqual(['0', ', ', '1']);
  act(() => {
    renderer.update(createElement(Component, { value: 10 }));
  });
  act(() => {
    advanceAnimationFrame(1, 0);
    advanceAnimationFrame(5, 1000 / 60);
  });
  expect(snapshots).toEqual([0, 0, 3.6720468997166984]);
  act(() => {
    advanceAnimationFrame(60, 1000 / 60);
  });
  expect(renderer.toJSON().children).toEqual(['10', ', ', '1']);
});

test('proper react hooks setter scheduling', () => {
  let snapshots = [];
  let setStateFn;
  function Component() {
    let [state, setState] = useMotionState(() => ({ x: 0 }));
    snapshots.push(state.x);
    setStateFn = setState;
    return createElement('span', null, state.x);
  }
  let renderer = create(createElement(Component));
  expect(renderer.toJSON().children).toEqual(['0']);
  act(() => {
    setStateFn({ x: spring(10) });
    advanceAnimationFrame(1, 0);
    advanceAnimationFrame(5, 1000 / 60);
  });
  expect(snapshots).toEqual([0, 3.6720468997166984]);
  let fn = jest.fn(() => ({ x: 0 }));
  act(() => {
    setStateFn(fn);
  });
  expect(fn).toHaveBeenCalledWith({ x: 3.6720468997166984 });
  expect(renderer.toJSON().children).toEqual(['0']);
});
