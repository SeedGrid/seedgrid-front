"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { isValidEmail } from "../validators";

export type SgInputEmailProps = Omit<SgInputTextProps, "type" | "error"> & {
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  invalidMessage?: string;
  validation?: (value: string) => string | null;
  validateOnBlur?: boolean;
  onValidation?: (message: string | null) => void;
  iconButtons?: React.ReactNode[];
};

export function SgInputEmail(props: SgInputEmailProps) {
  const { required, requiredMessage, invalidMessage, validateOnBlur, onValidation, error, inputProps, iconButtons, validation, ...rest } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const runValidation = React.useCallback(
    (value: string) => {
      if (!value && !required) {
        setInternalError(null);
        onValidation?.(null);
        return;
      }
      if (!value && required) {
        const message = requiredMessage ?? "Campo obrigatório ";
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      if (validation) {
        const custom = validation(value);
        if (custom) {
          setInternalError(custom);
          onValidation?.(custom);
          return;
        }
      }
      const valid = isValidEmail(value);
      const message = valid ? null : (invalidMessage ?? "Email inválido.");
      setInternalError(message);
      onValidation?.(message);
    },
    [invalidMessage, onValidation, required, requiredMessage, validation]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    onBlur: (event) => {
      if (validateOnBlur ?? true) runValidation(event.currentTarget.value);
      inputProps?.onBlur?.(event);
    }
  };

  return (
    <SgInputText
      {...rest}
      type="email"
      error={error ?? internalError ?? undefined}
      inputProps={mergedInputProps}
      iconButtons={iconButtons}
    />
  );
}
