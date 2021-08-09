# Oscillation

Physics-based animations made easy

    npm install oscillation

## Usage

```javascript
import { requestMotion, spring } from 'oscillation';

let output = document.querySelector('#output');
requestMotion({ x: 0 }, { x: spring(10) }, ({ x }) => {
  output.textContent = x;
});
```

## API

### `requestMotion(initialState, destinationValues, callback)`

Returns `motionId`, a special ID that should be used to cancel the motion (similar to rAF or setTimeout/setInterval)

### `cancelMotion(motionId)`

Uses `motionId` to cancel existing animations

### `spring(value[, config])`

## Examples

```javascript
import { requestMotion, cancelMotion, spring } from 'oscillation';

let target = document.querySelector('#targetSpinner');
let button = document.querySelector('#checkButton');

let currentX = 0;
let checked = false;
let motionId;

function triggerAnimation(checked) {
  let motionId = requestMotion({ x: currentX }, { x: spring(checked ? 100 : 0) }, ({ x }) => {
    currentX = x;
    target.style.transform = `translateX(${x}px)`;
  });
  return motionId;
}

button.addEventListener('click', () => {
  cancelMotion(motionId);
  checked = !checked;
  triggerAnimation(checked);
});
```
