import path from "node:path";
import fs from "fs-extra";
import {
  ensureSeedgridVendor,
  resolveSeedgridPackagesDir,
  vendorDependencySpec,
  writeSeedgridSource
} from "../lib/seedgridVendor.js";

type UpgradeParams = { source?: string };

export async function cmdUpgrade(params: UpgradeParams) {
  const appRoot = process.cwd();
  const cfg = path.join(appRoot, "seedgrid.config.ts");

  if (!(await fs.pathExists(cfg))) {
    throw new Error("Rode dentro do app (seedgrid.config.ts nao encontrado)." );
  }

  const pkgFile = path.join(appRoot, "package.json");
  if (!(await fs.pathExists(pkgFile))) {
    throw new Error("package.json nao encontrado.");
  }

  const pkg = await fs.readJson(pkgFile);
  const deps = Object.keys(pkg.dependencies ?? {}).filter((name) => name.startsWith("@seedgrid/"));
  const devDeps = Object.keys(pkg.devDependencies ?? {}).filter((name) => name.startsWith("@seedgrid/"));

  const seedgridDeps = new Set<string>([...deps, ...devDeps]);

  const sourceDir = await resolveSeedgridPackagesDir(appRoot, params.source);
  if (!sourceDir) {
    throw new Error("Nao consegui localizar a fonte SeedGrid. Use --source ou SEEDGRID_SOURCE.");
  }

  await ensureSeedgridVendor(appRoot, Array.from(seedgridDeps), {
    sourceDir,
    force: true
  });

  pkg.dependencies = pkg.dependencies ?? {};
  pkg.devDependencies = pkg.devDependencies ?? {};

  for (const name of Object.keys(pkg.dependencies)) {
    if (name.startsWith("@seedgrid/")) {
      pkg.dependencies[name] = vendorDependencySpec(name);
    }
  }

  for (const name of Object.keys(pkg.devDependencies)) {
    if (name.startsWith("@seedgrid/")) {
      pkg.devDependencies[name] = vendorDependencySpec(name);
    }
  }

  await fs.writeJson(pkgFile, pkg, { spaces: 2 });
  await writeSeedgridSource(appRoot, sourceDir);

  console.log("upgrade ok");
}
