# React Oscillation

Complementary React hooks and components for Oscillation library

    npm install react-oscillation

## Usage

```jsx
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

Hook to translate arbitrary input into motion-based value. A `factory` function suppose to return an
object that enumerates what values need to be advancing. Similar to `useMemo()`, `deps` array tracks
dependencies to update motion target.

```jsx
import { useMotion, spring } from "react-oscillation";

function Scene({ targetX, targetY }) {
  let { x, y } = useMotion(() => {
    return { x: spring(targetX), y: spring(targetY) };
  }, [targetX, targetY]);
  let transform = `translateX(${x}px, ${y}px)`;
  return (
    <section>
      <div className="object" style={{ transform }} />
    </section>
  );
}
```

### `useMotionState(initialValues)`

Hook to translate arbitrary input into motion-based value just like `useMotion()` but additionally
allows manually updating the target, similar to how `useState()` works.

```jsx
import { useMotionState, spring } from "react-oscillation";

function Scene() {
  let [{ x, y }, setState] = useMotion({ x: 0, y: 0 });
  let transform = `translateX(${x}px, ${y}px)`;
  let randomize = () => {
    let randomX = Math.random() * 500;
    let randomY = Math.random() * 300;
    setState({ x: spring(randomX), y: spring(randomY) });
  };
  return (
    <section>
      <div className="object" style={{ transform }} />
      <button onClick={randomize}>Move</button>
    </section>
  );
}
```

### `<Motion ...values />`

Component that provides motion-based values via render-prop. Suitable for cases where a small part
of component's render should be updated but re-rendering the whole component is bad for performance.

```jsx
import { useMotionState, spring } from "react-oscillation";

function Scene() {
  let [{ x, y }, setState] = useState({ x: 0, y: 0 });
  let randomize = () => {
    setState({ x: Math.random() * 500, y: Math.random() * 300 });
  };
  return (
    <section>
      <Motion x={x} y={y}>
        {({ x, y }) => {
          let transform = `translateX(${x}px, ${y}px)`;
          return <div className="object" style={{ transform }} />;
        }}
      </Motion>
      <button onClick={randomize}>Move</button>
    </section>
  );
}
```
