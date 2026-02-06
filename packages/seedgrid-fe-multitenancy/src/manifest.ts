import type { SeedGridModuleManifest, SeedGridRegistry } from "@seedgrid/fe-core";
import ptBr from "./i18n/pt-BR.json";

export const multitenancyManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-multitenancy",
  name: "SeedGrid FE Multitenancy",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "multitenancy",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.json"
      }
    ]
  },
  register(registry: SeedGridRegistry) {
    registry.addNavItem({
      id: "multitenancy",
      labelKey: "multitenancy.nav.multitenancy",
      href: "/multitenancy",
      requiresAuth: true,
      order: 55
    });
  }
};
