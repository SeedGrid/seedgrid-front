"use client";

import React from "react";
import { X } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import type { RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";

export type SgInputTextAreaProps = {
  id: string;
  label?: string;
  labelText?: string;
  labelPosition?: "float" | "top" | "left";
  labelWidth?: number | string;
  labelAlign?: "start" | "center" | "end";
  elevation?: "none" | "sm" | "md" | "lg";
  hintText?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  maxLength?: number;
  maxLengthMessage?: string;
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
} & RhfFieldProps;

type SgInputTextAreaBaseProps = Omit<SgInputTextAreaProps, keyof RhfFieldProps>;

function ErrorText(props: Readonly<{ message?: string }>) {
  if (!props.message) return null;
  return <p className="text-xs text-red-600">{props.message}</p>;
}

function mergeTextareaPropsWithField(
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement> | undefined,
  field: ControllerRenderProps<FieldValues, string>
) {
  const resolvedValue =
    typeof field.value === "string" ? field.value : field.value == null ? "" : String(field.value);

  return {
    ...textareaProps,
    value: resolvedValue,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.onChange(event);
      textareaProps?.onChange?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => {
      field.onBlur();
      textareaProps?.onBlur?.(event);
    },
    ref: (node: HTMLTextAreaElement | null) => {
      field.ref(node);
      const ref = (textareaProps as { ref?: React.Ref<HTMLTextAreaElement> })?.ref;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as { current: HTMLTextAreaElement | null }).current = node;
      }
    }
  };
}

function SgInputTextAreaBase(props: SgInputTextAreaBaseProps) {
  const i18n = useComponentsI18n();
  const textareaProps = props.textareaProps ?? {};
  const labelPosition = props.labelPosition ?? "float";
  const isFloatLabel = labelPosition === "float";
  const showExternalLabel = !isFloatLabel;
  const labelAlign = props.labelAlign ?? "start";
  const labelText = props.labelText ?? props.label ?? "";
  const placeholder = isFloatLabel
    ? props.hintText ?? labelText
    : props.hintText ?? "";
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
      } else if (typeof ref === "object") {
        (ref as { current: HTMLTextAreaElement | null }).current = node;
      }
    },
    [textareaProps]
  );

  const runValidation = React.useCallback(
    (value: string) => {
      const required = props.required ?? false;
      if (!value && required) {
        const message = props.requiredMessage ?? t(i18n, "components.inputs.textarea.required");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.maxLength && value.length > props.maxLength) {
        const message =
          props.maxLengthMessage ??
          t(i18n, "components.inputs.textarea.maxLength", { max: props.maxLength });
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minLength && value.length < props.minLength) {
        const message =
          props.minLengthMessage ??
          t(i18n, "components.inputs.textarea.minLength", { min: props.minLength });
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minNumberOfWords && wordCount(value) < props.minNumberOfWords) {
        const message =
          props.minNumberOfWordsMessage ??
          t(i18n, "components.inputs.textarea.minWords", { min: props.minNumberOfWords });
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.minLines && lineCount(value) < props.minLines) {
        const message = props.minLinesMessage ?? t(i18n, "components.inputs.textarea.minLines", { min: props.minLines });
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
    [i18n, props]
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

  const isDisabled = props.enabled === false || textareaProps.readOnly;
  const canShowClear = (props.clearButton ?? true) && !isDisabled;
  const hasSuffix = canShowClear;
  const paddingLeft = props.prefixIcon ? "pl-10" : "px-3";
  const paddingRight = hasSuffix ? "pr-10" : "pr-3";
  const placeholderClass = isFloatLabel ? "placeholder-transparent" : "placeholder:text-foreground/50";
  const baseClass =
    `peer w-full rounded-md text-sm focus:outline-none ${placeholderClass}`;
  const hasError = Boolean(props.error ?? internalError);
  const elevationClass = props.elevation === "none"
    ? ""
    : props.elevation === "md"
      ? "shadow-md"
      : props.elevation === "lg"
        ? "shadow-lg"
        : "shadow-sm";
  const borderClass = (props.withBorder ?? true) || hasError
    ? hasError
      ? "border border-[hsl(var(--destructive))] focus:border-[hsl(var(--destructive))] focus:ring-2 focus:ring-[hsl(var(--destructive)/0.25)]"
      : "border border-border focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]"
    : "border border-transparent";
  const bgClass = props.filled ? "bg-muted/40" : "bg-white";
  const finalClass = [
    baseClass,
    borderClass,
    elevationClass,
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
  const resolvedLabelWidth = props.labelWidth !== undefined
    ? typeof props.labelWidth === "number"
      ? `${props.labelWidth}px`
      : props.labelWidth
    : "11rem";
  const labelAlignClass = labelAlign === "center"
    ? "text-center"
    : labelAlign === "end"
      ? "text-right"
      : "text-left";
  const externalLabelClass = [
    "block text-sm font-medium",
    hasError ? "text-[hsl(var(--destructive))]" : "text-foreground/70",
    labelPosition === "left" ? `pt-2 ${labelAlignClass}` : "",
    props.labelClassName ?? ""
  ].join(" ");
  const outerLayoutStyle = labelPosition === "left"
    ? ({ ["--sg-input-label-width" as string]: resolvedLabelWidth } as React.CSSProperties)
    : undefined;
  const fieldNode = (
    <>
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
        {isFloatLabel ? (
          <label
            htmlFor={props.id}
            className={[
              "absolute left-3 bg-white px-1 transition-all",
              isFilled ? "-top-2 text-xs" : "top-3 text-sm",
              hasError ? "text-[hsl(var(--destructive))]" : isFilled ? "text-[hsl(var(--primary))]" : "text-foreground/60",
              hasError
                ? "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[hsl(var(--destructive))]"
                : "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]",
              props.labelClassName ?? ""
            ].join(" ")}
          >
            {labelText}
          </label>
        ) : null}
        {canShowClear ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-3 rounded px-1 text-xs text-foreground/60 hover:text-foreground"
            aria-label={t(i18n, "components.actions.clear")}
          >
            <X size={16} />
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
    </>
  );

  if (labelPosition === "left") {
    return (
      <div style={{ width: props.width ?? "100%" }}>
        <div
          className="grid grid-cols-1 gap-2 sm:grid-cols-[var(--sg-input-label-width)_minmax(0,1fr)] sm:items-start sm:gap-3"
          style={outerLayoutStyle}
        >
          {showExternalLabel ? (
            <label htmlFor={props.id} className={externalLabelClass}>
              {labelText}
            </label>
          ) : null}
          <div>{fieldNode}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: props.width ?? "100%" }}>
      {showExternalLabel ? (
        <label htmlFor={props.id} className={externalLabelClass}>
          {labelText}
        </label>
      ) : null}
      <div className={showExternalLabel ? "mt-1" : undefined}>
        {fieldNode}
      </div>
    </div>
  );
}

export function SgInputTextArea(props: Readonly<SgInputTextAreaProps>) {
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
          <SgInputTextAreaBase
            {...rest}
            error={rest.error ?? fieldState.error?.message}
            textareaProps={mergeTextareaPropsWithField(rest.textareaProps, field)}
          />
        )}
      />
    );
  }
  return <SgInputTextAreaBase {...rest} />;
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function lineCount(value: string) {
  return value.split("\n").length;
}
