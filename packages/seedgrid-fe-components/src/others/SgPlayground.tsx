"use client";

import * as React from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  type SandpackFiles,
  useSandpack
} from "@codesandbox/sandpack-react";
import { SgButton } from "../buttons/SgButton";
import { SgCard } from "../layout/SgCard";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgPlaygroundProps = {
  code: string;
  interactive?: boolean;
  codeContract?: "renderBody" | "appFile";
  preset?: SgPlaygroundPreset;
  title?: string;
  description?: string;
  height?: number | string;
  expandedHeight?: number | string;
  expandable?: boolean;
  resizable?: boolean;
  resizeAxis?: "vertical" | "horizontal" | "both";
  previewPadding?: number | string;
  className?: string;
  dependencies?: Record<string, string>;
  defaultImports?: string;
  previewWrapperClassName?: string;
  seedgridDependency?: string;
  bundlerURL?: string;
  bundlerTimeoutMs?: number;
  npmRegistries?: SgPlaygroundNpmRegistry[];
  withCard?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  cardId?: string;
};

export type SgPlaygroundPreset = "auto" | "basic" | "seedgrid" | "editor" | "full";
export type SgPlaygroundNpmRegistry = {
  enabledScopes: string[];
  limitToScopes: boolean;
  registryUrl: string;
  proxyEnabled: boolean;
  registryAuthToken?: string;
};

const DEFAULT_SEEDGRID_DEPENDENCY = "latest";
const DEFAULT_SANDPACK_BUNDLER_URL = "https://sandpack.seedgrid.com.br";
const DEFAULT_SANDPACK_BUNDLER_TIMEOUT_MS = 60000;
const DEFAULT_SANDBOX_BASE_DEPENDENCIES: Record<string, string> = {
  react: "18.2.0",
  "react-dom": "18.2.0"
};

const DEFAULT_SEEDGRID_RUNTIME_DEPENDENCIES: Record<string, string> = {
  "react-hook-form": "^7.0.0"
};

// lucide-react is a heavy peer dep (~1400 icons). For non-full presets we shim it with
// a generic SVG placeholder to avoid OOM in the browser bundler.
const SANDPACK_LUCIDE_REACT_SHIM_INDEX_JS = `const React = require("react");
const Icon = function(props) {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: props.size || props.width || 16,
    height: props.size || props.height || 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: props.color || "currentColor",
    strokeWidth: props.strokeWidth || 2,
    className: props.className
  });
};
const proxy = new Proxy({}, {
  get: function(_, key) {
    if (key === "__esModule") return true;
    return Icon;
  }
});
module.exports = proxy;
`;

const DEFAULT_SEEDGRID_EDITOR_DEPENDENCIES: Record<string, string> = {
  "@tiptap/core": "^2.9.1",
  "@tiptap/react": "^2.9.1",
  "@tiptap/pm": "^2.9.1",
  "@tiptap/starter-kit": "^2.9.1",
  "@tiptap/extension-underline": "^2.9.1",
  "@tiptap/extension-link": "^2.9.1",
  "@tiptap/extension-image": "^2.9.1",
  "@tiptap/extension-text-align": "^2.9.1",
  "@tiptap/extension-text-style": "^2.9.1",
  "@tiptap/extension-color": "^2.9.1",
  "@tiptap/extension-highlight": "^2.9.1",
  "@tiptap/extension-subscript": "^2.9.1",
  "@tiptap/extension-superscript": "^2.9.1",
  "@tiptap/extension-font-family": "^2.9.1"
};

const DEFAULT_SANDBOX_HOST_DEPENDENCIES: Record<string, string> = {
  "@codesandbox/sandpack-react": "^2.20.0"
};

const DEFAULT_SANDPACK_POLYFILLS: Record<string, string> = {
  assert: "^2.1.0",
  process: "^0.11.10",
  util: "^0.12.5"
};

const TIPTAP_SHIM_PACKAGES = [
  "@tiptap/core",
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
  "@tiptap/extension-font-family"
] as const;

// Sandpack's CRA runtime does not execute script tags from template HTML reliably.
// Load Tailwind as external resources so it is injected before module evaluation.
const SANDPACK_EXTERNAL_RESOURCES: string[] = [
  "/sandpack-tailwind-config.js",
  "https://cdn.tailwindcss.com"
];

const SANDPACK_QRCODE_SHIM_INDEX_JS = `const makeError = () =>
  new Error(
    "qrcode (node build) is not supported in Sandpack browser runtime. Update @seedgrid/fe-components to a browser-safe QR implementation."
  );

const qrcodeShim = {
  toDataURL() {
    return Promise.reject(makeError());
  }
};

export const toDataURL = (...args) => qrcodeShim.toDataURL(...args);
export default qrcodeShim;
`;

const SANDPACK_MARKDOWN_IT_BIN_SHIM = `import markdownit from "../index.mjs";

// Browser-safe shim: Sandpack must not execute markdown-it CLI entrypoint.
// Re-export parser factory so accidental imports of the bin path remain harmless.
export default markdownit;
export { markdownit };
`;

const SANDPACK_SANDBOX_SANDPACK_REACT_SHIM_INDEX_JS = `export const SandpackProvider = ({ children }) => children ?? null;
export const SandpackCodeEditor = () => null;
export const SandpackPreview = () => null;
export const useSandpack = () => ({
  sandpack: {
    activeFile: "/App.tsx",
    files: { "/App.tsx": { code: "" } },
    runSandpack: async () => {},
    clients: {},
    status: "idle"
  },
  dispatch: () => {},
  listen: () => () => {}
});
export default {};
`;

const SANDPACK_TIPTAP_REACT_SHIM_INDEX_JS = `export const EditorContent = () => null;
export const BubbleMenu = () => null;
export const FloatingMenu = () => null;
export const useEditor = () => null;
export default {};
`;

const SANDPACK_TIPTAP_EXTENSION_SHIM_INDEX_JS = `const extension = {
  configure() {
    return extension;
  },
  extend() {
    return extension;
  }
};
export default extension;
`;

const SANDPACK_SEEDGRID_TEXT_EDITOR_SHIM_INDEX_JS = `import * as React from "react";

export function SgTextEditor() {
  return React.createElement(
    "div",
    {
      style: {
        padding: "0.75rem",
        border: "1px solid #e4e4e7",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        color: "#6b7280",
        background: "#f9fafb"
      }
    },
    "SgTextEditor is disabled in this sandbox preset."
  );
}

export default SgTextEditor;
`;

