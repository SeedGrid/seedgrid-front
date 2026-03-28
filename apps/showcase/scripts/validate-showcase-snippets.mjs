import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const showcaseRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(showcaseRoot, "..", "..");
const appRoot = path.join(showcaseRoot, "src", "app");
const tsconfigPath = path.join(showcaseRoot, "tsconfig.json");

const referencePropPattern = /\b(sampleFile|playgroundFile)\s*=\s*"([^"]+)"/g;
const referencedPathLiteralPattern = /["'](apps\/showcase\/src\/app\/[^"']+\.(?:sample|playground))["']/g;
const componentSourcePattern = /\.(tsx|ts)$/;
const compilableSnippetPattern = /\.(tsx|ts)\.(sample|playground)$/;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function resolveLoader(filePath) {
  if (filePath.endsWith(".tsx.sample") || filePath.endsWith(".tsx.playground")) {
    return "tsx";
  }

  if (filePath.endsWith(".ts.sample") || filePath.endsWith(".ts.playground")) {
    return "ts";
  }

  return null;
}

function collectReferencedFiles() {
  const sourceFiles = walk(appRoot).filter(
    (filePath) => componentSourcePattern.test(filePath) && !compilableSnippetPattern.test(filePath)
  );
  const references = [];

  for (const sourceFile of sourceFiles) {
    const source = fs.readFileSync(sourceFile, "utf8");
    for (const match of source.matchAll(referencePropPattern)) {
      const [, propName, referencedPath] = match;
      references.push({
        sourceFile,
        propName,
        referencedPath,
        absolutePath: path.resolve(repoRoot, referencedPath)
      });
    }

    for (const match of source.matchAll(referencedPathLiteralPattern)) {
      const [, referencedPath] = match;
      references.push({
        sourceFile,
        propName: "pathLiteral",
        referencedPath,
        absolutePath: path.resolve(repoRoot, referencedPath)
      });
    }
  }

  return references;
}

function findEsbuildEntryPoint() {
  const directPath = path.join(repoRoot, "node_modules", "esbuild", "lib", "main.js");
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  const pnpmRoot = path.join(repoRoot, "node_modules", ".pnpm");
  if (!fs.existsSync(pnpmRoot)) {
    throw new Error("node_modules/.pnpm nao encontrado para localizar o esbuild.");
  }

  const candidates = fs
    .readdirSync(pnpmRoot)
    .filter((entry) => entry.startsWith("esbuild@"))
    .map((entry) => path.join(pnpmRoot, entry, "node_modules", "esbuild", "lib", "main.js"))
    .filter((entryPath) => fs.existsSync(entryPath))
    .sort();

  if (candidates.length === 0) {
    throw new Error("esbuild nao encontrado no workspace.");
  }

  return candidates[candidates.length - 1];
}

async function loadEsbuild() {
  const esbuildEntryPoint = findEsbuildEntryPoint();
  return import(pathToFileURL(esbuildEntryPoint).href);
}

async function compileSnippet(esbuild, filePath) {
  const loader = resolveLoader(filePath);
  if (!loader) {
    return;
  }

  const source = fs.readFileSync(filePath, "utf8");
  await esbuild.build({
    stdin: {
      contents: source,
      resolveDir: path.dirname(filePath),
      sourcefile: filePath,
      loader
    },
    absWorkingDir: repoRoot,
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: ["es2022"],
    tsconfig: tsconfigPath,
    logLevel: "silent",
    external: [
      "react",
      "react-dom",
      "react-hook-form",
      "next",
      "next/*",
      "lucide-react",
      "@tiptap/*"
    ]
  });
}

async function main() {
  const esbuild = await loadEsbuild();
  const references = collectReferencedFiles();

  const missingReferences = references.filter((entry) => !fs.existsSync(entry.absolutePath));
  if (missingReferences.length > 0) {
    for (const failure of missingReferences) {
      console.error(
        `[missing] ${path.relative(repoRoot, failure.sourceFile)} -> ${failure.propName}="${failure.referencedPath}"`
      );
    }
    process.exit(1);
  }

  const referencedFiles = new Map();
  for (const entry of references) {
    referencedFiles.set(entry.absolutePath, entry);
  }

  const allSnippetFiles = walk(appRoot).filter((filePath) => compilableSnippetPattern.test(filePath));
  const unreferencedFiles = allSnippetFiles.filter((filePath) => !referencedFiles.has(filePath));

  const compileFailures = [];
  for (const filePath of allSnippetFiles) {
    try {
      await compileSnippet(esbuild, filePath);
    } catch (error) {
      compileFailures.push({
        filePath,
        error
      });
    }
  }

  if (compileFailures.length > 0) {
    for (const failure of compileFailures) {
      console.error(`[compile] ${path.relative(repoRoot, failure.filePath)}`);
      if (Array.isArray(failure.error?.errors) && failure.error.errors.length > 0) {
        for (const detail of failure.error.errors) {
          const location = detail.location
            ? `${detail.location.file}:${detail.location.line}:${detail.location.column}`
            : path.relative(repoRoot, failure.filePath);
          console.error(`  ${location} ${detail.text}`);
        }
      } else {
        console.error(`  ${failure.error?.message ?? String(failure.error)}`);
      }
    }
    process.exit(1);
  }

  console.log(
    `Validated ${allSnippetFiles.length} sample/playground files, ${references.length} references and ${unreferencedFiles.length} extra files.`
  );
}

await main();
