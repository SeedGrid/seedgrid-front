export function parseStoredFabDragPosition(raw: unknown): { x: number; y: number } | null {
  const value = typeof raw === "string"
    ? (() => {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })()
    : raw;

  if (
    !value ||
    typeof value !== "object" ||
    typeof (value as { x?: unknown }).x !== "number" ||
    typeof (value as { y?: unknown }).y !== "number" ||
    !Number.isFinite((value as { x: number }).x) ||
    !Number.isFinite((value as { y: number }).y)
  ) {
    return null;
  }

  return {
    x: (value as { x: number }).x,
    y: (value as { y: number }).y
  };
}

export function buildFabStorageKey(dragId?: string | null): string | null {
  if (!dragId) return null;
  return `sg-fab-pos:${dragId}`;
}
