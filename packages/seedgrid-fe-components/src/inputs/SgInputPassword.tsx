"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";

export type SgInputPasswordProps = Omit<
  SgInputTextProps,
  "type" | "error" | "validation" | "required" | "requiredMessage" | "validateOnBlur"
> & {
  error?: string;
  onValidation?: (message: string | null) => void;
  required?: boolean;
  requiredMessage?: string;
  validateOnBlur?: boolean;
  hidePassword?: boolean;
  maxLength?: number;
  validation?: (value: string) => string | null;
};

export function SgInputPassword(props: Readonly<SgInputPasswordProps>) {
  const {
    inputProps,
    onValidation,
    required,
    requiredMessage,
    validateOnBlur,
    error,
    onClear,
    hidePassword,
    maxLength,
    validation,
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [isHidden, setIsHidden] = React.useState(hidePassword ?? true);
  const [hasInteracted, setHasInteracted] = React.useState(false);

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
      const message = validation?.(value) ?? null;
      setInternalError(message);
      onValidation?.(message);
    },
    [onValidation, required, requiredMessage, validation]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> & {
    "data-sg-password"?: string;
  } = {
    ...inputProps,
    "data-sg-password": "true",
    onChange: (event) => {
      setHasInteracted(true);
      if (validateOnBlur === false) runValidation(event.currentTarget.value);
      inputProps?.onChange?.(event);
    },
    onBlur: (event) => {
      if ((validateOnBlur ?? true) || hasInteracted) {
        runValidation(event.currentTarget.value);
      }
      inputProps?.onBlur?.(event);
    }
  };

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setIsHidden((prev) => !prev)}
      className="rounded p-1 text-foreground/60 hover:text-foreground"
      aria-label={isHidden ? "Mostrar senha" : "Ocultar senha"}
    >
      {isHidden ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a20.4 20.4 0 0 1 5.06-6.88" />
          <path d="M1 1l22 22" />
          <path d="M9.9 4.24A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a20.3 20.3 0 0 1-3.44 4.65" />
          <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      <style>{`
        [data-sg-password]::-ms-reveal,
        [data-sg-password]::-ms-clear {
          display: none;
        }
      `}</style>
      <SgInputText
        {...rest}
        type={isHidden ? "password" : "text"}
        maxLength={maxLength ?? 15}
        error={error ?? internalError ?? undefined}
        onClear={() => {
          setInternalError(null);
          onValidation?.(null);
          onClear?.();
        }}
        inputProps={mergedInputProps}
        iconButtons={[toggleIcon, ...(props.iconButtons ?? [])]}
      />
    </>
  );
}
