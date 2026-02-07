"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { maskCpfCnpj } from "../masks";
import { isValidCnpj, isValidCpf } from "../validators";

export type SgInputCPFCNPJProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  lengthMessage?: string;
  invalidMessage?: string;
  validation?: (value: string) => string | null;
  onValidation?: (message: string | null) => void;
  validateOnBlur?: boolean;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function onlyAlnumUpper(value: string) {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

export function SgInputCPFCNPJ(props: SgInputCPFCNPJProps) {
  const { required, requiredMessage, lengthMessage, invalidMessage, validateOnBlur, error, validation, ...rest } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const runValidation = React.useCallback(
    (value: string) => {
      const raw = onlyAlnumUpper(value);
      if (!raw && !required) {
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (!raw && required) {
        const message = requiredMessage ?? "Campo obrigatorio ";
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
      const isCnpj = /[A-Z]/.test(raw) || raw.length > 11;
      if (!isCnpj) {
        const digits = onlyDigits(value);
        if (digits.length !== 11) {
          const message = lengthMessage ?? "CPF deve ter 11 digitos.";
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
        if (!isValidCpf(value)) {
          const message = invalidMessage ?? "CPF invalido.";
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (raw.length !== 14) {
        const message = lengthMessage ?? "CNPJ deve ter 14 digitos.";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (!isValidCnpj(value)) {
        const message = invalidMessage ?? "CNPJ invalido.";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [required, requiredMessage, lengthMessage, invalidMessage, validation, props]
  );

  const inputProps = {
    ...rest.inputProps,
    inputMode: rest.inputProps.inputMode ?? "text",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = maskCpfCnpj(event.target.value);
      runValidation(event.currentTarget.value);
      rest.inputProps.onChange?.(event);
    }
  };

  const onBlur = inputProps.onBlur;
  const shouldValidateOnBlur = validateOnBlur ?? true;

  return (
    <SgInputText
      {...rest}
      maxLength={rest.maxLength ?? 18}
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
