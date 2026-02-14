import type React from "react";

export type SeedGridModuleId = string;

export type SeedGridProvider = React.ComponentType<{
  children: React.ReactNode;
}>;

export type SeedGridNavItem = {
  id: string;
  labelKey: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
  order?: number;
};

export type SeedGridRoute = {
  id: string;
  path: string;
  requiresAuth?: boolean;
};

export type SeedGridI18nBundle = {
  namespace: string;
  resources: Record<string, string>;
  distPath?: string;
};

export type SeedGridRegistry = {
  addProvider: (provider: SeedGridProvider) => void;
  addNavItem: (item: SeedGridNavItem) => void;
  addRoute: (route: SeedGridRoute) => void;
};

export type SeedGridModuleManifest = {
  id: SeedGridModuleId;
  name: string;
  version: string;
  i18n?: {
    defaultLocale: "pt-BR";
    bundles: SeedGridI18nBundle[];
  };
  register: (registry: SeedGridRegistry) => void;
};
