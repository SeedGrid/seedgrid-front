import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const srcDir = join(process.cwd(), "src");
const i18nDir = join(srcDir, "i18n");

function readSource(relativePath) {
  return readFileSync(join(srcDir, relativePath), "utf8");
}

function readLocale(name) {
  return readFileSync(join(i18nDir, name), "utf8");
}

const localeFiles = ["en-US.ts", "pt-BR.ts", "pt-PT.ts", "es.ts", "fr.ts"];
const requiredKeys = [
  "components.actions.openList",
  "components.inputs.select.placeholder",
  "components.inputs.stepper.increase",
  "components.inputs.stepper.decrease",
  "components.textEditor.toolbar.bold",
  "components.textEditor.help.cssEmbedded",
  "components.textEditor.editorAriaLabel",
  "components.datatable.columnFilterPlaceholder",
  "components.menu.close",
  "components.toaster.close",
  "components.dialog.close",
  "components.popup.ariaLabel",
  "components.gadgets.clock.searchTheme",
  "components.gadgets.clock.digitalAria",
  "components.tree.selected",
  "components.menu.pin",
  "components.menu.ariaLabel",
  "components.toolbar.toggle",
  "components.expandablePanel.ariaLabel",
  "components.carousel.goToSlide",
  "components.dock.resetPosition",
  "components.dock.resetConfirm",
  "components.actions.open",
  "components.menu.drag",
  "components.wizard.progress",
  "components.wizard.step",
  "components.gadgets.calendar.previousMonth",
  "components.gadgets.calendar.nextMonth",
  "components.gadgets.calendar.goToday",
  "components.gadgets.qrcode.title",
  "components.gadgets.gauge.radialAria",
  "components.gadgets.gauge.linearAria",
  "components.gadgets.gauge.value",
  "components.inputs.otp.slot",
  "components.inputs.otp.group",
  "components.inputs.toggle.ariaLabel",
  "components.breadcrumb.ariaLabel",
  "components.breadcrumb.overflow",
  "components.pageControl.ariaLabel",
  "components.pageControl.empty"
];

test("locale bundles include the new shared i18n keys", () => {
  for (const file of localeFiles) {
    const source = readLocale(file);
    for (const key of requiredKeys) {
      assert.match(source, new RegExp(`"${key.replace(/\./g, "\\.")}"`));
    }
  }
});

