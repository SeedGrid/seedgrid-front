import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const baseDir = join(process.cwd(), "src", "inputs");

function read(name) {
  return readFileSync(join(baseDir, name), "utf8");
}

test("SgAutocomplete preserves register and control integration paths", () => {
  const source = read("SgAutocomplete.tsx");
  assert.match(source, /rules=\{resolvedRules\}/);
  assert.match(source, /register=\{register\}/);
  assert.match(source, /name=\{name\}/);
});

test("SgInputTextArea preserves register and control integration paths", () => {
  const source = read("SgInputTextArea.tsx");
  assert.match(source, /register\(name, resolvedRules\)/);
  assert.match(source, /rules=\{resolvedRules\}/);
  assert.match(source, /name=\{name\}/);
});

test("SgInputSelect preserves register and control integration paths", () => {
  const source = read("SgInputSelect.tsx");
  assert.match(source, /register\(name, rules\)/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /name=\{name\}/);
});


test("SgSlider preserves register and control integration paths", () => {
  const source = read("SgSlider.tsx");
  assert.match(source, /register\(name, rules\)/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /resolveFieldError/);
});

test("SgStepperInput preserves register and control integration paths", () => {
  const source = read("SgStepperInput.tsx");
  assert.match(source, /register\(name, rules\)/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /resolveFieldError/);
});

test("SgTextEditor preserves control integration path", () => {
  const source = read("SgTextEditor.tsx");
  assert.match(source, /control && name/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /resolveFieldError/);
});

test("SgCombobox preserves control integration path", () => {
  const source = read("SgCombobox.tsx");
  assert.match(source, /control && name/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /resolveFieldError/);
});

test("SgOrderList preserves control integration path", () => {
  const source = read("SgOrderList.tsx");
  assert.match(source, /control && name/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /resolveFieldError/);
});

test("SgPickList preserves control integration path", () => {
  const source = read("SgPickList.tsx");
  assert.match(source, /control && name/);
  assert.match(source, /rules=\{rules\}/);
  assert.match(source, /resolveFieldError/);
});
