import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom, dispatchMouse, dispatchPointer, dispatchKeyboard, dispatchInput, dispatchBlur, setElementRect } from "./dom-harness.mjs";

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

const { SgDockMenu, SgToolBar, SgMenu, SgWizard, SgWizardPage, SgSplitButton, SgFloatActionButton, SgExpandablePanel, SgTreeView } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function buildDock(props = {}) {
  return React.createElement(SgDockMenu, {
    id: "main-dock",
    dragId: "main-dock",
    enableDragDrop: true,
    items: [{ id: "home", label: "Home", icon: React.createElement("span", null, "H") }],
    ...props
  });
}

function buildToolbar(props = {}) {
  const { children = React.createElement("div", null, "Toolbar body"), ...rest } = props;
  return React.createElement(
    SgToolBar,
    {
      id: "main-toolbar",
      title: "Main toolbar",
      freeDrag: true,
      draggable: true,
      collapsible: true,
      ...rest
    },
    children
  );
}

function buildSearchMenu(props = {}) {
  return React.createElement(SgMenu, {
    id: "main-menu-search",
    menuVariantStyle: "panel",
    search: { enabled: true, placeholder: "Find menu" },
    menu: [
      { id: "dashboard", label: "Dashboard", url: "/dashboard" },
      {
        id: "settings",
        label: "Settings",
        children: [
          { id: "security", label: "Security", url: "/settings/security" },
          { id: "billing", label: "Billing", url: "/settings/billing" }
        ]
      }
    ],
    ...props
  });
}

function buildKeyboardMenu(props = {}) {
  return React.createElement(SgMenu, {
    id: "main-menu-keyboard",
    menuVariantStyle: "panel",
    menu: [
      {
        id: "settings",
        label: "Settings",
        children: [
          { id: "security", label: "Security", url: "/settings/security" },
          { id: "billing", label: "Billing", url: "/settings/billing" }
        ]
      }
    ],
    ...props
  });
}



function buildFab(props = {}) {
  return React.createElement(SgFloatActionButton, {
    hint: "Quick actions",
    dragId: "main-fab",
    enableDragDrop: true,
    actions: [
      { label: "Edit", icon: React.createElement("span", null, "E"), onClick: () => props.onActionClick?.("edit") }
    ],
    ...props
  });
}
function buildSplitButton(props = {}) {
  return React.createElement(SgSplitButton, {
    label: "Actions",
    items: [
      { label: "Edit", onClick: () => props.onItemClick?.("edit") },
      { label: "Archive", onClick: () => props.onItemClick?.("archive") }
    ],
    ...props
  });
}

function WizardValidationField(props) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(null);

  return React.createElement(
    "div",
    null,
    React.createElement("input", {
      id: props.id,
      value,
      onFocus: () => props.onFocusInput?.(),
      onBlur: () => {
        props.onBlurInput?.();
        setError(value.trim() ? null : "Required field");
      },
      onChange: (event) => setValue(event.currentTarget.value)
    }),
    error ? React.createElement("p", { "data-sg-error": true }, error) : null
  );
}

function buildWizardWithValidation(props = {}) {
  return React.createElement(
    SgWizard,
    {
      onFinish: async () => {},
      stepper: "numbered",
      ...props
    },
    React.createElement(
      SgWizardPage,
      { title: "Account" },
      React.createElement(WizardValidationField, {
        id: "wizard-required-field",
        onFocusInput: props.onFocusInput,
        onBlurInput: props.onBlurInput
      })
    ),
    React.createElement(SgWizardPage, { title: "Profile" }, React.createElement("div", null, "Profile step"))
  );
}
function buildWizard(props = {}) {
  return React.createElement(
    SgWizard,
    {
      onFinish: async () => {},
      stepper: "numbered",
      ...props
    },
    React.createElement(SgWizardPage, { title: "Account" }, React.createElement("div", null, "Account step")),
    React.createElement(SgWizardPage, { title: "Profile" }, React.createElement("div", null, "Profile step")),
    React.createElement(SgWizardPage, { title: "Review" }, React.createElement("div", null, "Review step"))
  );
}

function buildExpandablePanel(props = {}) {
  return React.createElement(
    SgExpandablePanel,
    {
      defaultOpen: true,
      expandTo: "right",
      mode: "inline",
      resizable: true,
      size: { default: 320, min: 180, max: 480 },
      header: "Filters",
      animation: { type: "none" },
      ...props
    },
    React.createElement("div", null, "Panel body")
  );
}

