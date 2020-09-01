import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodeExternals from "rollup-plugin-node-externals";
import progress from "rollup-plugin-progress";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    typescript(),
    nodeExternals(),
    ...(process.env.NODE_ENV === "production" ? [nodeResolve()] : []),

    commonjs(),
    progress(),
  ],
};
