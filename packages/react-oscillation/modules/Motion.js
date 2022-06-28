import { useMotion } from "./useMotion.js";

function Motion(props) {
  let values = useMotion(() => omit(props, ["children"]), [props]);
  return props.children(values);
}

function omit(source, excluded) {
  let result = {};
  for (let key in source) {
    if (excluded.indexOf(key) >= 0) continue;
    result[key] = source[key];
  }
  return result;
}
