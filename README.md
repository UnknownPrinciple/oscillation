# React Oscillation

    npm install react-oscillation

## Usage

```javascript
import { useMotion, spring } from 'react-oscillation';

function Toggle({ checked, onChange }) {
  let { x } = useMotion(() => ({ x: spring(checked ? 100 : 0) }), [checked]);
  let transform = `translateX(${x}px)`;
  return (
    <section>
      <div className="toggle" onClick={() => onChange(!checked)}>
        <div className="toggle-handler" style={{ transform }} />
      </div>
    </section>
  );
}
```

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

## React API

### `useMotion(factory, deps)`

### `useMotionState(initialValues)`

### `<Motion ...values />`

## Fundamental API

### `requestMotion(initial, destination, callback)`

Returns `motionId`, a special ID that should be used to cancel the motion (similar to rAF or setTimeout/setInterval)

### `cancelMotion(motionId)`

Uses `motionId` to cancel existing animations
