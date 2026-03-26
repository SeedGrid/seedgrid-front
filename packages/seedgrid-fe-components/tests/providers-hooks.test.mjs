import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return {
      extend() {
        return {
          configure() {
            return this;
          }
        };
      }
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const {
  SgEnvironmentProvider,
  useSgEnvironment,
  useSgPersistence,
  buildSgPersistenceKey,
  createLocalStorageStrategy,
  createCompositePersistenceStrategy,
  createApiPersistenceStrategy,
  SgComponentsI18nProvider,
  useComponentsI18n,
  SgTimeProvider,
  useSgTime,
  resolvePersistedStateValue,
  readLocalPersistentState,
  writeLocalPersistentState,
  clearLocalPersistentState
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

async function withMockWindow(windowLike, fn) {
  const previousWindow = globalThis.window;
  globalThis.window = windowLike;
  try {
    return await fn();
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
  }
}

test("buildSgPersistenceKey builds namespaced keys and returns null without namespace", () => {
  assert.equal(buildSgPersistenceKey("prefs", null, "app"), null);
  assert.equal(buildSgPersistenceKey("prefs", "tenant-a", "app"), "sg:tenant-a:app:prefs");
  assert.equal(buildSgPersistenceKey("prefs", "tenant-a", ""), "sg:tenant-a:prefs");
});

test("createLocalStorageStrategy persists values through the provided localStorage", async () => {
  const store = new Map();
  const windowLike = {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, value),
      removeItem: (key) => store.delete(key)
    }
  };

  await withMockWindow(windowLike, async () => {
    const strategy = createLocalStorageStrategy({ prefix: "sg:" });
    await strategy.save("prefs", { dark: true });
    assert.deepEqual(await strategy.load("prefs"), { dark: true });
    await strategy.clear("prefs");
    assert.equal(await strategy.load("prefs"), null);
  });

  assert.equal(store.has("sg:prefs"), false);
});

test("createCompositePersistenceStrategy falls back and mirrors according to mode", async () => {
  const calls = [];
  const failingPrimary = {
    load: async () => {
      calls.push("primary.load");
      throw new Error("boom");
    },
    save: async () => {
      calls.push("primary.save");
      throw new Error("boom");
    },
    clear: async () => {
      calls.push("primary.clear");
      throw new Error("boom");
    }
  };
  const secondary = {
    load: async () => {
      calls.push("secondary.load");
      return { ok: true };
    },
    save: async () => {
      calls.push("secondary.save");
    },
    clear: async () => {
      calls.push("secondary.clear");
    }
  };

  const fallback = createCompositePersistenceStrategy({ mode: "fallback", primary: failingPrimary, secondary });
  assert.deepEqual(await fallback.load("prefs"), { ok: true });
  await fallback.save("prefs", { ok: true });
  await fallback.clear("prefs");
  assert.deepEqual(calls, [
    "primary.load",
    "secondary.load",
    "primary.save",
    "secondary.save",
    "primary.clear",
    "secondary.clear"
  ]);

  const mirrorCalls = [];
  const mirror = createCompositePersistenceStrategy({
    mode: "mirror",
    primary: {
      load: async () => {
        mirrorCalls.push("primary.load");
        return null;
      },
      save: async () => {
        mirrorCalls.push("primary.save");
      },
      clear: async () => {
        mirrorCalls.push("primary.clear");
      }
    },
    secondary: {
      load: async () => {
        mirrorCalls.push("secondary.load");
        return { mirrored: true };
      },
      save: async () => {
        mirrorCalls.push("secondary.save");
      },
      clear: async () => {
        mirrorCalls.push("secondary.clear");
      }
    }
  });

  assert.deepEqual(await mirror.load("prefs"), { mirrored: true });
  await mirror.save("prefs", { mirrored: true });
  await mirror.clear("prefs");
  assert.deepEqual(mirrorCalls, [
    "primary.load",
    "secondary.load",
    "primary.save",
    "secondary.save",
    "primary.clear",
    "secondary.clear"
  ]);
});

test("SgEnvironmentProvider exposes overrides to descendants", () => {
  let snapshot;

  function Probe() {
    const env = useSgEnvironment();
    const persistence = useSgPersistence();
    snapshot = {
      namespace: persistence.namespace,
      scope: persistence.scope,
      mode: persistence.mode,
      stateVersion: persistence.stateVersion,
      providerScope: env.persistence.scope
    };
    return null;
  }

  renderToStaticMarkup(
    React.createElement(
      SgEnvironmentProvider,
      {
        value: {
          namespaceProvider: { getNamespace: () => "tenant-a" },
          persistence: { scope: "crm", mode: "mirror", stateVersion: 7 },
          persistenceStrategy: {
            load: async () => null,
            save: async () => {},
            clear: async () => {}
          }
        }
      },
      React.createElement(Probe)
    )
  );

  assert.deepEqual(snapshot, {
    namespace: "tenant-a",
    scope: "crm",
    mode: "mirror",
    stateVersion: 7,
    providerScope: "crm"
  });
});

test("nested SgComponentsI18nProvider overrides locale and messages", () => {
  let snapshot;

  function Probe() {
    snapshot = useComponentsI18n();
    return null;
  }

  renderToStaticMarkup(
    React.createElement(
      SgComponentsI18nProvider,
      { locale: "fr" },
      React.createElement(
        SgComponentsI18nProvider,
        { locale: "en", messages: { "components.actions.clear": "Clear now" } },
        React.createElement(Probe)
      )
    )
  );

  assert.equal(snapshot.locale, "en-US");
  assert.equal(snapshot.messages["components.actions.clear"], "Clear now");
  assert.equal(snapshot.messages["components.actions.confirm"], "Confirm");
});

