import type { SeedGridModuleManifest, SeedGridRegistry } from "@seedgrid/fe-core";
import ptBr from "./i18n/pt-BR.json";
import { AuthProvider } from "./auth/AuthProvider";

export const securityManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-security",
  name: "SeedGrid FE Security",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "security",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.json"
      }
    ]
  },
  register(registry: SeedGridRegistry) {
    registry.addProvider(({ children }) => <AuthProvider>{children}</AuthProvider>);
    registry.addNavItem({
      id: "security",
      labelKey: "security.nav.security",
      href: "/security",
      requiresAuth: true,
      order: 50
    });
  }
};
