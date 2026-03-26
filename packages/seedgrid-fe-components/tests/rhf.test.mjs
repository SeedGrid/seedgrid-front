import test from "node:test";
import assert from "node:assert/strict";
import { mergeRequiredRule, resolveFieldError } from "../dist/rhf.js";

test("resolveFieldError returns the first non-empty error", () => {
  assert.equal(resolveFieldError(undefined, "", null, "server error", "field error"), "server error");
});

test("mergeRequiredRule injects required when needed", () => {
  assert.deepEqual(mergeRequiredRule(undefined, true, "Required field."), { required: "Required field." });
});

test("mergeRequiredRule preserves an explicit required rule", () => {
  const rules = { required: "Custom required", minLength: { value: 3, message: "Too short" } };
  assert.deepEqual(mergeRequiredRule(rules, true, "Fallback required"), rules);
});
