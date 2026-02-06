"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { maskCep } from "../masks";

export type SgInputCEPProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  lengthMessage?: string;
  validation?: (value: string) => string | null;
  onValidation?: (message: string | null) => void;
  validateOnBlur?: boolean;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function SgInputCEP(props: SgInputCEPProps) {
  const { required, requiredMessage, lengthMessage, validateOnBlur, error, validation, ...rest } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const runValidation = React.useCallback(
    (value: string) => {
      const digits = onlyDigits(value);
      if (!digits && !required) {
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (!digits && required) {
        const message = requiredMessage ?? "Campo obrigatório ";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (validation) {
        const message = validation(value);
        if (message) {
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
      }
      if (digits.length !== 8) {
        const message = lengthMessage ?? "CEP deve ter 8 dígitos.";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [required, requiredMessage, lengthMessage, validation, props]
  );

  const inputProps = {
    ...rest.inputProps,
    inputMode: rest.inputProps.inputMode ?? "numeric",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = maskCep(event.target.value);
      rest.inputProps.onChange?.(event);
    }
  };

  const onBlur = inputProps.onBlur;
  const shouldValidateOnBlur = validateOnBlur ?? true;

  return (
    <SgInputText
      {...rest}
      maxLength={rest.maxLength ?? 10}
      error={error ?? internalError ?? undefined}
      inputProps={{
        ...inputProps,
        onBlur: (event) => {
          if (shouldValidateOnBlur) runValidation(event.currentTarget.value);
          onBlur?.(event);
        }
      }}
    />
  );
}
