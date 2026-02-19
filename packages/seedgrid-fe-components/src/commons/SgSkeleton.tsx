"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSize(value?: number | string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export type SgSkeletonShape = "text" | "rectangle" | "rounded" | "square" | "circle";
export type SgSkeletonAnimation = "wave" | "pulse" | "none";

export type SgSkeletonProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  width?: number | string;
  height?: number | string;
  size?: number | string;
  borderRadius?: number | string;
  shape?: SgSkeletonShape;
  animation?: SgSkeletonAnimation;
};

export function SgSkeleton(props: Readonly<SgSkeletonProps>) {
  const {
    width,
    height,
    size,
    borderRadius,
    shape = "text",
    animation = "wave",
    className,
    style,
    ...rest
  } = props;

  const waveOverlayRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (animation !== "wave") return;
    const node = waveOverlayRef.current;
    if (!node || typeof node.animate !== "function") return;

    const wave = node.animate(
      [{ transform: "translateX(-100%)" }, { transform: "translateX(100%)" }],
      {
        duration: 1300,
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );

    return () => {
      wave.cancel();
    };
  }, [animation]);

  const cssSize = toCssSize(size);
  const cssWidth =
    cssSize ??
    toCssSize(width) ??
    (shape === "square" || shape === "circle" ? "2.5rem" : "100%");
  const cssHeight =
    cssSize ??
    toCssSize(height) ??
    (shape === "text" ? "1rem" : shape === "square" || shape === "circle" ? "2.5rem" : "2rem");

  const cssBorderRadius =
    toCssSize(borderRadius) ??
    (shape === "circle"
      ? "9999px"
      : shape === "square"
        ? "0"
        : shape === "rounded"
          ? "0.75rem"
          : shape === "text"
            ? "9999px"
            : "0.375rem");

  return (
    <div
      className={cn(
        "relative block overflow-hidden bg-muted/80",
        animation === "pulse" ? "animate-pulse" : "",
        className
      )}
      style={{
        width: cssWidth,
        height: cssHeight,
        borderRadius: cssBorderRadius,
        ...style
      }}
      {...rest}
    >
      {animation === "wave" ? (
        <span
          ref={waveOverlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, hsl(var(--background) / 0.55) 50%, transparent 100%)",
            transform: "translateX(-100%)",
            willChange: "transform"
          }}
        />
      ) : null}
    </div>
  );
}

SgSkeleton.displayName = "SgSkeleton";
