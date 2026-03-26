import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

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

const {
  SgCalendar,
  SgQRCode,
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgRadialGauge,
  SgLinearGauge,
  SgComponentsI18nProvider
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function renderWithLocale(locale, element) {
  return renderToStaticMarkup(
    React.createElement(SgComponentsI18nProvider, { locale }, element)
  );
}

test("SgQRCode exposes a translated SVG title", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgQRCode, { value: "https://seedgrid.com.br" })
  );

  assert.match(html, />Code QR</);
});

test("SgCalendar exposes translated card and navigation labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgCalendar, { showTodayShortcut: true })
  );

  assert.match(html, />Calendrier</);
  assert.match(html, /aria-label="Mois precedent"/);
  assert.match(html, /aria-label="Mois suivant"/);
  assert.match(html, /aria-label="Aller a aujourd hui"/);
});


test("SgClock exposes translated digital aria labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgClock, { clockStyle: "digital", locale: "fr", showSeconds: false })
  );

  assert.match(html, /aria-label="Horloge numerique"/);
  assert.match(html, />Horloge</);
});

test("SgClockThemePicker exposes translated placeholder text", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      SgComponentsI18nProvider,
      { locale: "fr" },
      React.createElement(
        SgClockThemeProvider,
        { value: { mode: "strict", fallbackThemeId: "missing", themes: [] } },
        React.createElement(SgClockThemePicker, { value: "missing", onChange: () => {} })
      )
    )
  );

  assert.match(html, />Theme</);
  assert.match(html, />Selectionnez un theme\.\.\.</);
});

test("gauges expose translated default accessibility labels", () => {
  const radialHtml = renderWithLocale("fr", React.createElement(SgRadialGauge, { value: 42 }));
  const linearHtml = renderWithLocale("fr", React.createElement(SgLinearGauge, { value: 42 }));

  assert.match(radialHtml, /aria-label="Jauge radiale"/);
  assert.match(radialHtml, />Valeur</);
  assert.match(linearHtml, /aria-label="Jauge lineaire"/);
});


test("SgClock renders localized 12-hour day periods", () => {
  const html = renderWithLocale(
    "es",
    React.createElement(SgClock, {
      clockStyle: "digital",
      locale: "es",
      format: "12h",
      showSeconds: false,
      initialServerTime: "2026-03-22T18:05:00Z",
      timezone: "UTC"
    })
  );

  assert.match(html, /aria-label="Reloj digital"/);
  assert.match(html, />06:05/);
  assert.match(html, /p\.[\s ]*m\./);
});


test("SgClockThemePicker exposes accessible listbox semantics", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      SgComponentsI18nProvider,
      { locale: "fr" },
      React.createElement(
        SgClockThemeProvider,
        {
          value: {
            mode: "strict",
            fallbackThemeId: "classic",
            themes: [
              { id: "classic", label: "Classique", order: 1 },
              { id: "modern", label: "Moderne", order: 2 }
            ]
          }
        },
        React.createElement(SgClockThemePicker, {
          value: "modern",
          onChange: () => {},
          defaultOpen: true,
          searchable: false
        })
      )
    )
  );

  assert.match(html, /aria-haspopup="listbox"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /role="listbox"/);
  assert.match(html, /role="option"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, />Actif</);
});
