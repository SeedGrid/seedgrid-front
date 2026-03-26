import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom, dispatchMouse, dispatchKeyboard, setElementRect } from "./dom-harness.mjs";

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

const { SgDialog, SgPopup } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function DialogHarness(props = {}) {
  const [open, setOpen] = React.useState(false);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true)
      },
      "Open dialog"
    ),
    React.createElement(
      SgDialog,
      {
        open,
        onOpenChange: setOpen,
        title: "Example dialog",
        closeOnEsc: true,
        restoreFocus: true,
        ...props
      },
      React.createElement("button", { type: "button", "data-sg-dialog-initial-focus": true }, "Primary action")
    )
  );
}

function PopupHarness(props = {}) {
  const [open, setOpen] = React.useState(false);
  const [actions, setActions] = React.useState([]);
  const anchorRef = React.useRef(null);

  React.useEffect(() => {
    setActions([
      {
        label: "Archive",
        onClick: () => props.onAction?.("archive")
      }
    ]);
  }, [props]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "button",
      {
        ref: anchorRef,
        type: "button",
        onClick: () => setOpen(true)
      },
      "Open popup"
    ),
    React.createElement(SgPopup, {
      open,
      onOpenChange: setOpen,
      anchorRef,
      title: "Quick actions",
      actions,
      ...props
    })
  );
}

test("SgDialog closes on Escape and restores focus to the trigger", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(React.createElement(DialogHarness));
    await flushDom();

    const trigger = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Open dialog"
    );
    assert.ok(trigger);

    await dispatchMouse(trigger, "click");
    await flushDom();
    await flushDom();

    const dialog = harness.document.querySelector('[role="dialog"][aria-modal="true"]');
    assert.ok(dialog);

    const primaryAction = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Primary action"
    );
    assert.ok(primaryAction);
    assert.equal(harness.document.activeElement, primaryAction);

    await dispatchKeyboard(harness.document, "keydown", { key: "Escape" });
    await flushDom();
    await flushDom();

    assert.equal(harness.document.querySelector('[role="dialog"][aria-modal="true"]'), null);
    assert.equal(harness.document.activeElement, trigger);
  } finally {
    harness.restore();
  }
});

test("SgPopup opens from the anchor and closes after an action click", async () => {
  const harness = setupDomHarness();
  try {
    const actions = [];
    await harness.render(React.createElement(PopupHarness, { onAction: (id) => actions.push(id) }));
    await flushDom();

    const trigger = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Open popup"
    );
    assert.ok(trigger);
    setElementRect(trigger, { left: 120, top: 80, width: 100, height: 36 });

    await dispatchMouse(trigger, "click");
    await flushDom();
    await flushDom();

    const popup = harness.document.querySelector('[role="dialog"][aria-modal="false"]');
    assert.ok(popup);
    setElementRect(popup, { left: 120, top: 124, width: 180, height: 80 });

    const archiveAction = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Archive"
    );
    assert.ok(archiveAction);

    await dispatchMouse(archiveAction, "click");
    await flushDom();
    await flushDom();

    assert.deepEqual(actions, ["archive"]);
    assert.equal(harness.document.querySelector('[role="dialog"][aria-modal="false"]'), null);
  } finally {
    harness.restore();
  }
});
