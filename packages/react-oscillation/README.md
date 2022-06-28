# React Oscillation

Complementary React hooks and components for Oscillation library

    npm install react-oscillation

## Usage

```javascript
import { useMotion, spring } from "react-oscillation";

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

## API

### `useMotion(factory, deps)`

### `useMotionState(initialValues)`

### `<Motion ...values />`
