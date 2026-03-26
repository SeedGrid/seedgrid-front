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

const {
  getBlockedEmailDomains,
  isBlockedEmailDomain,
  DEFAULT_BLOCKED_EMAIL_DOMAINS,
  validatePassword,
  validateBirthDate,
  isValidCpf,
  isValidCnpj,
  isValidEmail,
  isDateAfter,
  isDateBefore,
  maskCpf,
  maskCnpj,
  maskCpfCnpj,
  maskPostalCodeBR,
  maskPostalCodePT,
  maskPostalCodeUS,
  maskPostalCodeES,
  maskPostalCodePY,
  maskPostalCodeUY,
  maskPostalCodeAR,
  maskCep,
  maskPhone
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function withFixedToday(isoDate, fn) {
  const RealDate = Date;
  class MockDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(isoDate);
      } else {
        super(...args);
      }
    }
    static now() {
      return new RealDate(isoDate).getTime();
    }
    static parse(value) {
      return RealDate.parse(value);
    }
    static UTC(...args) {
      return RealDate.UTC(...args);
    }
  }

  globalThis.Date = MockDate;
  try {
    return fn();
  } finally {
    globalThis.Date = RealDate;
  }
}

function withRuntimeBlockedDomains(domains, fn) {
  const previous = globalThis.__seedgridBlockedEmailDomains;
  globalThis.__seedgridBlockedEmailDomains = domains;
  try {
    return fn();
  } finally {
    if (previous === undefined) {
      delete globalThis.__seedgridBlockedEmailDomains;
    } else {
      globalThis.__seedgridBlockedEmailDomains = previous;
    }
  }
}

test("getBlockedEmailDomains merges defaults, runtime domains and extras without duplicates", () => {
  const result = withRuntimeBlockedDomains(["Runtime.com", "mailinator.com"], () =>
    getBlockedEmailDomains(["Extra.com", "runtime.com"])
  );

  assert.ok(DEFAULT_BLOCKED_EMAIL_DOMAINS.includes("mailinator.com"));
  assert.ok(result.includes("runtime.com"));
  assert.ok(result.includes("extra.com"));
  assert.equal(result.filter((item) => item === "runtime.com").length, 1);
});

test("isBlockedEmailDomain honors merged blocked domains", () => {
  const blocked = withRuntimeBlockedDomains(["runtime.com"], () =>
    isBlockedEmailDomain("user@runtime.com", ["extra.com"])
  );
  const allowed = withRuntimeBlockedDomains(["runtime.com"], () =>
    isBlockedEmailDomain("user@seedgrid.com", ["extra.com"])
  );

  assert.equal(blocked, true);
  assert.equal(allowed, false);
});

test("validators cover cpf, cnpj and email paths", () => {
  assert.equal(isValidCpf("529.982.247-25"), true);
  assert.equal(isValidCpf("111.111.111-11"), false);
  assert.equal(isValidCnpj("11.444.777/0001-61"), true);
  assert.equal(isValidCnpj("11.111.111/1111-11"), false);
  assert.equal(isValidEmail("dev@seedgrid.com"), true);
  assert.equal(isValidEmail("invalid-email"), false);
});

test("validatePassword returns translated reasons and accepts valid values", () => {
  const invalid = validatePassword("abc", { minSize: 8 }, { locale: "en" });
  const valid = validatePassword("SeedGrid#2026", { minSize: 8 }, { locale: "en" });

  assert.match(invalid ?? "", /Invalid password/i);
  assert.match(invalid ?? "", /minimum of 8 characters/i);
  assert.equal(valid, null);
});

