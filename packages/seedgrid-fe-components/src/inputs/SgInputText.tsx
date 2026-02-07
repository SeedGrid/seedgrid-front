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
  prefixText?: string;
  suffixText?: string;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputProps?: (React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  });
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
  field: ControllerRenderProps<FieldValues, string>,
  options?: {
    normalizeValue?: (value: unknown) => string;
    toFieldValue?: (raw: string) => string;
  }
) {
  const resolvedValue =
    options?.normalizeValue
      ? options.normalizeValue(field.value)
      : typeof field.value === "string" ||
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
      if (options?.toFieldValue) {
        field.onChange(options.toFieldValue(event.currentTarget.value));
      } else {
        field.onChange(event);
      }
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
  const prefixText = props.prefixText ?? "";
  const suffixText = props.suffixText ?? "";
  const stripAffixes = React.useCallback(
    (value: unknown) => {
      if (value == null) return "";
      let text = String(value);
      if (!text) return "";
      if (prefixText && text.startsWith(prefixText)) {
        text = text.slice(prefixText.length);
      }
      if (suffixText && text.endsWith(suffixText)) {
        text = text.slice(0, -suffixText.length);
      }
      return text;
    },
    [prefixText, suffixText]
  );
  const buildFullValue = React.useCallback(
    (raw: string) => {
      if (!raw) return "";
      return `${prefixText}${raw}${suffixText}`;
    },
    [prefixText, suffixText]
  );
  const resolvedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps
  };
  if (inputProps.value !== undefined) {
    resolvedInputProps.value = stripAffixes(inputProps.value);
  }
  const labelText = props.labelText ?? props.label ?? "";
  const placeholder = props.placeholder ?? props.hintText ?? labelText;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const prefixRef = React.useRef<HTMLSpanElement | null>(null);
  const suffixRef = React.useRef<HTMLSpanElement | null>(null);
  const [prefixWidth, setPrefixWidth] = React.useState(0);
  const [suffixWidth, setSuffixWidth] = React.useState(0);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [isFilled, setIsFilled] = React.useState<boolean>(() => {
    const value = stripAffixes(inputProps.value ?? inputProps.defaultValue ?? "");
    return value.length > 0;
  });
  const [valueLength, setValueLength] = React.useState<number>(() => {
    const value = stripAffixes(inputProps.value ?? inputProps.defaultValue ?? "");
    return value.length;
  });

  React.useEffect(() => {
    const next = (inputRef.current?.value ?? "").length > 0;
    if (next !== isFilled) setIsFilled(next);
    setValueLength((inputRef.current?.value ?? "").length);
  });

  React.useEffect(() => {
    if (inputProps.value === undefined) return;
    const raw = stripAffixes(inputProps.value ?? "");
    setIsFilled(raw.length > 0);
    setValueLength(raw.length);
  }, [inputProps.value, stripAffixes]);

  React.useLayoutEffect(() => {
    if (prefixRef.current) {
      const next = prefixRef.current.offsetWidth;
      if (next !== prefixWidth) setPrefixWidth(next);
    } else if (prefixWidth !== 0) {
      setPrefixWidth(0);
    }
    if (suffixRef.current) {
      const next = suffixRef.current.offsetWidth;
      if (next !== suffixWidth) setSuffixWidth(next);
    } else if (suffixWidth !== 0) {
      setSuffixWidth(0);
    }
  }, [prefixText, suffixText, prefixWidth, suffixWidth]);

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      const ref = (resolvedInputProps as { ref?: React.Ref<HTMLInputElement> }).ref;
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
    resolvedInputProps.onChange?.(event);
    const rawValue = event.currentTarget.value;
    setIsFilled(rawValue.length > 0);
    setValueLength(rawValue.length);
    setHasInteracted(true);
    runValidation(rawValue);
    props.onChange?.(buildFullValue(rawValue));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    if ((props.validateOnBlur ?? true) || hasInteracted) {
      runValidation(event.currentTarget.value);
    }
    resolvedInputProps.onBlur?.(event);
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
    resolvedInputProps.onChange?.(event);
    props.onChange?.("");
    props.onClear?.();
  };

  const isDisabled = props.enabled === false || props.readOnly || resolvedInputProps.readOnly;
  const canShowClear = (props.clearButton ?? true) && !isDisabled;
  const hasSuffix = canShowClear || (props.iconButtons?.length ?? 0) > 0;
  const paddingLeft = props.prefixIcon ? "pl-10" : "px-3";
  const paddingRight = hasSuffix ? "pr-10" : "pr-3";
  const baseClass =
    "peer h-11 w-full rounded-md text-sm placeholder-transparent focus:outline-none";
  const hasError = Boolean(props.error ?? internalError);
  const borderClass = (props.withBorder ?? true) || hasError
    ? hasError
      ? "border border-[hsl(var(--destructive))] shadow-sm focus:border-[hsl(var(--destructive))] focus:ring-2 focus:ring-[hsl(var(--destructive)/0.25)]"
      : "border border-border shadow-sm focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]"
    : "border border-transparent";
  const bgClass = props.filled ? "bg-muted/40" : "bg-white";
  const finalClass = [
    baseClass,
    borderClass,
    bgClass,
    paddingLeft,
    paddingRight,
    "py-2",
    "leading-[1.2]",
    prefixText && suffixText ? "text-center" : suffixText ? "text-right" : "text-left"
  ].join(" ");
  let resolvedBorderRadius: string | undefined;
  if (props.borderRadius !== undefined) {
    resolvedBorderRadius =
      typeof props.borderRadius === "number"
        ? `${props.borderRadius}px`
        : props.borderRadius;
  }
  const prefixPaddingStyle = prefixText
    ? `calc(${prefixWidth}px + 0.75rem${props.prefixIcon ? " + 0.75rem" : ""})`
    : undefined;
  const suffixPaddingStyle = suffixText
    ? `calc(${suffixWidth}px + ${canShowClear ? "2rem" : "0.75rem"})`
    : undefined;
  const clearRightStyle = suffixText && suffixWidth
    ? `${suffixWidth}px`
    : undefined;

  return (
    <div style={{ width: props.width ?? "100%" }}>
      <div className="relative">
        {prefixText ? (
          <span
            ref={prefixRef}
            className="pointer-events-none absolute left-0 top-0 z-10 flex h-11 items-center rounded-l-md border border-border bg-muted/40 px-3 text-xs leading-none text-foreground/70"
          >
            {prefixText}
          </span>
        ) : null}
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
          style={{
            borderRadius: resolvedBorderRadius,
            paddingLeft: prefixPaddingStyle,
            paddingRight: suffixPaddingStyle,
            ...(prefixText ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0 } : {}),
            ...(suffixText ? { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 } : {}),
            ...(resolvedInputProps.style ?? {})
          }}
          maxLength={props.maxLength}
          readOnly={props.readOnly}
          disabled={props.enabled === false}
          inputMode={props.textInputType ?? resolvedInputProps.inputMode}
          {...resolvedInputProps}
          ref={setRefs}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        {suffixText ? (
          <span
            ref={suffixRef}
            className="pointer-events-none absolute right-0 top-0 z-10 flex h-11 items-center rounded-r-md border border-border bg-muted/40 px-3 text-xs leading-none text-foreground/70"
          >
            {suffixText}
          </span>
        ) : null}
        <label
          htmlFor={props.id}
          className={[
            "absolute bg-white px-1 transition-all",
            isFilled
              ? "-top-2 left-3 text-xs"
              : `top-3 text-sm ${props.prefixIcon ? "left-10" : "left-3"}`,
            hasError ? "text-[hsl(var(--destructive))]" : isFilled ? "text-[hsl(var(--primary))]" : "text-foreground/60",
            hasError
              ? "peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-[hsl(var(--destructive))]"
              : "peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]",
            props.labelClassName ?? ""
          ].join(" ")}
          style={prefixPaddingStyle ? { left: prefixPaddingStyle } : undefined}
        >
          {labelText}
        </label>
        {hasSuffix ? (
          <span
            className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1"
            style={clearRightStyle ? { right: clearRightStyle } : undefined}
          >
            {canShowClear ? (
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
    const prefixText = rest.prefixText ?? "";
    const suffixText = rest.suffixText ?? "";
    const normalizeValue = (value: unknown) => {
      if (value == null) return "";
      let text = String(value);
      if (prefixText && text.startsWith(prefixText)) {
        text = text.slice(prefixText.length);
      }
      if (suffixText && text.endsWith(suffixText)) {
        text = text.slice(0, -suffixText.length);
      }
      return text;
    };
    const toFieldValue = (raw: string) => {
      if (!raw) return "";
      return `${prefixText}${raw}${suffixText}`;
    };
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
            inputProps={mergeInputPropsWithField(rest.inputProps, field, { normalizeValue, toFieldValue })}
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
