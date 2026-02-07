"use client";

import React from "react";
import { X } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import type { RhfFieldProps } from "../rhf";

export type SgInputTextProps = {
  id: string;
  label?: string;
  labelText?: string;
  hintText?: string;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  maxLength?: number;
  minLength?: number;
  minLengthMessage?: string;
  minNumberOfWords?: number;
  minNumberOfWordsMessage?: string;
  prefixIcon?: React.ReactNode;
  width?: number | string;
  clearButton?: boolean;
  filled?: boolean;
  enabled?: boolean;
  textInputType?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  onEnter?: () => void;
  onExit?: () => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  withBorder?: boolean;
  borderRadius?: number | string;
  required?: boolean;
  requiredMessage?: string;
  showCharCounter?: boolean;
  iconButtons?: React.ReactNode[];
  readOnly?: boolean;
  validation?: (value: string) => string | null;
  validateOnBlur?: boolean;
  onValidation?: (message: string | null) => void;
} & RhfFieldProps;

type SgInputTextBaseProps = Omit<SgInputTextProps, keyof RhfFieldProps>;

function ErrorText(props: { message?: string }) {
  if (!props.message) return null;
  return <p data-sg-error className="text-xs text-red-600">{props.message}</p>;
}

function mergeInputPropsWithField(
  inputProps: React.InputHTMLAttributes<HTMLInputElement> | undefined,
  field: ControllerRenderProps<FieldValues, string>
) {
  const resolvedValue =
    typeof field.value === "string" ||
    typeof field.value === "number" ||
    Array.isArray(field.value)
      ? field.value
      : field.value == null
        ? ""
        : String(field.value);

  return {
    ...inputProps,
    value: resolvedValue,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(event);
      inputProps?.onChange?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur();
      inputProps?.onBlur?.(event);
    },
    ref: (node: HTMLInputElement | null) => {
      field.ref(node);
      const ref = (inputProps as { ref?: React.Ref<HTMLInputElement> })?.ref;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as { current: HTMLInputElement | null }).current = node;
      }
    }
  };
}

