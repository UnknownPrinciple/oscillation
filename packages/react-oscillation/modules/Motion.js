import { useMotion } from "./useMotion.js";

export function Motion(props) {
  let values = useMotion(() => collect(props), [props]);
  return props.children(values);
}

function collect(source) {
  let result = {};
  for (let key in source) {
    if (typeof source[key] === "function") continue;
    result[key] = source[key];
  }
  return result;
}
