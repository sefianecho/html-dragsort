import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: {
        file: "dev/inc/dragsort.js",
        format: "iife",
        name: "DragSort",
        sourcemap: true,
    },
    plugins: [
        typescript({
            tsconfig: "./tsconfig.json",
            outDir: "dev/inc",
            declaration: false,
            declarationDir: null,
        }),
        serve({
            port: 3000,
            contentBase: ["dev"],
        }),
        livereload({ watch: ["dev"] }),
    ],
};
