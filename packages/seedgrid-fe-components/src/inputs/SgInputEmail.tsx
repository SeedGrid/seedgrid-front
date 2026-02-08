"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { isBlockedEmailDomain, isValidEmail } from "../validators";
import { t, useComponentsI18n } from "../i18n";

export type SgInputEmailProps = Omit<SgInputTextProps, "type" | "error"> & {
  error?: string;
  required?: boolean;
  requiredMessage?: string;
  invalidMessage?: string;
  blockFakeMail?: boolean;
  blockedEmailDomains?: string[];
  validation?: (value: string) => string | null;
  validateOnBlur?: boolean;
  onValidation?: (message: string | null) => void;
  iconButtons?: React.ReactNode[];
};

export function SgInputEmail(props: Readonly<SgInputEmailProps>) {
  const i18n = useComponentsI18n();
  const {
    required,
    requiredMessage,
    invalidMessage,
    blockFakeMail,
    blockedEmailDomains,
    validateOnBlur,
    onValidation,
    error,
    inputProps,
    iconButtons,
    validation,
    onClear,
    ...rest
  } = props;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const runValidation = React.useCallback(
    (value: string) => {
      if (!value && !required) {
        setInternalError(null);
        onValidation?.(null);
        return;
      }
      if (!value && required) {
        const message = requiredMessage ?? t(i18n, "components.inputs.required");
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      const customMessage = validation?.(value) ?? null;
      if (customMessage) {
        setInternalError(customMessage);
        onValidation?.(customMessage);
        return;
      }
      if (!isValidEmail(value)) {
        const message = invalidMessage ?? t(i18n, "components.inputs.email.invalid");
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      if ((blockFakeMail ?? true) && isBlockedEmailDomain(value, blockedEmailDomains)) {
        const message = t(i18n, "components.inputs.email.tempInvalid");
        setInternalError(message);
        onValidation?.(message);
        return;
      }
      const message = null;
      setInternalError(message);
      onValidation?.(message);
    },
    [
      blockedEmailDomains,
      blockFakeMail,
      i18n,
      invalidMessage,
      onValidation,
      required,
      requiredMessage,
      validation
    ]
  );

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    onChange: (event) => {
      setHasInteracted(true);
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
      type="email"
      textInputType={props.textInputType ?? "email"}
      error={error ?? internalError ?? undefined}
      onClear={() => {
        setInternalError(null);
        onValidation?.(null);
        onClear?.();
      }}
      inputProps={mergedInputProps}
      iconButtons={iconButtons}
    />
  );
}
