import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom, dispatchMouse } from "./dom-harness.mjs";

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

const { SgEnvironmentProvider, useSgPersistentState } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function PersistentProbe(props) {
  const state = useSgPersistentState({
    baseKey: props.baseKey,
    defaultValue: props.defaultValue
  });

  return React.createElement(
    "div",
    null,
    React.createElement("span", { "data-testid": "hydrated" }, String(state.hydrated)),
    React.createElement("span", { "data-testid": "value" }, String(state.value)),
    React.createElement(
      "button",
      { type: "button", onClick: () => state.setValue((prev) => prev + 1) },
      "Increment"
    ),
    React.createElement(
      "button",
      { type: "button", onClick: () => void state.clear() },
      "Clear"
    )
  );
}

test("useSgPersistentState hydrates from localStorage and persists rendered updates", async () => {
  const harness = setupDomHarness();
  try {
    harness.window.localStorage.setItem("prefs", JSON.stringify(2));

    await harness.render(React.createElement(PersistentProbe, { baseKey: "prefs", defaultValue: 0 }));
    await flushDom();

    const valueNode = harness.document.querySelector('[data-testid="value"]');
    const hydratedNode = harness.document.querySelector('[data-testid="hydrated"]');
    assert.ok(valueNode);
    assert.ok(hydratedNode);
    assert.equal(hydratedNode.textContent, "true");
    assert.equal(valueNode.textContent, "2");

    const increment = Array.from(harness.document.querySelectorAll("button")).find((button) => button.textContent === "Increment");
    assert.ok(increment);
    await dispatchMouse(increment, "click");
    await flushDom();

    assert.equal(valueNode.textContent, "3");
    assert.equal(harness.window.localStorage.getItem("prefs"), "3");

    const clear = Array.from(harness.document.querySelectorAll("button")).find((button) => button.textContent === "Clear");
    assert.ok(clear);
    await dispatchMouse(clear, "click");
    await flushDom();

    assert.equal(valueNode.textContent, "0");
    assert.equal(harness.window.localStorage.getItem("prefs"), "0");
  } finally {
    harness.restore();
  }
});

test("useSgPersistentState uses provider persistence strategy during rendered hydration and clear", async () => {
  const harness = setupDomHarness();
  const calls = [];
  let saved = null;
  const strategy = {
    load: async (key) => {
      calls.push(["load", key]);
      return 5;
    },
    save: async (key, value) => {
      calls.push(["save", key, value]);
      saved = value;
    },
    clear: async (key) => {
      calls.push(["clear", key]);
      saved = null;
    }
  };

  try {
    await harness.render(
      React.createElement(
        SgEnvironmentProvider,
        {
          value: {
            persistenceStrategy: strategy,
            namespaceProvider: { getNamespace: () => "tenant-a" }
          }
        },
        React.createElement(PersistentProbe, { baseKey: "prefs", defaultValue: 0 })
      )
    );
    await flushDom();

    const valueNode = harness.document.querySelector('[data-testid="value"]');
    assert.ok(valueNode);
    assert.equal(valueNode.textContent, "5");
    assert.deepEqual(calls[0], ["load", "sg:tenant-a:app:unknown:prefs"]);

    const increment = Array.from(harness.document.querySelectorAll("button")).find((button) => button.textContent === "Increment");
    assert.ok(increment);
    await dispatchMouse(increment, "click");
    await flushDom();

    assert.equal(valueNode.textContent, "6");
    assert.equal(saved, 6);
    assert.ok(
      calls.some(
        (entry) =>
          entry[0] === "save" &&
          entry[1] === "sg:tenant-a:app:unknown:prefs" &&
          entry[2] === 6
      )
    );

    const clear = Array.from(harness.document.querySelectorAll("button")).find((button) => button.textContent === "Clear");
    assert.ok(clear);
    await dispatchMouse(clear, "click");
    await flushDom();

    assert.equal(valueNode.textContent, "0");
    assert.ok(
      calls.some(
        (entry) =>
          entry[0] === "clear" &&
          entry[1] === "sg:tenant-a:app:unknown:prefs"
      )
    );
  } finally {
    harness.restore();
  }
});