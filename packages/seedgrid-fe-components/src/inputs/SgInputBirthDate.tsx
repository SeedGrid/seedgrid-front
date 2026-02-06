"use client";

import React from "react";
import { SgInputDate, type SgInputDateProps } from "./SgInputDate";
import { validateBirthDate, type BirthDatePolicy } from "../validators";

export type SgInputBirthDateProps = Omit<SgInputDateProps, "maxDate" | "minDate"> &
  BirthDatePolicy & {
    maxDate?: string | Date;
    minDate?: string | Date;
    onValidation?: (message: string | null) => void;
    required?: boolean;
    requiredMessage?: string;
    validateOnBlur?: boolean;
    error?: string;
  };

export function SgInputBirthDate(props: SgInputBirthDateProps) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const { minAge, maxAge, onValidation, inputProps, minDate, maxDate, alwaysFloat, required, requiredMessage, validateOnBlur, error, ...rest } = props;

  const derivedMaxDate = maxAge !== undefined && maxAge >= 0
    ? new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate()).toISOString().slice(0, 10)
    : undefined;

  const derivedMinDate = minAge !== undefined && minAge >= 0
    ? new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate()).toISOString().slice(0, 10)
    : undefined;

  const [internalError, setInternalError] = React.useState<string | null>(null);

  const runValidation = React.useCallback(
    (value: string) => {
      if (!value && !required) {
        setInternalError(null);
        onValidation?.(null);
        return;
      }
      if (!value && required) {
        const message = requiredMessage ?? "Informe a data de nascimento.";
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      const message = validateBirthDate(value, { minAge, maxAge });
      setInternalError(message);
      onValidation?.(message);
    },
    [maxAge, minAge, onValidation, required, requiredMessage]
  );

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    runValidation(event.currentTarget.value);
    inputProps?.onBlur?.(event);
  };

  return (
    <SgInputDate
      {...rest}
      error={error ?? internalError ?? undefined}
      inputProps={{
        ...inputProps,
        onBlur: (event) => {
          if (validateOnBlur ?? true) handleBlur(event);
          else inputProps?.onBlur?.(event);
        }
      }}
      alwaysFloat={alwaysFloat ?? true}
      maxDate={maxDate ?? derivedMinDate ?? todayStr}
      minDate={minDate ?? derivedMaxDate}
    />
  );
}




