import type { SeedGridModuleManifest, SeedGridRegistry } from "@seedgrid/fe-core";
import ptBr from "./i18n/pt-BR.json";

export const backupManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-backup",
  name: "SeedGrid FE Backup",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "backup",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.json"
      }
    ]
  },
  register(registry: SeedGridRegistry) {
    registry.addNavItem({
      id: "backup",
      labelKey: "backup.nav.backup",
      href: "/backup",
      requiresAuth: true,
      order: 70
    });
  }
};
