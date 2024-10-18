# Oscillation

```bash
npm install oscillation
```

Oscillation is a physics-based animation library for creating smooth, natural-looking animations.

```javascript
import { motion, spring } from "oscillation";

// Animate a single value
motion(spring(0, 100), (value) => {
  console.log(value);
});

// Animate multiple properties
motion({ x: spring(0, 100), y: spring(0, 200) }, (state) => {
  console.log(state.x, state.y);
});

// Animate an array of values
motion([spring([0, 0, 0], [255, 128, 0]), spring(0, 360)], ([color, rotation]) => {
  console.log(color, rotation);
});
```

## API

### `motion(defs, callback, options?)`

Starts an animation and calls the callback with updated values on each frame. The `motion` function
is overloaded to support different input types:

1. Single motion object:

```javascript
motion(spring(0, 100), (value) => {
  // value gets animated from 0 to 100
});
```

2. Object with motion properties:

```javascript
motion({ x: spring(0, 100), y: spring(-50, 50) }, ({ x, y }) => {
  // x and y animated simultaneously
});
```

3. Array of motion objects:

```javascript
motion([spring([0, 0, 0], [255, 128, 0]), spring(0, 360)], ([color, rotation]) => {
  // color and rotation animated simultaneously
});
```

Parameters:

- `defs`: A single `Motion` object, an object with `Motion` values, or an array of `Motion` objects.
- `callback`: A function called on each frame with the current state.
- `options`: Optional object with an `AbortSignal` to stop the animation.

### `spring(source, destination, config?)`

Creates a spring-based motion.

Parameters:

- `source`: Initial value(s).
- `destination`: Target value(s).
- `config`: Optional spring configuration (`damping`, `frequency`, `precision`).

Supports various numeric types: `number`, `Float64Array`, `Float32Array`, `Uint32Array`,
`Int32Array`, `Uint16Array`, `Int16Array`, `Uint8Array`, `Int8Array`, `Array<number>`.

## Types

Extra types provided for TypeScript:

- `Motion<Value>`: Represents an animatable value with methods:
  - `update()`: Updates the motion state.
  - `complete()`: Checks if the motion is complete.
  - `interpolate(t: number)`: Interpolates the motion value at a given time t.

## Cancelling Animations

You can cancel ongoing animations using an `AbortSignal`:

```javascript
const controller = new AbortController();
const { signal } = controller;

motion(
  spring(0, 100),
  (value) => {
    console.log(value);
  },
  { signal },
);

// To cancel the animation:
controller.abort();
```

## Examples

### Animating UI Elements

```javascript
import { motion, spring } from "oscillation";

const button = document.querySelector("#myButton");

motion({ x: spring(0, 100), scale: spring(1, 1.2) }, (state) => {
  button.style.transform = `translateX(${state.x}px) scale(${state.scale})`;
});
```

### Complex Color and Rotation Animation

```javascript
import { motion, spring } from "oscillation";

const element = document.querySelector("#animatedElement");

motion([spring([0, 0, 0], [255, 128, 0]), spring(0, 360)], ([color, rotation]) => {
  const [r, g, b] = color;
  element.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  element.style.transform = `rotate(${rotation}deg)`;
});
```

## Prior Art

Oscillation project brings nothing significantly new to the scene and is based on the work of many
engineers and researchers.

- [React Motion](https://github.com/chenglou/react-motion) by
  [@chenglou](https://github.com/chenglou)
- [Mobile First Animation](https://github.com/aholachek/mobile-first-animation) talk by
  [@aholachek](https://github.com/aholachek)
- [Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/) talk from WWDC
  2018

## License

[ISC License](./LICENSE) &copy; Oleksii Raspopov
