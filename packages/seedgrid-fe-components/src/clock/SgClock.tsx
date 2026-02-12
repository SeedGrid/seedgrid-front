"use client";

import * as React from "react";
import { useSgTime } from "./SgTimeProvider";
import { useSgClockThemeResolver } from "./themes/provider";
import { ThemeLayer, resolveTheme } from "./themes/renderTheme";
import { useDarkFlag } from "./themes/useDarkFlag";
import type { SgClockTheme } from "./themes/types";
import { getTheme } from "./themes/registry";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgClockProps = {
  variant?: "digital" | "analog";
  size?: "sm" | "md" | "lg" | number;
  timezone?: string;
  locale?: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
  secondHandMode?: "step" | "smooth";
  themeId?: string;
  theme?: SgClockTheme;
  className?: string;
  centerOverlay?: React.ReactNode;
};

function getHmsForTimezone(date: Date, locale: string, timeZone?: string) {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type: string) => {
    const p = parts.find((x) => x.type === type)?.value ?? "0";
    const n = Number.parseInt(p, 10);
    return Number.isFinite(n) ? n : 0;
  };

  return { h: get("hour"), m: get("minute"), s: get("second") };
}

function sizeToClass(size: SgClockProps["size"]) {
  if (typeof size === "number") return "";
  if (size === "sm") return "text-sm";
  if (size === "lg") return "text-2xl";
  return "text-base";
}

function digitalSizeToNumber(size: SgClockProps["size"]) {
  if (typeof size === "number") return size;
  if (size === "sm") return 12;
  if (size === "lg") return 28;
  return 16;
}

function AnalogClock({
  size = 280,
  timezone,
  locale = "pt-BR",
  showSeconds = true,
  secondHandMode = "step",
  themeId = "classic",
  theme,
  className,
  centerOverlay
}: Omit<SgClockProps, "variant" | "format" | "size"> & { size: number }) {
  const { tick, nowMs } = useSgTime();
  void tick;

  const resolver = useSgClockThemeResolver();
  const dark = useDarkFlag();

  const date = new Date(nowMs());
  const { h, m, s } = getHmsForTimezone(date, locale, timezone);
  const ms = date.getMilliseconds();
  const sec = secondHandMode === "smooth" ? s + ms / 1000 : s;

  const secDeg = (sec / 60) * 360;
  const minDeg = ((m + sec / 60) / 60) * 360;
  const hourDeg = (((h % 12) + m / 60 + sec / 3600) / 12) * 360;

  const themeObj =
    theme ??
    (resolver ? resolveTheme(resolver, themeId, "classic") : getTheme(themeId) ?? getTheme("classic"));

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="block" aria-label="Analog clock">
        <g id="theme">{themeObj ? <ThemeLayer theme={themeObj} args={{ size, dark }} /> : null}</g>

        <g id="hands">
          <g transform={`rotate(${hourDeg} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="28"
              className="stroke-neutral-800 dark:stroke-neutral-200"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
          <g transform={`rotate(${minDeg} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              className="stroke-neutral-800 dark:stroke-neutral-200"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </g>
          {showSeconds && (
            <g transform={`rotate(${secDeg} 50 50)`}>
              <line
                x1="50"
                y1="54"
                x2="50"
                y2="14"
                className="stroke-rose-500"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>

        <circle cx="50" cy="50" r="2.2" className="fill-neutral-800 dark:fill-neutral-200" />
        {showSeconds ? <circle cx="50" cy="50" r="1.1" className="fill-rose-500" /> : null}

        {centerOverlay ? (
          <foreignObject x="35" y="35" width="30" height="30">
            <div className="flex h-full w-full items-center justify-center">{centerOverlay}</div>
          </foreignObject>
        ) : null}
      </svg>
    </div>
  );
}

function DigitalClock({
  timezone,
  locale = "pt-BR",
  format = "24h",
  showSeconds = true,
  size = "md",
  className
}: Omit<SgClockProps, "variant" | "secondHandMode" | "themeId" | "theme" | "centerOverlay">) {
  const { tick, nowMs } = useSgTime();
  void tick;

  const d = new Date(nowMs());
  const text = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: format === "12h"
  }).format(d);

  const classSize = sizeToClass(size);
  const fontSize =
    typeof size === "number" ? { fontSize: `${size}px`, lineHeight: 1 } : undefined;

  return (
    <div className={cn("font-mono tabular-nums", classSize, className)} style={fontSize}>
      {text}
    </div>
  );
}

export function SgClock(props: SgClockProps) {
  const {
    variant = "digital",
    size = "md",
    timezone,
    locale = "pt-BR",
    format = "24h",
    showSeconds = true,
    secondHandMode = "step",
    themeId = "classic",
    theme,
    className,
    centerOverlay
  } = props;

  if (variant === "analog") {
    const analogSize = typeof size === "number" ? size : size === "sm" ? 140 : size === "lg" ? 320 : 240;
    return (
      <AnalogClock
        size={analogSize}
        themeId={themeId}
        theme={theme}
        timezone={timezone}
        locale={locale}
        showSeconds={showSeconds}
        secondHandMode={secondHandMode}
        className={className}
        centerOverlay={centerOverlay}
      />
    );
  }

  return (
    <DigitalClock
      timezone={timezone}
      locale={locale}
      format={format}
      showSeconds={showSeconds}
      size={size}
      className={className}
    />
  );
}
