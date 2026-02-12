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

function useSecondTick() {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setTick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
}

export type SgClockProps = {
  variant?: "digital" | "analog" | "instrument";
  size?: "sm" | "md" | "lg" | number;
  timezone?: string;
  locale?: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
  digitalStyle?: "default" | "segment";
  secondHandMode?: "step" | "smooth";
  instrumentMode?: "hours" | "minutes" | "seconds";
  instrumentWindow?: number;
  instrumentRange?: { start: number; end: number };
  instrumentStep?: number;
  instrumentStyle?: "outlined" | "soft";
  instrumentHighlight?: boolean;
  instrumentSmooth?: boolean;
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

const SEGMENTS: Record<string, Array<{ x: number; y: number; w: number; h: number }>> = {
  "0": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 5, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 },
    { x: 0, y: 5, w: 1, h: 4 },
    { x: 0, y: 1, w: 1, h: 4 }
  ],
  "1": [
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 5, y: 5, w: 1, h: 4 }
  ],
  "2": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 },
    { x: 0, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 }
  ],
  "3": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 },
    { x: 5, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 }
  ],
  "4": [
    { x: 0, y: 1, w: 1, h: 4 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 },
    { x: 5, y: 5, w: 1, h: 4 }
  ],
  "5": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 },
    { x: 5, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 }
  ],
  "6": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 },
    { x: 0, y: 5, w: 1, h: 4 },
    { x: 5, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 }
  ],
  "7": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 5, y: 5, w: 1, h: 4 }
  ],
  "8": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 5, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 },
    { x: 0, y: 5, w: 1, h: 4 },
    { x: 0, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 }
  ],
  "9": [
    { x: 1, y: 0, w: 4, h: 1 },
    { x: 5, y: 1, w: 1, h: 4 },
    { x: 5, y: 5, w: 1, h: 4 },
    { x: 1, y: 9, w: 4, h: 1 },
    { x: 0, y: 1, w: 1, h: 4 },
    { x: 1, y: 4.5, w: 4, h: 1 }
  ]
};

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function renderSegmentDigit(digit: string, x: number, y: number, scale: number, keyPrefix: string) {
  const segs = SEGMENTS[digit] ?? [];
  return segs.map((s, idx) => (
    <rect
      key={`${keyPrefix}-${idx}`}
      x={round(x + s.x * scale)}
      y={round(y + s.y * scale)}
      width={round(s.w * scale)}
      height={round(s.h * scale)}
      className="fill-neutral-800 dark:fill-neutral-200"
      rx={round(0.3 * scale)}
    />
  ));
}

function renderSegmentChar(ch: string, x: number, y: number, scale: number, keyPrefix: string) {
  if (ch === ":") {
    return (
      <g key={keyPrefix}>
        <rect
          x={round(x + 2.2 * scale)}
          y={round(y + 2 * scale)}
          width={round(1 * scale)}
          height={round(1 * scale)}
          className="fill-neutral-800 dark:fill-neutral-200"
        />
        <rect
          x={round(x + 2.2 * scale)}
          y={round(y + 7 * scale)}
          width={round(1 * scale)}
          height={round(1 * scale)}
          className="fill-neutral-800 dark:fill-neutral-200"
        />
      </g>
    );
  }
  if (!SEGMENTS[ch]) return null;
  return <g key={keyPrefix}>{renderSegmentDigit(ch, x, y, scale, keyPrefix)}</g>;
}

function renderSegmentText(text: string, sizePx: number) {
  const baseScale = sizePx / 16;
  const digitW = 6 * baseScale;
  const digitH = 10 * baseScale;
  const gap = 1.4 * baseScale;
  const colonW = 4 * baseScale;
  let width = 0;

  for (const ch of text) {
    width += ch === ":" ? colonW : digitW;
    width += gap;
  }
  width -= gap;
  const height = digitH;

  let cursor = 0;
  const nodes: React.ReactNode[] = [];

  text.split("").forEach((ch, idx) => {
    const w = ch === ":" ? colonW : digitW;
    nodes.push(renderSegmentChar(ch, cursor, 0, baseScale, `seg-${idx}`));
    cursor += w + gap;
  });

  return { width, height, nodes };
}

function wrapRange(value: number, start: number, end: number) {
  const size = end - start + 1;
  const v = ((value - start) % size + size) % size;
  return start + v;
}

function getTimeValue(
  date: Date,
  locale: string,
  timeZone: string | undefined,
  mode: "hours" | "minutes" | "seconds",
  smooth: boolean
) {
  const { h, m, s } = getHmsForTimezone(date, locale, timeZone);
  const ms = date.getMilliseconds();

  if (mode === "hours") {
    if (!smooth) return { base: h, frac: 0 };
    const value = h + m / 60 + s / 3600;
    return { base: Math.floor(value), frac: value - Math.floor(value) };
  }
  if (mode === "minutes") {
    if (!smooth) return { base: m, frac: 0 };
    const value = m + s / 60;
    return { base: Math.floor(value), frac: value - Math.floor(value) };
  }
  if (!smooth) return { base: s, frac: 0 };
  const value = s + ms / 1000;
  return { base: Math.floor(value), frac: value - Math.floor(value) };
}

