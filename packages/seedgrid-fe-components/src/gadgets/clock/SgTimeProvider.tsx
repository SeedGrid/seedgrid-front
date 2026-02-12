"use client";

import * as React from "react";

export type SgTimeContextValue = {
  serverStartMs: number;
  perfStartMs: number;
  tick: number;
  nowMs: () => number;
};

const SgTimeContext = React.createContext<SgTimeContextValue | null>(null);

export function useSgTime() {
  const ctx = React.useContext(SgTimeContext);
  if (!ctx) throw new Error("useSgTime must be used within <SgTimeProvider />");
  return ctx;
}

export function SgTimeProvider({
  initialServerTime,
  children
}: {
  initialServerTime: string;
  children: React.ReactNode;
}) {
  const serverStartMsRef = React.useRef<number>(Date.parse(initialServerTime));
  const perfStartMsRef = React.useRef<number>(0);
  const [tick, setTick] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    perfStartMsRef.current = performance.now();
    setHydrated(true);

    const alignDelay = 1000 - (Date.now() % 1000);
    let intervalId: number | null = null;

    const timeoutId = window.setTimeout(() => {
      setTick((x) => x + 1);
      intervalId = window.setInterval(() => setTick((x) => x + 1), 1000);
    }, alignDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  const nowMs = React.useCallback(() => {
    if (!hydrated) return serverStartMsRef.current;
    const delta = performance.now() - perfStartMsRef.current;
    return serverStartMsRef.current + delta;
  }, [hydrated]);

  const value = React.useMemo<SgTimeContextValue>(
    () => ({
      serverStartMs: serverStartMsRef.current,
      perfStartMs: perfStartMsRef.current,
      tick,
      nowMs
    }),
    [tick, nowMs]
  );

  return <SgTimeContext.Provider value={value}>{children}</SgTimeContext.Provider>;
}
