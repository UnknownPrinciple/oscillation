import copy from "rollup-plugin-copy";
import size from "rollup-plugin-bundle-size";
import multi from "@rollup/plugin-multi-entry";

export default {
  input: ["modules/*.js", "!modules/environment.js"],
  output: { file: "build/oscillation.js", format: "esm" },
  plugins: [
    multi(),
    size(),
    copy({
      targets: [
        { src: ["../../LICENSE", "README.md"], dest: "build" },
        { src: ["package.json"], dest: "build", transform: generatePkg },
      ],
    }),
  ],
};

function generatePkg(contents) {
  let pkg = JSON.parse(contents.toString());
  return JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      license: pkg.license,
      author: pkg.author,
      homepage: pkg.homepage,
      repository: pkg.repository,
      main: pkg.main,
      module: pkg.module,
      exports: pkg.exports,
      type: pkg.type,
      types: pkg.types,
      sideEffects: pkg.sideEffects,
      files: pkg.files,
      keywords: pkg.keywords,
      dependencies: pkg.dependencies,
      peerDependencies: pkg.peerDependencies,
    },
    null,
    2,
  );
}
