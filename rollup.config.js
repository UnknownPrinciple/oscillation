import { defineConfig } from "rollup";
import copy from "rollup-plugin-copy";

export default defineConfig({
  input: "./oscillation.js",
  output: { dir: "build" },
  plugins: [
    copy({
      targets: [
        { src: ["LICENSE", "oscillation.d.ts"], dest: "build" },
        { src: "package.json", dest: "build", transform: generatePackageJson },
      ],
    }),
  ],
});

function generatePackageJson(contents) {
  let pkg = JSON.parse(contents.toString());
  let newPkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    license: pkg.license,
    author: pkg.author,
    homepage: pkg.homepage,
    repository: pkg.repository,
    type: "module",
    main: "./oscillation.js",
    module: "./oscillation.js",
    exports: {
      ".": "./oscillation.js",
    },
    files: ["*.js", "*.d.ts"],
    sideEffects: false,
    keywords: pkg.keywords,
    dependencies: pkg.dependencies,
    peerDependencies: pkg.peerDependencies,
  };
  return JSON.stringify(newPkg, null, 2);
}
