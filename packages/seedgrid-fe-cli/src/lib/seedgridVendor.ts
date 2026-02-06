import path from "node:path";
import fs from "fs-extra";
import { findSeedgridPackagesDir } from "./seedgridWorkspace.js";

const VENDOR_DIR_NAME = "seedgrid-packages";
const SOURCE_FILE = "seedgrid.source.json";

function toPosix(p: string) {
  return p.replace(/\\/g, "/");
}

export function packageNameToFolder(pkgName: string) {
  return pkgName.replace("@seedgrid/", "seedgrid-");
}

export function vendorDependencySpec(pkgName: string) {
  const folder = packageNameToFolder(pkgName);
  return `file:./${toPosix(path.join(VENDOR_DIR_NAME, folder))}`;
}

async function rewriteWorkspaceDeps(pkgDir: string) {
  const pkgFile = path.join(pkgDir, "package.json");
  if (!(await fs.pathExists(pkgFile))) return;

  const pkg = await fs.readJson(pkgFile);
  const sections = ["dependencies", "devDependencies", "optionalDependencies"] as const;

  for (const section of sections) {
    const deps = pkg?.[section];
    if (!deps || typeof deps !== "object") continue;
    for (const [depName, spec] of Object.entries(deps)) {
      if (typeof spec !== "string") continue;
      if (!spec.startsWith("workspace:")) continue;
      if (!depName.startsWith("@seedgrid/")) continue;
      const folder = packageNameToFolder(depName);
      deps[depName] = `file:../${toPosix(folder)}`;
    }
  }

  await fs.writeJson(pkgFile, pkg, { spaces: 2 });
}

type SourceOptions = {
  sourceDir?: string;
  sourceHint?: string;
  writeSource?: boolean;
  force?: boolean;
};

async function resolveCandidate(appRoot: string, candidate: string) {
  const resolved = path.resolve(appRoot, candidate);
  const asPackages = path.join(resolved, "seedgrid-fe-core");
  if (await fs.pathExists(asPackages)) return resolved;
  const asRoot = path.join(resolved, "packages", "seedgrid-fe-core");
  if (await fs.pathExists(asRoot)) return path.join(resolved, "packages");
  return null;
}

export async function resolveSeedgridPackagesDir(appRoot: string, sourceHint?: string) {
  if (sourceHint) {
    const resolved = await resolveCandidate(appRoot, sourceHint);
    if (!resolved) {
      throw new Error(`Fonte SeedGrid invalida: ${sourceHint}`);
    }
    return resolved;
  }

  const envHint = process.env.SEEDGRID_SOURCE;
  if (envHint) {
    const resolved = await resolveCandidate(appRoot, envHint);
    if (!resolved) {
      throw new Error(`SEEDGRID_SOURCE invalido: ${envHint}`);
    }
    return resolved;
  }

  const sourceFile = path.join(appRoot, SOURCE_FILE);
  if (await fs.pathExists(sourceFile)) {
    const cfg = await fs.readJson(sourceFile);
    if (typeof cfg?.packagesDir === "string") {
      const resolved = await resolveCandidate(appRoot, cfg.packagesDir);
      if (resolved) return resolved;
    }
    if (typeof cfg?.monorepoRoot === "string") {
      const resolved = await resolveCandidate(appRoot, cfg.monorepoRoot);
      if (resolved) return resolved;
    }
  }

  return await findSeedgridPackagesDir();
}

export async function writeSeedgridSource(appRoot: string, packagesDir: string) {
  const rel = path.relative(appRoot, packagesDir);
  const value = rel.includes(":") ? packagesDir : toPosix(rel);
  const sourceFile = path.join(appRoot, SOURCE_FILE);
  await fs.writeJson(sourceFile, { packagesDir: value }, { spaces: 2 });
}

function copyFilter(srcRoot: string, p: string) {
  const rel = path.relative(srcRoot, p);
  if (rel === "") return true;
  const parts = rel.split(path.sep);
  if (parts.includes("node_modules")) return false;
  if (parts.includes(".turbo")) return false;
  if (rel.endsWith(".tsbuildinfo")) return false;
  return true;
}

export async function ensureSeedgridVendor(appRoot: string, pkgNames: string[], options: SourceOptions = {}) {
  const packagesDir =
    options.sourceDir ?? (await resolveSeedgridPackagesDir(appRoot, options.sourceHint));
  if (!packagesDir) {
    throw new Error("Nao consegui localizar os pacotes SeedGrid para copiar.");
  }

  const vendorDir = path.join(appRoot, VENDOR_DIR_NAME);
  await fs.ensureDir(vendorDir);

  for (const pkgName of pkgNames) {
    const folder = packageNameToFolder(pkgName);
    const src = path.join(packagesDir, folder);
    const dest = path.join(vendorDir, folder);

    if (!(await fs.pathExists(src))) {
      throw new Error(`Pacote SeedGrid nao encontrado: ${pkgName}`);
    }

    const exists = await fs.pathExists(dest);
    if (exists && options.force) {
      await fs.remove(dest);
    }

    if (!(await fs.pathExists(dest))) {
      await fs.copy(src, dest, { filter: (p) => copyFilter(src, p) });
    }

    await rewriteWorkspaceDeps(dest);
  }

  if (options.writeSource) {
    await writeSeedgridSource(appRoot, packagesDir);
  }
}

export function vendorPackageRoot(appRoot: string, pkgName: string) {
  return path.join(appRoot, VENDOR_DIR_NAME, packageNameToFolder(pkgName));
}
