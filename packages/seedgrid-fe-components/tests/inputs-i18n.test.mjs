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
  SgInputOTP,
  SgToggleSwitch,
  SgComponentsI18nProvider
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function renderWithLocale(locale, element) {
  return renderToStaticMarkup(
    React.createElement(SgComponentsI18nProvider, { locale }, element)
  );
}

test("SgInputOTP exposes translated slot labels by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgInputOTP, {
      id: "security-otp",
      value: "12"
    })
  );

  assert.match(html, /aria-label="Code . usage unique 1"/);
  assert.match(html, /aria-label="Code . usage unique 2"/);
  assert.doesNotMatch(html, /aria-label="OTP 1"/);
});

test("SgInputOTP exposes a translated group label by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgInputOTP, {
      id: "security-otp",
      value: "12"
    })
  );

  assert.match(html, /role="group" aria-label="Code . usage unique"/);
  assert.doesNotMatch(html, /aria-label="security-otp"/);
});

test("SgInputOTP preserves explicit label text for slot labels", () => {
  const html = renderWithLocale(
    "en",
    React.createElement(SgInputOTP, {
      id: "security-otp",
      label: "Verification code",
      value: "12"
    })
  );

  assert.match(html, /aria-label="Verification code 1"/);
  assert.match(html, /aria-label="Verification code 2"/);
});


test("SgToggleSwitch exposes a translated default aria-label", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgToggleSwitch, {
      id: "newsletter-toggle"
    })
  );

  assert.match(html, /role="switch"/);
  assert.match(html, /aria-label="Basculer option"/);
  assert.doesNotMatch(html, /aria-label="newsletter-toggle"/);
});

test("SgToggleSwitch omits the fallback aria-label when a visible label exists", () => {
  const html = renderWithLocale(
    "en",
    React.createElement(SgToggleSwitch, {
      id: "newsletter-toggle",
      label: "Newsletter"
    })
  );

  assert.doesNotMatch(html, /aria-label="Toggle switch"/);
});
