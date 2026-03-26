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
  SgWizard,
  SgWizardPage,
  SgComponentsI18nProvider
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function renderWithLocale(locale, element) {
  return renderToStaticMarkup(
    React.createElement(SgComponentsI18nProvider, { locale }, element)
  );
}

test("SgWizard renders translated progress and action labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgWizard,
      { onFinish: () => {}, stepper: "numbered", initialStep: 1 },
      React.createElement(SgWizardPage, { title: "Compte" }, React.createElement("div", null, "A")),
      React.createElement(SgWizardPage, null, React.createElement("div", null, "B"))
    )
  );

  assert.match(html, /aria-label="Progression"/);
  assert.match(html, />Compte</);
  assert.match(html, />Etape 2</);
  assert.match(html, />Terminer</);
});

test("SgWizard clamps the initial step and shows the last page actions", () => {
  const html = renderWithLocale(
    "en",
    React.createElement(
      SgWizard,
      { onFinish: () => {}, stepper: "numbered", initialStep: 99 },
      React.createElement(SgWizardPage, { title: "Account" }, React.createElement("div", null, "A")),
      React.createElement(SgWizardPage, { title: "Profile" }, React.createElement("div", null, "B"))
    )
  );

  assert.match(html, />Profile</);
  assert.match(html, />Finish</);
  assert.match(html, />Previous</);
  assert.doesNotMatch(html, />Next</);
});

test("SgWizard allows overriding translated action labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgWizard,
      {
        onFinish: () => {},
        stepper: "none",
        labels: {
          next: "Continuer",
          previous: "Retour",
          finish: "Conclure"
        }
      },
      React.createElement(SgWizardPage, { title: "Compte" }, React.createElement("div", null, "A")),
      React.createElement(SgWizardPage, { title: "Profil" }, React.createElement("div", null, "B"))
    )
  );

  assert.match(html, />Continuer</);
  assert.doesNotMatch(html, />Suivant</);
  assert.doesNotMatch(html, /aria-label="Progression"/);
});
test("SgWizard hides the progress nav when stepper is none", () => {
  const html = renderWithLocale(
    "en",
    React.createElement(
      SgWizard,
      { onFinish: () => {}, stepper: "none" },
      React.createElement(SgWizardPage, { title: "Account" }, React.createElement("div", null, "A")),
      React.createElement(SgWizardPage, { title: "Profile" }, React.createElement("div", null, "B"))
    )
  );

  assert.doesNotMatch(html, /aria-label="Progress"/);
  assert.match(html, />Next</);
});

test("SgWizard clamps negative initial steps to the first page", () => {
  const html = renderWithLocale(
    "en",
    React.createElement(
      SgWizard,
      { onFinish: () => {}, stepper: "numbered", initialStep: -3 },
      React.createElement(SgWizardPage, { title: "Account" }, React.createElement("div", null, "A")),
      React.createElement(SgWizardPage, { title: "Profile" }, React.createElement("div", null, "B"))
    )
  );

  assert.match(html, />Account</);
  assert.match(html, />Next</);
  assert.doesNotMatch(html, />Previous</);
});