"use client";

import * as React from "react";

/** Duration of each fade phase (out and in) in ms */
const FADE_MS = 200;

export type SgFadeDigitProps = {
  /** Character to display. When changed, the current digit fades out and the new one fades in. */
  value: string;
  /** Text color of the digit. @default "#edebeb" */
  color?: string;
  /** Card background color. @default "#333232" */
  backgroundColor?: string;
  /**
   * CSS font-family for the digit.
   * @default undefined (browser default)
   */
  font?: string;
  /** Font size in pixels — controls overall card scale. @default 70 */
  fontSize?: number;
  /** Additional CSS classes on the outer card wrapper. */
  className?: string;
};

/**
 * SgFadeDigit — an animated card that "turns off" its current digit (fade to
 * transparent) and "turns on" the new one (fade in), simulating a bulb or
 * display switching effect.
 *
 * The card style matches SgFlipDigit (same proportions, divider line and
 * shadow) so both components can be mixed in clock-style layouts.
 */
export function SgFadeDigit({
  value,
  color = "#edebeb",
  backgroundColor = "#333232",
  font,
  fontSize = 70,
  className,
}: SgFadeDigitProps) {
  /**
   * What is rendered in the card. Lags behind `value` during animation:
   * we first fade out the old value, swap here, then fade in the new one.
   */
  const [displayValue, setDisplayValue] = React.useState(value);

  /** Drives the CSS opacity transition (1 = fully visible, 0 = invisible). */
  const [opacity, setOpacity] = React.useState(1);

  React.useEffect(() => {
    // Nothing to do — already showing the right value
    if (value === displayValue) return;

    // Phase 1: fade out
    setOpacity(0);

    // Phase 2: after fade-out completes, swap text and fade in
    const t = window.setTimeout(() => {
      setDisplayValue(value); // swap while invisible
      setOpacity(1);          // fade in with new value
    }, FADE_MS);

    return () => window.clearTimeout(t);

    // displayValue intentionally in deps: when setDisplayValue fires it causes
    // a re-run, which returns early (value === displayValue) — no loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, displayValue]);

  // ── Card dimensions (proportional to fontSize, matching SgFlipDigit) ──────
  const cardW = Math.round(fontSize * 0.88);
  const cardH = Math.round(fontSize * 1.38);
  const cardRadius = Math.max(2, Math.round(fontSize * 0.04));

  return (
    <div
      aria-label={displayValue}
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        width: cardW,
        height: cardH,
        borderRadius: cardRadius,
        backgroundColor,
        boxShadow:
          "0 .125em .3125em rgba(0,0,0,.25), 0 .02125em .06125em rgba(0,0,0,.25)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Horizontal divider — visual split between top and bottom halves */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: Math.round(cardH / 2),
          height: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Top highlight — subtle gloss on the upper panel */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.045) 0%, transparent 52%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Digit — constant transition so CSS always animates opacity changes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize,
          color,
          fontFamily: font,
          fontWeight: "bold",
          lineHeight: 1,
          userSelect: "none",
          opacity,
          // Transition is CONSTANT — direction never changes, so the browser
          // always animates when opacity goes 1→0 or 0→1.
          transition: `opacity ${FADE_MS}ms ease`,
          zIndex: 3,
        }}
      >
        {displayValue}
      </div>
    </div>
  );
}
