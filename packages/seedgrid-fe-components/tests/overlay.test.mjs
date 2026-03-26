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

test("SgConfirmationDialog keeps cancel and confirm close behavior enabled by default", () => {
  const source = readSource("overlay/SgConfirmationDialog.tsx");

  assert.match(source, /closeOnCancel = true/);
  assert.match(source, /closeOnConfirm = true/);
  assert.match(source, /if \(closeOnCancel\) setOpen\(false\)/);
  assert.match(source, /if \(closeOnConfirm\) setOpen\(false\)/);
});

test("SgConfirmationDialog routes dialog dismissals through the shared cancel flow", () => {
  const source = readSource("overlay/SgConfirmationDialog.tsx");

  assert.match(source, /if \(!next && open\) {\s*fireCancel\(\);/s);
  assert.match(source, /onOpenChange=\{handleDialogOpenChange\}/);
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


test("SgDialog routes the close button aria-label through shared i18n keys", () => {
  const source = readSource("overlay/SgDialog.tsx");

  assert.match(source, /aria-label=\{t\(i18n, "components\.dialog\.close"\)\}/);
  assert.doesNotMatch(source, /aria-label="Close"/);
});

test("SgDialog keeps Escape and overlay-click close behavior enabled by default", () => {
  const source = readSource("overlay/SgDialog.tsx");

  assert.match(source, /closeOnOverlayClick = true/);
  assert.match(source, /closeOnEsc = true/);
  assert.match(source, /if \(e\.target === overlayRef\.current\) close\(\)/);
  assert.match(source, /if \(e\.key === "Escape"\)/);
});

test("SgPopup prefers the title before falling back to the shared aria-label key", () => {
  const source = readSource("overlay/SgPopup.tsx");

  assert.match(source, /const resolvedAriaLabel = title \?\? t\(i18n, "components\.popup\.ariaLabel"\)/);
});

test("SgPopup keeps outside-click and Escape close behavior enabled by default", () => {
  const source = readSource("overlay/SgPopup.tsx");

  assert.match(source, /closeOnOutsideClick = true/);
  assert.match(source, /closeOnEscape = true/);
  assert.match(source, /if \(!closeOnOutsideClick\) return;/);
  assert.match(source, /if \(!closeOnEscape\) return;/);
});
