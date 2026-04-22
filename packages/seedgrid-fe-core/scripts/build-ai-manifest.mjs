import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));

const metaFiles = [
  "registry.meta.js",
  "persistence-localstorage.meta.js",
  "persistence-api.meta.js",
  "persistence-composite.meta.js",
  "useDebouncedValue.meta.js",
  "http/api-client.meta.js",
  "http/api-errors.meta.js",
  "http/api-exception-handler.meta.js",
];

const components = [];
for (const file of metaFiles) {
  try {
    const filePath = join(root, "dist", file);
    const fileUrl = new URL(`file:///${filePath.replaceAll("\\", "/")}`).href;
    const mod = await import(fileUrl);
    components.push({
      componentId: mod.sgMeta.componentId,
      exportName: mod.sgMeta.exportName,
      sgMeta: mod.sgMeta,
      aiHints: mod.aiHints,
    });
  } catch (err) {
    console.warn(`Warning: could not load ${file}:`, err.message);
  }
}

const manifest = {
  schemaVersion: "0.1",
  package: pkg.name,
  packageVersion: pkg.version,
  components,
};

mkdirSync(join(root, "dist/ai"), { recursive: true });
const outPath = join(root, "dist/ai/seedgrid-core.manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`Generated: ${outPath}`);
