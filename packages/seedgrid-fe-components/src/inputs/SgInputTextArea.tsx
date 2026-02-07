"use client";

import React from "react";

export type SgInputTextAreaProps = {
  id: string;
  label?: string;
  labelText?: string;
  hintText?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  maxLength?: number;
  maxLines?: number;
  minLines?: number;
  minLinesMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  minNumberOfWords?: number;
  minNumberOfWordsMessage?: string;
  required?: boolean;
  requiredMessage?: string;
  prefixIcon?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  clearButton?: boolean;
  filled?: boolean;
  enabled?: boolean;
  showCharCounter?: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  withBorder?: boolean;
  borderRadius?: number | string;
  validation?: (value: string) => string | null;
  validateOnBlur?: boolean;
  onValidation?: (message: string | null) => void;
};

function ErrorText(props: Readonly<{ message?: string }>) {
  if (!props.message) return null;
  return <p data-sg-error className="text-xs text-red-600">{props.message}</p>;
}

export function SgInputTextArea(props: Readonly<SgInputTextAreaProps>) {
  const textareaProps = props.textareaProps ?? {};
  const labelText = props.labelText ?? props.label ?? "";
  const placeholder = props.hintText ?? labelText;
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [isFilled, setIsFilled] = React.useState<boolean>(() => {
    const value = textareaProps.value ?? textareaProps.defaultValue ?? "";
    return String(value).length > 0;
  });
  const [valueLength, setValueLength] = React.useState<number>(() => {
    const value = textareaProps.value ?? textareaProps.defaultValue ?? "";
    return String(value).length;
  });

  React.useEffect(() => {
    const next = (textareaRef.current?.value ?? "").length > 0;
    if (next !== isFilled) setIsFilled(next);
    setValueLength((textareaRef.current?.value ?? "").length);
  });

  React.useEffect(() => {
    if (textareaProps.value === undefined) return;
    setIsFilled(String(textareaProps.value ?? "").length > 0);
    setValueLength(String(textareaProps.value ?? "").length);
  }, [textareaProps.value]);

  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      const ref = (textareaProps as { ref?: React.Ref<HTMLTextAreaElement> }).ref;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as { current: HTMLTextAreaElement | null }).current = node;
      }
    },
    [textareaProps]
  );

  const runValidation = React.useCallback(
    (value: string) => {
      const required = props.required ?? false;
      if (!value && required) {
        const message = props.requiredMessage ?? "Campo de preenchimento obrigatório.";
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minLength && value.length < props.minLength) {
        const message =
          props.minLengthMessage ??
          `Texto tem de ter no minimo ${props.minLength} letra(s).`;
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minNumberOfWords && wordCount(value) < props.minNumberOfWords) {
        const message =
          props.minNumberOfWordsMessage ??
          `Texto tem de ter no mínimo ${props.minNumberOfWords} palavra(s).`;
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minLines && lineCount(value) < props.minLines) {
        const message = props.minLinesMessage ?? `Texto tem de ter no mínimo ${props.minLines} linha(s)`;
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    setValueLength(event.currentTarget.value.length);
    setHasInteracted(true);
    runValidation(event.currentTarget.value);
    textareaProps.onChange?.(event);
    props.onChange?.(event.currentTarget.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    if ((props.validateOnBlur ?? true) || hasInteracted) {
      runValidation(event.currentTarget.value);
    }
    textareaProps.onBlur?.(event);
    props.onExit?.();
  };

  const handleFocus = () => {
    props.onEnter?.();
  };

  const handleClear = () => {
    if (!textareaRef.current) return;
    textareaRef.current.value = "";
    setIsFilled(false);
    setValueLength(0);
    const event = {
      target: textareaRef.current,
      currentTarget: textareaRef.current
    } as React.ChangeEvent<HTMLTextAreaElement>;
    textareaProps.onChange?.(event);
    props.onChange?.("");
    props.onClear?.();
  };

  const hasSuffix = (props.clearButton ?? true);
  const paddingLeft = props.prefixIcon ? "pl-10" : "px-3";
  const paddingRight = hasSuffix ? "pr-10" : "pr-3";
  const baseClass =
    "peer w-full rounded-md text-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]";
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
    "pt-4",
    "pb-3"
  ].join(" ");
  let resolvedBorderRadius: string | undefined;
  if (props.borderRadius !== undefined) {
    resolvedBorderRadius =
      typeof props.borderRadius === "number"
        ? `${props.borderRadius}px`
        : props.borderRadius;
  }

  const resolvedHeight = props.height;
  const textareaStyle: React.CSSProperties = {
    borderRadius: resolvedBorderRadius,
    ...(textareaProps.style ?? {})
  };
  if (resolvedHeight !== undefined) {
    textareaStyle.height =
      typeof resolvedHeight === "number" ? `${resolvedHeight}px` : resolvedHeight;
  }

  return (
    <div style={{ width: props.width ?? "100%" }}>
      <div className="relative">
        {props.prefixIcon ? (
          <span className="pointer-events-none absolute left-3 top-3 text-foreground/60">
            {props.prefixIcon}
          </span>
        ) : null}
        <textarea
          id={props.id}
          placeholder={placeholder}
          className={props.className ?? finalClass}
          style={textareaStyle}
          maxLength={props.maxLength}
          rows={props.maxLines ?? 2}
          readOnly={props.enabled === false ? true : textareaProps.readOnly}
          disabled={props.enabled === false}
          {...textareaProps}
          ref={setRefs}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <label
          htmlFor={props.id}
          className={[
            "absolute left-3 bg-white px-1 transition-all",
            isFilled ? "-top-2 text-xs text-[hsl(var(--primary))]" : "top-3 text-sm text-foreground/60",
            "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]",
            props.labelClassName ?? ""
          ].join(" ")}
        >
          {labelText}
        </label>
        {(props.clearButton ?? true) ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-3 rounded px-1 text-xs text-foreground/60 hover:text-foreground"
            aria-label="Limpar"
          >
            ×
          </button>
        ) : null}
      </div>
      <div className="mt-0 flex items-center justify-between gap-2">
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

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function lineCount(value: string) {
  return value.split("\n").length;
}
