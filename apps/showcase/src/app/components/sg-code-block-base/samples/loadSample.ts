import "server-only";

import path from "node:path";
import { access, readFile } from "node:fs/promises";

const SAMPLE_DIR_CANDIDATES = [
  path.join(
    process.cwd(),
    "src",
    "app",
    "components",
    "sg-code-block-base",
    "samples"
  ),
  path.join(
    process.cwd(),
    "apps",
    "showcase",
    "src",
    "app",
    "components",
    "sg-code-block-base",
    "samples"
  )
];

let cachedSampleDirPromise: Promise<string> | null = null;

async function resolveSampleDir(): Promise<string> {
  for (const candidate of SAMPLE_DIR_CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    `Could not resolve samples directory. cwd="${process.cwd()}". Checked: ${SAMPLE_DIR_CANDIDATES.join(", ")}`
  );
}

export async function loadSample(fileName: string): Promise<string> {
  if (!fileName.endsWith(".src")) {
    throw new Error(`Invalid sample extension for "${fileName}". Use ".src".`);
  }
  if (fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
    throw new Error(`Invalid sample file name "${fileName}".`);
  }

  if (!cachedSampleDirPromise) {
    cachedSampleDirPromise = resolveSampleDir();
  }
  const sampleDir = await cachedSampleDirPromise;

  const filePath = path.join(sampleDir, fileName);
  return readFile(filePath, "utf8");
}
