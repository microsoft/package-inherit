import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodeExternals from "rollup-plugin-node-externals";
import progress from "rollup-plugin-progress";

export default [{
  input: "src/index.ts",
  output: {
    format: "cjs",
    file: "dist/package-inherit.js",
    banner: "// This is generated and hosted here: https://github.com/microsoft/package-inherit/blob/main/dist/package-inherit.js"
  },
  plugins: [
    typescript({ isolatedModules: true }),
    nodeExternals(),
    nodeResolve(),
    commonjs(),
    progress(),
  ]
}, {
  input: "src/cli.ts",
  output: {
    format: "cjs",
    file: "dist/package-inherit-cli.js",
    banner: "// This is generated and hosted here: https://github.com/microsoft/package-inherit/blob/main/dist/package-inherit-cli.js"
  },
  plugins: [
    typescript({ isolatedModules: true }),
    nodeExternals(),
    nodeResolve(),
    commonjs(),
    progress(),
  ]
}];
