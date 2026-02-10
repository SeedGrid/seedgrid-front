import type { SeedThemeInput, ThemeVars } from "./ThemeConfig";
import {
  buildScaleFromHex,
  pickOnColor,
  shiftHue,
  toRgbVarValue,
  hslToHex,
} from "./colorUtils";

/* ------------- Semantic color generation ------------- */

// Semantic colors use FIXED hues to maintain universal UI/UX conventions:
// - Danger/Error = Red (recognizable as danger)
// - Warning = Yellow/Orange (recognizable as warning)
// - Success = Green (recognizable as success)
// - Info = Blue (recognizable as information)
function buildSemanticBaseFromHue(mode: "light" | "dark", hue: number) {
  const saturation = mode === "light" ? 85 : 80;
  const lightness = mode === "light" ? 48 : 56;
  return hslToHex(hue, saturation, lightness);
}

export function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* ------------- Main theme generator ------------- */

export function generateThemeVars(input: SeedThemeInput, resolvedMode: "light" | "dark"): ThemeVars {
  const seed = input.seed;

  // Base palette sources
  const primaryBase = seed;
  // Derive secondary/tertiary via hue shift (harmonious)
  const secondaryBase = shiftHue(seed, +35, 72, resolvedMode === "light" ? 48 : 54);
  const tertiaryBase = shiftHue(seed, +210, 62, resolvedMode === "light" ? 52 : 60);

  // Semantic bases (allow override) - FIXED hues for universal recognition
  const warningBase = input.warning ?? buildSemanticBaseFromHue(resolvedMode, 45);  // yellow/orange
  const errorBase   = input.error   ?? buildSemanticBaseFromHue(resolvedMode, 5);   // red
  const infoBase    = input.info    ?? buildSemanticBaseFromHue(resolvedMode, 210); // blue
  const successBase = input.success ?? buildSemanticBaseFromHue(resolvedMode, 145); // green

  // Build scales
  const primary = buildScaleFromHex(primaryBase, resolvedMode, { boostS: 4 });
  const secondary = buildScaleFromHex(secondaryBase, resolvedMode, { boostS: 2 });
  const tertiary = buildScaleFromHex(tertiaryBase, resolvedMode, { boostS: 0 });
  const warning = buildScaleFromHex(warningBase, resolvedMode, { boostS: 4 });
  const error = buildScaleFromHex(errorBase, resolvedMode, { boostS: 4 });
  const info = buildScaleFromHex(infoBase, resolvedMode, { boostS: 2 });
  const success = buildScaleFromHex(successBase, resolvedMode, { boostS: 2 });

  // Neutrals harmonized (pulled towards seed)
  const neutralBgHex = resolvedMode === "light"
    ? shiftHue(seed, 0, 10, 98)
    : shiftHue(seed, 0, 10, 10);
  const neutralSurfaceHex = resolvedMode === "light"
    ? shiftHue(seed, 0, 12, 95)
    : shiftHue(seed, 0, 12, 14);
  const neutralMutedSurfaceHex = resolvedMode === "light"
    ? shiftHue(seed, 0, 14, 90)
    : shiftHue(seed, 0, 14, 18);
  const borderHex = resolvedMode === "light"
    ? shiftHue(seed, 0, 18, 84)
    : shiftHue(seed, 0, 18, 26);
  const ringHex = primary[400] ?? primaryBase; // "beautiful" ring derived from primary
  const textHex = resolvedMode === "light" ? "#0B0B0C" : "#F6F6F7";
  const mutedTextHex = resolvedMode === "light" ? "#4B4B51" : "#B6B6BD";
  const disabledHex = resolvedMode === "light" ? "#E7E7EA" : "#2A2A2F";
  const onDisabledHex = resolvedMode === "light" ? "#8A8A93" : "#9B9BA5";
  const linkHex = info[600] ?? infoBase;
  const linkHoverHex = info[700] ?? infoBase;
  const badgeBgHex = resolvedMode === "light" ? (primary[100] ?? primaryBase) : (primary[800] ?? primaryBase);
  const badgeOnHex = pickOnColor(badgeBgHex);
  const tooltipBgHex = resolvedMode === "light" ? "#111317" : "#EDEEF0";
  const tooltipOnHex = pickOnColor(tooltipBgHex);

  const radius = input.radius ?? 12;

  const vars: ThemeVars = {
    "--sg-mode": resolvedMode,
    // Core singles as rgb
    "--sg-bg": toRgbVarValue(neutralBgHex),
    "--sg-surface": toRgbVarValue(neutralSurfaceHex),
    "--sg-muted-surface": toRgbVarValue(neutralMutedSurfaceHex),
    "--sg-border": toRgbVarValue(borderHex),
    "--sg-ring": toRgbVarValue(ringHex),
    "--sg-text": toRgbVarValue(textHex),
    "--sg-muted": toRgbVarValue(mutedTextHex),
    "--sg-disabled": toRgbVarValue(disabledHex),
    "--sg-on-disabled": toRgbVarValue(onDisabledHex),
    "--sg-link": toRgbVarValue(linkHex),
    "--sg-link-hover": toRgbVarValue(linkHoverHex),
    "--sg-badge": toRgbVarValue(badgeBgHex),
    "--sg-on-badge": toRgbVarValue(badgeOnHex),
    "--sg-tooltip": toRgbVarValue(tooltipBgHex),
    "--sg-on-tooltip": toRgbVarValue(tooltipOnHex),
    "--sg-radius": `${radius}px`,
  };

  // On colors (for 500 generally)
  const onPrimaryHex = pickOnColor(primary[500] ?? primaryBase);
  const onSecondaryHex = pickOnColor(secondary[500] ?? secondaryBase);
  const onTertiaryHex = pickOnColor(tertiary[500] ?? tertiaryBase);
  vars["--sg-on-primary"] = toRgbVarValue(onPrimaryHex);
  vars["--sg-on-secondary"] = toRgbVarValue(onSecondaryHex);
  vars["--sg-on-tertiary"] = toRgbVarValue(onTertiaryHex);

  // Semantic on colors (base at 500)
  vars["--sg-on-warning"] = toRgbVarValue(pickOnColor(warning[500] ?? warningBase));
  vars["--sg-on-error"] = toRgbVarValue(pickOnColor(error[500] ?? errorBase));
  vars["--sg-on-info"] = toRgbVarValue(pickOnColor(info[500] ?? infoBase));
  vars["--sg-on-success"] = toRgbVarValue(pickOnColor(success[500] ?? successBase));

  // Palette vars
  const stops = [50,100,200,300,400,500,600,700,800,900] as const;
  for (const s of stops) {
    vars[`--sg-primary-${s}`] = toRgbVarValue(primary[s] ?? primaryBase);
    vars[`--sg-secondary-${s}`] = toRgbVarValue(secondary[s] ?? secondaryBase);
    vars[`--sg-tertiary-${s}`] = toRgbVarValue(tertiary[s] ?? tertiaryBase);
    vars[`--sg-warning-${s}`] = toRgbVarValue(warning[s] ?? warningBase);
    vars[`--sg-error-${s}`] = toRgbVarValue(error[s] ?? errorBase);
    vars[`--sg-info-${s}`] = toRgbVarValue(info[s] ?? infoBase);
    vars[`--sg-success-${s}`] = toRgbVarValue(success[s] ?? successBase);
  }

  // Handy hover/active (normally 600/700)
  vars["--sg-primary-hover"] = vars["--sg-primary-600"] ?? toRgbVarValue(primaryBase);
  vars["--sg-primary-active"] = vars["--sg-primary-700"] ?? toRgbVarValue(primaryBase);
  vars["--sg-secondary-hover"] = vars["--sg-secondary-600"] ?? toRgbVarValue(secondaryBase);
  vars["--sg-secondary-active"] = vars["--sg-secondary-700"] ?? toRgbVarValue(secondaryBase);
  vars["--sg-tertiary-hover"] = vars["--sg-tertiary-600"] ?? toRgbVarValue(tertiaryBase);
  vars["--sg-tertiary-active"] = vars["--sg-tertiary-700"] ?? toRgbVarValue(tertiaryBase);
  vars["--sg-warning-hover"] = vars["--sg-warning-600"] ?? toRgbVarValue(warningBase);
  vars["--sg-error-hover"] = vars["--sg-error-600"] ?? toRgbVarValue(errorBase);
  vars["--sg-info-hover"] = vars["--sg-info-600"] ?? toRgbVarValue(infoBase);
  vars["--sg-success-hover"] = vars["--sg-success-600"] ?? toRgbVarValue(successBase);

  // Custom overrides
  if (input.customVars) {
    for (const k of Object.keys(input.customVars)) {
      const value = input.customVars[k];
      if (value !== undefined) {
        vars[k] = value;
      }
    }
  }

  return vars;
}