function buildOverlayExpandablePanel(props = {}) {
  return React.createElement(
    SgExpandablePanel,
    {
      defaultOpen: true,
      expandTo: "right",
      mode: "overlay",
      closeOnEsc: true,
      animation: { type: "none" },
      ...props
    },
    React.createElement("button", { type: "button" }, "First action"),
    React.createElement("button", { type: "button" }, "Second action")
  );
}

function buildTreeView(props = {}) {
  return React.createElement(SgTreeView, {
    searchable: true,
    checkable: true,
    defaultExpandedIds: ["settings"],
    searchPlaceholder: "Search tree",
    nodes: [
      { id: "dashboard", label: "Dashboard" },
      {
        id: "settings",
        label: "Settings",
        children: [
          { id: "security", label: "Security" },
          { id: "billing", label: "Billing" }
        ]
      }
    ],
    ...props
  });
}

test("SgDockMenu opens and confirms reset through the rendered context menu", async () => {
  const harness = setupDomHarness();
  try {
    const storageKey = "sg-dockmenu-pos:main-dock:viewport";
    harness.window.localStorage.setItem(storageKey, JSON.stringify({ x: 120, y: 240 }));

    await harness.render(buildDock());
    const dock = harness.document.getElementById("main-dock");
    assert.ok(dock);
    setElementRect(dock, { left: 100, top: 100, width: 160, height: 64 });

    await flushDom();
    await dispatchMouse(dock, "contextmenu", { button: 2, clientX: 110, clientY: 110 });

    assert.match(harness.document.body.textContent ?? "", /Reset position/i);

    const confirmButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Confirm"
    );
    assert.ok(confirmButton);

    await dispatchMouse(confirmButton, "click");
    await flushDom();

    assert.equal(harness.window.localStorage.getItem(storageKey), null);
    assert.doesNotMatch(harness.document.body.textContent ?? "", /Reset position/i);
  } finally {
    harness.restore();
  }
});

test("SgDockMenu persists rendered drag interactions through localStorage", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildDock());
    const dock = harness.document.getElementById("main-dock");
    assert.ok(dock);
    setElementRect(dock, { left: 100, top: 100, width: 160, height: 64 });

    await dispatchPointer(dock, "pointerdown", { button: 0, clientX: 120, clientY: 130 });
    await dispatchPointer(harness.window, "pointermove", { clientX: 170, clientY: 190 });
    await dispatchPointer(harness.window, "pointerup", { clientX: 170, clientY: 190 });
    await flushDom();

    const storageKey = "sg-dockmenu-pos:main-dock:viewport";
    assert.equal(harness.window.localStorage.getItem(storageKey), JSON.stringify({ x: 150, y: 160 }));
    assert.equal(dock.style.left, "150px");
    assert.equal(dock.style.top, "160px");
  } finally {
    harness.restore();
  }
});

test("SgToolBar toggles rendered content and notifies collapsed changes", async () => {
  const harness = setupDomHarness();
  try {
    const collapsedChanges = [];
    await harness.render(buildToolbar({
      defaultCollapsed: true,
      onCollapsedChange: (next) => collapsedChanges.push(next),
      children: React.createElement("div", null, "Toolbar body")
    }));

    assert.doesNotMatch(harness.document.body.textContent ?? "", /Toolbar body/i);

    const toggle = harness.document.querySelector('button[aria-label="Toggle toolbar"]');
    assert.ok(toggle);

    await dispatchMouse(toggle, "click");
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Toolbar body/i);
    assert.deepEqual(collapsedChanges, [false]);

    await dispatchMouse(toggle, "click");
    await flushDom();

    assert.doesNotMatch(harness.document.body.textContent ?? "", /Toolbar body/i);
    assert.deepEqual(collapsedChanges, [false, true]);
  } finally {
    harness.restore();
  }
});

