// seedgrid:managed
"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  delayMs: number,
  normalize?: (nextValue: T) => T
) {
  const normalizeValue = normalize ?? ((nextValue: T) => nextValue);
  const [debouncedValue, setDebouncedValue] = useState(() =>
    normalizeValue(value)
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(normalizeValue(value));
    }, Math.max(0, delayMs));

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayMs, normalizeValue, value]);

  return debouncedValue;
}