const SANDPACK_ASSERT_SHIM_INDEX_JS = `function fail(message) {
  throw new Error(message || "Assertion failed");
}

function assert(value, message) {
  if (!value) fail(message);
}

assert.ok = assert;
assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(message || "Expected values to be loosely equal");
};
assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) fail(message || "Expected values to be strictly equal");
};
assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) fail(message || "Expected values to be different");
};
assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) fail(message || "Expected values to be different");
};
assert.deepEqual = function deepEqual(actual, expected, message) {
  try {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(message || "Expected values to be deeply equal");
    }
  } catch (_) {
    if (actual !== expected) fail(message || "Expected values to be deeply equal");
  }
};
assert.throws = function throwsAssertion(fn, message) {
  var didThrow = false;
  try { fn(); } catch (_) { didThrow = true; }
  if (!didThrow) fail(message || "Expected function to throw");
};
assert.fail = fail;

module.exports = assert;
module.exports.default = assert;
`;

const SANDPACK_UTIL_SHIM_INDEX_JS = `const inspect = function inspect(value) {
  try {
    return JSON.stringify(value);
  } catch (_) {
    return String(value);
  }
};

inspect.custom = typeof Symbol !== "undefined" && Symbol.for
  ? Symbol.for("nodejs.util.inspect.custom")
  : "@@nodejs.util.inspect.custom";

function deprecate(fn, message) {
  var warned = false;
  return function deprecatedWrapper() {
    if (!warned && typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn(message);
      warned = true;
    }
    return fn.apply(this, arguments);
  };
}

function format() {
  return Array.prototype.map.call(arguments, function (item) {
    return String(item);
  }).join(" ");
}

const utilShim = { inspect, deprecate, format };
module.exports = utilShim;
module.exports.default = utilShim;
`;

const SANDPACK_PATH_SHIM_INDEX_JS = `function normalize(input) {
  return String(input || "").replace(/\\\\/g, "/");
}

function basename(input) {
  var text = normalize(input);
  var pieces = text.split("/").filter(Boolean);
  return pieces.length ? pieces[pieces.length - 1] : "";
}

function dirname(input) {
  var text = normalize(input);
  var index = text.lastIndexOf("/");
  if (index <= 0) return ".";
  return text.slice(0, index);
}

function join() {
  return Array.prototype
    .map.call(arguments, normalize)
    .filter(Boolean)
    .join("/")
    .replace(/\\/{2,}/g, "/");
}

function resolve() {
  return join.apply(null, arguments);
}

const pathShim = {
  sep: "/",
  delimiter: ":",
  basename,
  dirname,
  join,
  resolve,
  normalize
};

module.exports = pathShim;
module.exports.default = pathShim;
`;

const SANDPACK_FS_SHIM_INDEX_JS = `function notSupported(name) {
  throw new Error("fs." + name + " is not supported in Sandpack browser runtime.");
}

const fsShim = {
  openSync: function openSync() { return notSupported("openSync"); },
  createReadStream: function createReadStream() { return notSupported("createReadStream"); },
  createWriteStream: function createWriteStream() { return notSupported("createWriteStream"); },
  readFileSync: function readFileSync() { return notSupported("readFileSync"); }
};

module.exports = fsShim;
module.exports.default = fsShim;
`;

const SANDPACK_PROCESS_SHIM_INDEX_JS = `const processShim = {
  env: {},
  argv: ["browser"],
  stdout: { columns: 80 },
  stderr: { columns: 80 },
  cwd: function cwd() { return "/"; },
  nextTick: function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return Promise.resolve().then(function () { return fn.apply(null, args); });
  }
};

if (typeof globalThis !== "undefined" && !globalThis.process) {
  globalThis.process = processShim;
}

module.exports = processShim;
module.exports.default = processShim;
`;

