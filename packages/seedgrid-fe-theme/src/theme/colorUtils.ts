/* ------------- Color conversion utilities ------------- */

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex: ${hex}`);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0, gp = 0, bp = 0;
  if (0 <= h && h < 60) { rp = c; gp = x; bp = 0; }
  else if (60 <= h && h < 120) { rp = x; gp = c; bp = 0; }
  else if (120 <= h && h < 180) { rp = 0; gp = c; bp = x; }
  else if (180 <= h && h < 240) { rp = 0; gp = x; bp = c; }
  else if (240 <= h && h < 300) { rp = x; gp = 0; bp = c; }
  else { rp = c; gp = 0; bp = x; }
  return {
    r: (rp + m) * 255,
    g: (gp + m) * 255,
    b: (bp + m) * 255,
  };
}

export function hslToHex(h: number, s: number, l: number) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Relative luminance (approx) to decide black/white text
export function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => v / 255).map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * (srgb[0] ?? 0) + 0.7152 * (srgb[1] ?? 0) + 0.0722 * (srgb[2] ?? 0);
}

export function pickOnColor(bgHex: string) {
  // Simple and efficient: threshold ~0.5
  return relativeLuminance(bgHex) > 0.5 ? "#0B0B0C" : "#FFFFFF";
}

export function toRgbVarValue(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`; // <- ideal format for Tailwind rgb(var(--x)/alpha)
}

export function shiftHue(hex: string, dh: number, targetS?: number, targetL?: number) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const nh = (h + dh + 360) % 360;
  const ns = targetS ?? s;
  const nl = targetL ?? l;
  return hslToHex(nh, clamp(ns, 0, 100), clamp(nl, 0, 100));
}

/* ------------- Palette generation ------------- */

// Scale 50..900 "beautiful" (harmonizes in HSL, with L varying by stop)
export function buildScaleFromHex(
  baseHex: string,
  resolvedMode: "light" | "dark",
  opts?: { boostS?: number; biasL?: number }
) {
  const { r, g, b } = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  // stop -> Lightness target (lighter at 50, darker at 900)
  // For dark mode, we still want a "useful" scale (50 is less "white").
  const L_LIGHT: Record<number, number> = { 50: 96, 100: 92, 200: 86, 300: 78, 400: 68, 500: 56, 600: 48, 700: 40, 800: 32, 900: 24 };
  const L_DARK:  Record<number, number> = { 50: 22, 100: 28, 200: 34, 300: 40, 400: 48, 500: 56, 600: 64, 700: 72, 800: 80, 900: 88 };
  
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  const Lmap = resolvedMode === "light" ? L_LIGHT : L_DARK;
  
  // Saturation adjusts slightly: less at extremes, more in the middle
  const Smap: Record<number, number> = {
    50: s * 0.25,
    100: s * 0.35,
    200: s * 0.5,
    300: s * 0.7,
    400: s * 0.85,
    500: s * 1.0,
    600: s * 1.05,
    700: s * 1.05,
    800: s * 0.95,
    900: s * 0.85,
  };
  
  const boostS = opts?.boostS ?? 0;
  const biasL = opts?.biasL ?? 0;
  
  const out: Record<number, string> = {};
  for (const stop of stops) {
    const targetL = clamp((Lmap[stop] ?? 50) + biasL, 0, 100);
    const targetS = clamp((Smap[stop] ?? s) + boostS, 0, 100);
    out[stop] = hslToHex(h, targetS, targetL);
  }
  return out;
}

