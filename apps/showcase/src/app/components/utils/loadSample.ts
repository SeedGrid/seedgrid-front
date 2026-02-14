import "server-only";

import path from "node:path";
import { access, readFile } from "node:fs/promises";

let cachedBaseDirPromise: Promise<string> | null = null;

async function resolveBaseDir(): Promise<string> {
  const candidates = [
    path.join(process.cwd(), "src", "app", "components"),
    path.join(process.cwd(), "apps", "showcase", "src", "app", "components")
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    `Could not resolve components directory. cwd="${process.cwd()}". Checked: ${candidates.join(", ")}`
  );
}

export async function loadSample(componentPath: string, fileName: string): Promise<string> {
  if (!fileName.endsWith(".src")) {
    throw new Error(`Invalid sample extension for "${fileName}". Use ".src".`);
  }
  if (fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
    throw new Error(`Invalid sample file name "${fileName}".`);
  }

  cachedBaseDirPromise ??= resolveBaseDir();
  const baseDir = await cachedBaseDirPromise;

  const filePath = path.join(baseDir, componentPath, "samples", fileName);
  return readFile(filePath, "utf8");
}