const SANDPACK_FALLBACK_THEME_VARS: Readonly<Record<string, string>> = {
  // shadcn/ui design tokens (HSL)
  "--background": "0 0% 100%",
  "--foreground": "222.2 84% 4.9%",
  "--primary": "142 76% 36%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "210 40% 96.1%",
  "--secondary-foreground": "222.2 47.4% 11.2%",
  "--accent": "152 57% 40%",
  "--accent-foreground": "0 0% 100%",
  "--destructive": "0 84.2% 60.2%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "214.3 31.8% 91.4%",
  "--input": "214.3 31.8% 91.4%",
  "--ring": "142 76% 36%",
  "--muted": "210 40% 96.1%",
  "--muted-foreground": "215.4 16.3% 46.9%",
  "--card": "0 0% 100%",
  "--card-foreground": "222.2 84% 4.9%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "222.2 84% 4.9%",
  "--radius": "0.5rem",
  // SeedGrid neutrals (RGB space-separated)
  "--sg-bg": "255 255 255",
  "--sg-surface": "248 250 252",
  "--sg-muted-surface": "241 245 249",
  "--sg-text": "15 23 42",
  "--sg-muted": "100 116 139",
  "--sg-border": "226 232 240",
  "--sg-ring": "74 222 128",
  "--sg-disabled": "203 213 225",
  "--sg-on-disabled": "148 163 184",
  "--sg-link": "22 163 74",
  "--sg-link-hover": "21 128 61",
  "--sg-radius": "0.5rem",
  // On-color tokens
  "--sg-on-primary": "255 255 255",
  "--sg-on-secondary": "255 255 255",
  "--sg-on-tertiary": "255 255 255",
  "--sg-on-warning": "255 255 255",
  "--sg-on-error": "255 255 255",
  "--sg-on-info": "255 255 255",
  "--sg-on-success": "255 255 255",
  // Primary palette (green)
  "--sg-primary-50": "240 253 244",
  "--sg-primary-100": "220 252 231",
  "--sg-primary-200": "187 247 208",
  "--sg-primary-300": "134 239 172",
  "--sg-primary-400": "74 222 128",
  "--sg-primary-500": "34 197 94",
  "--sg-primary-600": "22 163 74",
  "--sg-primary-700": "21 128 61",
  "--sg-primary-800": "22 101 52",
  "--sg-primary-900": "20 83 45",
  "--sg-primary-hover": "21 128 61",
  "--sg-primary-active": "22 101 52",
  // Secondary palette (zinc)
  "--sg-secondary-50": "250 250 250",
  "--sg-secondary-100": "244 244 245",
  "--sg-secondary-200": "228 228 231",
  "--sg-secondary-300": "212 212 216",
  "--sg-secondary-400": "161 161 170",
  "--sg-secondary-500": "113 113 122",
  "--sg-secondary-600": "82 82 91",
  "--sg-secondary-700": "63 63 70",
  "--sg-secondary-800": "39 39 42",
  "--sg-secondary-900": "24 24 27",
  "--sg-secondary-hover": "63 63 70",
  "--sg-secondary-active": "39 39 42",
  // Tertiary palette (teal)
  "--sg-tertiary-50": "240 253 250",
  "--sg-tertiary-100": "204 251 241",
  "--sg-tertiary-200": "153 246 228",
  "--sg-tertiary-300": "94 234 212",
  "--sg-tertiary-400": "45 212 191",
  "--sg-tertiary-500": "20 184 166",
  "--sg-tertiary-600": "13 148 136",
  "--sg-tertiary-700": "15 118 110",
  "--sg-tertiary-800": "17 94 89",
  "--sg-tertiary-900": "19 78 74",
  "--sg-tertiary-hover": "15 118 110",
  "--sg-tertiary-active": "17 94 89",
  // Warning palette (amber)
  "--sg-warning-50": "255 251 235",
  "--sg-warning-100": "254 243 199",
  "--sg-warning-200": "253 230 138",
  "--sg-warning-300": "252 211 77",
  "--sg-warning-400": "251 191 36",
  "--sg-warning-500": "245 158 11",
  "--sg-warning-600": "217 119 6",
  "--sg-warning-700": "180 83 9",
  "--sg-warning-800": "146 64 14",
  "--sg-warning-900": "120 53 15",
  "--sg-warning-hover": "180 83 9",
  "--sg-warning-active": "146 64 14",
  // Error palette (red)
  "--sg-error-50": "254 242 242",
  "--sg-error-100": "254 226 226",
  "--sg-error-200": "254 202 202",
  "--sg-error-300": "252 165 165",
  "--sg-error-400": "248 113 113",
  "--sg-error-500": "239 68 68",
  "--sg-error-600": "220 38 38",
  "--sg-error-700": "185 28 28",
  "--sg-error-800": "153 27 27",
  "--sg-error-900": "127 29 29",
  "--sg-error-hover": "185 28 28",
  "--sg-error-active": "153 27 27",
  // Info palette (sky)
  "--sg-info-50": "240 249 255",
  "--sg-info-100": "224 242 254",
  "--sg-info-200": "186 230 253",
  "--sg-info-300": "125 211 252",
  "--sg-info-400": "56 189 248",
  "--sg-info-500": "14 165 233",
  "--sg-info-600": "2 132 199",
  "--sg-info-700": "3 105 161",
  "--sg-info-800": "7 89 133",
  "--sg-info-900": "12 74 110",
  "--sg-info-hover": "3 105 161",
  "--sg-info-active": "7 89 133",
  // Success palette (green, same as primary)
  "--sg-success-50": "240 253 244",
  "--sg-success-100": "220 252 231",
  "--sg-success-200": "187 247 208",
  "--sg-success-300": "134 239 172",
  "--sg-success-400": "74 222 128",
  "--sg-success-500": "34 197 94",
  "--sg-success-600": "22 163 74",
  "--sg-success-700": "21 128 61",
  "--sg-success-800": "22 101 52",
  "--sg-success-900": "20 83 45",
  "--sg-success-hover": "21 128 61",
  "--sg-success-active": "22 101 52",
  // Button component vars (green primary default)
  "--sg-btn-bg": "rgb(22 163 74)",
  "--sg-btn-fg": "rgb(255 255 255)",
  "--sg-btn-border": "rgb(22 163 74)",
  "--sg-btn-hover-bg": "rgb(21 128 61)",
  "--sg-btn-hover-fg": "rgb(255 255 255)",
  "--sg-btn-hover-border": "rgb(21 128 61)",
  "--sg-btn-active-bg": "rgb(22 101 52)",
  "--sg-btn-ring": "rgb(74 222 128 / 0.4)",
  "--sg-btn-tint": "22 163 74",
  // Avatar component vars
  "--sg-avatar-bg": "rgb(22 163 74)",
  "--sg-avatar-fg": "rgb(255 255 255)",
  "--sg-avatar-border": "transparent",
  "--sg-avatar-ring": "rgb(74 222 128)",
  // Badge component vars
  "--sg-badge-bg": "rgb(240 253 244)",
  "--sg-badge-fg": "rgb(22 163 74)",
  "--sg-badge-border": "rgb(187 247 208)",
  "--sg-badge-hover-bg": "rgb(220 252 231)",
  "--sg-badge-hover-fg": "rgb(21 128 61)",
  "--sg-badge-hover-border": "rgb(134 239 172)",
  "--sg-badge-ring": "rgb(74 222 128)",
  "--sg-badge-soft-bg": "rgb(240 253 244)",
  "--sg-badge-soft-fg": "rgb(22 163 74)",
};

const SANDPACK_CORE_THEME_VARS = [
  "--background",
  "--foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--muted",
  "--muted-foreground",
  "--radius"
] as const;

// Explicit list of --sg-* vars to read from host via getPropertyValue().
// CSSStyleDeclaration.length/.item() does NOT enumerate CSS custom properties,
// so we must call getPropertyValue() for each var by name.
const SANDPACK_SG_VARS = [
  // Neutrals
  "--sg-bg", "--sg-surface", "--sg-muted-surface",
  "--sg-text", "--sg-muted", "--sg-border", "--sg-ring",
  "--sg-disabled", "--sg-on-disabled",
  "--sg-link", "--sg-link-hover",
  "--sg-radius",
  // On-color tokens
  "--sg-on-primary", "--sg-on-secondary", "--sg-on-tertiary",
  "--sg-on-warning", "--sg-on-error", "--sg-on-info", "--sg-on-success",
  // Primary palette
  "--sg-primary-50", "--sg-primary-100", "--sg-primary-200", "--sg-primary-300",
  "--sg-primary-400", "--sg-primary-500", "--sg-primary-600", "--sg-primary-700",
  "--sg-primary-800", "--sg-primary-900", "--sg-primary-hover", "--sg-primary-active",
  // Secondary palette
  "--sg-secondary-50", "--sg-secondary-100", "--sg-secondary-200", "--sg-secondary-300",
  "--sg-secondary-400", "--sg-secondary-500", "--sg-secondary-600", "--sg-secondary-700",
  "--sg-secondary-800", "--sg-secondary-900", "--sg-secondary-hover", "--sg-secondary-active",
  // Tertiary palette
  "--sg-tertiary-50", "--sg-tertiary-100", "--sg-tertiary-200", "--sg-tertiary-300",
  "--sg-tertiary-400", "--sg-tertiary-500", "--sg-tertiary-600", "--sg-tertiary-700",
  "--sg-tertiary-800", "--sg-tertiary-900", "--sg-tertiary-hover", "--sg-tertiary-active",
  // Warning palette
  "--sg-warning-50", "--sg-warning-100", "--sg-warning-200", "--sg-warning-300",
  "--sg-warning-400", "--sg-warning-500", "--sg-warning-600", "--sg-warning-700",
  "--sg-warning-800", "--sg-warning-900", "--sg-warning-hover", "--sg-warning-active",
  // Error palette
  "--sg-error-50", "--sg-error-100", "--sg-error-200", "--sg-error-300",
  "--sg-error-400", "--sg-error-500", "--sg-error-600", "--sg-error-700",
  "--sg-error-800", "--sg-error-900", "--sg-error-hover", "--sg-error-active",
  // Info palette
  "--sg-info-50", "--sg-info-100", "--sg-info-200", "--sg-info-300",
  "--sg-info-400", "--sg-info-500", "--sg-info-600", "--sg-info-700",
  "--sg-info-800", "--sg-info-900", "--sg-info-hover", "--sg-info-active",
  // Success palette
  "--sg-success-50", "--sg-success-100", "--sg-success-200", "--sg-success-300",
  "--sg-success-400", "--sg-success-500", "--sg-success-600", "--sg-success-700",
  "--sg-success-800", "--sg-success-900", "--sg-success-hover", "--sg-success-active",
  // Button component vars
  "--sg-btn-bg", "--sg-btn-fg", "--sg-btn-border",
  "--sg-btn-hover-bg", "--sg-btn-hover-fg", "--sg-btn-hover-border",
  "--sg-btn-active-bg", "--sg-btn-ring", "--sg-btn-tint",
  // Avatar component vars
  "--sg-avatar-bg", "--sg-avatar-fg", "--sg-avatar-border", "--sg-avatar-ring",
  // Badge component vars
  "--sg-badge-bg", "--sg-badge-fg", "--sg-badge-border",
  "--sg-badge-hover-bg", "--sg-badge-hover-fg", "--sg-badge-hover-border",
  "--sg-badge-ring", "--sg-badge-soft-bg", "--sg-badge-soft-fg",
] as const;

