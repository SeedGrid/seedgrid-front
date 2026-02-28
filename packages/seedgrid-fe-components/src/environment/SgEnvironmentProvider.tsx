"use client";

import React from "react";
import {
  createLocalStorageStrategy,
  buildSgPersistenceKey,
} from "./persistence";
import type {
  NamespaceProvider,
  PersistenceStrategy,
  SgPersistenceRecordDTO,
  SgPersistenceMode,
  SgPersistenceConfig,
  SgEnvironmentValue,
  SgEnvironment,
} from "./persistence";

// Re-export types and functions to keep the existing public API stable.
export type {
  NamespaceProvider,
  PersistenceStrategy,
  SgPersistenceRecordDTO,
  SgPersistenceMode,
  SgPersistenceConfig,
  SgEnvironmentValue,
  SgEnvironment,
};
export {
  buildSgPersistenceKey,
  createLocalStorageStrategy,
  createApiPersistenceStrategy,
  createCompositePersistenceStrategy,
} from "./persistence";

const defaultNamespaceProvider: NamespaceProvider = {
  getNamespace: () => ""
};

const defaultEnvironment: SgEnvironmentValue = {
  namespaceProvider: defaultNamespaceProvider,
  persistenceStrategy: createLocalStorageStrategy(),
  persistence: {
    scope: "app:unknown",
    mode: "fallback",
    stateVersion: 1
  }
};

const SgEnvironmentContext = React.createContext<SgEnvironmentValue | null>(null);

export function SgEnvironmentProvider(props: {
  value?: Partial<SgEnvironmentValue>;
  children: React.ReactNode;
}) {
  const value = React.useMemo<SgEnvironmentValue>(
    () => ({
      namespaceProvider: props.value?.namespaceProvider ?? defaultNamespaceProvider,
      persistenceStrategy: props.value?.persistenceStrategy ?? defaultEnvironment.persistenceStrategy,
      persistence: {
        scope: props.value?.persistence?.scope ?? defaultEnvironment.persistence.scope,
        mode: props.value?.persistence?.mode ?? defaultEnvironment.persistence.mode,
        stateVersion: props.value?.persistence?.stateVersion ?? defaultEnvironment.persistence.stateVersion
      }
    }),
    [
      props.value?.namespaceProvider,
      props.value?.persistenceStrategy,
      props.value?.persistence?.scope,
      props.value?.persistence?.mode,
      props.value?.persistence?.stateVersion
    ]
  );

  return (
    <SgEnvironmentContext.Provider value={value}>
      {props.children}
    </SgEnvironmentContext.Provider>
  );
}

export function useSgEnvironment(): SgEnvironmentValue {
  return React.useContext(SgEnvironmentContext) ?? defaultEnvironment;
}

export function useHasSgEnvironmentProvider(): boolean {
  return React.useContext(SgEnvironmentContext) !== null;
}

export function useSgNamespaceProvider(): NamespaceProvider {
  return useSgEnvironment().namespaceProvider;
}

export function useSgPersistence() {
  const env = useSgEnvironment();
  const namespace = env.namespaceProvider.getNamespace();
  const fullKey = (baseKey: string) =>
    buildSgPersistenceKey(baseKey, namespace, env.persistence.scope);

  const load = React.useCallback(
    async (baseKey: string) => {
      const key = fullKey(baseKey);
      if (!key) return null;
      return await env.persistenceStrategy.load(key);
    },
    [env.persistenceStrategy, namespace, env.persistence.scope]
  );

  const save = React.useCallback(
    async (baseKey: string, state: unknown) => {
      const key = fullKey(baseKey);
      if (!key) return;
      await env.persistenceStrategy.save(key, state);
    },
    [env.persistenceStrategy, namespace, env.persistence.scope]
  );

  const clear = React.useCallback(
    async (baseKey: string) => {
      const key = fullKey(baseKey);
      if (!key) return;
      await env.persistenceStrategy.clear(key);
    },
    [env.persistenceStrategy, namespace, env.persistence.scope]
  );

  return {
    namespace,
    scope: env.persistence.scope,
    mode: env.persistence.mode,
    stateVersion: env.persistence.stateVersion,
    load,
    save,
    clear
  };
}

export function useSgPersistentState<T>(args: {
  baseKey: string;
  defaultValue: T;
  serialize?: (value: T) => unknown;
  deserialize?: (value: unknown) => T;
}) {
  const { baseKey, defaultValue } = args;
  const serialize = React.useMemo(
    () => args.serialize ?? ((value: T) => value),
    [args.serialize]
  );
  const deserialize = React.useMemo(
    () => args.deserialize ?? ((value: unknown) => value as T),
    [args.deserialize]
  );
  const hasProvider = useHasSgEnvironmentProvider();
  const persistence = useSgPersistence();
  const [value, setValue] = React.useState<T>(defaultValue);
  const [hydrated, setHydrated] = React.useState(false);

  // Load from persistence on mount
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        let loaded: unknown;
        if (hasProvider) {
          loaded = await persistence.load(baseKey);
        } else {
          try {
            const raw = localStorage.getItem(baseKey);
            loaded = raw !== null ? JSON.parse(raw) : null;
          } catch {
            loaded = null;
          }
        }
        if (!alive) return;
        if (loaded !== null && loaded !== undefined) {
          setValue(deserialize(loaded));
        } else {
          setValue(defaultValue);
        }
        setHydrated(true);
      } catch {
        if (!alive) return;
        setValue(defaultValue);
        setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [baseKey, defaultValue, hasProvider, persistence.load, deserialize]);

  // Save to persistence whenever value changes after hydration
  React.useEffect(() => {
    if (!hydrated) return;
    if (hasProvider) {
      void persistence.save(baseKey, serialize(value));
    } else {
      try {
        localStorage.setItem(baseKey, JSON.stringify(value));
      } catch {
        // ignore
      }
    }
  }, [value, hydrated, hasProvider, baseKey, persistence.save, serialize]);

  const setAndPersist = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue(next);
    },
    []
  );

  const clear = React.useCallback(async () => {
    if (hasProvider) {
      await persistence.clear(baseKey);
    } else {
      try {
        localStorage.removeItem(baseKey);
      } catch {
        // ignore
      }
    }
    setValue(defaultValue);
  }, [baseKey, hasProvider, persistence.clear, defaultValue]);

  return { value, setValue: setAndPersist, clear, hydrated };
}
