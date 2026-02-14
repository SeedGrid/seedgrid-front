import type {
  SeedGridModuleManifest as ComponentsManifest,
  SeedGridRegistry as ComponentsRegistry,
  PersistenceStrategy as ComponentsPersistenceStrategy,
  SgEnvironmentValue as ComponentsEnvironmentValue,
  NamespaceProvider as ComponentsNamespaceProvider,
  SgPersistenceConfig as ComponentsPersistenceConfig
} from "@seedgrid/fe-components";
import type {
  SeedGridModuleManifest as CoreManifest,
  SeedGridRegistry as CoreRegistry,
  PersistenceStrategy as CorePersistenceStrategy,
  SgEnvironmentValue as CoreEnvironmentValue,
  NamespaceProvider as CoreNamespaceProvider,
  SgPersistenceConfig as CorePersistenceConfig
} from "@seedgrid/fe-core";

export function adaptComponentsManifestToCore(manifest: ComponentsManifest): CoreManifest {
  return {
    ...manifest,
    register(registry: CoreRegistry) {
      manifest.register(registry as unknown as ComponentsRegistry);
    }
  };
}

export function adaptCoreManifestToComponents(manifest: CoreManifest): ComponentsManifest {
  return {
    ...manifest,
    register(registry: ComponentsRegistry) {
      manifest.register(registry as unknown as CoreRegistry);
    }
  };
}

export function adaptCorePersistenceStrategy(
  strategy: CorePersistenceStrategy
): ComponentsPersistenceStrategy {
  return {
    load: (key) => strategy.load(key),
    save: (key, state) => strategy.save(key, state),
    clear: (key) => strategy.clear(key)
  };
}

export function adaptComponentsPersistenceStrategy(
  strategy: ComponentsPersistenceStrategy
): CorePersistenceStrategy {
  return {
    load: (key) => strategy.load(key),
    save: (key, state) => strategy.save(key, state),
    clear: (key) => strategy.clear(key)
  };
}

export function adaptCoreNamespaceProvider(
  provider: CoreNamespaceProvider
): ComponentsNamespaceProvider {
  return {
    getNamespace: () => provider.getNamespace()
  };
}

export function adaptComponentsNamespaceProvider(
  provider: ComponentsNamespaceProvider
): CoreNamespaceProvider {
  return {
    getNamespace: () => provider.getNamespace()
  };
}

export function adaptCorePersistenceConfig(config: CorePersistenceConfig): ComponentsPersistenceConfig {
  return {
    mode: config.mode,
    scope: config.scope,
    stateVersion: config.stateVersion
  };
}

export function adaptComponentsPersistenceConfig(
  config: ComponentsPersistenceConfig
): CorePersistenceConfig {
  return {
    mode: config.mode,
    scope: config.scope,
    stateVersion: config.stateVersion
  };
}

export function adaptCoreEnvironmentValue(
  value: CoreEnvironmentValue
): ComponentsEnvironmentValue {
  return {
    namespaceProvider: adaptCoreNamespaceProvider(value.namespaceProvider),
    persistenceStrategy: adaptCorePersistenceStrategy(value.persistenceStrategy),
    persistence: adaptCorePersistenceConfig(value.persistence)
  };
}

export function adaptComponentsEnvironmentValue(
  value: ComponentsEnvironmentValue
): CoreEnvironmentValue {
  return {
    namespaceProvider: adaptComponentsNamespaceProvider(value.namespaceProvider),
    persistenceStrategy: adaptComponentsPersistenceStrategy(value.persistenceStrategy),
    persistence: adaptComponentsPersistenceConfig(value.persistence)
  };
}
