import path from "node:path";
import fs from "fs-extra";
import { resolvePackageRoot } from "../lib/pkgResolve.js";
import { mergePtBrNamespace } from "../lib/i18nMerge.js";
import { addManifestToSeedgridConfig } from "../lib/seedgridConfig.js";
import { ensureSeedgridVendor, vendorDependencySpec } from "../lib/seedgridVendor.js";

const ALIASES: Record<string, string> = {
  audit: "@seedgrid/fe-audit",
  backup: "@seedgrid/fe-backup",
  multitenancy: "@seedgrid/fe-multitenancy",
  multtitenancy: "@seedgrid/fe-multitenancy",
  components: "@seedgrid/fe-components",
  core: "@seedgrid/fe-core",
  commons: "@seedgrid/fe-commons",
  theme: "@seedgrid/fe-theme",
  security: "@seedgrid/fe-security"
};

function normalizeModuleName(input: string) {
  const trimmed = input.trim();
  if (trimmed.startsWith("@seedgrid/")) return trimmed;
  if (ALIASES[trimmed]) return ALIASES[trimmed];
  if (trimmed.startsWith("seedgrid-fe-")) return `@seedgrid/fe-${trimmed.slice("seedgrid-fe-".length)}`;
  if (trimmed.startsWith("fe-")) return `@seedgrid/${trimmed}`;
  return trimmed;
}

function expandModuleNames(input: string) {
  const normalized = normalizeModuleName(input);
  if (normalized === "@seedgrid/fe-multitenancy") {
    return ["@seedgrid/fe-security", "@seedgrid/fe-audit", "@seedgrid/fe-backup", "@seedgrid/fe-components", normalized];
  }
  return [normalized];
}

function uniq(list: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

function guessManifest(moduleName: string) {
  if (moduleName.includes("fe-commons")) return { importName: "commonsManifest", manifestVar: "commonsManifest" };
  if (moduleName.includes("fe-theme")) return { importName: "themeManifest", manifestVar: "themeManifest" };
  if (moduleName.includes("fe-security")) return { importName: "securityManifest", manifestVar: "securityManifest" };
  if (moduleName.includes("fe-audit")) return { importName: "auditManifest", manifestVar: "auditManifest" };
  if (moduleName.includes("fe-backup")) return { importName: "backupManifest", manifestVar: "backupManifest" };
  if (moduleName.includes("fe-multitenancy")) return { importName: "multitenancyManifest", manifestVar: "multitenancyManifest" };
  if (moduleName.includes("fe-components")) return { importName: "componentsManifest", manifestVar: "componentsManifest" };
  return { importName: "manifest", manifestVar: "manifest" };
}

function guessNamespace(moduleName: string) {
  return moduleName.split("/").pop()!.replace("fe-", "");
}

async function ensureMultitenancySignupPage(appRoot: string) {
  const pagePath = path.join(appRoot, "src", "app", "(public)", "multitenancy", "signup", "page.tsx");
  if (await fs.pathExists(pagePath)) return;

  const content =
    `"use client";\n\nimport React from \"react\";\nimport { MultitenancySignupForm } from \"@seedgrid/fe-multitenancy\";\nimport { seedgridConfig } from \"../../../../../seedgrid.config\";\nimport { useI18n, t } from \"@/seedgrid/provider\";\n\nexport default function MultitenancySignupPage() {\n  const i18n = useI18n();\n  const appName =\n    seedgridConfig.theme?.brand?.name ?? seedgridConfig.appTitle ?? seedgridConfig.appName ?? \"SeedGrid Multitenancy\";\n\n  return (\n    <MultitenancySignupForm\n      appName={appName}\n      labels={{\n        title: t(i18n, \"multitenancy.signup.title\"),\n        subtitle: t(i18n, \"multitenancy.signup.subtitle\"),\n        disclaimer: t(i18n, \"multitenancy.signup.disclaimer\"),\n        submit: t(i18n, \"multitenancy.signup.submit\")\n      }}\n    />\n  );\n}\n`;

  await fs.ensureDir(path.dirname(pagePath));
  await fs.writeFile(pagePath, content, "utf8");
}

export async function cmdAdd(params: { moduleName: string }) {
  const appRoot = process.cwd();
  const cfg = path.join(appRoot, "seedgrid.config.ts");

  if (!(await fs.pathExists(cfg))) {
    throw new Error("Rode dentro do app (seedgrid.config.ts nao encontrado)." );
  }

  const modulesToAdd = uniq(expandModuleNames(params.moduleName));

  await ensureSeedgridVendor(appRoot, ["@seedgrid/fe-core", ...modulesToAdd], { writeSource: true });

  const pkgFile = path.join(appRoot, "package.json");
  const pkg = await fs.readJson(pkgFile);
  pkg.dependencies = pkg.dependencies ?? {};

  for (const moduleName of modulesToAdd) {
    const currentSpec = pkg.dependencies[moduleName];
    if (!currentSpec || (typeof currentSpec === "string" && currentSpec.startsWith("workspace:"))) {
      pkg.dependencies[moduleName] = vendorDependencySpec(moduleName);
    }
  }

  if (modulesToAdd.includes("@seedgrid/fe-multitenancy")) {
    if (!pkg.dependencies["react-hook-form"]) {
      pkg.dependencies["react-hook-form"] = "^7.52.2";
    }
  }

  await fs.writeJson(pkgFile, pkg, { spaces: 2 });

  for (const moduleName of modulesToAdd) {
    const { importName, manifestVar } = guessManifest(moduleName);
    await addManifestToSeedgridConfig({
      appRoot,
      importName,
      importFrom: moduleName,
      manifestVar
    });

    const namespace = guessNamespace(moduleName);
    const pkgRoot = await resolvePackageRoot(appRoot, moduleName);

    const distI18n = path.join(pkgRoot, "dist", "i18n", "pt-BR.json");
    const srcI18n = path.join(pkgRoot, "src", "i18n", "pt-BR.json");

    let resources: Record<string, string> = {};
    if (await fs.pathExists(distI18n)) resources = await fs.readJson(distI18n);
    else if (await fs.pathExists(srcI18n)) resources = await fs.readJson(srcI18n);

    await mergePtBrNamespace({ appRoot, namespace, resources });
  }

  if (modulesToAdd.includes("@seedgrid/fe-multitenancy")) {
    await ensureMultitenancySignupPage(appRoot);
  }

  console.log(`add ok: ${modulesToAdd.join(", ")}`);
}
