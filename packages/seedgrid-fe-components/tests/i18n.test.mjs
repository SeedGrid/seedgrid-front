import test from "node:test";
import assert from "node:assert/strict";
import {
  componentsMessagesEnUs,
  componentsMessagesFr,
  getComponentsI18n,
  resolveComponentsI18n,
  setComponentsI18n
} from "../dist/i18n/index.js";

function resetRuntimeI18n() {
  delete globalThis.__seedgridComponentsI18n;
}

test("defaults to en-US when no locale is configured", () => {
  resetRuntimeI18n();
  const i18n = getComponentsI18n();
  assert.equal(i18n.locale, "en-US");
  assert.equal(i18n.messages["components.actions.clear"], componentsMessagesEnUs["components.actions.clear"]);
});

test("accepts en as alias and normalizes it to en-US", () => {
  resetRuntimeI18n();
  const i18n = resolveComponentsI18n({ locale: "en" });
  assert.equal(i18n.locale, "en-US");
  assert.equal(i18n.messages["components.password.show"], componentsMessagesEnUs["components.password.show"]);
});

test("loads french messages when locale is fr", () => {
  resetRuntimeI18n();
  const i18n = resolveComponentsI18n({ locale: "fr" });
  assert.equal(i18n.locale, "fr");
  assert.equal(i18n.messages["components.actions.clear"], componentsMessagesFr["components.actions.clear"]);
});

test("setComponentsI18n preserves english default and applies overrides", () => {
  resetRuntimeI18n();
  setComponentsI18n({
    locale: "en",
    messages: {
      "components.actions.clear": "Wipe"
    }
  });
  const i18n = getComponentsI18n();
  assert.equal(i18n.locale, "en-US");
  assert.equal(i18n.messages["components.actions.clear"], "Wipe");
  assert.equal(i18n.messages["components.actions.confirm"], componentsMessagesEnUs["components.actions.confirm"]);
});


test("falls back to english messages for unsupported locales", () => {
  resetRuntimeI18n();
  const i18n = resolveComponentsI18n({ locale: "de-DE" });
  assert.equal(i18n.locale, "de-DE");
  assert.equal(i18n.messages["components.actions.confirm"], componentsMessagesEnUs["components.actions.confirm"]);
});

test("accepts namespaced component messages in resolveComponentsI18n", () => {
  resetRuntimeI18n();
  const i18n = resolveComponentsI18n({
    locale: "pt-BR",
    messages: {
      components: {
        "components.actions.clear": "Limpar agora"
      }
    }
  });

  assert.equal(i18n.locale, "pt-BR");
  assert.equal(i18n.messages["components.actions.clear"], "Limpar agora");
});

test("setComponentsI18n resets to the new locale bundle when the locale changes", () => {
  resetRuntimeI18n();
  setComponentsI18n({
    locale: "en",
    messages: {
      "components.actions.clear": "Wipe"
    }
  });

  setComponentsI18n({ locale: "fr" });

  const i18n = getComponentsI18n();
  assert.equal(i18n.locale, "fr");
  assert.equal(i18n.messages["components.actions.clear"], componentsMessagesFr["components.actions.clear"]);
  assert.equal(i18n.messages["components.actions.confirm"], componentsMessagesFr["components.actions.confirm"]);
});
