"use client";

import * as React from "react";
import type { SgClockTheme } from "./types";

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polar(r: number, a: number) {
  return { x: round(50 + r * Math.sin(a)), y: round(50 - r * Math.cos(a)) };
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

function renderSevenSegDigit(digit: string, x: number, y: number, scale: number) {
  const segs = SEGMENTS[digit] ?? [];
  return segs.map((s, idx) => (
    <rect
      key={`${digit}-${idx}`}
      x={round(x + s.x * scale)}
      y={round(y + s.y * scale)}
      width={round(s.w * scale)}
      height={round(s.h * scale)}
      className="fill-neutral-700 dark:fill-neutral-300"
      rx={round(0.3 * scale)}
    />
  ));
}

function renderSevenSegNumber(num: number, cx: number, cy: number, scale: number) {
  const digits = String(num).split("");
  const w = 6 * scale;
  const gap = 1.2 * scale;
  const total = digits.length * w + (digits.length - 1) * gap;
  const startX = cx - total / 2;
  const startY = cy - (10 * scale) / 2;

  return digits.map((d, i) => (
    <g key={`${num}-${i}`}>{renderSevenSegDigit(d, startX + i * (w + gap), startY, scale)}</g>
  ));
}

const ThemeClassic = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-neutral-100 dark:fill-neutral-900" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-300 dark:stroke-neutral-700" />
    {Array.from({ length: 60 }).map((_, i) => {
      const major = i % 5 === 0;
      const len = major ? 4 : 2;
      const r1 = 46;
      const r2 = r1 - len;
      const a = (i * Math.PI) / 30;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className={major ? "stroke-neutral-400 stroke-[0.9]" : "stroke-neutral-400 stroke-[0.6]"}
          strokeLinecap="round"
        />
      );
    })}
    {Array.from({ length: 12 }).map((_, idx) => {
      const n = idx + 1;
      const a = (n * Math.PI) / 6;
      const r = 34;
      const p = polar(r, a);
      return (
        <text
          key={n}
          x={p.x}
          y={round(p.y + 3)}
          textAnchor="middle"
          className="fill-neutral-800 text-[6px] font-semibold dark:fill-neutral-200"
        >
          {n}
        </text>
      );
    })}
  </>
);

const ThemeMinimal = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-200 dark:stroke-neutral-800" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const r1 = 46;
      const r2 = 42;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.1]"
          strokeLinecap="round"
        />
      );
    })}
  </>
);

const ThemeDark = () => (
  <>
    <defs>
      <radialGradient id="sgClockDarkGrad" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="rgb(30 41 59)" />
        <stop offset="100%" stopColor="rgb(2 6 23)" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#sgClockDarkGrad)" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-700" />
    {Array.from({ length: 60 }).map((_, i) => {
      const major = i % 5 === 0;
      const len = major ? 4 : 2;
      const r1 = 46;
      const r2 = r1 - len;
      const a = (i * Math.PI) / 30;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className={major ? "stroke-neutral-400 stroke-[0.9]" : "stroke-neutral-600 stroke-[0.6]"}
          strokeLinecap="round"
        />
      );
    })}
    {Array.from({ length: 12 }).map((_, idx) => {
      const n = idx + 1;
      const a = (n * Math.PI) / 6;
      const r = 34;
      const p = polar(r, a);
      return (
        <text
          key={n}
          x={p.x}
          y={round(p.y + 3)}
          textAnchor="middle"
          className="fill-neutral-200 text-[6px] font-medium"
        >
          {n}
        </text>
      );
    })}
  </>
);

const ThemeSeedGrid = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-200 dark:stroke-neutral-800" />
    {Array.from({ length: 6 }).map((_, i) => {
      const p = 22 + i * 6;
      return (
        <React.Fragment key={i}>
          <line x1={p} y1={18} x2={p} y2={82} className="stroke-neutral-100 dark:stroke-neutral-900 stroke-[0.7]" />
          <line x1={18} y1={p} x2={82} y2={p} className="stroke-neutral-100 dark:stroke-neutral-900 stroke-[0.7]" />
        </React.Fragment>
      );
    })}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const r1 = 46;
      const r2 = 40;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.2]"
          strokeLinecap="round"
        />
      );
    })}
    <text
      x="50"
      y="56"
      textAnchor="middle"
      className="fill-neutral-200 text-[10px] font-semibold dark:fill-neutral-800"
    >
      SG
    </text>
  </>
);

