import bj from "babel-jest";

export default bj.createTransformer({
  presets: [["@babel/preset-env", { loose: true }], "@babel/preset-react"],
});
