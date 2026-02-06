export type SeedGridLocale = "pt-BR";

export type SeedGridMessages = Record<string, Record<string, string>>;

export function mergeMessages(target: SeedGridMessages, add: SeedGridMessages): SeedGridMessages {
  const out: SeedGridMessages = { ...target };
  for (const ns of Object.keys(add)) {
    out[ns] = { ...(out[ns] ?? {}), ...(add[ns] ?? {}) };
  }
  return out;
}