test("SgToolBar persists rendered free-drag interactions through localStorage", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildToolbar());
    const toolbar = harness.document.querySelector('[data-sg-toolbar-id="main-toolbar"]');
    assert.ok(toolbar);
    setElementRect(toolbar, { left: 50, top: 60, width: 120, height: 48 });

    await dispatchPointer(toolbar, "pointerdown", { button: 0, clientX: 70, clientY: 80 });
    await dispatchPointer(harness.window, "pointermove", { clientX: 130, clientY: 150 });
    await dispatchPointer(harness.window, "pointerup", { clientX: 130, clientY: 150 });
    await flushDom();

    const storageKey = "sg-toolbar-pos:main-toolbar";
    assert.equal(harness.window.localStorage.getItem(storageKey), JSON.stringify({ x: 110, y: 130 }));
    assert.equal(toolbar.style.left, "110px");
    assert.equal(toolbar.style.top, "130px");
  } finally {
    harness.restore();
  }
});

test("SgMenu supports rendered keyboard navigation and activation", async () => {
  const harness = setupDomHarness();
  try {
    const navigated = [];
    await harness.render(buildKeyboardMenu({ onNavigate: (node) => navigated.push(node.id) }));

    const navigation = harness.document.querySelector('[role="navigation"]');
    assert.ok(navigation);

    await dispatchKeyboard(navigation, "keydown", { key: "ArrowDown" });
    await flushDom();
    assert.equal(harness.document.activeElement?.getAttribute("data-sg-menu-node"), "settings");

    await dispatchKeyboard(navigation, "keydown", { key: "ArrowRight" });
    await flushDom();

    await dispatchKeyboard(navigation, "keydown", { key: "ArrowDown" });
    await flushDom();
    assert.equal(harness.document.activeElement?.getAttribute("data-sg-menu-node"), "security");

    await dispatchKeyboard(navigation, "keydown", { key: "Enter" });
    await flushDom();

    assert.deepEqual(navigated, ["security"]);
  } finally {
    harness.restore();
  }
});

test("SgWizard advances and goes back through rendered actions", async () => {
  const harness = setupDomHarness();
  try {
    const stepChanges = [];
    await harness.render(buildWizard({ onStepChange: (step) => stepChanges.push(step) }));

    assert.match(harness.document.body.textContent ?? "", /Account step/i);

    const nextButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Next"
    );
    assert.ok(nextButton);

    await dispatchMouse(nextButton, "click");
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Profile step/i);

    const previousButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Previous"
    );
    assert.ok(previousButton);

    await dispatchMouse(previousButton, "click");
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Account step/i);
    assert.deepEqual(stepChanges.slice(0, 3), [0, 1, 0]);
  } finally {
    harness.restore();
  }
});

test("SgWizard blocks next and finish when guards deny the rendered action", async () => {
  const harness = setupDomHarness();
  try {
    let finished = 0;
    await harness.render(buildWizard({
      initialStep: 1,
      onBeforeNext: async () => false,
      onBeforeFinish: async () => false,
      onFinish: async () => {
        finished += 1;
      }
    }));

    const nextButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Next"
    );
    assert.ok(nextButton);

    await dispatchMouse(nextButton, "click");
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Profile step/i);

    await dispatchMouse(nextButton, "click");
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Profile step/i);
    assert.equal(finished, 0);
  } finally {
    harness.restore();
  }
});




test("SgSplitButton opens the rendered menu and activates an item", async () => {
  const harness = setupDomHarness();
  try {
    const clicks = [];
    await harness.render(buildSplitButton({ onItemClick: (id) => clicks.push(id) }));

    const toggles = Array.from(harness.document.querySelectorAll('button[aria-haspopup="menu"]'));
    assert.equal(toggles.length, 1);

    await dispatchMouse(toggles[0], "click");
    await flushDom();

    const menu = harness.document.querySelector('[role="menu"]');
    assert.ok(menu);
    assert.equal(toggles[0].getAttribute("aria-expanded"), "true");

    const editItem = Array.from(harness.document.querySelectorAll('[role="menuitem"]')).find(
      (item) => item.textContent?.trim() === "Edit"
    );
    assert.ok(editItem);

    await dispatchMouse(editItem, "click");
    await flushDom();

    assert.deepEqual(clicks, ["edit"]);
    assert.equal(harness.document.querySelector('[role="menu"]'), null);
    assert.equal(toggles[0].getAttribute("aria-expanded"), "false");
  } finally {
    harness.restore();
  }
});