const SANDPACK_BASE_STYLES_CSS = `* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
}

#root {
  padding: var(--sg-preview-padding, 0px);
}

body {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background: rgb(var(--sg-bg, 255 255 255));
  color: rgb(var(--sg-text, 11 11 12));
}

/* Classes with arbitrary values used by SeedGrid components */
.bg-\\[var\\(--sg-btn-bg\\)\\] { background-color: var(--sg-btn-bg); }
.text-\\[var\\(--sg-btn-fg\\)\\] { color: var(--sg-btn-fg); }
.border-\\[var\\(--sg-btn-border\\)\\] { border-color: var(--sg-btn-border); }
.hover\\:bg-\\[var\\(--sg-btn-hover-bg\\)\\]:hover { background-color: var(--sg-btn-hover-bg); }
.hover\\:text-\\[var\\(--sg-btn-hover-fg\\)\\]:hover { color: var(--sg-btn-hover-fg); }
.hover\\:border-\\[var\\(--sg-btn-hover-border\\)\\]:hover { border-color: var(--sg-btn-hover-border); }
.active\\:bg-\\[var\\(--sg-btn-active-bg\\)\\]:active { background-color: var(--sg-btn-active-bg); }
.focus-visible\\:ring-\\[var\\(--sg-btn-ring\\)\\]:focus-visible { box-shadow: 0 0 0 4px var(--sg-btn-ring); }
.hover\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.12\\)\\]:hover { background-color: rgb(var(--sg-btn-tint) / 0.12); }
.active\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.18\\)\\]:active { background-color: rgb(var(--sg-btn-tint) / 0.18); }
.hover\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.10\\)\\]:hover { background-color: rgb(var(--sg-btn-tint) / 0.10); }
.active\\:bg-\\[rgb\\(var\\(--sg-btn-tint\\)\\/0\\.16\\)\\]:active { background-color: rgb(var(--sg-btn-tint) / 0.16); }
.transition-\\[background-color\\,color\\,border-color\\,box-shadow\\,transform\\] {
  transition-property: background-color, color, border-color, box-shadow, transform;
}
.active\\:translate-y-\\[0\\.5px\\]:active { transform: translateY(0.5px); }
.size-4 { width: 1rem; height: 1rem; }
.size-5 { width: 1.25rem; height: 1.25rem; }
`;

const SANDPACK_HOST_STYLES_CSS = `
.sg-playground-preview .sp-cube-wrapper {
  top: 8px !important;
  right: 8px !important;
  bottom: auto !important;
  left: auto !important;
}
`;

const SANDPACK_TAILWIND_CONFIG_JS = `function sgPalette(name) {
  return {
    50: "rgb(var(--sg-" + name + "-50) / <alpha-value>)",
    100: "rgb(var(--sg-" + name + "-100) / <alpha-value>)",
    200: "rgb(var(--sg-" + name + "-200) / <alpha-value>)",
    300: "rgb(var(--sg-" + name + "-300) / <alpha-value>)",
    400: "rgb(var(--sg-" + name + "-400) / <alpha-value>)",
    500: "rgb(var(--sg-" + name + "-500) / <alpha-value>)",
    600: "rgb(var(--sg-" + name + "-600) / <alpha-value>)",
    700: "rgb(var(--sg-" + name + "-700) / <alpha-value>)",
    800: "rgb(var(--sg-" + name + "-800) / <alpha-value>)",
    900: "rgb(var(--sg-" + name + "-900) / <alpha-value>)",
    DEFAULT: "rgb(var(--sg-" + name + "-500) / <alpha-value>)",
    hover: "rgb(var(--sg-" + name + "-hover) / <alpha-value>)",
    active: "rgb(var(--sg-" + name + "-active) / <alpha-value>)"
  };
}

window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        sg: {
          bg: "rgb(var(--sg-bg) / <alpha-value>)",
          surface: "rgb(var(--sg-surface) / <alpha-value>)",
          "muted-surface": "rgb(var(--sg-muted-surface) / <alpha-value>)",
          border: "rgb(var(--sg-border) / <alpha-value>)",
          ring: "rgb(var(--sg-ring) / <alpha-value>)",
          focus: "rgb(var(--sg-ring) / <alpha-value>)",
          text: "rgb(var(--sg-text) / <alpha-value>)",
          muted: "rgb(var(--sg-muted) / <alpha-value>)",
          disabled: "rgb(var(--sg-disabled) / <alpha-value>)",
          "on-disabled": "rgb(var(--sg-on-disabled) / <alpha-value>)",
          hover: "rgb(var(--sg-primary-50) / <alpha-value>)",
          hover2: "rgb(var(--sg-primary-100) / <alpha-value>)",
          surface2: "rgb(var(--sg-muted-surface) / <alpha-value>)",
          link: "rgb(var(--sg-link) / <alpha-value>)",
          "link-hover": "rgb(var(--sg-link-hover) / <alpha-value>)",
          "on-primary": "rgb(var(--sg-on-primary) / <alpha-value>)",
          "on-secondary": "rgb(var(--sg-on-secondary) / <alpha-value>)",
          "on-tertiary": "rgb(var(--sg-on-tertiary) / <alpha-value>)",
          "on-warning": "rgb(var(--sg-on-warning) / <alpha-value>)",
          "on-error": "rgb(var(--sg-on-error) / <alpha-value>)",
          "on-info": "rgb(var(--sg-on-info) / <alpha-value>)",
          "on-success": "rgb(var(--sg-on-success) / <alpha-value>)",
          primary: sgPalette("primary"),
          secondary: sgPalette("secondary"),
          tertiary: sgPalette("tertiary"),
          warning: sgPalette("warning"),
          error: sgPalette("error"),
          info: sgPalette("info"),
          success: sgPalette("success")
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        sg: "var(--sg-radius)"
      }
    }
  }
};
`;

