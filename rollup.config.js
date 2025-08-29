import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const input = "src/index.ts";
export default [
    {
        input,
        output: [
            {
                file: "dist/iife/html-dragsort.js",
                format: "iife",
                name: "HtmlDragsort",
                sourcemap: true,
            },
            {
                file: "dist/es/html-dragsort.js",
                format: "es",
                sourcemap: true,
            },
            {
                file: "dist/umd/html-dragsort.js",
                format: "umd",
                name: "HtmlDragsort",
                sourcemap: true,
            },
        ],
        plugins: [typescript()],
    },
    {
        input,
        output: [
            {
                file: "dist/iife/html-dragsort.min.js",
                format: "iife",
                name: "HtmlDragsort",
                sourcemap: true,
            },
            {
                file: "dist/es/html-dragsort.min.js",
                format: "es",
                sourcemap: true,
            },
            {
                format: "umd",
                file: "dist/umd/html-dragsort.min.js",
                name: "HtmlDragsort",
                sourcemap: true,
            },
        ],
        plugins: [typescript(), terser()],
    },
];
