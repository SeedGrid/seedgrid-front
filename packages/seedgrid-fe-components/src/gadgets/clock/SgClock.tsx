"use client";

import * as React from "react";
import { useSgTimeContext } from "./SgTimeProvider";
import { useSgClockThemeResolver } from "./themes/provider";
import { ThemeLayer, resolveTheme } from "./themes/renderTheme";
import { useDarkFlag } from "./themes/useDarkFlag";
import type { SgClockTheme } from "./themes/types";
import { getTheme } from "./themes/registry";
import { SgFlipDigit } from "../../digits/flip-digit";
import { SgRoller3DDigit } from "../../digits/roller3d-digit";
import { SgFadeDigit } from "../../digits/fade-digit";
import { SgMatrixDigit } from "../../digits/matrix-digit";
import { SgNeonDigit } from "../../digits/neon-digit";
import { SgDiscardDigit } from "../../digits/discard-digit";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useSecondTick(enabled = true) {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);
}

function parseInitialServerMs(initialServerTime?: string) {
  if (!initialServerTime) return Date.now();
  const parsed = Date.parse(initialServerTime);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function useClockNowMs(initialServerTime?: string) {
  const ctx = useSgTimeContext();
  const [seedMs] = React.useState(() => parseInitialServerMs(initialServerTime));
  const perfStartMsRef = React.useRef(0);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    perfStartMsRef.current = performance.now();
    setHydrated(true);
  }, []);

  const nowMs = React.useCallback(() => {
    if (ctx) return ctx.nowMs();
    if (!hydrated) return seedMs;
    const delta = performance.now() - perfStartMsRef.current;
    return seedMs + delta;
  }, [ctx, hydrated, seedMs]);

  return { nowMs, hasProvider: Boolean(ctx), providerTick: ctx?.tick ?? 0 };
}

export type SgClockProps = {
  variant?: "digital" | "analog";
  size?: "sm" | "md" | "lg" | number;
  initialServerTime?: string;
  timezone?: string;
  locale?: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
  digitalStyle?: SgClockDigitalStyle;
  secondHandMode?: "step" | "smooth";
  themeId?: string;
  theme?: SgClockTheme;
  className?: string;
  centerOverlay?: React.ReactNode;
};

export type SgClockDigitalStyle =
  | "default"
  | "segment"
  | "roller3d"
  | "flip"
  | "fade"
  | "matrix"
  | "neon"
  | "discard";

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