// Keep CRA's expected HTML entry file path for react/react-ts templates.
const SANDPACK_TAILWIND_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

function normalizeUrl(raw: string | undefined, fallback: string): string {
  const value = raw?.trim();
  if (!value) return fallback;

  try {
    const parsed = new URL(value);
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

function normalizeTimeoutMs(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}

function parseBooleanFlag(value: string | undefined, fallback: boolean): boolean {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return fallback;
  if (normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on") {
    return true;
  }
  if (normalized === "0" || normalized === "false" || normalized === "no" || normalized === "off") {
    return false;
  }
  return fallback;
}

function resolveDefaultNpmRegistriesFromEnv(): SgPlaygroundNpmRegistry[] | undefined {
  const registryUrlRaw = process.env.NEXT_PUBLIC_SANDPACK_NPM_REGISTRY_URL?.trim();
  if (!registryUrlRaw) return undefined;

  const scopesRaw = process.env.NEXT_PUBLIC_SANDPACK_NPM_REGISTRY_SCOPES;
  const enabledScopes = (scopesRaw ?? "@seedgrid")
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

  const limitToScopes = parseBooleanFlag(
    process.env.NEXT_PUBLIC_SANDPACK_NPM_REGISTRY_LIMIT_TO_SCOPES,
    true
  );
  const proxyEnabled = parseBooleanFlag(
    process.env.NEXT_PUBLIC_SANDPACK_NPM_REGISTRY_PROXY_ENABLED,
    false
  );
  const registryAuthToken = process.env.NEXT_PUBLIC_SANDPACK_NPM_REGISTRY_AUTH_TOKEN?.trim();

  return [
    {
      enabledScopes,
      limitToScopes,
      registryUrl: registryUrlRaw.replace(/\/+$/, ""),
      proxyEnabled,
      ...(registryAuthToken ? { registryAuthToken } : {})
    }
  ];
}

const SANDPACK_MIN_COMPONENT_MESSAGES: Record<string, string> = {
  "components.actions.clear": "Clear",
  "components.actions.cancel": "Cancel",
  "components.actions.confirm": "Confirm",
  "components.inputs.required": "Required field.",
  "components.inputs.maxLength": "Maximum {max} characters.",
  "components.inputs.minLength": "Minimum {min} characters.",
  "components.inputs.minWords": "Minimum {min} words.",
  "components.inputs.email.invalid": "Invalid email.",
  "components.inputs.phone.invalid": "Invalid phone.",
  "components.inputs.date.invalid": "Invalid date.",
  "components.inputs.number.min": "Value must be at least {min}.",
  "components.inputs.number.max": "Value must be at most {max}.",
  "components.password.show": "Show password",
  "components.password.hide": "Hide password",
  "components.autocomplete.empty": "No records found.",
  "components.autocomplete.loading": "Loading...",
  "components.rating.cancel": "Cancel rating",
  "components.radiogroup.cancel": "No option"
};

// These shims use valid JSON so the Sandpack bundler can parse them as JSON modules.
// (The self-hosted bundler evaluates .json files as JS, wrapping them with module.exports = {...}.)
const SANDPACK_SEEDGRID_PT_BR_JSON_SHIM = JSON.stringify(SANDPACK_MIN_COMPONENT_MESSAGES);
const SANDPACK_SEEDGRID_PT_PT_JSON_SHIM = JSON.stringify(SANDPACK_MIN_COMPONENT_MESSAGES);
const SANDPACK_SEEDGRID_EN_US_JSON_SHIM = JSON.stringify(SANDPACK_MIN_COMPONENT_MESSAGES);
const SANDPACK_SEEDGRID_ES_JSON_SHIM = JSON.stringify(SANDPACK_MIN_COMPONENT_MESSAGES);
const SANDPACK_SEEDGRID_BLOCKED_EMAIL_DOMAINS_JSON_SHIM = JSON.stringify({
  blockedEmailDomains: []
});

// CJS shims for .js locale files (new npm versions after the JSON→TypeScript conversion).
const SANDPACK_SEEDGRID_LOCALE_JS_SHIM = `module.exports = ${JSON.stringify(SANDPACK_MIN_COMPONENT_MESSAGES)};`;
const SANDPACK_SEEDGRID_BLOCKED_EMAIL_JS_SHIM = `module.exports = ${JSON.stringify({ blockedEmailDomains: [] })};`;

function parseRgbParts(raw: string): [number, number, number] | null {
  const value = raw.trim();
  if (!value) return null;

  const normalized = value
    .replace(/^rgb\(/i, "")
    .replace(/\)$/g, "")
    .replace(/\//g, " ")
    .replace(/,/g, " ")
    .trim();

  const pieces = normalized
    .split(/\s+/)
    .map((part) => Number(part))
    .filter((num) => Number.isFinite(num));

  if (pieces.length < 3) return null;

  const r = pieces[0] as number;
  const g = pieces[1] as number;
  const b = pieces[2] as number;
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return [clamp(r), clamp(g), clamp(b)];
}

function rgbToHslTriplet(r: number, g: number, b: number): string {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rr:
        h = ((gg - bb) / delta + (gg < bb ? 6 : 0)) / 6;
        break;
      case gg:
        h = ((bb - rr) / delta + 2) / 6;
        break;
      default:
        h = ((rr - gg) / delta + 4) / 6;
        break;
    }
  }

  const hue = Math.round(h * 360);
  const sat = Math.round(s * 100);
  const lig = Math.round(l * 100);
  return `${hue} ${sat}% ${lig}%`;
}

function toHslFromRgbVar(value?: string): string | null {
  if (!value) return null;
  const parts = parseRgbParts(value);
  if (!parts) return null;
  return rgbToHslTriplet(parts[0], parts[1], parts[2]);
}

function mapSgVarsToCoreVars(themeVars: Record<string, string>): Record<string, string> {
  const mapped: Record<string, string> = {};

  const assignFromSg = (coreVar: string, sgVar: string) => {
    const hsl = toHslFromRgbVar(themeVars[sgVar]);
    if (hsl) mapped[coreVar] = hsl;
  };

  assignFromSg("--background", "--sg-bg");
  assignFromSg("--foreground", "--sg-text");
  assignFromSg("--primary", "--sg-primary-600");
  assignFromSg("--primary-foreground", "--sg-on-primary");
  assignFromSg("--secondary", "--sg-secondary-600");
  assignFromSg("--secondary-foreground", "--sg-on-secondary");
  assignFromSg("--accent", "--sg-tertiary-600");
  assignFromSg("--accent-foreground", "--sg-on-tertiary");
  assignFromSg("--destructive", "--sg-error-600");
  assignFromSg("--destructive-foreground", "--sg-on-error");
  assignFromSg("--border", "--sg-border");
  assignFromSg("--ring", "--sg-primary-400");

  return mapped;
}

function readThemeVarsFromHost(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const computed = window.getComputedStyle(document.documentElement);
  const themeVars: Record<string, string> = {};

  for (const varName of SANDPACK_CORE_THEME_VARS) {
    const value = computed.getPropertyValue(varName).trim();
    if (value) themeVars[varName] = value;
  }

  // CSSStyleDeclaration.length/.item() does NOT enumerate CSS custom properties,
  // so we explicitly call getPropertyValue() for each known --sg-* var.
  for (const varName of SANDPACK_SG_VARS) {
    const value = computed.getPropertyValue(varName).trim();
    if (value) themeVars[varName] = value;
  }

  Object.assign(themeVars, mapSgVarsToCoreVars(themeVars));

  return themeVars;
}

function normalizeCssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function buildSandpackStylesCss(themeVars: Record<string, string>, previewPadding: string): string {
  const mergedVars = {
    ...SANDPACK_FALLBACK_THEME_VARS,
    ...themeVars,
    "--sg-preview-padding": previewPadding
  };
  const rootVars = Object.entries(mergedVars)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([varName, value]) => `  ${varName}: ${value};`)
    .join("\n");
  return `:root {
${rootVars}
}

${SANDPACK_BASE_STYLES_CSS}`;
}

function ReadonlyBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function buildAppTsxFromRenderBody(
  renderBody: string,
  defaultImports: string,
  wrapperClassName?: string
) {
  const body = renderBody
    .replace(/\t/g, "  ")
    .split("\n")
    .map((line) => (line ? `        ${line}` : ""))
    .join("\n");

  if (!wrapperClassName) {
    return `import * as React from "react";
${defaultImports}

export default function App() {
  return (
    <>
${body}
    </>
  );
}
`;
  }

  return `import * as React from "react";
${defaultImports}

export default function App() {
  return (
    <div className="${wrapperClassName}">
      <>
${body}
      </>
    </div>
  );
}
`;
}

async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

function CopyButton() {
  const { sandpack } = useSandpack();
  const [copyState, setCopyState] = React.useState<"idle" | "success" | "error">("idle");

  const handleCopy = React.useCallback(async () => {
    try {
      const activeFilePath = sandpack.activeFile;
      const activeCode = sandpack.files[activeFilePath]?.code ?? "";
      const copied = await copyText(activeCode);
      setCopyState(copied ? "success" : "error");
    } catch {
      setCopyState("error");
    }
  }, [sandpack.activeFile, sandpack.files]);

  React.useEffect(() => {
    if (copyState === "idle") return;
    const timerId = window.setTimeout(() => setCopyState("idle"), 1400);
    return () => window.clearTimeout(timerId);
  }, [copyState]);

  return (
    <SgButton appearance="outline" size="sm" onClick={handleCopy}>
      {copyState === "success" ? "Copiado" : copyState === "error" ? "Erro" : "Copiar"}
    </SgButton>
  );
}

function RunButton({ onRun }: { onRun?: () => void }) {
  const { sandpack } = useSandpack();
  const [running, setRunning] = React.useState(false);

  const handleRun = React.useCallback(async () => {
    if (running) return;
    setRunning(true);
    onRun?.();

    try {
      if (typeof window !== "undefined") {
        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
        });
      }

      // On lazy init + hidden preview scenarios, iframe/client registration can lag by a tick.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        await sandpack.runSandpack();

        if (
          sandpack.status === "running" ||
          sandpack.status === "done" ||
          Object.keys(sandpack.clients ?? {}).length > 0
        ) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    } catch (error) {
      console.error("[SgPlayground] Failed to run Sandpack", error);
    } finally {
      if (typeof window !== "undefined") {
        window.setTimeout(() => setRunning(false), 150);
      } else {
        setRunning(false);
      }
    }
  }, [onRun, running, sandpack]);

  return (
    <SgButton
      severity="primary"
      size="sm"
      loading={running}
      onClick={handleRun}
    >
      {running ? "Running" : "Run"}
    </SgButton>
  );
}

