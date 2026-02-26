"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSize(value: number | string | undefined) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return `${value}px`;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type SgSliderProps = {
  id: string;
  minValue: number;
  maxValue: number;
  value?: number;
  defaultValue?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
  width?: number | string;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "id"
    | "min"
    | "max"
    | "step"
    | "value"
    | "defaultValue"
    | "onChange"
    | "disabled"
    | "aria-label"
  >;
};

export function SgSlider(props: Readonly<SgSliderProps>) {
  const {
    id,
    minValue,
    maxValue,
    value,
    defaultValue,
    step = 1,
    disabled = false,
    onChange,
    ariaLabel,
    className,
    width,
    inputProps
  } = props;

  const safeMin = Number.isFinite(minValue) ? minValue : 0;
  const rawMax = Number.isFinite(maxValue) ? maxValue : safeMin;
  const safeMax = Math.max(safeMin, rawMax);
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState<number>(() =>
    clamp(defaultValue ?? safeMin, safeMin, safeMax)
  );

  React.useEffect(() => {
    if (isControlled) return;
    setInternalValue((prev) => clamp(prev, safeMin, safeMax));
  }, [isControlled, safeMin, safeMax]);

  const currentValue = clamp(
    isControlled ? (value as number) : internalValue,
    safeMin,
    safeMax
  );

  return (
    <input
      id={id}
      type="range"
      min={safeMin}
      max={safeMax}
      step={safeStep}
      value={currentValue}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => {
        const nextRaw = Number(event.currentTarget.value);
        const next = clamp(Number.isFinite(nextRaw) ? nextRaw : safeMin, safeMin, safeMax);
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      }}
      className={cn("h-5 w-full cursor-pointer", disabled ? "cursor-not-allowed opacity-60" : "", className)}
      style={{ width: toCssSize(width) }}
      {...inputProps}
    />
  );
}

SgSlider.displayName = "SgSlider";

