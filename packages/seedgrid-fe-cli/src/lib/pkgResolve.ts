import path from "node:path";
import fs from "fs-extra";
import { findSeedgridPackagesDir } from "./seedgridWorkspace.js";
import { vendorPackageRoot } from "./seedgridVendor.js";

export async function resolvePackageRoot(appRoot: string, pkgName: string): Promise<string> {
  const nm = path.join(appRoot, "node_modules", pkgName);
  if (await fs.pathExists(nm)) return nm;

  const vendor = vendorPackageRoot(appRoot, pkgName);
  if (await fs.pathExists(vendor)) return vendor;

  const guess = pkgName.replace("@seedgrid/", "seedgrid-");

  const pkgFile = path.join(appRoot, "package.json");
  if (await fs.pathExists(pkgFile)) {
    const pkg = await fs.readJson(pkgFile);
    const spec = pkg?.dependencies?.[pkgName] ?? pkg?.devDependencies?.[pkgName];
    if (typeof spec === "string" && spec.startsWith("file:")) {
      const rel = spec.slice("file:".length);
      const resolved = path.resolve(appRoot, rel);
      if (await fs.pathExists(resolved)) return resolved;
    }
  }

  const packagesDir = await findSeedgridPackagesDir();
  if (packagesDir) {
    const ws = path.join(packagesDir, guess);
    if (await fs.pathExists(ws)) return ws;
  }

  const ws = path.join(appRoot, "..", "..", "packages", guess);
  if (await fs.pathExists(ws)) return ws;

  throw new Error(`Nao consegui resolver o pacote: ${pkgName}`);
}