test("SgSplitButton closes the rendered menu on Escape", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildSplitButton());

    const toggle = harness.document.querySelector('button[aria-haspopup="menu"]');
    assert.ok(toggle);

    await dispatchMouse(toggle, "click");
    await flushDom();
    assert.ok(harness.document.querySelector('[role="menu"]'));

    await dispatchKeyboard(harness.document, "keydown", { key: "Escape" });
    await flushDom();

    assert.equal(harness.document.querySelector('[role="menu"]'), null);
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
  } finally {
    harness.restore();
  }
});
test("SgFloatActionButton persists rendered drag interactions through localStorage", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildFab());
    const fab = harness.document.querySelector('button[aria-label="Quick actions"]');
    assert.ok(fab);
    const container = fab.parentElement;
    assert.ok(container);
    setElementRect(container, { left: 80, top: 90, width: 56, height: 56 });

    await dispatchPointer(fab, "pointerdown", { button: 0, clientX: 100, clientY: 110 });
    await dispatchPointer(harness.window, "pointermove", { clientX: 170, clientY: 190 });
    await dispatchPointer(harness.window, "pointerup", { clientX: 170, clientY: 190 });
    await flushDom();

    const storageKey = "sg-fab-pos:main-fab";
    assert.equal(harness.window.localStorage.getItem(storageKey), JSON.stringify({ x: 150, y: 170 }));
    assert.equal(container.style.left, "150px");
    assert.equal(container.style.top, "170px");
  } finally {
    harness.restore();
  }
});

test("SgFloatActionButton opens the rendered reset popup and clears the stored position", async () => {
  const harness = setupDomHarness();
  try {
    const storageKey = "sg-fab-pos:main-fab";
    harness.window.localStorage.setItem(storageKey, JSON.stringify({ x: 140, y: 180 }));

    await harness.render(buildFab());
    await flushDom();

    const fab = harness.document.querySelector('button[aria-label="Quick actions"]');
    assert.ok(fab);
    const container = fab.parentElement;
    assert.ok(container);
    setElementRect(container, { left: 140, top: 180, width: 56, height: 56 });

    await dispatchMouse(fab, "contextmenu", { button: 2, clientX: 150, clientY: 190 });
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Reset position/i);

    const yesButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Yes"
    );
    assert.ok(yesButton);

    await dispatchMouse(yesButton, "click");
    await flushDom();

    assert.equal(harness.window.localStorage.getItem(storageKey), null);
    assert.equal(container.style.left, "");
    assert.equal(container.style.top, "");
    assert.doesNotMatch(harness.document.body.textContent ?? "", /Reset position/i);
  } finally {
    harness.restore();
  }
});
test("SgWizard focuses and blurs rendered inputs before blocking an invalid step", async () => {
  const harness = setupDomHarness();
  try {
    let focused = 0;
    let blurred = 0;
    await harness.render(
      buildWizardWithValidation({
        onFocusInput: () => {
          focused += 1;
        },
        onBlurInput: () => {
          blurred += 1;
        }
      })
    );
    await flushDom();

    const nextButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Next"
    );
    assert.ok(nextButton);

    await dispatchMouse(nextButton, "click");
    await flushDom();
    await flushDom();

    assert.ok(focused >= 1);
    assert.ok(blurred >= 1);
    assert.match(harness.document.body.textContent ?? "", /Required field/i);
    assert.doesNotMatch(harness.document.body.textContent ?? "", /Profile step/i);
  } finally {
    harness.restore();
  }
});

test("SgWizard advances after rendered validation errors are fixed", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildWizardWithValidation());
    await flushDom();

    const nextButton = Array.from(harness.document.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Next"
    );
    assert.ok(nextButton);

    await dispatchMouse(nextButton, "click");
    await flushDom();
    await flushDom();
    assert.match(harness.document.body.textContent ?? "", /Required field/i);

    const input = harness.document.querySelector('#wizard-required-field');
    assert.ok(input);
    await dispatchInput(input, "ok");
    await flushDom();
    await dispatchBlur(input);
    await flushDom();

    await dispatchMouse(nextButton, "click");
    await flushDom();
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Profile step/i);
    assert.doesNotMatch(harness.document.body.textContent ?? "", /Required field/i);
  } finally {
    harness.restore();
  }
});
test("SgMenu filters the rendered navigation tree from the search field", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildSearchMenu());
    await flushDom();

    const searchInput = harness.document.querySelector('input[placeholder="Find menu"]');
    assert.ok(searchInput);

    await dispatchInput(searchInput, "billing");
    await flushDom();
    await flushDom();

    const navigation = harness.document.querySelector('[role="navigation"]');
    assert.ok(navigation);
    assert.match(navigation.textContent ?? "", /Settings/i);
    assert.match(navigation.textContent ?? "", /Billing/i);
    assert.doesNotMatch(navigation.textContent ?? "", /Dashboard/i);
    assert.doesNotMatch(navigation.textContent ?? "", /Security/i);
  } finally {
    harness.restore();
  }
});

