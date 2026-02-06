import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";

async function findCliPackageRoot(): Promise<string | null> {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i += 1) {
    const pkgFile = path.join(dir, "package.json");
    if (await fs.pathExists(pkgFile)) {
      try {
        const pkg = await fs.readJson(pkgFile);
        if (pkg?.name === "@seedgrid/fe-cli") return dir;
      } catch {
        // ignore and keep walking up
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export async function findSeedgridPackagesDir(): Promise<string | null> {
  const cliRoot = await findCliPackageRoot();
  if (!cliRoot) return null;

  const packagesDir = path.resolve(cliRoot, "..", "..", "packages");
  const coreDir = path.join(packagesDir, "seedgrid-fe-core");
  if (!(await fs.pathExists(coreDir))) return null;

  return packagesDir;
}
