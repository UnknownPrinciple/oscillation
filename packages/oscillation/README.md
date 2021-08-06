# Oscillation

    npm install oscillation

## Usage

```javascript
import { requestMotion, cancelMotion, spring } from 'react-oscillation';

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

## API

### `requestMotion(initial, destination, callback)`

Returns `motionId`, a special ID that should be used to cancel the motion (similar to rAF or setTimeout/setInterval)

### `cancelMotion(motionId)`

Uses `motionId` to cancel existing animations
