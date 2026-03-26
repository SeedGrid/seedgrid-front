"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { resolveFieldError, type RhfFieldProps } from "../rhf";

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

type SliderInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "id"
  | "min"
  | "max"
  | "step"
  | "value"
  | "defaultValue"
  | "disabled"
  | "aria-label"
> & {
  ref?: React.Ref<HTMLInputElement>;
};

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
  error?: string;
  inputProps?: SliderInputProps;
} & RhfFieldProps;

type SgSliderBaseProps = Omit<SgSliderProps, "name" | "control" | "register" | "rules">;

function mergeInputRefs(
  primary: React.Ref<HTMLInputElement> | undefined,
  secondary: React.Ref<HTMLInputElement> | undefined
) {
  return (node: HTMLInputElement | null) => {
    if (typeof primary === "function") {
      primary(node);
    } else if (primary && typeof primary === "object" && "current" in primary) {
      primary.current = node;
    }

    if (typeof secondary === "function") {
      secondary(node);
    } else if (secondary && typeof secondary === "object" && "current" in secondary) {
      secondary.current = node;
    }
  };
}

function SgSliderBase(props: Readonly<SgSliderBaseProps>) {
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
    error,
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
    <div style={{ width: toCssSize(width) }}>
      <input
        id={id}
        type="range"
        min={safeMin}
        max={safeMax}
        step={safeStep}
        value={currentValue}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        onChange={(event) => {
          const nextRaw = Number(event.currentTarget.value);
          const next = clamp(Number.isFinite(nextRaw) ? nextRaw : safeMin, safeMin, safeMax);
          if (!isControlled) setInternalValue(next);
          onChange?.(next);
          inputProps?.onChange?.(event);
        }}
        onBlur={(event) => {
          inputProps?.onBlur?.(event);
        }}
        className={cn("h-5 w-full cursor-pointer", disabled ? "cursor-not-allowed opacity-60" : "", className)}
        {...inputProps}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function SgSlider(props: Readonly<SgSliderProps>) {
  const { control, name, register, rules, ...rest } = props;

  if (name && register) {
    const reg = register(name, rules);
    return (
      <SgSliderBase
        {...rest}
        inputProps={{
          ...rest.inputProps,
          name,
          ref: mergeInputRefs(reg.ref, rest.inputProps?.ref),
          onBlur: (event) => {
            reg.onBlur(event);
            rest.inputProps?.onBlur?.(event);
          },
          onChange: (event) => {
            reg.onChange(event);
            rest.inputProps?.onChange?.(event);
          }
        }}
      />
    );
  }

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState }) => (
          <SgSliderBase
            {...rest}
            error={resolveFieldError(rest.error, fieldState.error?.message)}
            value={typeof field.value === "number" ? field.value : Number(field.value ?? rest.minValue)}
            onChange={(next) => field.onChange(next)}
            inputProps={{
              ...rest.inputProps,
              name,
              ref: mergeInputRefs(field.ref, rest.inputProps?.ref),
              onBlur: (event) => {
                field.onBlur();
                rest.inputProps?.onBlur?.(event);
              }
            }}
          />
        )}
      />
    );
  }

  return <SgSliderBase {...rest} />;
}

SgSlider.displayName = "SgSlider";
