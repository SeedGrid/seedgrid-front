import * as React from "react";

type SegmentRect = { x: number; y: number; w: number; h: number };

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

const DIGIT_GLYPHS: Record<string, SegmentRect[]> = {
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
  ],
  "-": [{ x: 1, y: 4.5, w: 4, h: 1 }],
  " ": []
};

const COLON_GLYPH: SegmentRect[] = [
  { x: 1.5, y: 2, w: 1, h: 1 },
  { x: 1.5, y: 7, w: 1, h: 1 }
];

export type SgSegmentDigitProps = {
  /** Character rendered by the component (first character is used). */
  value: string;
  /** Display height in pixels. */
  size?: number;
  /** Color of active segments. */
  color?: string;
  /** Additional classes on outer wrapper. */
  className?: string;
  /** Additional inline styles on outer wrapper. */
  style?: React.CSSProperties;
};

export function SgSegmentDigit({
  value,
  size = 16,
  color,
  className,
  style
}: Readonly<SgSegmentDigitProps>) {
  const char = (value ?? " ").charAt(0);
  const normalized = char === ":" ? ":" : (DIGIT_GLYPHS[char] ? char : " ");
  const isColon = normalized === ":";
  const glyph = isColon ? COLON_GLYPH : DIGIT_GLYPHS[normalized] ?? DIGIT_GLYPHS[" "] ?? [];
  const viewWidth = isColon ? 4 : 6;
  const viewHeight = 10;
  const scale = Math.max(0.2, size / viewHeight);
  const width = round(viewWidth * scale);
  const height = round(viewHeight * scale);

  return (
    <svg
      role="img"
      aria-label={value}
      width={width}
      height={height}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className={cn("inline-block align-middle text-[rgb(var(--sg-text,var(--sg-fg)))]", className)}
      style={{ color, ...style }}
    >
      {glyph.map((segment, idx) => (
        <rect
          key={`${normalized}-${idx}`}
          x={segment.x}
          y={segment.y}
          width={segment.w}
          height={segment.h}
          rx={0.3}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
