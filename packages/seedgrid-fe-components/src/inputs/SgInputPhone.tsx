"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { maskPhone } from "../masks";
import { t, useComponentsI18n } from "../i18n";

export type SgInputPhoneProps = Omit<SgInputTextProps, "inputProps" | "error"> & {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
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

export function SgInputPhone(props: Readonly<SgInputPhoneProps>) {
  const i18n = useComponentsI18n();
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
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const runValidation = React.useCallback(
    (value: string) => {
      const digits = onlyDigits(value);
      if (!digits && !required) {
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (!digits && required) {
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
      if (digits.length !== 10 && digits.length !== 11) {
        const message = lengthMessage ?? invalidMessage ?? t(i18n, "components.inputs.phone.invalid");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [i18n, required, requiredMessage, lengthMessage, invalidMessage, validation, props]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    inputMode: inputProps?.inputMode ?? "numeric",
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasInteracted(true);
      event.target.value = maskPhone(event.target.value);
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
