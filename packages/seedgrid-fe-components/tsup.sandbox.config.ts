import { defineConfig } from "tsup";

/**
 * Sandbox bundle — single pre-compiled CJS file for use inside Sandpack playgrounds.
 *
 * Why: @seedgrid/fe-components is compiled with plain tsc (no bundler), so its
 * dist/ has 200+ individual JS files. When Sandpack loads the package it must
 * fetch and transform every file, including heavy peer deps like lucide-react.
 * This build collapses everything into one dist/sandbox.cjs so Sandpack only
 * processes a single file.
 *
 * React / ReactDOM are kept external — Sandpack provides them via its own dep graph.
 * lucide-react, tiptap and @codesandbox/sandpack-react are kept external because
 * SgPlayground already provides virtual shims for them.
 * react-hook-form, qrcode.react and @pqina/flip are bundled in (small packages
 * that would otherwise require extra npm fetches inside the sandbox).
 */
export default defineConfig({
  entry: { sandbox: "src/index.ts" },
  format: ["cjs"],
  outDir: "dist",
  outExtension: () => ({ js: ".cjs" }),
  external: [
    // Provided by Sandpack
    "react",
    "react-dom",
    // Already shimmed by SgPlayground virtual filesystem
    "lucide-react",
    "qrcode",
    "@tiptap/core",
    "@tiptap/react",
    "@tiptap/pm",
    "@tiptap/starter-kit",
    "@tiptap/extension-underline",
    "@tiptap/extension-link",
    "@tiptap/extension-image",
    "@tiptap/extension-text-align",
    "@tiptap/extension-text-style",
    "@tiptap/extension-color",
    "@tiptap/extension-highlight",
    "@tiptap/extension-subscript",
    "@tiptap/extension-superscript",
    "@tiptap/extension-font-family",
    "@codesandbox/sandpack-react",
  ],
  noExternal: [
    // Bundle these in so Sandpack doesn't need to fetch them from npm
    "react-hook-form",
    "qrcode.react",
    "@pqina/flip",
  ],
  dts: false,
  minify: true,
  sourcemap: false,
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.define = { "process.env.NODE_ENV": '"production"' };
  },
});
