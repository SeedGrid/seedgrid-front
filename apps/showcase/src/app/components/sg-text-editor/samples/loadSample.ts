/* eslint-disable @typescript-eslint/no-require-imports */

const webpackRequire = require as any;
const context = webpackRequire.context("./", false, /\.src$/);

export function loadSample(fileName: string): string {
  if (!fileName.endsWith(".src")) {
    throw new Error(`Invalid sample extension for "${fileName}". Use ".src".`);
  }
  if (fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
    throw new Error(`Invalid sample file name "${fileName}".`);
  }

  const key = `./${fileName}`;
  const keys = context.keys() as string[];
  if (!keys.includes(key)) {
    throw new Error(`Sample "${fileName}" not found in ${__dirname}.`);
  }

  const mod = context(key) as string | { default: string };
  return typeof mod === "string" ? mod : mod.default;
}
