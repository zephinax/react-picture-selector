import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import analyze from "rollup-plugin-analyzer";
import replace from "@rollup/plugin-replace";
import { readFileSync } from "fs";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8")
);

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: false,
      },
    ],
    external: ["react", "react-dom", "axios", "react/jsx-runtime"],
    plugins: [
      replace({
        preventAssignment: true,
        __APP_VERSION__: JSON.stringify(packageJson.version),
      }),
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      analyze({ summaryOnly: true }),
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [(dts.default || dts)()],
    external: [/\.css$/],
  },
];
