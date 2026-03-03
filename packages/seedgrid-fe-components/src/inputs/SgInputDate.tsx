"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { t, useComponentsI18n } from "../i18n";

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

function formatDateDisplay(value: string | Date | undefined, locale: string) {
  const iso = toDateValue(value);
  if (!iso) return "";
  if (locale === "en-US") return iso;
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

function parseDateValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function SgInputDate(props: SgInputDateProps) {
  const i18n = useComponentsI18n();
  const {
    minDate,
    maxDate,
    inputProps,
    alwaysFloat,
    required,
    requiredMessage,
    validateOnBlur,
    validation,
    onValidation,
    error,
    ...rest
  } = props;
  const showStaticLabel = true;
  const labelText = rest.labelText ?? rest.label ?? "";
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const hasError = Boolean(error ?? internalError);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const minDateValue = toDateValue(minDate);
  const maxDateValue = toDateValue(maxDate);

  const runValidation = React.useCallback(
    (value: string) => {
      if (!value && !required) {
        setInternalError(null);
        onValidation?.(null);
        return;
      }
      if (!value && required) {
        const message = requiredMessage ?? t(i18n, "components.inputs.required");
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      const customMessage = validation?.(value) ?? null;
      if (customMessage) {
        setInternalError(customMessage);
        onValidation?.(customMessage);
        return;
      }
      const parsed = parseDateValue(value);
      if (!parsed) {
        const message = t(i18n, "components.inputs.date.invalid");
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      const min = minDateValue ? parseDateValue(minDateValue) : null;
      const max = maxDateValue ? parseDateValue(maxDateValue) : null;
      if (min && parsed < min || max && parsed > max) {
        const minLabel = formatDateDisplay(minDateValue, i18n.locale);
        const maxLabel = formatDateDisplay(maxDateValue, i18n.locale);
        const message =
          minLabel && maxLabel
            ? t(i18n, "components.inputs.date.range", { min: minLabel, max: maxLabel })
            : minLabel
              ? t(i18n, "components.inputs.date.min", { min: minLabel })
              : t(i18n, "components.inputs.date.max", { max: maxLabel });
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      setInternalError(null);
      onValidation?.(null);
    },
    [i18n, maxDateValue, minDateValue, onValidation, required, requiredMessage, validation]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    placeholder: showStaticLabel ? " " : (inputProps?.placeholder ?? rest.hintText ?? labelText),
    min: minDateValue,
    max: maxDateValue,
    readOnly: inputProps?.readOnly,
    onChange: (event) => {
      setHasInteracted(true);
      if (validateOnBlur === false || internalError) {
        runValidation(event.currentTarget.value);
      }
      inputProps?.onChange?.(event);
    },
    onBlur: (event) => {
      if ((validateOnBlur ?? true) || hasInteracted) {
        runValidation(event.currentTarget.value);
      }
      inputProps?.onBlur?.(event);
    }
  };

  const inputClassName = (() => {
    if (mergedInputProps.className) return mergedInputProps.className;
    const hasError = Boolean(error ?? internalError);
    const elevationClass = props.elevation === "none"
      ? ""
      : props.elevation === "md"
        ? "shadow-md"
        : props.elevation === "lg"
          ? "shadow-lg"
          : "shadow-sm";
    const baseClass =
      "peer h-11 w-full rounded-md bg-white pl-3 pr-7 py-2.5 text-sm placeholder-transparent focus:outline-none";
    const borderClass = hasError
      ? "border border-[hsl(var(--destructive))] focus:border-[hsl(var(--destructive))] focus:ring-2 focus:ring-[hsl(var(--destructive)/0.25)]"
      : "border border-border focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]";
    return [baseClass, borderClass, elevationClass].filter(Boolean).join(" ");
  })();

  return (
    <div className={showStaticLabel ? "relative" : undefined}>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
      `}</style>
      {showStaticLabel && labelText ? (
        <label
          htmlFor={rest.id}
          className={[
            "pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-1 text-[11px] font-medium leading-none",
            hasError ? "text-[hsl(var(--destructive))]" : "text-foreground/70"
          ].join(" ")}
        >
          {labelText}
        </label>
      ) : null}
      <SgInputText
        {...rest}
        type="date"
        error={error ?? internalError ?? undefined}
        inputProps={mergedInputProps}
        className={inputClassName}
        labelClassName={showStaticLabel ? "sr-only" : undefined}
      />
    </div>
  );
}





