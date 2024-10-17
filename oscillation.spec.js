import { test as base } from "rollwright";
import { expect } from "@playwright/test";

let test = base.extend({
  advance: async ({ execute }, use) => {
    let advance = await execute(() => {
      let timestamp = 0;
      window.performance = { now: () => timestamp };

      let callbacks = {};
      let id = 0;
      window.requestAnimationFrame = (cb) => ((callbacks[id++] = cb), id);
      window.cancelAnimationFrame = (id) => delete callbacks[id];

      function step(ms) {
        let cbs = callbacks;
        callbacks = {};
        timestamp += ms;
        for (let k in cbs) cbs[k](timestamp);
      }

      return (steps, ms) => {
        for (let i = 0; i < steps; i++) step(ms);
      };
    });

    await use((steps, ms) =>
      execute((advance, steps, ms) => advance(steps, ms), advance, steps, ms),
    );
  },
});

test("interpolation with ideal timer condition", async ({ execute, advance }) => {
  let snapshots = await execute(async () => {
    let { motion } = await import("./motion.js");
    let { spring } = await import("./spring.js");
    let snapshots = [];
    let ctl = new AbortController();
    motion(spring(0, 10), (x) => snapshots.push(x), { signal: ctl.signal });
    return snapshots;
  });

  await advance(1, 0);
  await advance(5, 1000 / 60);

  expect(await snapshots.jsonValue()).toEqual([
    0, 0.47241496285986795, 1.1901835641718526, 2.0130615470443205, 2.8566207208531145,
    3.6720468997166984,
  ]);
});

test("eventual interpolation completeness", async ({ execute, advance }) => {
  let snapshots = await execute(async () => {
    let { motion } = await import("./motion.js");
    let { spring } = await import("./spring.js");
    let snapshots = [];
    let ctl = new AbortController();
    motion(spring(0, 10), (x) => snapshots.push(x), { signal: ctl.signal });
    return snapshots;
  });

  await advance(1, 0);
  await advance(69, 1000 / 60);

  expect((await snapshots.jsonValue()).at(-1)).toBe(10);
});

test("interpolation with inconsistent timer condition", async ({ execute, advance }) => {
  let snapshots = await execute(async () => {
    let { motion } = await import("./motion.js");
    let { spring } = await import("./spring.js");
    let snapshots = [];
    let ctl = new AbortController();
    motion(spring(0, 10), (x) => snapshots.push(x), { signal: ctl.signal });
    return snapshots;
  });

  await advance(1, 0);
  expect(await snapshots.jsonValue()).toEqual([0]);

  await advance(1, (1000 / 60) * 11);
  expect(await snapshots.jsonValue()).toEqual([0]);

  await advance(3, 0.1);
  expect(await snapshots.jsonValue()).toEqual([
    0, 0.0028344897771590463, 0.0056689795543180925, 0.008503469331477139,
  ]);

  await advance(10, 999);
  expect(await snapshots.jsonValue()).toEqual([
    0, 0.0028344897771590463, 0.0056689795543180925, 0.008503469331477139,
  ]);

  await advance(2, 36);
  expect(await snapshots.jsonValue()).toEqual([
    0, 0.0028344897771590463, 0.0056689795543180925, 0.008503469331477139, 1.3218440414314472,
    3.117557098089461,
  ]);
});

test("explicit motion cancellation", async ({ execute, advance }) => {
  let ctl = await execute(() => new AbortController());

  let snapshots = await execute(async (ctl) => {
    let { motion } = await import("./motion.js");
    let { spring } = await import("./spring.js");
    let snapshots = [];
    motion(spring(-10, -100), (x) => snapshots.push(x), { signal: ctl.signal });
    return snapshots;
  }, ctl);

  await advance(1, 0);
  await advance(3, 1000 / 60);

  await execute((ctl) => ctl.abort(), ctl);
  await advance(2, 1000 / 60);

  expect(await snapshots.jsonValue()).toEqual([
    -10, -14.251734665738812, -20.711652077546674, -28.117553923398887,
  ]);
});
