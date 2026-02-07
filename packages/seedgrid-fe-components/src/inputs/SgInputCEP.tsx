"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { maskCep } from "../masks";

export type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
};

export type SgInputCEPProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  lengthMessage?: string;
  invalidMessage?: string;
  validation?: (value: string) => string | null;
  onValidation?: (message: string | null) => void;
  validateOnBlur?: boolean;
  validateWithViaCep?: boolean;
  viaCepErrorMessage?: string;
  viaCepFetch?: (cep: string) => Promise<ViaCepResponse>;
  onViaCepResult?: (data: ViaCepResponse) => void;
  onViaCepError?: (error: unknown) => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

const defaultViaCepFetch = async (cep: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return (await response.json()) as ViaCepResponse;
};

export function SgInputCEP(props: Readonly<SgInputCEPProps>) {
  const {
    required,
    requiredMessage,
    lengthMessage,
    invalidMessage,
    validateOnBlur,
    error,
    validation,
    onClear,
    inputProps,
    validateWithViaCep,
    viaCepErrorMessage,
    viaCepFetch,
    onViaCepResult,
    onViaCepError,
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const lastValidatedCepRef = React.useRef<string | null>(null);

  const runValidation = React.useCallback(
    async (value: string) => {
      const digits = onlyDigits(value);
      if (!digits && !required) {
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (!digits && required) {
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
      if (digits.length !== 8) {
        const message = lengthMessage ?? "CEP deve ter 8 digitos.";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (validateWithViaCep) {
        if (lastValidatedCepRef.current === digits) {
          setInternalError(null);
          props.onValidation?.(null);
          return;
        }
        try {
          const checker = viaCepFetch ?? defaultViaCepFetch;
          const data = await checker(digits);
          lastValidatedCepRef.current = digits;
          onViaCepResult?.(data);
          if (data?.erro) {
            const message = viaCepErrorMessage ?? invalidMessage ?? "CEP invalido.";
            setInternalError(message);
            props.onValidation?.(message);
            return;
          }
        } catch (err) {
          onViaCepError?.(err);
        }
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [
      invalidMessage,
      lengthMessage,
      onViaCepError,
      onViaCepResult,
      props,
      required,
      requiredMessage,
      validateWithViaCep,
      validation,
      viaCepErrorMessage,
      viaCepFetch
    ]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    inputMode: inputProps?.inputMode ?? "numeric",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasInteracted(true);
      event.target.value = maskCep(event.target.value);
      runValidation(event.currentTarget.value);
      inputProps?.onChange?.(event);
    },
    onBlur: (event) => {
      if ((validateOnBlur ?? true) || hasInteracted) {
        runValidation(event.currentTarget.value);
      }
      inputProps?.onBlur?.(event);
    }
  };

  return (
    <SgInputText
      {...rest}
      maxLength={rest.maxLength ?? 10}
      error={error ?? internalError ?? undefined}
      textInputType={props.textInputType ?? "numeric"}
      onClear={() => {
        setInternalError(null);
        props.onValidation?.(null);
        onClear?.();
      }}
      inputProps={mergedInputProps}
    />
  );
}
