"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import {
  maskPostalCodeBR,
  maskPostalCodePT,
  maskPostalCodeUS,
  maskPostalCodeES,
  maskPostalCodeUY,
  maskPostalCodeAR,
  maskPostalCodePY
} from "../masks";
import { t, useComponentsI18n } from "../i18n";

export type PostalCodeCountry = "BR" | "PT" | "US" | "ES" | "UY" | "AR" | "PY";

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

type CountryConfig = {
  mask: (value: string) => string;
  rawLength: number;
  maxLength: number;
  inputMode: "numeric" | "text";
  placeholder: string;
  lengthKey: string;
  invalidKey: string;
};

const COUNTRY_CONFIGS: Record<PostalCodeCountry, CountryConfig> = {
  BR: {
    mask: maskPostalCodeBR,
    rawLength: 8,
    maxLength: 10,
    inputMode: "numeric",
    placeholder: "00000-000",
    lengthKey: "components.inputs.postalCode.BR.length",
    invalidKey: "components.inputs.postalCode.BR.invalid"
  },
  PT: {
    mask: maskPostalCodePT,
    rawLength: 7,
    maxLength: 8,
    inputMode: "numeric",
    placeholder: "0000-000",
    lengthKey: "components.inputs.postalCode.PT.length",
    invalidKey: "components.inputs.postalCode.PT.invalid"
  },
  US: {
    mask: maskPostalCodeUS,
    rawLength: 5,
    maxLength: 10,
    inputMode: "numeric",
    placeholder: "00000",
    lengthKey: "components.inputs.postalCode.US.length",
    invalidKey: "components.inputs.postalCode.US.invalid"
  },
  ES: {
    mask: maskPostalCodeES,
    rawLength: 5,
    maxLength: 5,
    inputMode: "numeric",
    placeholder: "00000",
    lengthKey: "components.inputs.postalCode.ES.length",
    invalidKey: "components.inputs.postalCode.ES.invalid"
  },
  UY: {
    mask: maskPostalCodeUY,
    rawLength: 5,
    maxLength: 5,
    inputMode: "numeric",
    placeholder: "00000",
    lengthKey: "components.inputs.postalCode.UY.length",
    invalidKey: "components.inputs.postalCode.UY.invalid"
  },
  AR: {
    mask: maskPostalCodeAR,
    rawLength: 4,
    maxLength: 8,
    inputMode: "text",
    placeholder: "A0000AAA",
    lengthKey: "components.inputs.postalCode.AR.length",
    invalidKey: "components.inputs.postalCode.AR.invalid"
  },
  PY: {
    mask: maskPostalCodePY,
    rawLength: 6,
    maxLength: 6,
    inputMode: "numeric",
    placeholder: "000000",
    lengthKey: "components.inputs.postalCode.PY.length",
    invalidKey: "components.inputs.postalCode.PY.invalid"
  }
};

export type SgInputPostalCodeProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  inputProps?: (React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  });
  error?: string;
  country?: PostalCodeCountry;
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

function extractRaw(value: string, country: PostalCodeCountry): string {
  if (country === "AR") {
    return value.replaceAll(/[^0-9A-Za-z]/g, "").toUpperCase();
  }
  return value.replaceAll(/\D/g, "");
}

const defaultViaCepFetch = async (cep: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return (await response.json()) as ViaCepResponse;
};

export function SgInputPostalCode(props: Readonly<SgInputPostalCodeProps>) {
  const i18n = useComponentsI18n();
  const {
    country = "BR",
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

  const config = COUNTRY_CONFIGS[country];
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const lastValidatedRef = React.useRef<string | null>(null);
  const lastViaCepErroRef = React.useRef<boolean | null>(null);

  const runValidation = React.useCallback(
    async (value: string) => {
      const raw = extractRaw(value, country);
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
      const expectedLength = country === "US"
        ? (raw.length > 5 ? 9 : 5)
        : country === "AR"
          ? (raw.length > 4 ? 8 : 4)
          : config.rawLength;
      if (raw.length !== expectedLength) {
        const message = lengthMessage ?? t(i18n, config.lengthKey);
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (country === "BR" && validateWithViaCep) {
        if (lastValidatedRef.current === raw) {
          const message = viaCepErrorMessage ?? invalidMessage ?? t(i18n, config.invalidKey);
          if (lastViaCepErroRef.current) {
            setInternalError(message);
            props.onValidation?.(message);
          } else {
            setInternalError(null);
            props.onValidation?.(null);
          }
          return;
        }
        try {
          const checker = viaCepFetch ?? defaultViaCepFetch;
          const data = await checker(raw);
          lastValidatedRef.current = raw;
          lastViaCepErroRef.current = Boolean(data?.erro);
          onViaCepResult?.(data);
          if (data?.erro) {
            const message = viaCepErrorMessage ?? invalidMessage ?? t(i18n, config.invalidKey);
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
      config,
      country,
      i18n,
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
    inputMode: inputProps?.inputMode ?? config.inputMode,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasInteracted(true);
      event.target.value = config.mask(event.target.value);
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
      maxLength={rest.maxLength ?? config.maxLength}
      error={error ?? internalError ?? undefined}
      textInputType={props.textInputType ?? (config.inputMode === "numeric" ? "numeric" : undefined)}
      onClear={() => {
        setInternalError(null);
        props.onValidation?.(null);
        onClear?.();
        lastValidatedRef.current = null;
        lastViaCepErroRef.current = null;
      }}
      inputProps={mergedInputProps}
    />
  );
}
