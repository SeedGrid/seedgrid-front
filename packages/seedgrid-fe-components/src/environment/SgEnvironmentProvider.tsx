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
  const serialize = args.serialize ?? ((value: T) => value);
  const deserialize = args.deserialize ?? ((value: unknown) => value as T);
  const persistence = useSgPersistence();
  const [value, setValue] = React.useState<T>(defaultValue);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const loaded = await persistence.load(baseKey);
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
  }, [baseKey, persistence.load, deserialize]);

  const setAndPersist = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const computed = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        void persistence.save(baseKey, serialize(computed));
        return computed;
      });
    },
    [baseKey, persistence.save, serialize]
  );

  const clear = React.useCallback(async () => {
    await persistence.clear(baseKey);
    setValue(defaultValue);
  }, [baseKey, persistence.clear, defaultValue]);

  return { value, setValue: setAndPersist, clear, hydrated };
}
