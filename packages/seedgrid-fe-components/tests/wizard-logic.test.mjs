import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

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

const { clampWizardStep, canProceedWizardAction } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

test("clampWizardStep keeps the step inside the valid page range", () => {
  assert.equal(clampWizardStep(undefined, 3), 0);
  assert.equal(clampWizardStep(-4, 3), 0);
  assert.equal(clampWizardStep(1, 3), 1);
  assert.equal(clampWizardStep(99, 3), 2);
  assert.equal(clampWizardStep(3, 0), 0);
});

test("canProceedWizardAction stops immediately when the page is invalid", async () => {
  let validateStepCalled = false;
  let beforeActionCalled = false;

  const ok = await canProceedWizardAction({
    step: 2,
    validateCurrentPage: async () => false,
    validateStep: async () => {
      validateStepCalled = true;
      return true;
    },
    beforeAction: async () => {
      beforeActionCalled = true;
      return true;
    }
  });

  assert.equal(ok, false);
  assert.equal(validateStepCalled, false);
  assert.equal(beforeActionCalled, false);
});

test("canProceedWizardAction stops when validateStep blocks the transition", async () => {
  const calls = [];

  const ok = await canProceedWizardAction({
    step: 1,
    validateCurrentPage: async () => {
      calls.push("page");
      return true;
    },
    validateStep: async (step) => {
      calls.push(`validate:${step}`);
      return false;
    },
    beforeAction: async (step) => {
      calls.push(`before:${step}`);
      return true;
    }
  });

  assert.equal(ok, false);
  assert.deepEqual(calls, ["page", "validate:1"]);
});

test("canProceedWizardAction stops when the action guard blocks the transition", async () => {
  const calls = [];

  const ok = await canProceedWizardAction({
    step: 0,
    validateCurrentPage: async () => {
      calls.push("page");
      return true;
    },
    validateStep: async (step) => {
      calls.push(`validate:${step}`);
      return true;
    },
    beforeAction: async (step) => {
      calls.push(`before:${step}`);
      return false;
    }
  });

  assert.equal(ok, false);
  assert.deepEqual(calls, ["page", "validate:0", "before:0"]);
});

test("canProceedWizardAction allows the transition when all guards pass", async () => {
  const calls = [];

  const ok = await canProceedWizardAction({
    step: 3,
    validateCurrentPage: async () => {
      calls.push("page");
      return true;
    },
    validateStep: async (step) => {
      calls.push(`validate:${step}`);
      return true;
    },
    beforeAction: async (step) => {
      calls.push(`before:${step}`);
      return true;
    }
  });

  assert.equal(ok, true);
  assert.deepEqual(calls, ["page", "validate:3", "before:3"]);
});