test("validateBirthDate respects fixed age bounds", () => {
  const tooYoung = withFixedToday("2026-03-22T00:00:00.000Z", () =>
    validateBirthDate("2010-03-23", { minAge: 18 }, { locale: "en" })
  );
  const valid = withFixedToday("2026-03-22T00:00:00.000Z", () =>
    validateBirthDate("1990-03-22", { minAge: 18, maxAge: 80 }, { locale: "en" })
  );
  const invalidConfig = validateBirthDate("1990-03-22", { minAge: 80, maxAge: 18 }, { locale: "en" });

  assert.match(tooYoung ?? "", /at least 18/i);
  assert.equal(valid, null);
  assert.match(invalidConfig ?? "", /minAge must be <= maxAge/i);
});

test("date helpers compare ISO dates inclusively", () => {
  assert.equal(isDateAfter("2026-03-22", "2026-03-22"), true);
  assert.equal(isDateAfter("2026-03-21", "2026-03-22"), false);
  assert.equal(isDateBefore("2026-03-22", "2026-03-22"), true);
  assert.equal(isDateBefore("2026-03-23", "2026-03-22"), false);
});

test("masks format cpf cnpj postal codes and phone numbers", () => {
  assert.equal(maskCpf("52998224725"), "529.982.247-25");
  assert.equal(maskCnpj("11444777000161"), "11.444.777/0001-61");
  assert.equal(maskCpfCnpj("ABC12345678901"), "AB.C12.345/6789-01");
  assert.equal(maskPostalCodeBR("12345678"), "12345-678");
  assert.equal(maskPostalCodePT("1234567"), "1234-567");
  assert.equal(maskPostalCodeUS("123456789"), "12345-6789");
  assert.equal(maskPostalCodeES("28013"), "28013");
  assert.equal(maskPostalCodePY("123456"), "123456");
  assert.equal(maskPhone("11987654321"), "(11) 98765-4321");
});




test("validators handle malformed and empty inputs defensively", () => {
  assert.equal(isBlockedEmailDomain("invalid-email", ["runtime.com"]), false);
  assert.equal(isBlockedEmailDomain(" USER@RUNTIME.COM ", ["runtime.com"]), true);
  assert.equal(isValidCpf("123"), false);
  assert.equal(isValidCnpj("ABC"), false);
  assert.equal(isValidEmail("   "), false);
});

test("validatePassword reports repeated and sequential patterns separately", () => {
  const repeated = validatePassword("AAA111!!!", { minSize: 8 }, { locale: "en" });
  const sequential = validatePassword("Abc123!!", { minSize: 8 }, { locale: "en" });

  assert.match(repeated ?? "", /repeated/i);
  assert.match(sequential ?? "", /sequence/i);
});

test("validateBirthDate handles missing config and invalid dates", () => {
  const missing = validateBirthDate("1990-03-22", {}, { locale: "en" });
  const invalid = validateBirthDate("not-a-date", { minAge: 18 }, { locale: "en" });
  const tooOld = withFixedToday("2026-03-22T00:00:00.000Z", () =>
    validateBirthDate("1900-03-22", { maxAge: 80 }, { locale: "en" })
  );

  assert.match(missing ?? "", /configuration/i);
  assert.match(invalid ?? "", /invalid date/i);
  assert.match(tooOld ?? "", /at most 80/i);
});

test("date helpers return true when bounds are missing", () => {
  assert.equal(isDateAfter("2026-03-22", undefined), true);
  assert.equal(isDateBefore("2026-03-22", undefined), true);
  assert.equal(isDateAfter("", "2026-03-22"), true);
  assert.equal(isDateBefore("", "2026-03-22"), true);
});

test("masks handle partial, legacy and locale-specific formats", () => {
  assert.equal(maskCpf("5299"), "529.9");
  assert.equal(maskCnpj("11A44"), "11.A44");
  assert.equal(maskCpfCnpj("1234567890"), "123.456.789-0");
  assert.equal(maskCep("12345678"), "12345-678");
  assert.equal(maskPostalCodeUY("123456"), "12345");
  assert.equal(maskPostalCodeAR("c1425abcxyz"), "C1425ABC");
  assert.equal(maskPhone("1198765"), "(11) 9876-5");
});
