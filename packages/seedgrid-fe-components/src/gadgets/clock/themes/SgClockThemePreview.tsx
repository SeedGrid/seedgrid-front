"use client";

import * as React from "react";
import type { SgClockTheme } from "./types";
import { ThemeLayer } from "./renderTheme";
import { useDarkFlag } from "./useDarkFlag";

export function SgClockThemePreview({
  theme,
  size = 64,
  className
}: {
  theme: SgClockTheme;
  size?: number;
  className?: string;
}) {
  const dark = useDarkFlag();

  const hourDeg = 305;
  const minDeg = 60;
  const secDeg = 180;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className ?? "block"}
      aria-hidden="true"
    >
      <g id="theme">
        <ThemeLayer theme={theme} args={{ size, dark }} />
      </g>

      <g id="hands" opacity="0.9">
        <g transform={`rotate(${hourDeg} 50 50)`}>
          <line x1="50" y1="50" x2="50" y2="32" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${minDeg} 50 50)`}>
          <line x1="50" y1="50" x2="50" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${secDeg} 50 50)`} opacity="0.7">
          <line x1="50" y1="54" x2="50" y2="16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="50" r="2.2" fill="currentColor" />
      </g>
    </svg>
  );
}
