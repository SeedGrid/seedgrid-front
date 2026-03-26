export function resolvePersistedStateValue<T>(args: {
  loaded: unknown;
  defaultValue: T;
  deserialize: (value: unknown) => T;
}): T {
  const { loaded, defaultValue, deserialize } = args;
  if (loaded === null || loaded === undefined) {
    return defaultValue;
  }
  return deserialize(loaded);
}

export function readLocalPersistentState<T>(args: {
  storage: Pick<Storage, "getItem">;
  baseKey: string;
  defaultValue: T;
  deserialize: (value: unknown) => T;
}): T {
  const { storage, baseKey, defaultValue, deserialize } = args;
  try {
    const raw = storage.getItem(baseKey);
    if (raw === null) {
      return defaultValue;
    }
    return resolvePersistedStateValue({
      loaded: JSON.parse(raw),
      defaultValue,
      deserialize
    });
  } catch {
    return defaultValue;
  }
}

export function writeLocalPersistentState<T>(args: {
  storage: Pick<Storage, "setItem">;
  baseKey: string;
  value: T;
}): void {
  const { storage, baseKey, value } = args;
  storage.setItem(baseKey, JSON.stringify(value));
}

export function clearLocalPersistentState<T>(args: {
  storage: Pick<Storage, "removeItem">;
  baseKey: string;
  defaultValue: T;
}): T {
  const { storage, baseKey, defaultValue } = args;
  storage.removeItem(baseKey);
  return defaultValue;
}