test("SgExpandablePanel resizes the rendered inline panel through the handle", async () => {
  const harness = setupDomHarness();
  try {
    const sizeChanges = [];
    await harness.render(buildExpandablePanel({ onSizeChange: (size) => sizeChanges.push(size) }));
    await flushDom();

    const panel = harness.document.querySelector('[role="region"]');
    assert.ok(panel);
    setElementRect(panel, { left: 0, top: 0, width: 320, height: 240 });

    const resizeHandle = panel.querySelector('[aria-hidden="true"]');
    assert.ok(resizeHandle);

    await dispatchPointer(resizeHandle, "pointerdown", { button: 0, clientX: 320, clientY: 24 });
    await dispatchPointer(harness.window, "pointermove", { clientX: 420, clientY: 24 });
    await dispatchPointer(harness.window, "pointerup", { clientX: 420, clientY: 24 });
    await flushDom();

    const wrapper = panel.parentElement;
    assert.ok(wrapper);
    assert.equal(wrapper.style.width, "420px");
    assert.deepEqual(sizeChanges, [420]);
  } finally {
    harness.restore();
  }
});

test("SgExpandablePanel closes the rendered overlay on Escape and focuses the first action", async () => {
  const harness = setupDomHarness();
  try {
    const openChanges = [];
    await harness.render(buildOverlayExpandablePanel({ onOpenChange: (open) => openChanges.push(open) }));
    await flushDom();
    await flushDom();

    const firstAction = Array.from(harness.document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === "First action"
    );
    assert.ok(firstAction);
    assert.equal(harness.document.activeElement, firstAction);

    await dispatchKeyboard(harness.document, "keydown", { key: "Escape" });
    await flushDom();
    await flushDom();

    assert.deepEqual(openChanges, [false]);
    assert.equal(
      Array.from(harness.document.querySelectorAll('button')).find((button) => button.textContent?.trim() === "First action"),
      undefined
    );
  } finally {
    harness.restore();
  }
});


test("SgTreeView filters the rendered nodes from the search field", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildTreeView());
    await flushDom();

    const searchInput = harness.document.querySelector('input[placeholder="Search tree"]');
    assert.ok(searchInput);

    await dispatchInput(searchInput, "billing");
    await flushDom();
    await flushDom();

    const tree = harness.document.body;
    assert.match(tree.textContent ?? "", /Settings/i);
    assert.match(tree.textContent ?? "", /Billing/i);
    assert.doesNotMatch(tree.textContent ?? "", /Dashboard/i);
    assert.doesNotMatch(tree.textContent ?? "", /Security/i);
  } finally {
    harness.restore();
  }
});

test("SgTreeView expands, collapses and clears rendered checked nodes", async () => {
  const harness = setupDomHarness();
  try {
    const checkedChanges = [];
    const expandedChanges = [];
    await harness.render(
      buildTreeView({
        defaultExpandedIds: [],
        defaultCheckedIds: ["billing"],
        onCheckedChange: (ids) => checkedChanges.push(ids),
        onExpandedChange: (ids) => expandedChanges.push(ids)
      })
    );
    await flushDom();

    assert.doesNotMatch(harness.document.body.textContent ?? "", /Billing/i);

    const expandAll = Array.from(harness.document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === "Expand all"
    );
    assert.ok(expandAll);
    await dispatchMouse(expandAll, "click");
    await flushDom();

    assert.match(harness.document.body.textContent ?? "", /Billing/i);

    const clear = Array.from(harness.document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === "Clear"
    );
    assert.ok(clear);
    await dispatchMouse(clear, "click");
    await flushDom();

    const collapseAll = Array.from(harness.document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === "Collapse all"
    );
    assert.ok(collapseAll);
    await dispatchMouse(collapseAll, "click");
    await flushDom();

    assert.deepEqual(checkedChanges.at(-1), []);
    assert.ok(expandedChanges.some((ids) => ids.includes("settings")));
    assert.deepEqual(expandedChanges.at(-1), []);
    assert.doesNotMatch(harness.document.body.textContent ?? "", /Billing/i);
  } finally {
    harness.restore();
  }
});
