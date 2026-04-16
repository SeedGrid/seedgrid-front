import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const distRoot = path.join(packageRoot, "dist");
const manifestOutputPath = path.join(distRoot, "ai", "seedgrid-components.manifest.json");

async function loadPackageVersion() {
  const packageJsonPath = path.join(packageRoot, "package.json");
  const packageJsonRaw = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonRaw);
  return String(packageJson.version ?? "0.0.0");
}

async function loadComponentMeta(relativeModulePath) {
  const moduleUrl = pathToFileURL(path.join(distRoot, relativeModulePath)).href;
  const module = await import(moduleUrl);

  return {
    componentId: module.sgMeta.componentId,
    exportName: module.sgMeta.exportName,
    sgMeta: module.sgMeta,
    aiHints: module.aiHints
  };
}

async function main() {
  const packageVersion = await loadPackageVersion();
  const components = await Promise.all([
    loadComponentMeta(path.join("inputs", "SgAutocomplete.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputBirthDate.meta.js")),
    loadComponentMeta(path.join("inputs", "SgCheckboxGroup.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCNPJ.meta.js")),
    loadComponentMeta(path.join("inputs", "SgCombobox.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCPF.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCPFCNPJ.meta.js")),
    loadComponentMeta(path.join("inputs", "SgDatatable.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputText.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputNumber.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputCurrency.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputDate.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputEmail.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputOTP.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputPassword.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputPhone.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputPostalCode.meta.js")),
    loadComponentMeta(path.join("inputs", "SgOrderList.meta.js")),
    loadComponentMeta(path.join("inputs", "SgPickList.meta.js")),
    loadComponentMeta(path.join("inputs", "SgRadioGroup.meta.js")),
    loadComponentMeta(path.join("inputs", "SgRating.meta.js")),
    loadComponentMeta(path.join("inputs", "SgSlider.meta.js")),
    loadComponentMeta(path.join("inputs", "SgStepperInput.meta.js")),
    loadComponentMeta(path.join("inputs", "SgTextEditor.meta.js")),
    loadComponentMeta(path.join("inputs", "SgInputTextarea.meta.js")),
    loadComponentMeta(path.join("inputs", "SgToggleSwitch.meta.js")),
    loadComponentMeta(path.join("buttons", "SgButton.meta.js")),
    loadComponentMeta(path.join("buttons", "SgFloatActionButton.meta.js")),
    loadComponentMeta(path.join("buttons", "SgSplitButton.meta.js")),
    loadComponentMeta(path.join("commons", "SgAvatar.meta.js")),
    loadComponentMeta(path.join("commons", "SgAvatarGroup.meta.js")),
    loadComponentMeta(path.join("commons", "SgBadge.meta.js")),
    loadComponentMeta(path.join("commons", "SgBadgeOverlay.meta.js")),
    loadComponentMeta(path.join("commons", "SgSkeleton.meta.js")),
    loadComponentMeta(path.join("commons", "SgToaster.meta.js")),
    loadComponentMeta(path.join("commons", "SgToastHost.meta.js")),
    loadComponentMeta(path.join("commons", "SgWhistleHost.meta.js")),
    loadComponentMeta(path.join("commons", "toast.meta.js")),
    loadComponentMeta(path.join("commons", "dismissSgToast.meta.js")),
    loadComponentMeta(path.join("commons", "subscribeSgToasts.meta.js")),
    loadComponentMeta(path.join("commons", "whistle.meta.js")),
    loadComponentMeta(path.join("commons", "dismissSgWhistle.meta.js")),
    loadComponentMeta(path.join("commons", "subscribeSgWhistles.meta.js")),
    loadComponentMeta(path.join("overlay", "SgConfirmationDialog.meta.js")),
    loadComponentMeta(path.join("overlay", "SgDialog.meta.js")),
    loadComponentMeta(path.join("overlay", "SgPopup.meta.js")),
    loadComponentMeta(path.join("layout", "SgAccordion.meta.js")),
    loadComponentMeta(path.join("layout", "SgBreadcrumb.meta.js")),
    loadComponentMeta(path.join("layout", "SgCard.meta.js")),
    loadComponentMeta(path.join("layout", "SgCarousel.meta.js")),
    loadComponentMeta(path.join("layout", "SgDockLayout.meta.js")),
    loadComponentMeta(path.join("layout", "SgDockScreen.meta.js")),
    loadComponentMeta(path.join("layout", "SgDockZone.meta.js")),
    loadComponentMeta(path.join("layout", "SgExpandablePanel.meta.js")),
    loadComponentMeta(path.join("layout", "SgGrid.meta.js")),
    loadComponentMeta(path.join("layout", "SgGroupBox.meta.js")),
    loadComponentMeta(path.join("layout", "SgMenu.meta.js")),
    loadComponentMeta(path.join("layout", "SgPageControl.meta.js")),
    loadComponentMeta(path.join("layout", "SgPageControlPage.meta.js")),
    loadComponentMeta(path.join("layout", "SgPanel.meta.js")),
    loadComponentMeta(path.join("layout", "SgScreen.meta.js")),
    loadComponentMeta(path.join("layout", "SgStack.meta.js")),
    loadComponentMeta(path.join("layout", "SgToolbarIconButton.meta.js")),
    loadComponentMeta(path.join("layout", "SgTreeView.meta.js")),
    loadComponentMeta(path.join("layout", "SgToolBar.meta.js")),
    loadComponentMeta(path.join("menus", "SgDockMenu.meta.js")),
    loadComponentMeta(path.join("wizard", "SgWizard.meta.js")),
    loadComponentMeta(path.join("wizard", "SgWizardPage.meta.js")),
    loadComponentMeta(path.join("gadgets", "calendar", "SgCalendar.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "SgClock.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "SgTimeProvider.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "useSgTime.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "SgClockThemePicker.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "useSgClockThemeResolver.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "SgClockThemePreview.meta.js")),
    loadComponentMeta(path.join("gadgets", "clock", "themes", "SgClockThemeProvider.meta.js")),
    loadComponentMeta(path.join("gadgets", "gauge", "SgLinearGauge.meta.js")),
    loadComponentMeta(path.join("gadgets", "gauge", "SgRadialGauge.meta.js")),
    loadComponentMeta(path.join("gadgets", "qr-code", "SgQRCode.meta.js")),
    loadComponentMeta(path.join("gadgets", "string-animator", "SgStringAnimator.meta.js")),
    loadComponentMeta(path.join("digits", "discard-digit", "SgDiscardDigit.meta.js")),
    loadComponentMeta(path.join("digits", "fade-digit", "SgFadeDigit.meta.js")),
    loadComponentMeta(path.join("digits", "flip-digit", "SgFlipDigit.meta.js")),
    loadComponentMeta(path.join("digits", "matrix-digit", "SgMatrixDigit.meta.js")),
    loadComponentMeta(path.join("digits", "neon-digit", "SgNeonDigit.meta.js")),
    loadComponentMeta(path.join("digits", "roller3d-digit", "SgRoller3DDigit.meta.js")),
    loadComponentMeta(path.join("digits", "segment-digit", "SgSegmentDigit.meta.js")),
    loadComponentMeta(path.join("digits", "seven-segment-digit", "SgSevenSegmentDigit.meta.js")),
    loadComponentMeta(path.join("environment", "SgEnvironmentProvider.meta.js")),
    loadComponentMeta(path.join("environment", "useSgEnvironment.meta.js")),
    loadComponentMeta(path.join("environment", "useSgNamespaceProvider.meta.js")),
    loadComponentMeta(path.join("environment", "useSgPersistence.meta.js")),
    loadComponentMeta(path.join("environment", "useSgPersistentState.meta.js")),
    loadComponentMeta(path.join("i18n", "SgComponentsI18nProvider.meta.js")),
    loadComponentMeta(path.join("i18n", "useComponentsI18n.meta.js"))
  ]);

  const manifest = {
    schemaVersion: "0.1",
    package: "@seedgrid/fe-components",
    packageVersion,
    components
  };

  await mkdir(path.dirname(manifestOutputPath), { recursive: true });
  await writeFile(manifestOutputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`AI manifest generated at ${manifestOutputPath}`);
}

await main();
