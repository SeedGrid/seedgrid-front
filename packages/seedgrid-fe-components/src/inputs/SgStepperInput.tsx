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

export type SgStepperInputProps = {
  id: string;
  minValue: number;
  maxValue: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
  inputClassName?: string;
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
    | "disabled"
    | "readOnly"
    | "onChange"
    | "aria-label"
  >;
};

export function SgStepperInput(props: Readonly<SgStepperInputProps>) {
  const {
    id,
    minValue,
    maxValue,
    step = 1,
    value,
    defaultValue,
    disabled = false,
    readOnly = false,
    onChange,
    ariaLabel,
    className,
    inputClassName,
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

  const emitValue = React.useCallback(
    (nextRaw: number) => {
      const next = clamp(nextRaw, safeMin, safeMax);
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange, safeMax, safeMin]
  );

  const canDecrease = !disabled && !readOnly && currentValue > safeMin;
  const canIncrease = !disabled && !readOnly && currentValue < safeMax;

  return (
    <div
      className={cn(
        "inline-flex h-10 overflow-hidden rounded-md border border-border bg-background",
        disabled ? "opacity-60" : "",
        className
      )}
      style={{ width: toCssSize(width) }}
    >
      <input
        id={id}
        type="number"
        min={safeMin}
        max={safeMax}
        step={safeStep}
        value={currentValue}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel}
        onChange={(event) => {
          const inputNext = Number(event.currentTarget.value);
          if (!Number.isFinite(inputNext)) return;
          emitValue(inputNext);
        }}
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent px-3 text-sm outline-none",
          "focus:ring-0 [appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          inputClassName
        )}
        {...inputProps}
      />

      <div className="flex w-7 flex-col border-l border-border">
        <button
          type="button"
          aria-label="Increase value"
          disabled={!canIncrease}
          onClick={() => emitValue(currentValue + safeStep)}
          className={cn(
            "inline-flex h-1/2 items-center justify-center text-foreground",
            "border-b border-border text-[10px]",
            canIncrease ? "hover:bg-muted" : "cursor-not-allowed opacity-40"
          )}
        >
          <StepArrow direction="up" />
        </button>
        <button
          type="button"
          aria-label="Decrease value"
          disabled={!canDecrease}
          onClick={() => emitValue(currentValue - safeStep)}
          className={cn(
            "inline-flex h-1/2 items-center justify-center text-foreground text-[10px]",
            canDecrease ? "hover:bg-muted" : "cursor-not-allowed opacity-40"
          )}
        >
          <StepArrow direction="down" />
        </button>
      </div>
    </div>
  );
}

SgStepperInput.displayName = "SgStepperInput";

function StepArrow(props: { direction: "up" | "down" }) {
  const rotate = props.direction === "up" ? 0 : 180;
  return (
    <svg viewBox="0 0 24 24" className="size-3" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M12 8l5 8H7z" fill="currentColor" />
    </svg>
  );
}