const ThemeMusic = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-neutral-50 dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-200 dark:stroke-neutral-800" />
    {Array.from({ length: 5 }).map((_, i) => {
      const y = 38 + i * 4;
      return (
        <line
          key={i}
          x1={20}
          y1={y}
          x2={80}
          y2={y}
          className="stroke-neutral-200 dark:stroke-neutral-800 stroke-[0.8]"
        />
      );
    })}
    <g className="fill-neutral-300 dark:fill-neutral-800">
      <circle cx="32" cy="44" r="2.2" />
      <rect x="33.7" y="32" width="1" height="12" rx="0.5" />
      <circle cx="68" cy="52" r="2.2" />
      <rect x="69.7" y="40" width="1" height="12" rx="0.5" />
    </g>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const r1 = 46;
      const r2 = 42;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.1]"
          strokeLinecap="round"
        />
      );
    })}
  </>
);

const ThemeMusicNotes = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-300 dark:stroke-neutral-700" />

    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const r1 = 46;
      const r2 = 40;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.1]"
          strokeLinecap="round"
        />
      );
    })}

    {/* music notes around */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const r = 36;
      const p = polar(r, a);
      const up = i % 2 === 0;
      return (
        <g key={i} transform={`translate(${round(p.x - 2.5)} ${round(p.y - 2.5)})`}>
          <ellipse cx="2.5" cy="3.2" rx="2.2" ry="1.6" className="fill-neutral-800 dark:fill-neutral-200" />
          <rect
            x={up ? 4.3 : 0.6}
            y={-6}
            width="0.8"
            height="7"
            className="fill-neutral-800 dark:fill-neutral-200"
          />
        </g>
      );
    })}

    <text
      x="50"
      y="68"
      textAnchor="middle"
      className="fill-neutral-300 text-[7px] font-semibold tracking-[2px] dark:fill-neutral-700"
    >
      MUSICA
    </text>
  </>
);

const ThemeMusicStaff = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-300 dark:stroke-neutral-700" />

    {/* staff ring */}
    <circle cx="50" cy="50" r="38" className="fill-none stroke-neutral-300 dark:stroke-neutral-700 stroke-[0.8]" />
    <circle cx="50" cy="50" r="42" className="fill-none stroke-neutral-300 dark:stroke-neutral-700 stroke-[0.8]" />

    {/* staff lines */}
    {Array.from({ length: 5 }).map((_, i) => {
      const y = 30 + i * 4;
      return (
        <line
          key={i}
          x1={18}
          y1={y}
          x2={82}
          y2={y}
          className="stroke-neutral-300 dark:stroke-neutral-700 stroke-[0.8]"
        />
      );
    })}

    {/* simple notes on staff */}
    <g className="fill-neutral-700 dark:fill-neutral-300">
      <circle cx="30" cy="38" r="1.8" />
      <rect x="31.5" y="28" width="0.8" height="10" rx="0.4" />
      <circle cx="66" cy="46" r="1.8" />
      <rect x="67.5" y="36" width="0.8" height="10" rx="0.4" />
      <path d="M55 34c2-2 4-2 6 0" className="stroke-neutral-700 dark:stroke-neutral-300" strokeWidth="0.8" fill="none" />
    </g>

    {/* outer ticks */}
    {Array.from({ length: 60 }).map((_, i) => {
      if (i % 5 !== 0) return null;
      const a = (i * Math.PI) / 30;
      const r1 = 46;
      const r2 = 42;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-neutral-400 dark:stroke-neutral-600 stroke-[1]"
          strokeLinecap="round"
        />
      );
    })}
  </>
);



