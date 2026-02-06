import type { SeedGridModuleManifest, SeedGridRegistry } from "@seedgrid/fe-core";
import ptBr from "./i18n/pt-BR.json";

export const auditManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-audit",
  name: "SeedGrid FE Audit",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "audit",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.json"
      }
    ]
  },
  register(registry: SeedGridRegistry) {
    registry.addNavItem({
      id: "audit",
      labelKey: "audit.nav.audit",
      href: "/audit",
      requiresAuth: true,
      order: 60
    });
  }
};
