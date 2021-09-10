import { jest } from '@jest/globals';
import { requestMotion, cancelMotion } from '../requestMotion.js';
import { spring, springs } from '../spring.js';
import instantiateMock from '../__mocks__/host.js';

beforeEach(() => {
  instantiateMock();
});

test('interpolation with ideal timer condition', () => {
  let snapshots = [];
  requestMotion({ x: 0 }, { x: spring(10) }, ({ x }) => snapshots.push(x));

  advanceAnimationFrame(1, 0);
  advanceAnimationFrame(5, 1000 / 60);
  expect(snapshots).toEqual([
    0, 0.47241496285986795, 1.1901835641718526, 2.0130615470443205, 2.8566207208531145,
    3.6720468997166984,
  ]);
});

test('eventual interpolation completeness', () => {
  let snapshots = [];
  requestMotion({ x: 0 }, { x: spring(10) }, ({ x }) => snapshots.push(x));

  advanceAnimationFrame(1, 0);
  advanceAnimationFrame(69, 1000 / 60);
  expect(snapshots[snapshots.length - 1]).toBe(10);
});

test('interpolation with inconsistent timer condition', () => {
  let snapshots = [];
  requestMotion({ x: 0 }, { x: spring(10) }, ({ x }) => snapshots.push(x));

  advanceAnimationFrame(1, 0);
  expect(snapshots).toEqual([0]);

  advanceAnimationFrame(1, (1000 / 60) * 11);
  expect(snapshots).toEqual([0]);

  advanceAnimationFrame(3, 0.1);
  expect(snapshots).toEqual([
    0, 0.0028344897771590463, 0.0056689795543180925, 0.008503469331477139,
  ]);

  advanceAnimationFrame(10, 999);
  expect(snapshots).toEqual([
    0, 0.0028344897771590463, 0.0056689795543180925, 0.008503469331477139,
  ]);

  advanceAnimationFrame(2, 36);
  expect(snapshots).toEqual([
    0, 0.0028344897771590463, 0.0056689795543180925, 0.008503469331477139, 1.3218440414314472,
    3.117557098089461,
  ]);
});

test('explicit motion cancellation', () => {
  let snapshots = [];
  let id = requestMotion({ x: -10 }, { x: spring(-100) }, ({ x }) => snapshots.push(x));

  advanceAnimationFrame(1, 0);
  advanceAnimationFrame(3, 1000 / 60);

  cancelMotion(id);
  advanceAnimationFrame(2, 1000 / 60);

  expect(cancelAnimationFrame).toHaveBeenCalled();
  expect(snapshots).toEqual([-10, -14.251734665738812, -20.711652077546674, -28.117553923398887]);
});

test('completeness argument passed', () => {
  let snapshots = [];
  requestMotion({ x: 0 }, { x: spring(10) }, ({ x }, c) => snapshots.push([x, c]));

  advanceAnimationFrame(1, 0);
  advanceAnimationFrame(69, 1000 / 60);
  expect(snapshots[0]).toEqual([0, false]);
  expect(snapshots[snapshots.length - 1]).toEqual([10, true]);
});

test('no work needed', () => {
  let callback = jest.fn();
  let id = requestMotion({ x: 0 }, { x: 0 }, callback);
  expect(callback).not.toHaveBeenCalled();
  expect(requestAnimationFrame).not.toHaveBeenCalled();
  expect(id).toBe(null);
});

test('no cancellation needed', () => {
  let id = requestMotion({ x: 0 }, { x: 0 }, jest.fn());
  let result = cancelMotion(id);
  expect(result).toBe(false);
});
