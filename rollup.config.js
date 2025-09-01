import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

const input = "src/index.ts";
export default [
    {
        input,
        output: [
            {
                file: "dist/html-dragsort.umd.js",
                format: "umd",
                name: "HTMLDragSort",
            },
            {
                file: "dist/html-dragsort.iife.js",
                format: "iife",
                name: "HTMLDragSort",
            },
            {
                file: "dist/html-dragsort.esm.js",
                format: "es",
            },
        ],
        plugins: [del({ targets: "dist/*" }), typescript()],
    },
    {
        input,
        output: [
            {
                file: "dist/html-dragsort.iife.min.js",
                format: "iife",
                name: "HTMLDragSort",
                sourcemap: true,
            },
            {
                file: "dist/html-dragsort.esm.min.js",
                format: "es",
                sourcemap: true,
            },
            {
                file: "dist/html-dragsort.umd.min.js",
                format: "umd",
                name: "HTMLDragSort",
                sourcemap: true,
            },
        ],
        plugins: [del({ targets: "dist/*" }), typescript(), terser()],
    },
];
