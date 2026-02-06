"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { validatePassword, type PasswordPolicy } from "../validators";

export type SgInputPasswordProps = Omit<SgInputTextProps, "type" | "error"> & {
  error?: string;
  policy?: PasswordPolicy;
  onValidation?: (message: string | null) => void;
  required?: boolean;
  requiredMessage?: string;
  validateOnBlur?: boolean;
  iconButtons?: React.ReactNode[];
  hidePassword?: boolean;
  maxLength?: number;
};

export function SgInputPassword(props: SgInputPasswordProps) {
  const {
    inputProps,
    policy,
    onValidation,
    required,
    requiredMessage,
    validateOnBlur,
    error,
    iconButtons,
    hidePassword,
    maxLength,
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [isHidden, setIsHidden] = React.useState(hidePassword ?? true);

  const runValidation = React.useCallback(
    (value: string) => {
      if (!value && !required) {
        setInternalError(null);
        onValidation?.(null);
        return;
      }
      if (!value && required) {
        const message = requiredMessage ?? "Campo obrigatório";
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      const message = validatePassword(value, policy);
      setInternalError(message);
      onValidation?.(message);
    },
    [onValidation, policy, required, requiredMessage]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    onBlur: (event) => {
      if (validateOnBlur ?? true) runValidation(event.currentTarget.value);
      inputProps?.onBlur?.(event);
    }
  };

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setIsHidden((prev) => !prev)}
      className="rounded px-1 text-xs text-foreground/60 hover:text-foreground"
      aria-label={isHidden ? "Mostrar senha" : "Ocultar senha"}
    >
      {isHidden ? "Mostrar" : "Ocultar"}
    </button>
  );

  return (
    <SgInputText
      {...rest}
      type={isHidden ? "password" : "text"}
      maxLength={maxLength}
      error={error ?? internalError ?? undefined}
      inputProps={mergedInputProps}
      iconButtons={[toggleIcon, ...(iconButtons ?? [])]}
    />
  );
}