test("components use translation helpers instead of hardcoded labels for patched UI strings", () => {
  const expectations = [
    ["inputs/SgAutocomplete.tsx", 't(i18n, "components.actions.openList")'],
    ["inputs/SgCombobox.tsx", 't(i18n, "components.actions.openList")'],
    ["inputs/SgInputSelect.tsx", 't(i18n, "components.inputs.select.placeholder")'],
    ["inputs/SgStepperInput.tsx", 't(i18n, "components.inputs.stepper.increase")'],
    ["inputs/SgStepperInput.tsx", 't(i18n, "components.inputs.stepper.decrease")'],
    ["inputs/SgTextEditor.tsx", 't(i18n, "components.textEditor.toolbar.bold")'],
    ["inputs/SgTextEditor.tsx", 't(i18n, "components.actions.save")'],
    ["inputs/SgTextEditor.tsx", 't(i18n, "components.textEditor.editorAriaLabel")'],
    ["commons/SgToaster.tsx", 't(i18n, "components.toaster.close")'],
    ["overlay/SgDialog.tsx", 't(i18n, "components.dialog.close")'],
    ["overlay/SgPopup.tsx", 't(i18n, "components.popup.ariaLabel")'],
    ["layout/SgMenu.tsx", 't(i18n, "components.menu.close")'],
    ["layout/SgMenu.tsx", 't(i18n, "components.menu.pin")'],
    ["layout/SgMenu.tsx", 't(i18n, "components.menu.ariaLabel")'],
    ["layout/SgCard.tsx", 't(i18n, "components.actions.collapse")'],
    ["buttons/SgSplitButton.tsx", 't(i18n, "components.actions.openList")'],
    ["buttons/SgFloatActionButton.tsx", 't(i18n, "components.actions.open")'],
    ["layout/SgToolBar.tsx", 't(i18n, "components.toolbar.toggle")'],
    ["layout/SgExpandablePanel.tsx", 't(i18n, "components.expandablePanel.ariaLabel")'],
    ["layout/SgCarousel.tsx", 't(i18n, "components.carousel.goToSlide", { slide: index + 1 })'],
    ["layout/SgBreadcrumb.tsx", 't(i18n, "components.breadcrumb.ariaLabel")'],
    ["layout/SgBreadcrumb.tsx", 't(i18n, "components.breadcrumb.overflow")'],
    ["layout/SgPageControl.tsx", 't(i18n, "components.pageControl.ariaLabel")'],
    ["layout/SgPageControl.tsx", 't(i18n, "components.pageControl.empty")'],
    ["menus/SgDockMenu.tsx", 't(i18n, "components.dock.resetPosition")'],
    ["menus/SgDockMenu.tsx", 't(i18n, "components.dock.resetConfirm")'],
    ["layout/SgMenu.tsx", 't(i18n, "components.menu.drag")'],
    ["layout/SgTreeView.tsx", 't(i18n, "components.actions.expandAll")'],
    ["layout/SgTreeView.tsx", 't(i18n, "components.tree.selected"'],
    ["gadgets/clock/themes/SgClockThemePicker.tsx", 't(i18n, "components.gadgets.clock.searchTheme")'],
    ["gadgets/clock/SgClock.tsx", 't(i18n, "components.gadgets.clock.digitalAria")'],
    ["wizard/SgWizard.tsx", 't(i18n, "components.wizard.progress")'],
    ["wizard/SgWizard.tsx", 't(i18n, "components.wizard.step", { step: i + 1 })'],
    ["gadgets/calendar/SgCalendar.tsx", 't(i18n, "components.gadgets.calendar.previousMonth")'],
    ["gadgets/calendar/SgCalendar.tsx", 't(i18n, "components.gadgets.calendar.goToday")'],
    ["gadgets/qr-code/SgQRCode.tsx", 't(i18n, "components.gadgets.qrcode.title")'],
    ["gadgets/gauge/SgRadialGauge.tsx", 't(i18n, "components.gadgets.gauge.radialAria")'],
    ["gadgets/gauge/SgRadialGauge.tsx", 't(i18n, "components.gadgets.gauge.value")'],
    ["gadgets/gauge/SgLinearGauge.tsx", 't(i18n, "components.gadgets.gauge.linearAria")'],
    ["gadgets/clock/themes/SgClockThemePicker.tsx", "value={q}"],
    ["gadgets/clock/themes/SgClockThemePicker.tsx", "onChange={setQ}"],
    ["inputs/SgPickList.tsx", 't(i18n, "components.actions.top")'],
    ["inputs/SgOrderList.tsx", 't(i18n, "components.orderlist.moveUp")'],
    ["inputs/SgPickList.tsx", 't(i18n, "components.picklist.moveToTarget")'],
    ["inputs/SgDatatable.tsx", 't(i18n, "components.datatable.columnFilterPlaceholder", { column: String(column.header ?? "") })'],
    ["inputs/SgInputOTP.tsx", 't(i18n, "components.inputs.otp.slot", { slot: slotIndex + 1 })'],
    ["inputs/SgInputOTP.tsx", 't(i18n, "components.inputs.otp.group")'],
    ["inputs/SgToggleSwitch.tsx", 't(i18n, "components.inputs.toggle.ariaLabel")']
  ];

  for (const [file, expected] of expectations) {
    const source = readSource(file);
    assert.match(source, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("patched components no longer contain the previous hardcoded labels", () => {
  const forbidden = [
    ["inputs/SgAutocomplete.tsx", "Abrir lista"],
    ["inputs/SgCombobox.tsx", "Abrir lista"],
    ["inputs/SgInputSelect.tsx", "Selecione"],
    ["inputs/SgStepperInput.tsx", "Increase value"],
    ["inputs/SgStepperInput.tsx", "Decrease value"],
    ["commons/SgToaster.tsx", "Close toast"],
    ["overlay/SgDialog.tsx", 'aria-label="Close"'],
    ["overlay/SgDialog.tsx", '?? "Dialog"'],
    ["overlay/SgPopup.tsx", '?? "Popup"'],
    ["layout/SgMenu.tsx", "Close menu"],
    ["layout/SgMenu.tsx", "Pin menu"],
    ["layout/SgMenu.tsx", 'ariaLabel = "Menu"'],
    ["buttons/SgFloatActionButton.tsx", 'hint ?? (open ? "Close" : "Open")'],
    ["layout/SgToolBar.tsx", 'aria-label="Toggle toolbar"'],
    ["layout/SgExpandablePanel.tsx", 'ariaLabel ?? "Expandable panel"'],
    ["layout/SgCarousel.tsx", "Go to slide"],
    ["layout/SgBreadcrumb.tsx", "ariaLabel = \"Breadcrumb\""],
    ["layout/SgBreadcrumb.tsx", "overflowLabel = \"Mais caminhos\""],
    ["layout/SgPageControl.tsx", "ariaLabel = \"Page control\""],
    ["layout/SgPageControl.tsx", "emptyMessage = \"No visible pages.\""],
    ["layout/SgMenu.tsx", "Drag menu"],
    ["layout/SgCard.tsx", "Recolher"],
    ["layout/SgCard.tsx", "Expandir"],
    ["layout/SgTreeView.tsx", "Collapse all"],
    ["gadgets/clock/themes/SgClockThemePicker.tsx", "No themes found."],
    ["gadgets/clock/SgClock.tsx", "Digital clock"],
    ["wizard/SgWizard.tsx", "Progress"],
    ["wizard/SgWizard.tsx", "Step ${i + 1}"],
    ["gadgets/calendar/SgCalendar.tsx", "Previous month"],
    ["gadgets/calendar/SgCalendar.tsx", "Go to today"],
    ["gadgets/qr-code/SgQRCode.tsx", "title=\"QR Code\""],
    ["gadgets/gauge/SgRadialGauge.tsx", ">Value<"],
    ["gadgets/gauge/SgLinearGauge.tsx", "Linear gauge"],
    ["gadgets/gauge/SgRadialGauge.tsx", "Radial gauge"],
    ["inputs/SgPickList.tsx", ">Top<"],
    ["inputs/SgTextEditor.tsx", "\"aria-label\": id"],
    ["inputs/SgTextEditor.tsx", "<html lang=\"pt-BR\">"],
    ["inputs/SgOrderList.tsx", "Move up"],
    ["inputs/SgOrderList.tsx", "No items available."],
    ["inputs/SgPickList.tsx", "Move selected to target"],
    ["inputs/SgPickList.tsx", "Search source"],
    ["inputs/SgDatatable.tsx", "Search in all columns"],
    ["inputs/SgDatatable.tsx", "Rows per page"],
    ["inputs/SgDatatable.tsx", 'Filter ${String(column.header ?? "")}'],
    ["inputs/SgInputOTP.tsx", "`OTP ${slotIndex + 1}`"],
    ["inputs/SgInputOTP.tsx", "aria-label={labelText || id}"],
    ["inputs/SgToggleSwitch.tsx", "aria-label={props.label ? undefined : props.id}"]
  ];

  for (const [file, value] of forbidden) {
    const source = readSource(file);
    assert.doesNotMatch(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});


