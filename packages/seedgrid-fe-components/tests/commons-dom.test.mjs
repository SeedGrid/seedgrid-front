import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
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

const {
  SgWhistleHost,
  sgWhistle,
  dismissSgWhistle
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

test("SgWhistleHost renders visible whistles in flow and respects max with newestOnTop", async () => {
  const harness = setupDomHarness();

  try {
    dismissSgWhistle();
    await harness.render(
      React.createElement(SgWhistleHost, {
        max: 1,
        newestOnTop: true,
        gap: 16,
        "data-testid": "host"
      })
    );

    await act(async () => {
      sgWhistle.info({ title: "First", message: "Older" });
      sgWhistle.success({ title: "Second", message: "Newer" });
    });
    await flushDom();

    const host = harness.document.querySelector('[data-testid="host"]');
    assert.ok(host);
    assert.equal(host.style.gap, "16px");
    assert.equal(harness.document.body.textContent.includes("Older"), false);
    assert.equal(harness.document.body.textContent.includes("Newer"), true);
  } finally {
    dismissSgWhistle();
    harness.restore();
  }
});

test("SgWhistleHost supports custom rendering, action dismissal and timed close", async () => {
  const harness = setupDomHarness();
  let actionCalls = 0;
  let closeCalls = 0;

  try {
    dismissSgWhistle();
    await harness.render(React.createElement(SgWhistleHost, null));

    await act(async () => {
      sgWhistle.custom(
        () => React.createElement("strong", null, "Custom whistle"),
        { message: "unused", dismissible: false }
      );
    });
    await flushDom();
    assert.equal(harness.document.body.textContent.includes("Custom whistle"), true);

    await act(async () => {
      sgWhistle.warning({
        message: "Undoable",
        action: {
          label: "Undo",
          onClick: () => {
            actionCalls += 1;
          }
        }
      });
    });
    await flushDom();

    const undo = Array.from(harness.document.querySelectorAll("button")).find((button) => button.textContent === "Undo");
    assert.ok(undo);
    await dispatchMouse(undo, "click");
    await flushDom();

    assert.equal(actionCalls, 1);
    assert.equal(harness.document.body.textContent.includes("Undoable"), false);

    await act(async () => {
      sgWhistle.show({
        message: "Auto close",
        duration: 20,
        onClose: () => {
          closeCalls += 1;
        }
      });
    });
    await flushDom();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 40));
    });
    await flushDom();

    assert.equal(harness.document.body.textContent.includes("Auto close"), false);
    assert.equal(closeCalls, 1);
  } finally {
    dismissSgWhistle();
    harness.restore();
  }
});