const ThemeRomanClassic = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-[#f2e9dc] dark:fill-neutral-900" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-600/60 dark:stroke-neutral-600" />
    <circle cx="50" cy="50" r="36" className="fill-none stroke-neutral-500/40 dark:stroke-neutral-700" />

    {Array.from({ length: 60 }).map((_, i) => {
      const major = i % 5 === 0;
      const len = major ? 4 : 2;
      const r1 = 46;
      const r2 = r1 - len;
      const a = (i * Math.PI) / 30;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className={major ? "stroke-neutral-700 stroke-[1]" : "stroke-neutral-600/70 stroke-[0.6]"}
          strokeLinecap="round"
        />
      );
    })}

    {["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"].map((n, idx) => {
      const a = ((idx + 1) * Math.PI) / 6;
      const r = 32;
      const p = polar(r, a);
      return (
        <text
          key={n}
          x={p.x}
          y={round(p.y + 3)}
          textAnchor="middle"
          className="fill-neutral-800 text-[7px] font-semibold dark:fill-neutral-200"
        >
          {n}
        </text>
      );
    })}
  </>
);

const ThemeRomanOrnate = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-700 dark:stroke-neutral-600" />
    <circle cx="50" cy="50" r="44" className="fill-none stroke-neutral-700/60 dark:stroke-neutral-700" />

    {/* ornamental rim */}
    {Array.from({ length: 48 }).map((_, i) => {
      const a = (i * Math.PI) / 24;
      const r = 46.5;
      const p = polar(r, a);
      return <circle key={i} cx={p.x} cy={p.y} r="0.6" className="fill-neutral-700/70 dark:fill-neutral-600" />;
    })}

    {["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"].map((n, idx) => {
      const a = ((idx + 1) * Math.PI) / 6;
      const r = 32;
      const p = polar(r, a);
      return (
        <text
          key={n}
          x={p.x}
          y={round(p.y + 3)}
          textAnchor="middle"
          className="fill-neutral-800 text-[7px] font-semibold dark:fill-neutral-200"
        >
          {n}
        </text>
      );
    })}

    {/* inner diamond ticks */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const r = 40;
      const p = polar(r, a);
      return (
        <rect
          key={i}
          x={round(p.x - 1)}
          y={round(p.y - 1)}
          width="2"
          height="2"
          className="fill-neutral-700 dark:fill-neutral-500"
        />
      );
    })}
  </>
);

const ThemeSegment = () => (
  <>
    <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
    <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-300 dark:stroke-neutral-700" />

    {Array.from({ length: 60 }).map((_, i) => {
      const major = i % 5 === 0;
      const len = major ? 4 : 2;
      const r1 = 46;
      const r2 = r1 - len;
      const a = (i * Math.PI) / 30;
      const p1 = polar(r1, a);
      const p2 = polar(r2, a);
      return (
        <line
          key={i}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className={major ? "stroke-neutral-400 stroke-[0.9]" : "stroke-neutral-400/60 stroke-[0.6]"}
          strokeLinecap="round"
        />
      );
    })}

    {Array.from({ length: 12 }).map((_, idx) => {
      const n = idx + 1;
      const a = (n * Math.PI) / 6;
      const r = 32;
      const p = polar(r, a);
      return <g key={n}>{renderSevenSegNumber(n, p.x, p.y, 0.7)}</g>;
    })}
  </>
);

export const sgClockThemesBuiltIn: SgClockTheme[] = [
  { id: "classic", label: "Classic", render: () => <ThemeClassic />, order: 1 },
  { id: "minimal", label: "Minimal", render: () => <ThemeMinimal />, order: 2 },
  { id: "dark", label: "Dark", render: () => <ThemeDark />, order: 3 },
  { id: "seedgrid", label: "SeedGrid", render: () => <ThemeSeedGrid />, order: 4 },
  { id: "music", label: "Music", render: () => <ThemeMusic />, order: 5 },
  { id: "music-notes", label: "Music Notes", render: () => <ThemeMusicNotes />, order: 6 },
  { id: "music-staff", label: "Music Staff", render: () => <ThemeMusicStaff />, order: 8 },
  { id: "roman-classic", label: "Roman Classic", render: () => <ThemeRomanClassic />, order: 9 },
  { id: "roman-ornate", label: "Roman Ornate", render: () => <ThemeRomanOrnate />, order: 10 },
  { id: "segment", label: "Segment", render: () => <ThemeSegment />, order: 11 }
];