function SgInputTextBase(props: SgInputTextBaseProps) {
  const inputProps = props.inputProps ?? {};
  const labelText = props.labelText ?? props.label ?? "";
  const placeholder = props.placeholder ?? props.hintText ?? labelText;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [isFilled, setIsFilled] = React.useState<boolean>(() => {
    const value = inputProps.value ?? inputProps.defaultValue ?? "";
    return String(value).length > 0;
  });
  const [valueLength, setValueLength] = React.useState<number>(() => {
    const value = inputProps.value ?? inputProps.defaultValue ?? "";
    return String(value).length;
  });

  React.useEffect(() => {
    const next = (inputRef.current?.value ?? "").length > 0;
    if (next !== isFilled) setIsFilled(next);
    setValueLength((inputRef.current?.value ?? "").length);
  });

  React.useEffect(() => {
    if (inputProps.value === undefined) return;
    setIsFilled(String(inputProps.value ?? "").length > 0);
    setValueLength(String(inputProps.value ?? "").length);
  }, [inputProps.value]);

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      const ref = (inputProps as { ref?: React.Ref<HTMLInputElement> }).ref;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object") {
        (ref as { current: HTMLInputElement | null }).current = node;
      }
    },
    [inputProps]
  );

  const runValidation = React.useCallback(
    (value: string) => {
      const required = props.required ?? false;
      if (!value && required) {
        const message = props.requiredMessage ?? "Campo obrigatorio.";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minLength && value.length < props.minLength) {
        const message =
          props.minLengthMessage ??
          `Campo tem de ter no minimo ${props.minLength} letra(s).`;
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minNumberOfWords && wordCount(value) < props.minNumberOfWords) {
        const message =
          props.minNumberOfWordsMessage ??
          `Campo tem de ter no minimo ${props.minNumberOfWords} palavra(s).`;
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.validation) {
        const message = props.validation(value);
        setInternalError(message);
        props.onValidation?.(message ?? null);
        return;
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [props]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    setValueLength(event.currentTarget.value.length);
    setHasInteracted(true);
    runValidation(event.currentTarget.value);
    inputProps.onChange?.(event);
    props.onChange?.(event.currentTarget.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    if ((props.validateOnBlur ?? true) || hasInteracted) {
      runValidation(event.currentTarget.value);
    }
    inputProps.onBlur?.(event);
    props.onExit?.();
  };

  const handleFocus = () => {
    props.onEnter?.();
  };

  const handleClear = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    setIsFilled(false);
    setValueLength(0);
    const event = {
      target: inputRef.current,
      currentTarget: inputRef.current
    } as React.ChangeEvent<HTMLInputElement>;
    inputProps.onChange?.(event);
    props.onChange?.("");
    props.onClear?.();
  };

  const hasSuffix = (props.clearButton ?? true) || (props.iconButtons?.length ?? 0) > 0;
  const paddingLeft = props.prefixIcon ? "pl-10" : "px-3";
  const paddingRight = hasSuffix ? "pr-10" : "pr-3";
  const baseClass =
    "peer h-11 w-full rounded-md text-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]";
  const borderClass = props.withBorder ?? true
    ? "border border-border shadow-sm focus:border-[hsl(var(--primary))]"
    : "border border-transparent";
  const bgClass = props.filled ? "bg-muted/40" : "bg-white";
  const finalClass = [
    baseClass,
    borderClass,
    bgClass,
    paddingLeft,
    paddingRight,
    "pt-4"
  ].join(" ");
  let resolvedBorderRadius: string | undefined;
  if (props.borderRadius !== undefined) {
    resolvedBorderRadius =
      typeof props.borderRadius === "number"
        ? `${props.borderRadius}px`
        : props.borderRadius;
  }

  return (
    <div style={{ width: props.width ?? "100%" }}>
      <div className="relative">
        {props.prefixIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-foreground/60">
            {props.prefixIcon}
          </span>
        ) : null}
        <input
          id={props.id}
          type={props.type ?? "text"}
          placeholder={placeholder}
          className={props.className ?? finalClass}
          style={{ borderRadius: resolvedBorderRadius, ...(inputProps.style ?? {}) }}
          maxLength={props.maxLength}
          readOnly={props.readOnly}
          disabled={props.enabled === false}
          inputMode={props.textInputType ?? inputProps.inputMode}
          {...inputProps}
          ref={setRefs}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <label
          htmlFor={props.id}
          className={[
            "absolute bg-white px-1 transition-all",
            isFilled
              ? "-top-2 left-3 text-xs text-[hsl(var(--primary))]"
              : `top-3 text-sm text-foreground/60 ${props.prefixIcon ? "left-10" : "left-3"}`,
            `peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]`,
            props.labelClassName ?? ""
          ].join(" ")}
        >
          {labelText}
        </label>
        {hasSuffix ? (
          <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {(props.clearButton ?? true) ? (
              <button
                type="button"
                onClick={handleClear}
                className="rounded px-1 text-xs text-foreground/60 hover:text-foreground"
                aria-label="Limpar"
              >
 <X size={16} /> 
              </button>
            ) : null}
            {props.iconButtons?.map((node, index) => (
              <span key={index}>{node}</span>
            ))}
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <ErrorText message={props.error ?? internalError ?? undefined} />
        {props.showCharCounter ? (
          <span className="text-[11px] text-foreground/50">
            {valueLength}{props.maxLength ? `/${props.maxLength}` : ""}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SgInputText(props: SgInputTextProps) {
  const { control, name, ...rest } = props;
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field,
          fieldState
        }: {
          field: ControllerRenderProps<FieldValues, string>;
          fieldState: ControllerFieldState;
        }) => (
          <SgInputTextBase
            {...rest}
            error={rest.error ?? fieldState.error?.message}
            inputProps={mergeInputPropsWithField(rest.inputProps, field)}
          />
        )}
      />
    );
  }
  return <SgInputTextBase {...rest} />;
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
