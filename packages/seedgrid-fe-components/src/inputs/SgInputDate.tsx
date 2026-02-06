"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";

export type SgInputDateProps = Omit<SgInputTextProps, "type"> & {
  minDate?: string | Date;
  maxDate?: string | Date;
  alwaysFloat?: boolean;
};

function toDateValue(value?: string | Date) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.toISOString().slice(0, 10);
}

export function SgInputDate(props: SgInputDateProps) {
  const { minDate, maxDate, inputProps, alwaysFloat, ...rest } = props;
  const showStaticLabel = Boolean(alwaysFloat);
  const labelText = rest.labelText ?? rest.label ?? "";
  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    placeholder: showStaticLabel ? " " : (inputProps?.placeholder ?? rest.hintText ?? labelText),
    min: toDateValue(minDate),
    max: toDateValue(maxDate)
  };

  const inputClassName =
    mergedInputProps.className ??
    "peer h-11 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm shadow-sm placeholder-transparent focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]";

  return (
    <div className={showStaticLabel ? "relative" : undefined}>
      {showStaticLabel && labelText ? (
        <label
          htmlFor={rest.id}
          className="pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-1 text-[11px] font-medium leading-none text-foreground/70"
        >
          {labelText}
        </label>
      ) : null}
      <SgInputText
        {...rest}
        type="date"
        inputProps={mergedInputProps}
        className={inputClassName}
        labelClassName={showStaticLabel ? "sr-only" : undefined}
      />
    </div>
  );
}





