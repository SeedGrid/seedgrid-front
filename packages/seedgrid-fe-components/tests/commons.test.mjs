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
  SgBadge,
  SgAvatar,
  SgComponentsI18nProvider,
  setComponentsI18n,
  subscribeSgToasts,
  dismissSgToast,
  getActiveHostId,
  hasAnyHost,
  nextHostId,
  registerHost,
  subscribeHostRegistry,
  unregisterHost,
  toast
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function renderWithLocale(locale, element) {
  return renderToStaticMarkup(
    React.createElement(SgComponentsI18nProvider, { locale }, element)
  );
}


test("SgAvatar exposes a translated default aria-label", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgAvatar, { icon: React.createElement("span", null, "A") })
  );

  assert.match(html, /aria-label="Avatar"/);
});

test("SgAvatar preserves an explicit alt override", () => {
  const html = renderToStaticMarkup(
    React.createElement(SgAvatar, {
      src: "/user.png",
      alt: "Maria Souza"
    })
  );

  assert.match(html, /aria-label="Maria Souza"/);
  assert.match(html, /alt="Maria Souza"/);
});
test("SgBadge exposes a translated remove aria-label by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgBadge, { value: "New", removable: true })
  );

  assert.match(html, /aria-label="Retirer badge"/);
});

test("SgBadge preserves an explicit remove aria-label override", () => {
  const html = renderToStaticMarkup(
    React.createElement(SgBadge, {
      value: "New",
      removable: true,
      removeAriaLabel: "Dismiss badge"
    })
  );

  assert.match(html, /aria-label="Dismiss badge"/);
});
test("toast.promise uses the translated loading fallback", async () => {
  dismissSgToast();
  setComponentsI18n({ locale: "fr" });

  let snapshot = [];
  const unsubscribe = subscribeSgToasts((items) => {
    snapshot = items;
  });

  try {
    const result = await toast.promise(Promise.resolve("ok"), {
      success: "Done"
    });

    assert.equal(result, "ok");
    assert.equal(snapshot.length, 1);
    assert.equal(snapshot[0]?.title, "Done");
    assert.equal(snapshot[0]?.type, "success");
    assert.equal(snapshot[0]?.id?.startsWith("sg-toast-"), true);
  } finally {
    unsubscribe();
    dismissSgToast();
    setComponentsI18n({ locale: "en-US" });
  }
});

test("toast host registry keeps the most recently registered host active", () => {
  const first = nextHostId();
  const second = nextHostId();
  const seen = [];
  const unsubscribe = subscribeHostRegistry(() => {
    seen.push(getActiveHostId());
  });

  registerHost(first);
  assert.equal(hasAnyHost(), true);
  assert.equal(getActiveHostId(), first);

  registerHost(second);
  assert.equal(getActiveHostId(), second);

  unregisterHost(second);
  assert.equal(getActiveHostId(), first);

  unregisterHost(first);
  assert.equal(hasAnyHost(), false);
  assert.equal(getActiveHostId(), null);

  unsubscribe();
  assert.deepEqual(seen, [first, second, first, null]);
});

test("toast host registry ignores duplicate registration and unsubscribes listeners", () => {
  const id = nextHostId();
  let calls = 0;
  const unsubscribe = subscribeHostRegistry(() => {
    calls += 1;
  });

  registerHost(id);
  registerHost(id);
  unregisterHost(id);
  unsubscribe();
  registerHost(id);
  unregisterHost(id);

  assert.equal(calls, 2);
});
