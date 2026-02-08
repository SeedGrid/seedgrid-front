"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { maskCnpj } from "../masks";
import { isValidCnpj } from "../validators";
import { t, useComponentsI18n } from "../i18n";

export type SgInputCNPJProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  lengthMessage?: string;
  invalidMessage?: string;
  validation?: (value: string) => string | null;
  onValidation?: (message: string | null) => void;
  validateOnBlur?: boolean;
  validateWithPublicaCnpj?: boolean;
  publicaCnpjErrorMessage?: string;
  publicaCnpjFetch?: (cnpj: string) => Promise<unknown | null>;
  onPublicaCnpjResult?: (data: unknown | null) => void;
  onPublicaCnpjError?: (error: unknown) => void;
};

function onlyAlnumUpper(value: string) {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

const defaultPublicaCnpjFetch = async (cnpj: string) => {
  const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
  if (!response.ok) return null;
  return response.json();
};

export function SgInputCNPJ(props: SgInputCNPJProps) {
  const i18n = useComponentsI18n();
  const {
    required,
    requiredMessage,
    lengthMessage,
    invalidMessage,
    validateOnBlur,
    error,
    validation,
    validateWithPublicaCnpj,
    publicaCnpjErrorMessage,
    publicaCnpjFetch,
    onPublicaCnpjResult,
    onPublicaCnpjError,
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const lastValidatedCnpjRef = React.useRef<string | null>(null);
  const lastPublicaFoundRef = React.useRef<boolean | null>(null);

  const runValidation = React.useCallback(
    async (value: string) => {
      const raw = onlyAlnumUpper(value);
      if (!raw && !required) {
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (!raw && required) {
        const message = requiredMessage ?? t(i18n, "components.inputs.required");
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
      if (raw.length !== 14) {
        const message = lengthMessage ?? t(i18n, "components.inputs.cnpj.length");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (!isValidCnpj(value)) {
        const message = invalidMessage ?? t(i18n, "components.inputs.cnpj.invalid");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (validateWithPublicaCnpj && !/[A-Z]/.test(raw)) {
        const digits = onlyDigits(raw);
        if (digits.length === 14) {
          if (lastValidatedCnpjRef.current === digits) {
            const message = publicaCnpjErrorMessage ?? invalidMessage ?? t(i18n, "components.inputs.cnpj.invalid");
            if (lastPublicaFoundRef.current === false) {
              setInternalError(message);
              props.onValidation?.(message);
            } else {
              setInternalError(null);
              props.onValidation?.(null);
            }
            return;
          }
          try {
            const checker = publicaCnpjFetch ?? defaultPublicaCnpjFetch;
            const data = await checker(digits);
            lastValidatedCnpjRef.current = digits;
            lastPublicaFoundRef.current = Boolean(data);
            onPublicaCnpjResult?.(data);
            if (!data) {
              const message = publicaCnpjErrorMessage ?? invalidMessage ?? t(i18n, "components.inputs.cnpj.invalid");
              setInternalError(message);
              props.onValidation?.(message);
              return;
            }
          } catch (err) {
            onPublicaCnpjError?.(err);
          }
        }
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [
      i18n,
      required,
      requiredMessage,
      lengthMessage,
      invalidMessage,
      validation,
      props,
      validateWithPublicaCnpj,
      publicaCnpjErrorMessage,
      publicaCnpjFetch,
      onPublicaCnpjResult,
      onPublicaCnpjError
    ]
  );

  const inputProps = {
    ...rest.inputProps,
    inputMode: rest.inputProps.inputMode ?? "text",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = maskCnpj(event.target.value);
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
      onClear={() => {
        setInternalError(null);
        props.onValidation?.(null);
        lastValidatedCnpjRef.current = null;
        lastPublicaFoundRef.current = null;
        rest.onClear?.();
      }}
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
