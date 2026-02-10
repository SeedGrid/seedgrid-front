export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function onlyAlnumUpper(value: string) {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

export function maskCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);
  const out = [part1, part2, part3].filter(Boolean).join(".");
  return part4 ? `${out}-${part4}` : out;
}

export function maskCnpj(value: string) {
  const chars = onlyAlnumUpper(value).slice(0, 14);
  const part1 = chars.slice(0, 2);
  const part2 = chars.slice(2, 5);
  const part3 = chars.slice(5, 8);
  const part4 = chars.slice(8, 12);
  const part5 = chars.slice(12, 14);
  let out = [part1, part2, part3].filter(Boolean).join(".");
  if (part4) out += `/${part4}`;
  if (part5) out += `-${part5}`;
  return out;
}

export function maskCpfCnpj(value: string) {
  const alnum = onlyAlnumUpper(value);
  if (/[A-Z]/.test(alnum)) {
    return maskCnpj(alnum);
  }
  const digits = onlyDigits(value);
  return digits.length <= 11 ? maskCpf(digits) : maskCnpj(digits);
}

export function maskCep(value: string) {
  return maskPostalCodeBR(value);
}

// BR: 00000-000 (8 digits)
export function maskPostalCodeBR(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 8);
  return part2 ? `${part1}-${part2}` : part1;
}

// PT: 0000-000 (7 digits)
export function maskPostalCodePT(value: string) {
  const digits = onlyDigits(value).slice(0, 7);
  const part1 = digits.slice(0, 4);
  const part2 = digits.slice(4, 7);
  return part2 ? `${part1}-${part2}` : part1;
}

// US: 00000 or 00000-0000 (5 or 9 digits)
export function maskPostalCodeUS(value: string) {
  const digits = onlyDigits(value).slice(0, 9);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 9);
  return part2 ? `${part1}-${part2}` : part1;
}

// ES: 00000 (5 digits)
export function maskPostalCodeES(value: string) {
  return onlyDigits(value).slice(0, 5);
}

// UY: 00000 (5 digits)
export function maskPostalCodeUY(value: string) {
  return onlyDigits(value).slice(0, 5);
}

// AR: A0000AAA (1 letter + 4 digits + 3 letters) or legacy 0000 (4 digits)
export function maskPostalCodeAR(value: string) {
  const clean = value.replaceAll(/[^0-9A-Za-z]/g, "").toUpperCase().slice(0, 8);
  return clean;
}

// PY: 000000 (6 digits)
export function maskPostalCodePY(value: string) {
  return onlyDigits(value).slice(0, 6);
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  const ddd = digits.slice(0, 2);
  const part1 = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const part2 = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);
  if (!ddd) return digits;
  if (!part1) return `(${ddd}`;
  if (!part2) return `(${ddd}) ${part1}`;
  return `(${ddd}) ${part1}-${part2}`;
}
