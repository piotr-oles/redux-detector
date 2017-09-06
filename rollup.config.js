const typescript = require("rollup-plugin-typescript2");
const sourcemap = require("rollup-plugin-sourcemaps");
const path = require("path");
const process = require("process");

const pkg = {
  path: process.cwd(),
  meta: require(path.join(process.cwd(), "package.json"))
};

if (!pkg.meta.main) {
  throw new Error(
    'Missing "main" key in package.json - cannot compile CommonJS module.'
  );
}

if (!pkg.meta.module) {
  throw new Error(
    'Missing "module" key in package.json - cannot compile ES6 module.'
  );
}

export default {
  input: pkg.path + "/src/index.ts",
  output: [
    {
      file: pkg.path + "/" + pkg.meta.main,
      format: "cjs"
    },
    {
      file: pkg.path + "/" + pkg.meta.module,
      format: "esm"
    }
  ],
  external: Object.keys(
    Object.assign(pkg.meta.peerDependencies || {}, pkg.meta.dependencies || {})
  ),
  plugins: [
    typescript({
      clean: true
    }),
    sourcemap()
  ]
};
