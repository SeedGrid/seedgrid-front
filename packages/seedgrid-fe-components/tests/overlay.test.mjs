import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const srcDir = join(process.cwd(), "src");

function readSource(relativePath) {
  return readFileSync(join(srcDir, relativePath), "utf8");
}

test("SgConfirmationDialog routes default action labels through shared i18n keys", () => {
  const source = readSource("overlay/SgConfirmationDialog.tsx");

  assert.match(source, /t\(i18n, "components\.actions\.cancel"\)/);
  assert.match(source, /t\(i18n, "components\.actions\.confirm"\)/);
});

test("SgConfirmationDialog does not hardcode default button text values", () => {
  const source = readSource("overlay/SgConfirmationDialog.tsx");

  assert.doesNotMatch(source, /cancelLabel\s*=\s*[^\n]*"Cancel"/);
  assert.doesNotMatch(source, /confirmLabel\s*=\s*[^\n]*"Confirm"/);
});
test("SgDialog routes the default aria-label through shared i18n keys", () => {
  const source = readSource("overlay/SgDialog.tsx");

  assert.match(source, /t\(i18n, "components\.dialog\.ariaLabel"\)/);
  assert.doesNotMatch(source, /\?\? "Dialog"/);
});

test("SgPopup routes the default aria-label through shared i18n keys", () => {
  const source = readSource("overlay/SgPopup.tsx");

  assert.match(source, /t\(i18n, "components\.popup\.ariaLabel"\)/);
  assert.match(source, /aria-label=\{resolvedAriaLabel\}/);
});
