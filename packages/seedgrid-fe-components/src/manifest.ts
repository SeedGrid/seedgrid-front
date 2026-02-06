import type { SeedGridModuleManifest, SeedGridRegistry } from "@seedgrid/fe-core";

export const componentsManifest: SeedGridModuleManifest = {
  id: "seedgrid-fe-components",
  name: "SeedGrid FE Components",
  version: "0.2.0",
  register(_registry: SeedGridRegistry) {
    // No navigation or providers for this package.
  }
};