export default function SgPlayground(props: Readonly<SgPlaygroundProps>) {
  const {
    code,
    interactive = false,
    codeContract = "renderBody",
    preset = "auto",
    title,
    description,
    height = 360,
    expandedHeight = "70vh",
    expandable = true,
    resizable = true,
    resizeAxis = "vertical",
    previewPadding,
    className,
    dependencies,
    defaultImports,
    previewWrapperClassName = "h-[420px] rounded-xl border border-border bg-muted/30 p-3",
    seedgridDependency,
    bundlerURL,
    bundlerTimeoutMs,
    npmRegistries,
    withCard = true,
    collapsible = true,
    defaultOpen = true,
    cardId
  } = props;
  const effectivePreviewPadding = normalizeCssSize(
    previewPadding ?? (codeContract === "appFile" ? 12 : 0)
  );

  const [sandpackStylesCss, setSandpackStylesCss] = React.useState<string>(() =>
    buildSandpackStylesCss({}, effectivePreviewPadding)
  );
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<"code" | "preview">("code");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const refreshStyles = () => {
      const liveThemeVars = readThemeVarsFromHost();
      setSandpackStylesCss(buildSandpackStylesCss(liveThemeVars, effectivePreviewPadding));
    };

    let frameId: number | null = null;
    const scheduleRefresh = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        refreshStyles();
      });
    };

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"]
    });

    refreshStyles();

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [effectivePreviewPadding]);

  const seedgridDefaultImports = defaultImports ?? `import {
  SgScreen,
  SgMainPanel,
  SgPanel,
  SgGrid,
  SgStack,
  SgButton,
  SgAutocomplete
} from "@seedgrid/fe-components";`;

  const appTsx =
    codeContract === "appFile"
      ? code
      : buildAppTsxFromRenderBody(code, seedgridDefaultImports, previewWrapperClassName);

  const resolvedSeedgridDependency =
    seedgridDependency ??
    process.env.NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY ??
    DEFAULT_SEEDGRID_DEPENDENCY;

  const requestedDeps = dependencies ?? {};
  const requestedDepKeys = Object.keys(requestedDeps);
  const resolvedBundlerURL = normalizeUrl(
    bundlerURL ?? process.env.NEXT_PUBLIC_SANDPACK_BUNDLER_URL,
    DEFAULT_SANDPACK_BUNDLER_URL
  );
  const resolvedBundlerTimeoutMs = normalizeTimeoutMs(
    bundlerTimeoutMs ??
      Number(process.env.NEXT_PUBLIC_SANDPACK_BUNDLER_TIMEOUT_MS ?? Number.NaN),
    DEFAULT_SANDPACK_BUNDLER_TIMEOUT_MS
  );
  const resolvedNpmRegistries = React.useMemo(
    () => npmRegistries ?? resolveDefaultNpmRegistriesFromEnv(),
    [npmRegistries]
  );

  React.useEffect(() => {
    if (!interactive) return;
    if (!parseBooleanFlag(process.env.NEXT_PUBLIC_SANDPACK_DEBUG, false)) return;

    console.info("[SgPlayground] Sandpack runtime config", {
      bundlerURL: resolvedBundlerURL,
      bundlerTimeoutMs: resolvedBundlerTimeoutMs,
      npmRegistries: (resolvedNpmRegistries ?? []).map((registry) => ({
        enabledScopes: registry.enabledScopes,
        limitToScopes: registry.limitToScopes,
        registryUrl: registry.registryUrl,
        proxyEnabled: registry.proxyEnabled
      }))
    });
  }, [interactive, resolvedBundlerTimeoutMs, resolvedBundlerURL, resolvedNpmRegistries]);

  const codeUsesSeedgrid = /from\s+["']@seedgrid\/fe-components["']/.test(appTsx);
  const codeUsesTextEditor = /\bSgTextEditor\b/.test(appTsx);
  const codeUsesPlaygroundComponent = /\bSgPlayground\b/.test(appTsx);

  const resolvedPreset: Exclude<SgPlaygroundPreset, "auto"> =
    preset === "auto"
      ? codeUsesTextEditor
        ? "editor"
        : codeUsesSeedgrid
          ? "seedgrid"
          : "basic"
      : preset;

  const includeSeedgridDependency =
    resolvedPreset === "seedgrid" ||
    resolvedPreset === "editor" ||
    resolvedPreset === "full" ||
    requestedDepKeys.includes("@seedgrid/fe-components");

  const includeEditorDependencies =
    resolvedPreset === "editor" ||
    resolvedPreset === "full" ||
    codeUsesTextEditor ||
    requestedDepKeys.some((dep) => dep.startsWith("@tiptap/"));

  const includeSandpackReactDependency =
    resolvedPreset === "full" ||
    codeUsesPlaygroundComponent ||
    requestedDepKeys.includes("@codesandbox/sandpack-react");

  const shouldShimSandpackReact = includeSeedgridDependency && !includeSandpackReactDependency;
  const shouldShimTiptap = includeSeedgridDependency && !includeEditorDependencies;
  const shouldIncludeNodePolyfills = includeEditorDependencies;
  // Shim lucide-react for all non-full presets to avoid OOM from bundling ~1400 icon components.
  // Full preset gets the real package so icons render correctly.
  const shouldShimLucide = includeSeedgridDependency && resolvedPreset !== "full" && !requestedDepKeys.includes("lucide-react");

  const files: SandpackFiles = {
    "/App.tsx": { code: appTsx, active: true },
    "/styles.css": { code: sandpackStylesCss || buildSandpackStylesCss({}, effectivePreviewPadding) }
  };

  if (includeSeedgridDependency) {
    // Intercept the package entry point and redirect to the pre-compiled sandbox bundle
    // (dist/sandbox.cjs) instead of the tsc barrel file (dist/index.js).
    // This makes the Sandpack bundler fetch and process ONE file instead of 200+ individual files.
    // The real package.json from npm is left intact so version resolution works normally.
    // Requires @seedgrid/fe-components to be built with: pnpm run build:sandbox
    files["/node_modules/@seedgrid/fe-components/dist/index.js"] = {
      code: `module.exports = require("./sandbox.cjs");`,
      hidden: true
    };

    // Compatibility shim for legacy @seedgrid/fe-components builds that still import "qrcode" (node-only path).
    files["/node_modules/qrcode/index.js"] = { code: SANDPACK_QRCODE_SHIM_INDEX_JS, hidden: true };

    // Virtual index.html: loads Tailwind v3 play CDN with SeedGrid design-token config.
    // This keeps CRA's public/index.html entry path expected by the react/react-ts templates.
    files["/public/index.html"] = { code: SANDPACK_TAILWIND_INDEX_HTML, hidden: true };
    // Tailwind config is loaded via externalResources because Sandpack runtime
    // does not execute scripts from template HTML head/body consistently.
    files["/sandpack-tailwind-config.js"] = { code: SANDPACK_TAILWIND_CONFIG_JS, hidden: true };

    // Sandpack runtime can evaluate JSON files as plain JS modules.
    // Provide CJS-compatible shims to keep @seedgrid/fe-components i18n/validators working.
    // .json shims cover current npm versions; .js shims cover new versions after JSON→TypeScript conversion.
    files["/node_modules/@seedgrid/fe-components/dist/i18n/pt-BR.json"] = {
      code: SANDPACK_SEEDGRID_PT_BR_JSON_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/pt-PT.json"] = {
      code: SANDPACK_SEEDGRID_PT_PT_JSON_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/en-US.json"] = {
      code: SANDPACK_SEEDGRID_EN_US_JSON_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/es.json"] = {
      code: SANDPACK_SEEDGRID_ES_JSON_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/blocked-email-domains.json"] = {
      code: SANDPACK_SEEDGRID_BLOCKED_EMAIL_DOMAINS_JSON_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/pt-BR.js"] = {
      code: SANDPACK_SEEDGRID_LOCALE_JS_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/pt-PT.js"] = {
      code: SANDPACK_SEEDGRID_LOCALE_JS_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/en-US.js"] = {
      code: SANDPACK_SEEDGRID_LOCALE_JS_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/i18n/es.js"] = {
      code: SANDPACK_SEEDGRID_LOCALE_JS_SHIM,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/blocked-email-domains.js"] = {
      code: SANDPACK_SEEDGRID_BLOCKED_EMAIL_JS_SHIM,
      hidden: true
    };
  }

  if (shouldIncludeNodePolyfills) {
    // markdown-it CLI entry uses node:fs and breaks in browser runtime.
    files["/node_modules/markdown-it/bin/markdown-it.mjs"] = {
      code: SANDPACK_MARKDOWN_IT_BIN_SHIM,
      hidden: true
    };
    // Node builtin compatibility shims used by transitive dependencies (e.g. argparse from markdown-it/tiptap).
    files["/node_modules/assert/index.js"] = { code: SANDPACK_ASSERT_SHIM_INDEX_JS, hidden: true };
    files["/node_modules/util/index.js"] = { code: SANDPACK_UTIL_SHIM_INDEX_JS, hidden: true };
    files["/node_modules/path/index.js"] = { code: SANDPACK_PATH_SHIM_INDEX_JS, hidden: true };
    files["/node_modules/fs/index.js"] = { code: SANDPACK_FS_SHIM_INDEX_JS, hidden: true };
    files["/node_modules/process/index.js"] = { code: SANDPACK_PROCESS_SHIM_INDEX_JS, hidden: true };
  }

  if (shouldShimSandpackReact) {
    files["/node_modules/@codesandbox/sandpack-react/index.js"] = {
      code: SANDPACK_SANDBOX_SANDPACK_REACT_SHIM_INDEX_JS,
      hidden: true
    };
  }

  if (shouldShimTiptap) {
    files["/node_modules/@seedgrid/fe-components/dist/inputs/SgTextEditor.js"] = {
      code: SANDPACK_SEEDGRID_TEXT_EDITOR_SHIM_INDEX_JS,
      hidden: true
    };
    files["/node_modules/@seedgrid/fe-components/dist/inputs/SgTextEditor.mjs"] = {
      code: SANDPACK_SEEDGRID_TEXT_EDITOR_SHIM_INDEX_JS,
      hidden: true
    };

    files["/node_modules/@tiptap/react/package.json"] = {
      code: JSON.stringify({ name: "@tiptap/react", version: "0.0.0-shim", main: "index.js", module: "index.mjs" }),
      hidden: true
    };
    files["/node_modules/@tiptap/react/index.js"] = {
      code: SANDPACK_TIPTAP_REACT_SHIM_INDEX_JS,
      hidden: true
    };
    files["/node_modules/@tiptap/react/index.mjs"] = {
      code: SANDPACK_TIPTAP_REACT_SHIM_INDEX_JS,
      hidden: true
    };

    for (const packageName of TIPTAP_SHIM_PACKAGES) {
      files[`/node_modules/${packageName}/package.json`] = {
        code: JSON.stringify({ name: packageName, version: "0.0.0-shim", main: "index.js", module: "index.mjs" }),
        hidden: true
      };
      files[`/node_modules/${packageName}/index.js`] = {
        code: SANDPACK_TIPTAP_EXTENSION_SHIM_INDEX_JS,
        hidden: true
      };
      files[`/node_modules/${packageName}/index.mjs`] = {
        code: SANDPACK_TIPTAP_EXTENSION_SHIM_INDEX_JS,
        hidden: true
      };
    }
  }

  if (shouldShimLucide) {
    files["/node_modules/lucide-react/package.json"] = {
      code: JSON.stringify({ name: "lucide-react", version: "0.0.0-shim", main: "index.js" }),
      hidden: true
    };
    files["/node_modules/lucide-react/index.js"] = {
      code: SANDPACK_LUCIDE_REACT_SHIM_INDEX_JS,
      hidden: true
    };
  }

  const deps: Record<string, string> = {
    ...DEFAULT_SANDBOX_BASE_DEPENDENCIES,
    ...(includeSeedgridDependency ? DEFAULT_SEEDGRID_RUNTIME_DEPENDENCIES : {}),
    ...(includeSeedgridDependency && !shouldShimLucide ? { "lucide-react": "^0.468.0" } : {}),
    ...(includeEditorDependencies ? DEFAULT_SEEDGRID_EDITOR_DEPENDENCIES : {}),
    ...(includeSandpackReactDependency ? DEFAULT_SANDBOX_HOST_DEPENDENCIES : {}),
    ...(shouldIncludeNodePolyfills ? DEFAULT_SANDPACK_POLYFILLS : {}),
    ...(includeSeedgridDependency ? { "@seedgrid/fe-components": resolvedSeedgridDependency } : {}),
    ...requestedDeps
  };
  const currentHeight = isExpanded ? expandedHeight : height;
  const resizeClass = !resizable
    ? undefined
    : resizeAxis === "vertical"
      ? "resize-y"
      : resizeAxis === "horizontal"
        ? "resize-x"
        : "resize";
  const sandpackCustomSetup = React.useMemo(
    () => ({
      dependencies: deps,
      entry: "/index.tsx",
      ...(resolvedNpmRegistries ? { npmRegistries: resolvedNpmRegistries } : {})
    }),
    [deps, resolvedNpmRegistries]
  );
  const sandpackOptions = React.useMemo(
    () =>
      ({
        autorun: false,
        initMode: "lazy",
        bundlerURL: resolvedBundlerURL,
        // Keep both keys while sandpack typings/runtime differ across versions.
        bundlerTimeOut: resolvedBundlerTimeoutMs,
        bundlerTimeout: resolvedBundlerTimeoutMs,
        activeFile: "/App.tsx",
        visibleFiles: ["/App.tsx"],
        externalResources: includeSeedgridDependency ? SANDPACK_EXTERNAL_RESOURCES : []
      }) as any,
    [includeSeedgridDependency, resolvedBundlerTimeoutMs, resolvedBundlerURL]
  );

  const content = interactive ? (
    <div className={cn(withCard ? "" : "rounded-lg border border-border", withCard ? undefined : className)}>
      <SandpackProvider
        template="react-ts"
        files={files}
        customSetup={sandpackCustomSetup}
        options={sandpackOptions}
      >
        <style>{SANDPACK_HOST_STYLES_CSS}</style>
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            {withCard ? null : <span className="text-sm font-medium">{title ?? "Example"}</span>}
            <span className="text-xs text-muted-foreground">
              {codeContract === "renderBody" ? "editable snippet" : "editable App.tsx"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {expandable ? (
              <SgButton
                appearance="outline"
                size="sm"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Reduzir" : "Expandir"}
              </SgButton>
            ) : null}
            <RunButton onRun={() => setActivePanel("preview")} />
          </div>
        </div>

        <div className="flex md:hidden border-b border-border">
          <button
            type="button"
            className={cn(
              "flex-1 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activePanel === "code"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActivePanel("code")}
          >
            Código
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activePanel === "preview"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActivePanel("preview")}
          >
            Preview
          </button>
        </div>

        <div
          className={cn(
            "grid overflow-auto min-h-[260px]",
            "grid-cols-1 md:grid-cols-2",
            resizeClass
          )}
          style={{ height: currentHeight }}
        >
          <div className={cn("min-w-0 md:border-r border-border", activePanel !== "code" ? "hidden md:block" : "")}>
            <SandpackCodeEditor
              showLineNumbers
              wrapContent
              showTabs={false}
              showRunButton={false}
              style={{ height: "100%" }}
            />
            <div className="flex justify-end border-t border-border px-3 py-2">
              <CopyButton />
            </div>
          </div>
          <div className={cn("min-w-0", activePanel !== "preview" ? "hidden md:block" : "")}>
            <SandpackPreview
              className="sg-playground-preview"
              style={{ height: "100%" }}
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              showRestartButton={false}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  ) : (
    <div className={cn(withCard ? undefined : "space-y-2", withCard ? undefined : className)}>
      {withCard ? null : title ? <div className="text-sm font-medium">{title}</div> : null}
      <ReadonlyBlock code={code} />
    </div>
  );

  if (!withCard) return content;

  return (
    <SgCard
      id={cardId}
      title={title ?? "Codigo"}
      description={description}
      collapsible={collapsible}
      defaultOpen={defaultOpen}
      className={cn("rounded-lg", className)}
      bodyClassName="p-0"
    >
      {content}
    </SgCard>
  );
}
