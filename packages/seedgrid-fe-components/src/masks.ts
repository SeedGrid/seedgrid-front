export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
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
  const digits = onlyDigits(value).slice(0, 14);
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5, 8);
  const part4 = digits.slice(8, 12);
  const part5 = digits.slice(12, 14);
  let out = [part1, part2, part3].filter(Boolean).join(".");
  if (part4) out += `/${part4}`;
  if (part5) out += `-${part5}`;
  return out;
}

export function maskCpfCnpj(value: string) {
  const digits = onlyDigits(value);
  return digits.length <= 11 ? maskCpf(digits) : maskCnpj(digits);
}

export function maskCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 8);
  return part2 ? `${part1}-${part2}` : part1;
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
