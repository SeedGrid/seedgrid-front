import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { useForm } from "react-hook-form";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

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

const { SgAutocomplete, SgInputPhone, SgInputText } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function ControlledAutocomplete(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgAutocomplete, {
    id: "autocomplete-native-input",
    label: "Autocomplete",
    placeholder: "Type here",
    value,
    onChange: setValue,
    source: (query) => [
      { id: "query", label: query || "empty", value: query || "empty" },
      { id: "abacaxi", label: "Abacaxi", value: "Abacaxi" }
    ],
    minLengthForSearch: 0,
    openOnFocus: true,
    showDropDownButton: true,
    ...props
  });
}

function ControlledInputText(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgInputText, {
    id: "input-text-native-input",
    label: "Input text",
    placeholder: "Type here",
    inputProps: {
      value,
      onChange: (event) => setValue(event.currentTarget.value)
    },
    ...props
  });
}

function RhfControlledInputText(props = {}) {
  const { control } = useForm({
    defaultValues: {
      text: ""
    }
  });

  return React.createElement(SgInputText, {
    id: "input-text-rhf-input",
    name: "text",
    control,
    label: "Input text",
    placeholder: "Type here",
    ...props
  });
}

function ControlledInputPhone(props = {}) {
  const [value, setValue] = React.useState("");

  return React.createElement(SgInputPhone, {
    id: "input-phone-native-input",
    label: "Phone",
    required: true,
    inputProps: {
      value,
      onChange: (event) => setValue(event.currentTarget.value)
    },
    ...props
  });
}

test("SgAutocomplete keeps the typed value when native input events drive the field", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledAutocomplete));
    await flushDom();

    const input = harness.document.querySelector('input#autocomplete-native-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        input.dispatchEvent(
          new harness.window.InputEvent("beforeinput", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    assert.equal(input.value, word);
  } finally {
    harness.restore();
  }
});

test("SgInputText keeps the typed value when controlled through inputProps.value", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledInputText));
    await flushDom();

    const input = harness.document.querySelector('input#input-text-native-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        input.dispatchEvent(
          new harness.window.InputEvent("beforeinput", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    assert.equal(input.value, word);
  } finally {
    harness.restore();
  }
});

test("SgInputText keeps the typed value when controlled through react-hook-form", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(RhfControlledInputText));
    await flushDom();

    const input = harness.document.querySelector('input#input-text-rhf-input');
    assert.ok(input);

    await act(async () => {
      input.focus();
    });
    await flushDom();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value");
    assert.ok(descriptor?.set);

    const word = "Abacaxi";
    for (const ch of word) {
      await act(async () => {
        const previous = input.value;
        input.dispatchEvent(new harness.window.KeyboardEvent("keydown", { key: ch, bubbles: true, cancelable: true }));
        input.dispatchEvent(
          new harness.window.InputEvent("beforeinput", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        descriptor.set.call(input, previous + ch);
        input._valueTracker?.setValue?.(previous);
        input.dispatchEvent(
          new harness.window.InputEvent("input", {
            data: ch,
            inputType: "insertText",
            bubbles: true,
            cancelable: true
          })
        );
        input.dispatchEvent(new harness.window.KeyboardEvent("keyup", { key: ch, bubbles: true, cancelable: true }));
      });

      await flushDom();
    }

    assert.equal(input.value, word);
  } finally {
    harness.restore();
  }
});

test("SgInputPhone shows the required asterisk when required is true", async () => {
  const harness = setupDomHarness();

  try {
    await harness.render(React.createElement(ControlledInputPhone));
    await flushDom();

    const label = harness.document.querySelector('label[for="input-phone-native-input"]');
    assert.ok(label);
    assert.match(label.textContent ?? "", /Phone\s*\*/);
  } finally {
    harness.restore();
  }
});
