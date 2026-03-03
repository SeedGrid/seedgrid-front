import type { SeedGridModuleManifest, SeedGridRegistry } from "./integration/module";
import ptBr from "./i18n/pt-BR.js";

export const componentsManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-components",
  name: "SeedGrid FE Components",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "components",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.js"
      }
    ]
  },
  register(_registry: SeedGridRegistry) {
    // No navigation or providers for this package.
  }
};
