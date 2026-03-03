import blockedEmailDomainsConfig from "./blocked-email-domains.js";
import { resolveComponentsI18n, t, type SgComponentsI18n, type SgComponentsI18nInput } from "./i18n";

type BlockedEmailDomainsConfig = {
  blockedEmailDomains?: string[];
};

export const DEFAULT_BLOCKED_EMAIL_DOMAINS = (
  blockedEmailDomainsConfig as BlockedEmailDomainsConfig
).blockedEmailDomains ?? [];

type SeedgridGlobal = {
  __seedgridBlockedEmailDomains?: string[];
};

function getRuntimeBlockedEmailDomains() {
  if (typeof globalThis === "undefined") return [];
  const globalConfig = globalThis as SeedgridGlobal;
  if (!Array.isArray(globalConfig.__seedgridBlockedEmailDomains)) return [];
  return globalConfig.__seedgridBlockedEmailDomains;
}

export function getBlockedEmailDomains(extra?: string[]) {
  const merged = [
    ...DEFAULT_BLOCKED_EMAIL_DOMAINS,
    ...getRuntimeBlockedEmailDomains(),
    ...(extra ?? [])
  ];
  const normalized = merged
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

export function isBlockedEmailDomain(email: string, extra?: string[]) {
  const parts = email.trim().toLowerCase().split("@");
  const domain = parts.length > 1 ? parts[parts.length - 1] : "";
  if (!domain) return false;
  const blocked = new Set(getBlockedEmailDomains(extra));
  return blocked.has(domain);
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function onlyAlnumUpper(value: string) {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

export function isValidCpf(value: string) {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calc = (factor: number) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i++) {
      total += parseInt(digits.charAt(i), 10) * (factor - i);
    }
    const mod = total % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calc(10);
  const d2 = calc(11);
  return d1 === parseInt(digits.charAt(9), 10) && d2 === parseInt(digits.charAt(10), 10);
}

export function isValidCnpj(value: string) {
  const raw = onlyAlnumUpper(value);
  if (raw.length !== 14) return false;

  // opcional: eu manteria so para CNPJ numerico.
  // Para alfanumerico, isso pode bloquear casos "ok" (embora improvaveis).
  // if (/^([0-9A-Z])\1+$/.test(raw)) return false;

  if (/[A-Z]/.test(raw.slice(12))) return false; // DV precisa ser numerico

  const toValue = (char: string) => {
    if (char >= "0" && char <= "9") return char.charCodeAt(0) - 48;
    if (char >= "A" && char <= "Z") return char.charCodeAt(0) - 55; // A=10..Z=35
    return Number.NaN;
  };

  const calc = (base: string, weights: readonly number[]) => {
    let total = 0;

    for (let i = 0; i < weights.length; i++) {
      const weight = weights[i];
      const v = toValue(base.charAt(i));

      if (weight === undefined || Number.isNaN(v)) return Number.NaN;

      total += v * weight;
    }

    const mod = total % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base12 = raw.slice(0, 12);

  const d1 = calc(base12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (!Number.isFinite(d1)) return false;

  const d2 = calc(base12 + String(d1), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (!Number.isFinite(d2)) return false;

  return d1 === Number(raw.charAt(12)) && d2 === Number(raw.charAt(13));
}

export function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value.trim());
}

function hasSequentialRun(value: string, minRun: number) {
  if (value.length < minRun) return false;
  let asc = 1;
  let desc = 1;

  for (let i = 1; i < value.length; i++) {
    const prev = value.charAt(i - 1).toLowerCase();
    const curr = value.charAt(i).toLowerCase();
    const letters = /[a-z]/.test(prev) && /[a-z]/.test(curr);
    const digits = /\d/.test(prev) && /\d/.test(curr);

    if (letters || digits) {
      if (curr.charCodeAt(0) - prev.charCodeAt(0) === 1) {
        asc += 1;
        desc = 1;
      } else if (prev.charCodeAt(0) - curr.charCodeAt(0) === 1) {
        desc += 1;
        asc = 1;
      } else {
        asc = 1;
        desc = 1;
      }
    } else {
      asc = 1;
      desc = 1;
    }

    if (asc >= minRun || desc >= minRun) return true;
  }
  return false;
}

function hasRepeatedSequence(value: string) {
  if (/(.)\1{2,}/.test(value)) return true;
  return /([A-Za-z0-9])([^A-Za-z0-9])\1(?:\2\1){2,}/.test(value);
}

export type PasswordPolicy = {
  minSize?: number;
  upper?: boolean;
  lower?: boolean;
  number?: boolean;
  special?: boolean;
  noRepeat?: boolean;
  expirationDays?: number;
  maxHistory?: number;
};

export function validatePassword(
  value: string,
  policy: PasswordPolicy = {},
  i18n?: SgComponentsI18nInput | SgComponentsI18n
) {
  const resolvedI18n = resolveComponentsI18n(i18n);

  if (!value || !value.trim()) return t(resolvedI18n, "components.validators.password.empty");

  const minSize = Math.max(1, policy.minSize ?? 8);
  const upper = policy.upper ?? true;
  const lower = policy.lower ?? true;
  const number = policy.number ?? true;
  const special = policy.special ?? true;
  const noRepeat = policy.noRepeat ?? true;

  const problems: string[] = [];
  if (value.length < minSize) {
    problems.push(t(resolvedI18n, "components.validators.password.minSize", { min: minSize }));
  }
  if (upper && !/[A-Z]/.test(value)) problems.push(t(resolvedI18n, "components.validators.password.upper"));
  if (lower && !/[a-z]/.test(value)) problems.push(t(resolvedI18n, "components.validators.password.lower"));
  if (number && !/\d/.test(value)) problems.push(t(resolvedI18n, "components.validators.password.number"));
  if (special && !/[^A-Za-z0-9]/.test(value)) {
    problems.push(t(resolvedI18n, "components.validators.password.special"));
  }
  if (noRepeat && hasSequentialRun(value, 3)) {
    problems.push(t(resolvedI18n, "components.validators.password.sequence"));
  }
  if (noRepeat && hasRepeatedSequence(value)) {
    problems.push(t(resolvedI18n, "components.validators.password.repeated"));
  }

  if (problems.length) {
    return t(resolvedI18n, "components.validators.password.invalid", { reasons: problems.join("; ") });
  }
  return null;
}

export function isDateAfter(value: string, minDate?: string) {
  if (!value || !minDate) return true;
  return new Date(value).getTime() >= new Date(minDate).getTime();
}

export function isDateBefore(value: string, maxDate?: string) {
  if (!value || !maxDate) return true;
  return new Date(value).getTime() <= new Date(maxDate).getTime();
}

export type BirthDatePolicy = {
  minAge?: number;
  maxAge?: number;
};

function calculateAge(birthDate: Date, today: Date) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

export function validateBirthDate(
  value: string,
  policy: BirthDatePolicy,
  i18n?: SgComponentsI18nInput | SgComponentsI18n
) {
  const resolvedI18n = resolveComponentsI18n(i18n);
  const minAge = policy.minAge;
  const maxAge = policy.maxAge;
  const hasMin = typeof minAge === "number" && minAge >= 0;
  const hasMax = typeof maxAge === "number" && maxAge >= 0;

  if (!hasMin && !hasMax) {
    return t(resolvedI18n, "components.validators.birthdate.configMissing");
  }
  if (hasMin && hasMax && (minAge as number) > (maxAge as number)) {
    return t(resolvedI18n, "components.validators.birthdate.configRange");
  }
  if (!value) return null;

  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return t(resolvedI18n, "components.validators.birthdate.invalidDate");

  const today = new Date();
  const age = calculateAge(birth, today);
  const ok = (!hasMin || age >= (minAge as number)) && (!hasMax || age <= (maxAge as number));
  if (ok) return null;

  if (hasMin && hasMax) {
    const min = minAge ?? 0;
    const max = maxAge ?? 0;
    return t(resolvedI18n, "components.validators.birthdate.ageBetween", { min, max });
  }
  if (hasMin) {
    const min = minAge ?? 0;
    return t(resolvedI18n, "components.validators.birthdate.ageMin", { min });
  }
  const max = maxAge ?? 0;
  return t(resolvedI18n, "components.validators.birthdate.ageMax", { max });
}
