import test from "node:test";
import assert from "node:assert/strict";

const search = await import(new URL("../dist/gadgets/clock/themes/search.js", import.meta.url));

const { filterClockThemes, resolveClockThemeSelection } = search;

const themes = [
  { id: "classic", label: "Classic", tags: ["default", "clean"] },
  { id: "modern-dark", label: "Modern Dark", tags: ["dark", "contrast"] },
  { id: "retro", label: "Retro", tags: ["vintage"] }
];

test("filterClockThemes matches id, label and tags", () => {
  assert.deepEqual(filterClockThemes(themes, "modern").map((theme) => theme.id), ["modern-dark"]);
  assert.deepEqual(filterClockThemes(themes, "clean").map((theme) => theme.id), ["classic"]);
  assert.deepEqual(filterClockThemes(themes, "retro").map((theme) => theme.id), ["retro"]);
});

test("resolveClockThemeSelection prefers selected theme and falls back when missing", () => {
  const resolver = {
    resolve(id) {
      return themes.find((theme) => theme.id === id) ?? null;
    }
  };

  assert.equal(
    resolveClockThemeSelection({ resolver, allThemes: themes, value: "modern-dark", fallbackThemeId: "classic" })?.id,
    "modern-dark"
  );

  assert.equal(
    resolveClockThemeSelection({ resolver, allThemes: themes, value: "missing", fallbackThemeId: "classic" })?.id,
    "classic"
  );
});

test("resolveClockThemeSelection returns null when both value and fallback are unavailable", () => {
  assert.equal(
    resolveClockThemeSelection({ resolver: null, allThemes: themes, value: "missing", fallbackThemeId: "also-missing" }),
    null
  );
});