function InstrumentClock({
  size = "md",
  locale = "pt-BR",
  timezone,
  instrumentWindow = 12,
  instrumentRange,
  instrumentStep = 1,
  instrumentStyle = "outlined",
  instrumentHighlight = true,
  instrumentSmooth = true,
  className
}: Omit<SgClockProps, "variant" | "format" | "secondHandMode" | "themeId" | "theme" | "centerOverlay">) {
  const { tick, nowMs } = useSgTime();
  void tick;
  useSecondTick();

  const date = new Date(nowMs());
  const windowSize = instrumentWindow % 2 === 0 ? instrumentWindow + 1 : instrumentWindow;
  const centerIndex = Math.floor(windowSize / 2);

  const cellWidth = typeof size === "number" ? size : size === "sm" ? 36 : size === "lg" ? 64 : 48;
  const height = Math.round(cellWidth * 0.9);
  const pad = instrumentStyle === "soft" ? "bg-muted/40" : "bg-background";
  const border = instrumentStyle === "outlined" ? "border border-border" : "";

  const lastPosRef = React.useRef<Record<"hours" | "minutes" | "seconds", number | null>>({
    hours: null,
    minutes: null,
    seconds: null
  });

  const renderLine = (
    mode: "hours" | "minutes" | "seconds",
    range: { start: number; end: number }
  ) => {
    const { base, frac } = getTimeValue(date, locale, timezone, mode, instrumentSmooth);
    const values = Array.from({ length: windowSize }).map((_, idx) => {
      const offset = (idx - centerIndex) * instrumentStep;
      const value = wrapRange(base + offset, range.start, range.end);
      return value;
    });

    const pos = base + frac;
    const lastPos = lastPosRef.current[mode] ?? null;
    if (lastPos === null) {
      lastPosRef.current[mode] = pos;
    } else if (instrumentSmooth) {
      const rangeSize = range.end - range.start + 1;
      const delta = pos - lastPos;
      if (delta < -rangeSize / 2) {
        lastPosRef.current[mode] = lastPos - rangeSize;
      }
    }

    const translateX = ((lastPosRef.current[mode] ?? pos) - pos) * cellWidth;
    lastPosRef.current[mode] = pos;

    return (
      <div className={cn("relative overflow-hidden rounded-lg", pad, border)} style={{ height }}>
        <div
          className="flex items-center"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: instrumentSmooth ? "transform 60ms linear" : "none"
          }}
        >
          {values.map((v, idx) => {
            const isCenter = idx === centerIndex;
            return (
              <div
                key={`${mode}-${v}-${idx}`}
                className={cn(
                  "flex items-center justify-center font-mono tabular-nums text-muted-foreground",
                  isCenter && instrumentHighlight ? "text-foreground font-semibold" : ""
                )}
                style={{ width: cellWidth, height }}
              >
                {String(v).padStart(2, "0")}
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -top-2 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-foreground" />
            <div className="absolute -bottom-2 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-foreground" />
            <div className="h-full w-0.5 bg-foreground" style={{ height }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("relative w-full max-w-full space-y-3", className)}>
      {renderLine("hours", instrumentRange ?? { start: 0, end: 23 })}
      {renderLine("minutes", instrumentRange ?? { start: 0, end: 59 })}
      {renderLine("seconds", instrumentRange ?? { start: 0, end: 59 })}
    </div>
  );
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
  useSecondTick();

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
  digitalStyle = "default",
  className
}: Omit<SgClockProps, "variant" | "secondHandMode" | "themeId" | "theme" | "centerOverlay">) {
  const { tick, nowMs } = useSgTime();
  void tick;
  useSecondTick();

  const d = new Date(nowMs());
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: format === "12h"
  }).formatToParts(d);

  const getPart = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");
  let dayPeriod = getPart("dayPeriod");

  if (format === "12h" && !dayPeriod) {
    const { h } = getHmsForTimezone(d, locale, timezone);
    dayPeriod = h >= 12 ? "PM" : "AM";
  }

  const text = `${hour}:${minute}${showSeconds ? `:${second}` : ""}`;

  const classSize = sizeToClass(size);
  const fontSize =
    typeof size === "number" ? { fontSize: `${size}px`, lineHeight: 1 } : undefined;
  const sizePx = digitalSizeToNumber(size);

  if (digitalStyle === "segment") {
    const seg = renderSegmentText(text, sizePx);
    return (
      <div className={cn("flex items-end gap-2", className)} aria-label="Digital clock">
        <svg width={seg.width} height={seg.height} viewBox={`0 0 ${seg.width} ${seg.height}`} className="block">
          {seg.nodes}
        </svg>
        {format === "12h" && dayPeriod ? (
          <span className="text-xs font-semibold text-muted-foreground">{dayPeriod}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("font-mono tabular-nums", classSize, className)} style={fontSize}>
      {text}
      {format === "12h" && dayPeriod ? (
        <span className="ml-2 align-top text-xs font-semibold text-muted-foreground">{dayPeriod}</span>
      ) : null}
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
    digitalStyle = "default",
    secondHandMode = "step",
    instrumentMode = "minutes",
    instrumentWindow = 12,
    instrumentRange,
    instrumentStep = 1,
    instrumentStyle = "outlined",
    instrumentHighlight = true,
    instrumentSmooth = true,
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

  if (variant === "instrument") {
    return (
      <InstrumentClock
        size={size}
        locale={locale}
        timezone={timezone}
        instrumentMode={instrumentMode}
        instrumentWindow={instrumentWindow}
        instrumentRange={instrumentRange}
        instrumentStep={instrumentStep}
        instrumentStyle={instrumentStyle}
        instrumentHighlight={instrumentHighlight}
        instrumentSmooth={instrumentSmooth}
        className={className}
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
      digitalStyle={digitalStyle}
      className={className}
    />
  );
}
