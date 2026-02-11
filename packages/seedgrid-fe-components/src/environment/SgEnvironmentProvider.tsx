"use client";

import React from "react";

export type NamespaceProvider = {
  getNamespace: () => string | null;
};

export type PersistenceStrategy = {
  load: (key: string) => unknown | Promise<unknown>;
  save: (key: string, state: unknown) => void | Promise<void>;
  clear: (key: string) => void | Promise<void>;
};

const defaultNamespaceProvider: NamespaceProvider = {
  getNamespace: () => ""
};

export type SgPersistenceRecordDTO = {
  protocolVersion: 1;
  key: string;
  scope: string;
  stateVersion: number;
  updatedAt: string;
  state: unknown;
};

export type SgPersistenceMode = "strict" | "fallback" | "mirror";

export type SgPersistenceConfig = {
  scope: string;
  mode: SgPersistenceMode;
  stateVersion: number;
};

export type SgEnvironmentValue = {
  namespaceProvider: NamespaceProvider;
  persistenceStrategy: PersistenceStrategy;
  persistence: SgPersistenceConfig;
};

export type SgEnvironment = SgEnvironmentValue;

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

export function buildSgPersistenceKey(baseKey: string, namespace?: string | null, scope?: string | null) {
  const resolved = namespace ?? "";
  if (!resolved) return null;
  const resolvedScope = (scope ?? "").trim();
  if (!resolvedScope) return `sg:${resolved}:${baseKey}`;
  return `sg:${resolved}:${resolvedScope}:${baseKey}`;
}

export function createLocalStorageStrategy(options?: { prefix?: string }): PersistenceStrategy {
  const prefix = options?.prefix ?? "";
  const full = (key: string) => (prefix ? `${prefix}${key}` : key);
  return {
    load: (key) => {
      try {
        const raw = window.localStorage.getItem(full(key));
        if (raw == null) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },
    save: (key, state) => {
      try {
        window.localStorage.setItem(full(key), JSON.stringify(state));
      } catch {
        // ignore
      }
    },
    clear: (key) => {
      try {
        window.localStorage.removeItem(full(key));
      } catch {
        // ignore
      }
    }
  };
}

export function createApiPersistenceStrategy(args: {
  baseUrl: string;
  fetcher?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  scope: string;
  stateVersion: number;
}): PersistenceStrategy {
  const fetcher = args.fetcher ?? fetch;
  const base = args.baseUrl.replace(/\/$/, "");
  const version = args.stateVersion;
  const scope = args.scope;

  return {
    load: async (key) => {
      const res = await fetcher(`${base}/sg/persistence?key=${encodeURIComponent(key)}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error(`SG persistence load failed (${res.status})`);
      const data = (await res.json()) as { found?: boolean; record?: SgPersistenceRecordDTO };
      if (!data?.found || !data.record) return null;
      return data.record.state;
    },
    save: async (key, state) => {
      const record: SgPersistenceRecordDTO = {
        protocolVersion: 1,
        key,
        scope,
        stateVersion: version,
        updatedAt: new Date().toISOString(),
        state
      };
      const res = await fetcher(`${base}/sg/persistence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record })
      });
      if (!res.ok) throw new Error(`SG persistence save failed (${res.status})`);
    },
    clear: async (key) => {
      const res = await fetcher(`${base}/sg/persistence?key=${encodeURIComponent(key)}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error(`SG persistence clear failed (${res.status})`);
    }
  };
}

export function createCompositePersistenceStrategy(args: {
  mode: SgPersistenceMode;
  primary: PersistenceStrategy;
  secondary: PersistenceStrategy;
}): PersistenceStrategy {
  const { mode, primary, secondary } = args;

  return {
    load: async (key) => {
      if (mode === "strict") {
        return await primary.load(key);
      }
      if (mode === "mirror") {
        try {
          const remote = await primary.load(key);
          if (remote !== null && remote !== undefined) return remote;
        } catch {
          // ignore and fallback
        }
        return await secondary.load(key);
      }
      try {
        return await primary.load(key);
      } catch {
        return await secondary.load(key);
      }
    },
    save: async (key, state) => {
      if (mode === "strict") {
        await primary.save(key, state);
        return;
      }
      if (mode === "mirror") {
        await Promise.allSettled([
          Promise.resolve(primary.save(key, state)),
          Promise.resolve(secondary.save(key, state))
        ]);
        return;
      }
      try {
        await primary.save(key, state);
      } catch {
        await secondary.save(key, state);
      }
    },
    clear: async (key) => {
      if (mode === "strict") {
        await primary.clear(key);
        return;
      }
      if (mode === "mirror") {
        await Promise.allSettled([
          Promise.resolve(primary.clear(key)),
          Promise.resolve(secondary.clear(key))
        ]);
        return;
      }
      try {
        await primary.clear(key);
      } catch {
        await secondary.clear(key);
      }
    }
  };
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
