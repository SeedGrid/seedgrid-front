import type { SeedGridModuleManifest, SeedGridRegistry } from "@seedgrid/fe-core";
import ptBr from "./i18n/pt-BR.json";

export const commonsManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-commons",
  name: "SeedGrid FE Commons",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "commons",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.json"
      }
    ]
  },
  register(registry: SeedGridRegistry) {
    registry.addNavItem({
      id: "login",
      labelKey: "commons.nav.login",
      href: "/login",
      requiresAuth: false,
      order: 1
    });

    registry.addNavItem({
      id: "dashboard",
      labelKey: "commons.nav.dashboard",
      href: "/dashboard",
      requiresAuth: true,
      order: 10
    });
  }
};
