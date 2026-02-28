import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgMatrixDigitProps = {
  /**
   * Text to render using matrix dots.
   * Supports letters, numbers and common symbols.
   */
  value: string;
  /** Color of active dots. */
  color?: string;
  /** Background color of the matrix container. */
  backgroundColor?: string;
  /** Color of inactive dots. */
  offColor?: string;
  /** Dot size in pixels. */
  dotSize?: number;
  /** Gap between dots in pixels. */
  gap?: number;
  /** Gap between characters in pixels. */
  charGap?: number;
  /** Internal padding in pixels. */
  padding?: number;
  /** Border radius of the matrix container in pixels. */
  rounded?: number;
  /** Add a subtle glow around active dots. */
  glow?: boolean;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
  /** Additional CSS style for the outer wrapper. */
  style?: React.CSSProperties;
};

const MATRIX_GLYPHS: Record<string, readonly string[]> = {
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "11100"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00001", "00001", "00001", "00001", "10001", "10001", "01110"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "10001", "11001", "10101", "10011", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "_": ["00000", "00000", "00000", "00000", "00000", "00000", "11111"],
  ".": ["00000", "00000", "00000", "00000", "00000", "00110", "00110"],
  ":": ["00000", "00110", "00110", "00000", "00110", "00110", "00000"],
  "/": ["00001", "00010", "00100", "01000", "10000", "00000", "00000"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"]
};

const FALLBACK_GLYPH: readonly string[] = ["01110", "10001", "00001", "00010", "00100", "00000", "00100"];

function getGlyph(char: string) {
  return MATRIX_GLYPHS[char] ?? FALLBACK_GLYPH;
}

export function SgMatrixDigit({
  value,
  color = "#22d3ee",
  backgroundColor = "#0b1220",
  offColor = "rgba(148, 163, 184, 0.22)",
  dotSize = 9,
  gap = 3,
  charGap = 7,
  padding = 8,
  rounded = 10,
  glow = true,
  className,
  style
}: Readonly<SgMatrixDigitProps>) {
  const chars = React.useMemo(() => {
    const normalized = (value ?? "").toUpperCase();
    return normalized.length > 0 ? Array.from(normalized) : [" "];
  }, [value]);

  const glowSize = Math.max(2, Math.round(dotSize * 0.55));

  return (
    <div
      role="img"
      aria-label={value}
      className={cn("inline-flex items-center", className)}
      style={{
        gap: charGap,
        padding,
        borderRadius: rounded,
        backgroundColor,
        ...style
      }}
    >
      {chars.map((char, charIndex) => {
        const glyph = getGlyph(char);
        return (
          <div
            key={`${char}-${charIndex}`}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(5, ${dotSize}px)`,
              gridTemplateRows: `repeat(7, ${dotSize}px)`,
              gap
            }}
          >
            {glyph.map((row, rowIndex) =>
              Array.from(row).map((bit, colIndex) => {
                const active = bit === "1";
                return (
                  <span
                    key={`${rowIndex}-${colIndex}`}
                    aria-hidden="true"
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: 9999,
                      backgroundColor: active ? color : offColor,
                      boxShadow: active && glow ? `0 0 ${glowSize}px ${color}` : "none",
                      transition: "background-color 160ms ease, box-shadow 160ms ease"
                    }}
                  />
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}
