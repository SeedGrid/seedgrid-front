import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom, dispatchMouse, dispatchInput, dispatchPointer, setElementRect } from "./dom-harness.mjs";

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

const { SgClockThemeProvider, SgClockThemePicker, SgLinearGauge, SgRadialGauge } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

const themes = [
  { id: "classic", label: "Classic", tags: ["default", "clean"] },
  { id: "modern-dark", label: "Modern Dark", tags: ["dark", "contrast"] },
  { id: "retro", label: "Retro", tags: ["vintage"] }
];

function StatefulClockThemePicker(props) {
  const [value, setValue] = React.useState(props.initialValue ?? "classic");

  return React.createElement(SgClockThemePicker, {
    value,
    onChange: (next) => {
      setValue(next);
      props.onThemeChange?.(next);
    },
    ...props
  });
}

function buildClockThemePicker(props = {}) {
  return React.createElement(
    SgClockThemeProvider,
    { value: { themes } },
    React.createElement(StatefulClockThemePicker, props)
  );
}

test("SgClockThemePicker opens the rendered listbox and selects a theme option", async () => {
  const harness = setupDomHarness();
  try {
    const changes = [];
    await harness.render(buildClockThemePicker({ onThemeChange: (next) => changes.push(next) }));
    await flushDom();

    const toggle = harness.document.querySelector('button[aria-haspopup="listbox"]');
    assert.ok(toggle);
    assert.equal(toggle.getAttribute("aria-expanded"), "false");

    await dispatchMouse(toggle, "click");
    await flushDom();

    const listbox = harness.document.querySelector('[role="listbox"]');
    assert.ok(listbox);
    assert.equal(toggle.getAttribute("aria-expanded"), "true");

    const retroOption = Array.from(harness.document.querySelectorAll('[role="option"]')).find(
      (node) => node.textContent?.includes("Retro")
    );
    assert.ok(retroOption);

    await dispatchMouse(retroOption, "click");
    await flushDom();

    assert.deepEqual(changes, ["retro"]);
    assert.equal(harness.document.querySelector('[role="listbox"]'), null);
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    assert.match(toggle.textContent ?? "", /Retro/i);
  } finally {
    harness.restore();
  }
});

test("SgClockThemePicker filters rendered options through the search input", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(buildClockThemePicker({ defaultOpen: true }));
    await flushDom();

    const searchInput = harness.document.querySelector('input#sg-clock-theme-search');
    assert.ok(searchInput);

    await dispatchInput(searchInput, "retro");
    await flushDom();
    await flushDom();

    const options = Array.from(harness.document.querySelectorAll('[role="option"]'));
    assert.equal(options.length, 1);
    assert.match(options[0].textContent ?? "", /Retro/i);

    await dispatchInput(searchInput, "missing-theme");
    await flushDom();
    await flushDom();

    assert.equal(harness.document.querySelectorAll('[role="option"]').length, 0);
    assert.match(harness.document.body.textContent ?? "", /No themes found/i);
  } finally {
    harness.restore();
  }
});
function StatefulLinearGauge(props) {
  const [value, setValue] = React.useState(props.defaultValue ?? 20);

  return React.createElement(SgLinearGauge, {
    min: 0,
    max: 100,
    width: 360,
    height: 120,
    primaryPointerDraggable: true,
    value,
    onValueChange: (next) => {
      setValue(next);
      props.onGaugeChange?.(next);
    },
    ...props
  });
}

function StatefulRadialGauge(props) {
  const [value, setValue] = React.useState(props.defaultValue ?? 20);

  return React.createElement(SgRadialGauge, {
    min: 0,
    max: 100,
    width: 300,
    height: 300,
    startAngle: 180,
    endAngle: 0,
    primaryPointerDraggable: true,
    value,
    onValueChange: (next) => {
      setValue(next);
      props.onGaugeChange?.(next);
    },
    ...props
  });
}

test("SgLinearGauge updates the rendered value through pointer drag", async () => {
  const harness = setupDomHarness();
  try {
    const changes = [];
    await harness.render(React.createElement(StatefulLinearGauge, { onGaugeChange: (next) => changes.push(next) }));
    await flushDom();

    const meter = harness.document.querySelector('[role="meter"]');
    assert.ok(meter);
    const svg = meter.querySelector('svg');
    assert.ok(svg);
    setElementRect(svg, { left: 0, top: 0, width: 360, height: 120 });

    const pointer = svg.querySelector('g.cursor-pointer');
    assert.ok(pointer);

    await dispatchPointer(pointer, "pointerdown", { button: 0, clientX: 85, clientY: 80 });
    await dispatchPointer(harness.window, "pointermove", { clientX: 300, clientY: 80 });
    await dispatchPointer(harness.window, "pointerup", { clientX: 300, clientY: 80 });
    await flushDom();

    const currentValue = Number(meter.getAttribute('aria-valuenow'));
    assert.ok(Number.isFinite(currentValue));
    assert.ok(currentValue > 20);
    assert.ok(changes.length > 0);
    assert.ok(changes.at(-1) > 20);
  } finally {
    harness.restore();
  }
});

test("SgRadialGauge updates the rendered value through pointer drag", async () => {
  const harness = setupDomHarness();
  try {
    const changes = [];
    await harness.render(React.createElement(StatefulRadialGauge, { onGaugeChange: (next) => changes.push(next) }));
    await flushDom();

    const meter = harness.document.querySelector('[role="meter"]');
    assert.ok(meter);
    const svg = meter.querySelector('svg');
    assert.ok(svg);
    setElementRect(svg, { left: 0, top: 0, width: 300, height: 300 });

    const pointer = svg.querySelector('g.cursor-pointer');
    assert.ok(pointer);

    await dispatchPointer(pointer, "pointerdown", { button: 0, clientX: 60, clientY: 150 });
    await dispatchPointer(harness.window, "pointermove", { clientX: 250, clientY: 150 });
    await dispatchPointer(harness.window, "pointerup", { clientX: 250, clientY: 150 });
    await flushDom();

    const currentValue = Number(meter.getAttribute('aria-valuenow'));
    assert.ok(Number.isFinite(currentValue));
    assert.notEqual(currentValue, 20);
    assert.ok(changes.length > 0);
    assert.notEqual(changes.at(-1), 20);
  } finally {
    harness.restore();
  }
});