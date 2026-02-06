import type { SeedGridModuleManifest } from "@seedgrid/fe-core";
import ptBr from "./i18n/pt-BR.json";

export const themeManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-theme",
  name: "SeedGrid FE Theme",
  version: "0.2.0",
  i18n: {
    defaultLocale: "pt-BR",
    bundles: [
      {
        namespace: "theme",
        resources: ptBr,
        distPath: "dist/i18n/pt-BR.json"
      }
    ]
  },
  register() {}
};
