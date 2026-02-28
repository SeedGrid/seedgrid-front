import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgNeonDigitProps = {
  /** Text/character rendered with neon style. */
  value: string;
  /** Enables fade-out/fade-in animation when value changes. */
  animateOnChange?: boolean;
  /** Total animation time in milliseconds when value changes. */
  transitionMs?: number;
  /** Main text color. */
  color?: string;
  /** Background color of the component surface. */
  backgroundColor?: string;
  /** Glow/shadow color around the text. */
  shadowColor?: string;
  /** Extra intensity factor for the glow effect. */
  shadowStrength?: number;
  /** Font size in pixels. */
  fontSize?: number;
  /** Font weight of the text. */
  fontWeight?: number | string;
  /** Font family alias (same effect as fontFamily). */
  font?: string;
  /** Letter spacing in pixels. */
  letterSpacing?: number;
  /** Internal padding in pixels. */
  padding?: number;
  /** Border radius in pixels. */
  rounded?: number;
  /** Custom font family. */
  fontFamily?: string;
  /** Additional classes on container. */
  className?: string;
  /** Additional style on container. */
  style?: React.CSSProperties;
};

export function SgNeonDigit({
  value,
  animateOnChange = true,
  transitionMs = 320,
  color = "#e2e8f0",
  backgroundColor = "#120f2b",
  shadowColor,
  shadowStrength = 1,
  fontSize = 46,
  fontWeight = 600,
  font,
  letterSpacing = 0,
  padding = 14,
  rounded = 12,
  fontFamily,
  className,
  style
}: Readonly<SgNeonDigitProps>) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [lit, setLit] = React.useState(true);

  React.useEffect(() => {
    if (!animateOnChange) {
      setDisplayValue(value);
      setLit(true);
      return;
    }
    if (value === displayValue) return;
    const halfDuration = Math.max(40, Math.round(transitionMs / 2));
    const swapTimer = window.setTimeout(() => {
      setDisplayValue(value);
      setLit(true);
    }, halfDuration);
    setLit(false);
    return () => window.clearTimeout(swapTimer);
  }, [animateOnChange, displayValue, transitionMs, value]);

  const glowColor = shadowColor ?? color;
  const glowFactor = Math.max(0.2, shadowStrength);
  const fadeFactor = lit ? 1 : 0.2;
  const halfDuration = Math.max(40, Math.round(transitionMs / 2));
  const inner = Math.max(1, Math.round(fontSize * 0.07 * glowFactor));
  const near = Math.max(3, Math.round(fontSize * 0.2 * glowFactor));
  const mid = Math.max(6, Math.round(fontSize * 0.42 * glowFactor));
  const outer = Math.max(12, Math.round(fontSize * 0.78 * glowFactor));
  const ambient = Math.max(18, Math.round(fontSize * 1.2 * glowFactor));
  const resolvedFontFamily = font ?? fontFamily;
  const fullTextShadow = `0 0 ${inner}px #ffffff, 0 0 ${near}px ${color}, 0 0 ${mid}px ${glowColor}, 0 0 ${outer}px ${glowColor}, 0 0 ${ambient}px ${glowColor}`;
  const dimTextShadow = `0 0 ${Math.max(1, Math.round(inner * 0.5))}px ${glowColor}`;
  const fullContainerShadow = `inset 0 0 ${Math.round(ambient * 0.6)}px rgba(0, 0, 0, 0.24), 0 0 ${Math.round(ambient * 0.7)}px ${glowColor}, 0 0 ${Math.round(ambient * 1.35)}px ${glowColor}`;
  const dimContainerShadow = `inset 0 0 ${Math.round(ambient * 0.4)}px rgba(0, 0, 0, 0.24), 0 0 ${Math.round(ambient * 0.22)}px ${glowColor}`;

  return (
    <div
      role="img"
      aria-label={value}
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        padding,
        borderRadius: rounded,
        backgroundColor,
        boxShadow: lit ? fullContainerShadow : dimContainerShadow,
        transition: `box-shadow ${halfDuration}ms ease, filter ${halfDuration}ms ease`,
        filter: lit ? "brightness(1)" : "brightness(0.85)",
        ...style
      }}
    >
      <span
        style={{
          color,
          fontSize,
          fontWeight,
          lineHeight: 1.05,
          letterSpacing,
          fontFamily: resolvedFontFamily,
          opacity: fadeFactor,
          textShadow: lit ? fullTextShadow : dimTextShadow,
          transition: `opacity ${halfDuration}ms ease, text-shadow ${halfDuration}ms ease, filter ${halfDuration}ms ease`,
          filter: lit ? "saturate(1)" : "saturate(0.55)"
        }}
      >
        {displayValue}
      </span>
    </div>
  );
}