function buildRange(min: number, max: number) {
  const out: number[] = [];
  for (let i = min; i <= max; i += 1) out.push(i);
  return out;
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


function AnalogClock({
  size = 280,
  initialServerTime,
  timezone,
  locale = "pt-BR",
  showSeconds = true,
  secondHandMode = "step",
  themeId = "classic",
  theme,
  className,
  centerOverlay
}: Omit<SgClockProps, "variant" | "format" | "size"> & { size: number }) {
  const { nowMs, hasProvider, providerTick } = useClockNowMs(initialServerTime);
  void providerTick;
  useSecondTick(!hasProvider);

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
  initialServerTime,
  timezone,
  locale = "pt-BR",
  format = "24h",
  showSeconds = true,
  size = "md",
  digitalStyle = "default",
  className
}: Omit<SgClockProps, "variant" | "secondHandMode" | "themeId" | "theme" | "centerOverlay">) {
  const { nowMs, hasProvider, providerTick } = useClockNowMs(initialServerTime);
  void providerTick;
  useSecondTick(!hasProvider);

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
  const withPeriod =
    format === "12h" && dayPeriod ? `${text} ${dayPeriod.toUpperCase()}` : text;

  if (digitalStyle === "flip") {
    const hNum = Number.parseInt(hour, 10) || 0;
    const mNum = Number.parseInt(minute, 10) || 0;
    const sNum = Number.parseInt(second || "0", 10) || 0;
    const safeHour = format === "12h" ? (hNum === 0 ? 12 : hNum) : hNum;
    const hh = String(safeHour).padStart(2, "0");
    const mm = String(mNum).padStart(2, "0");
    const ss = String(sNum).padStart(2, "0");

    // fontSize drives all sizing in SgFlipDigit/@pqina/flip
    const digitFont = Math.round(sizePx * 1.4);
    // Approx card height: fontSize * line-height(1.4) from the library CSS
    const cardH = Math.round(digitFont * 1.4);

    const Colon = () => (
      <div className="flex flex-col items-center justify-center gap-2" style={{ height: cardH }}>
        <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
        <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
      </div>
    );

    const PeriodCell = ({ value }: { value: string }) => (
      <div
        className="flex items-center justify-center rounded bg-[#333232]"
        style={{
          height: cardH,
          padding: `0 ${Math.round(sizePx * 0.4)}px`,
          boxShadow: "0 .125em .3125em rgba(0,0,0,.25)",
        }}
      >
        <span style={{ fontSize: Math.round(sizePx * 0.9), color: "#edebeb", fontWeight: 700, lineHeight: 1 }}>
          {value}
        </span>
      </div>
    );

    return (
      <div className={cn("flex items-center gap-2", className)} aria-label="Digital clock">
        <SgFlipDigit value={hh.charAt(0)} fontSize={digitFont} />
        <SgFlipDigit value={hh.charAt(1)} fontSize={digitFont} />
        <Colon />
        <SgFlipDigit value={mm.charAt(0)} fontSize={digitFont} />
        <SgFlipDigit value={mm.charAt(1)} fontSize={digitFont} />
        {showSeconds ? (
          <>
            <Colon />
            <SgFlipDigit value={ss.charAt(0)} fontSize={digitFont} />
            <SgFlipDigit value={ss.charAt(1)} fontSize={digitFont} />
          </>
        ) : null}
        {format === "12h" && dayPeriod ? <PeriodCell value={dayPeriod.toUpperCase()} /> : null}
      </div>
    );
  }

  if (digitalStyle === "roller3d") {
    const hNum = Number.parseInt(hour, 10) || 0;
    const mNum = Number.parseInt(minute, 10) || 0;
    const sNum = Number.parseInt(second || "0", 10) || 0;
    const hourMax = format === "12h" ? 12 : 23;
    const hourMin = format === "12h" ? 1 : 0;
    const safeHour = format === "12h" ? (hNum === 0 ? 12 : hNum) : hNum;

    const hourItems = buildRange(hourMin, hourMax).map((n) => String(n).padStart(2, "0"));
    const minuteItems = buildRange(0, 59).map((n) => String(n).padStart(2, "0"));
    const secondItems = buildRange(0, 59).map((n) => String(n).padStart(2, "0"));
    const periodItems = ["AM", "PM"];

    const digitFont = Math.round(sizePx * 1.35);
    const hh = String(safeHour).padStart(2, "0");
    const mm = String(mNum).padStart(2, "0");
    const ss = String(sNum).padStart(2, "0");

    return (
      <div className={cn("flex items-center gap-4", className)} style={fontSize} aria-label="Digital clock">
        <SgRoller3DDigit value={hh} items={hourItems} fontSize={digitFont} />
        <SgRoller3DDigit value={mm} items={minuteItems} fontSize={digitFont} />
        {showSeconds ? <SgRoller3DDigit value={ss} items={secondItems} fontSize={digitFont} /> : null}
        {format === "12h" && dayPeriod ? (
          <SgRoller3DDigit value={dayPeriod.toUpperCase()} items={periodItems} fontSize={digitFont} />
        ) : null}
      </div>
    );
  }

  if (digitalStyle === "fade") {
    const hNum = Number.parseInt(hour, 10) || 0;
    const mNum = Number.parseInt(minute, 10) || 0;
    const sNum = Number.parseInt(second || "0", 10) || 0;
    const safeHour = format === "12h" ? (hNum === 0 ? 12 : hNum) : hNum;
    const hh = String(safeHour).padStart(2, "0");
    const mm = String(mNum).padStart(2, "0");
    const ss = String(sNum).padStart(2, "0");
    const digitFont = Math.round(sizePx * 1.35);
    const cardH = Math.round(digitFont * 1.4);

    const Colon = () => (
      <div className="flex flex-col items-center justify-center gap-2" style={{ height: cardH }}>
        <div className="h-2 w-2 rounded-full bg-neutral-500/70" />
        <div className="h-2 w-2 rounded-full bg-neutral-500/70" />
      </div>
    );

    return (
      <div className={cn("flex items-center gap-2", className)} aria-label="Digital clock">
        <SgFadeDigit value={hh.charAt(0)} fontSize={digitFont} />
        <SgFadeDigit value={hh.charAt(1)} fontSize={digitFont} />
        <Colon />
        <SgFadeDigit value={mm.charAt(0)} fontSize={digitFont} />
        <SgFadeDigit value={mm.charAt(1)} fontSize={digitFont} />
        {showSeconds ? (
          <>
            <Colon />
            <SgFadeDigit value={ss.charAt(0)} fontSize={digitFont} />
            <SgFadeDigit value={ss.charAt(1)} fontSize={digitFont} />
          </>
        ) : null}
        {format === "12h" && dayPeriod ? (
          <span className="text-xs font-semibold text-muted-foreground">{dayPeriod.toUpperCase()}</span>
        ) : null}
      </div>
    );
  }

  if (digitalStyle === "discard") {
    const hNum = Number.parseInt(hour, 10) || 0;
    const mNum = Number.parseInt(minute, 10) || 0;
    const sNum = Number.parseInt(second || "0", 10) || 0;
    const safeHour = format === "12h" ? (hNum === 0 ? 12 : hNum) : hNum;
    const hh = String(safeHour).padStart(2, "0");
    const mm = String(mNum).padStart(2, "0");
    const ss = String(sNum).padStart(2, "0");
    const digitFont =
      typeof size === "number"
        ? Math.max(36, Math.round(sizePx * 2.2))
        : size === "sm"
          ? 38
          : size === "lg"
            ? 56
            : 44;

    const pagesForDigit = (digit: string) => {
      const n = Number.parseInt(digit, 10);
      if (!Number.isFinite(n)) return 1;
      return Math.max(1, Math.min(30, n));
    };

    const Colon = () => (
      <SgDiscardDigit
        value=":"
        fontSize={Math.max(26, Math.round(digitFont * 0.72))}
        totalNumberPages={1}
        transitionMs={560}
        animateOnChange={false}
      />
    );

    const PeriodCell = ({ value }: { value: string }) => (
      <SgDiscardDigit
        value={value}
        fontSize={Math.max(20, Math.round(digitFont * 0.52))}
        totalNumberPages={1}
        transitionMs={560}
        animateOnChange={false}
      />
    );

    return (
      <div className={cn("flex items-end gap-2", className)} aria-label="Digital clock">
        <SgDiscardDigit value={hh.charAt(0)} fontSize={digitFont} totalNumberPages={pagesForDigit(hh.charAt(0))} transitionMs={560} changeAnimationMode="incoming" />
        <SgDiscardDigit value={hh.charAt(1)} fontSize={digitFont} totalNumberPages={pagesForDigit(hh.charAt(1))} transitionMs={560} changeAnimationMode="incoming" />
        <Colon />
        <SgDiscardDigit value={mm.charAt(0)} fontSize={digitFont} totalNumberPages={pagesForDigit(mm.charAt(0))} transitionMs={560} changeAnimationMode="incoming" />
        <SgDiscardDigit value={mm.charAt(1)} fontSize={digitFont} totalNumberPages={pagesForDigit(mm.charAt(1))} transitionMs={560} changeAnimationMode="incoming" />
        {showSeconds ? (
          <>
            <Colon />
            <SgDiscardDigit value={ss.charAt(0)} fontSize={digitFont} totalNumberPages={pagesForDigit(ss.charAt(0))} transitionMs={560} changeAnimationMode="incoming" />
            <SgDiscardDigit value={ss.charAt(1)} fontSize={digitFont} totalNumberPages={pagesForDigit(ss.charAt(1))} transitionMs={560} changeAnimationMode="incoming" />
          </>
        ) : null}
        {format === "12h" && dayPeriod ? <PeriodCell value={dayPeriod.toUpperCase()} /> : null}
      </div>
    );
  }

  if (digitalStyle === "matrix") {
    const dotSize = Math.max(3, Math.round(sizePx * 0.32));
    return (
      <div className={cn("flex items-center", className)} aria-label="Digital clock">
        <SgMatrixDigit
          value={withPeriod}
          dotSize={dotSize}
          gap={Math.max(1, Math.round(dotSize * 0.35))}
          charGap={Math.max(3, Math.round(dotSize * 0.9))}
          padding={Math.max(6, Math.round(dotSize * 1.3))}
          rounded={Math.max(8, Math.round(dotSize * 1.1))}
        />
      </div>
    );
  }

  if (digitalStyle === "neon") {
    const neonFont = Math.max(18, Math.round(sizePx * 1.35));
    return (
      <div className={cn("flex items-center", className)} aria-label="Digital clock">
        <SgNeonDigit
          value={withPeriod}
          fontSize={neonFont}
          padding={Math.max(8, Math.round(sizePx * 0.6))}
          rounded={Math.max(10, Math.round(sizePx * 0.45))}
        />
      </div>
    );
  }

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
    initialServerTime,
    timezone,
    locale = "pt-BR",
    format = "24h",
    showSeconds = true,
    digitalStyle = "default",
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
        initialServerTime={initialServerTime}
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
      initialServerTime={initialServerTime}
      locale={locale}
      format={format}
      showSeconds={showSeconds}
      size={size}
      digitalStyle={digitalStyle}
      className={className}
    />
  );
}