test("SgTimeProvider exposes deterministic initial time during server render", () => {
  let snapshot;
  const initialServerTime = "2026-03-22T12:34:56.000Z";

  function Probe() {
    const time = useSgTime();
    snapshot = {
      serverStartMs: time.serverStartMs,
      nowMs: time.nowMs(),
      tick: time.tick
    };
    return null;
  }

  renderToStaticMarkup(
    React.createElement(
      SgTimeProvider,
      { initialServerTime },
      React.createElement(Probe)
    )
  );

  const expected = Date.parse(initialServerTime);
  assert.equal(snapshot.serverStartMs, expected);
  assert.equal(snapshot.nowMs, expected);
  assert.equal(snapshot.tick, 0);
});





test("resolvePersistedStateValue deserializes loaded values and falls back for empty loads", () => {
  assert.equal(
    resolvePersistedStateValue({
      loaded: { count: 2 },
      defaultValue: 0,
      deserialize: (value) => value.count
    }),
    2
  );

  assert.equal(
    resolvePersistedStateValue({
      loaded: null,
      defaultValue: 7,
      deserialize: () => 99
    }),
    7
  );
});

test("local persistent-state helpers read write and clear deterministically", () => {
  const store = new Map();
  const storage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key)
  };

  writeLocalPersistentState({ storage, baseKey: "prefs", value: { dark: true } });
  assert.equal(store.get("prefs"), JSON.stringify({ dark: true }));

  assert.deepEqual(
    readLocalPersistentState({
      storage,
      baseKey: "prefs",
      defaultValue: { dark: false },
      deserialize: (value) => ({ dark: Boolean(value.dark) })
    }),
    { dark: true }
  );

  store.set("prefs", "not-json");
  assert.deepEqual(
    readLocalPersistentState({
      storage,
      baseKey: "prefs",
      defaultValue: { dark: false },
      deserialize: (value) => value
    }),
    { dark: false }
  );

  assert.deepEqual(
    clearLocalPersistentState({ storage, baseKey: "prefs", defaultValue: { dark: false } }),
    { dark: false }
  );
  assert.equal(store.has("prefs"), false);
});


test("createApiPersistenceStrategy uses the injected fetcher for load save and clear", async () => {
  const calls = [];
  const fetcher = async (input, init) => {
    calls.push([String(input), init?.method ?? "GET", init?.body ?? null]);

    if ((init?.method ?? "GET") === "GET") {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          found: true,
          record: {
            protocolVersion: 1,
            key: "prefs",
            scope: "crm",
            stateVersion: 3,
            updatedAt: "2026-03-22T00:00:00.000Z",
            state: { dark: true }
          }
        })
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({})
    };
  };

  const strategy = createApiPersistenceStrategy({
    baseUrl: "https://api.example.com/",
    fetcher,
    scope: "crm",
    stateVersion: 3
  });

  assert.deepEqual(await strategy.load("prefs"), { dark: true });
  await strategy.save("prefs", { dark: false });
  await strategy.clear("prefs");

  assert.equal(calls[0][0], "https://api.example.com/sg/persistence?key=prefs");
  assert.equal(calls[0][1], "GET");
  assert.equal(calls[1][0], "https://api.example.com/sg/persistence");
  assert.equal(calls[1][1], "POST");
  assert.match(String(calls[1][2]), /"scope":"crm"/);
  assert.match(String(calls[1][2]), /"stateVersion":3/);
  assert.match(String(calls[1][2]), /"state":\{"dark":false\}/);
  assert.equal(calls[2][0], "https://api.example.com/sg/persistence?key=prefs");
  assert.equal(calls[2][1], "DELETE");
});

test("createApiPersistenceStrategy throws deterministic errors for non-ok responses", async () => {
  const strategy = createApiPersistenceStrategy({
    baseUrl: "https://api.example.com",
    fetcher: async (_input, init) => ({
      ok: false,
      status: init?.method === "POST" ? 503 : init?.method === "DELETE" ? 500 : 404,
      json: async () => ({})
    }),
    scope: "crm",
    stateVersion: 1
  });

  await assert.rejects(() => strategy.load("prefs"), /SG persistence load failed \(404\)/);
  await assert.rejects(() => strategy.save("prefs", { dark: true }), /SG persistence save failed \(503\)/);
  await assert.rejects(() => strategy.clear("prefs"), /SG persistence clear failed \(500\)/);
});

test("createCompositePersistenceStrategy strict mode delegates only to the primary strategy", async () => {
  const calls = [];
  const strict = createCompositePersistenceStrategy({
    mode: "strict",
    primary: {
      load: async () => {
        calls.push("primary.load");
        return { ok: true };
      },
      save: async () => {
        calls.push("primary.save");
      },
      clear: async () => {
        calls.push("primary.clear");
      }
    },
    secondary: {
      load: async () => {
        calls.push("secondary.load");
        return { shouldNot: true };
      },
      save: async () => {
        calls.push("secondary.save");
      },
      clear: async () => {
        calls.push("secondary.clear");
      }
    }
  });

  assert.deepEqual(await strict.load("prefs"), { ok: true });
  await strict.save("prefs", { ok: true });
  await strict.clear("prefs");
  assert.deepEqual(calls, ["primary.load", "primary.save", "primary.clear"]);
});
