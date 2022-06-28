import * as React from "react";

import { create, act } from "react-test-renderer";
import { Motion } from "../Motion.js";

import { spring } from "../spring.js";
import instantiateMock from "../__mocks__/host.js";

beforeEach(() => {
  instantiateMock();
});

test("proper react hooks data passing to the core library", () => {
  let snapshots = [];
  function Component({ value }) {
    return (
      <Motion number={spring(value)} constant={1}>
        {({ number, constant }) => {
          snapshots.push(number);
          return (
            <span>
              {number}, {constant}
            </span>
          );
        }}
      </Motion>
    );
  }
  let renderer = create(<Component value={0} />);
  expect(renderer.toJSON().children).toEqual(["0", ", ", "1"]);
  act(() => {
    renderer.update(<Component value={10} />);
  });
  act(() => {
    advanceAnimationFrame(1, 0);
    advanceAnimationFrame(5, 1000 / 60);
  });
  expect(snapshots).toEqual([0, 0, 3.6720468997166984]);
  act(() => {
    advanceAnimationFrame(60, 1000 / 60);
  });
  expect(renderer.toJSON().children).toEqual(["10", ", ", "1"]);
});
