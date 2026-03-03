"use client";

import React from "react";
import { X } from "lucide-react";
import { Controller } from "react-hook-form";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  RegisterOptions,
  UseFormRegister
} from "react-hook-form";
import type { RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";

export type SgInputNumberProps = {
  id: string;
  label?: string;
  labelText?: string;
  labelPosition?: "float" | "top" | "left";
  labelWidth?: number | string;
  labelAlign?: "start" | "center" | "end";
  elevation?: "none" | "sm" | "md" | "lg";
  hintText?: string;
  prefixText?: string;
  suffixText?: string;
  decimals?: number; // default 2
  allowNegative?: boolean; // default true
  emptyValue?: "null" | "zero"; // default "zero"
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputProps?: (React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  });
  maxValue?: number;
  minValue?: number;
  minValueMessage?: string;
  maxValueMessage?: string;
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
  iconButtons?: React.ReactNode[];
  readOnly?: boolean;
  validation?: (value: string) => string | null;
  validateOnBlur?: boolean;
  onValidation?: (message: string | null) => void;
  register?: UseFormRegister<FieldValues>;
  rules?: RegisterOptions<FieldValues>;
} & RhfFieldProps;

type SgInputNumberBaseProps = Omit<SgInputNumberProps, keyof RhfFieldProps> & {
  externalValue?: string | number;
  onExternalChange?: (value: string) => void;
};

type NumberState = {
  negative: boolean;
  intDigits: string;
  decDigits: string;
  hasDecimal: boolean;
};

function ErrorText(props: { message?: string }) {
  if (!props.message) return null;
  return <p data-sg-error className="text-xs text-red-600">{props.message}</p>;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

function getSeparators(locale: string) {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1000.1);
    const group = parts.find((p) => p.type === "group")?.value ?? ",";
    const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
    return { group, decimal };
  } catch {
    return { group: ",", decimal: "." };
  }
}

function normalizeState(
  raw: string,
  decimals: number,
  allowNegative: boolean,
  decimalSep: string
): NumberState {
  let text = raw ?? "";
  const isNegative = allowNegative && text.includes("-");
  text = text.replace(/[^0-9.,]/g, "");
  const lastDot = text.lastIndexOf(".");
  const lastComma = text.lastIndexOf(",");
  const decimalIndex = Math.max(lastDot, lastComma);
  let intPart = "";
  let decPart = "";
  let hasDecimal = false;
  if (decimalIndex >= 0) {
    hasDecimal = true;
    intPart = text.slice(0, decimalIndex).replace(/[^0-9]/g, "");
    decPart = text.slice(decimalIndex + 1).replace(/[^0-9]/g, "");
  } else {
    intPart = text.replace(/[^0-9]/g, "");
  }
  if (!intPart) intPart = "0";
  if (decimals > 0) {
    decPart = decPart.slice(0, decimals);
  } else {
    decPart = "";
    hasDecimal = false;
  }
  return {
    negative: isNegative,
    intDigits: intPart,
    decDigits: decPart,
    hasDecimal
  };
}

function formatWithGroup(intDigits: string, group: string) {
  const clean = intDigits.replace(/^0+(?!$)/, "");
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, group);
}

function stateToDisplay(state: NumberState | null, decimals: number, decimalSep: string, group: string) {
  if (!state) return "";
  const intPart = formatWithGroup(state.intDigits, group);
  if (decimals <= 0) return `${state.negative ? "-" : ""}${intPart}`;
  const decPart = state.decDigits.padEnd(decimals, "0");
  return `${state.negative ? "-" : ""}${intPart}${decimalSep}${decPart}`;
}

function stateToValue(state: NumberState | null, decimals: number): string {
  if (!state) return "";
  const intPart = state.intDigits.replace(/^0+(?!$)/, "");
  if (decimals <= 0) return `${state.negative ? "-" : ""}${intPart || "0"}`;
  const decPart = state.decDigits.padEnd(decimals, "0");
  return `${state.negative ? "-" : ""}${intPart || "0"}.${decPart}`;
}

function stateToNumber(state: NumberState | null, decimals: number): number | null {
  if (!state) return null;
  const value = stateToValue(state, decimals);
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num;
}

function setCaretToEnd(input: HTMLInputElement | null) {
  if (!input) return;
  const length = input.value.length;
  try {
    input.setSelectionRange(length, length);
  } catch {
    // ignore
  }
}

function SgInputNumberBase(props: SgInputNumberBaseProps) {
  const i18n = useComponentsI18n();
  const decimals = props.decimals ?? 2;
  const allowNegative = props.allowNegative ?? true;
  const emptyValue = props.emptyValue ?? "zero";
  const { decimal: decimalSep, group: groupSep } = getSeparators(i18n.locale);
  const inputProps = props.inputProps ?? {};
  const {
    value: _ignoredValue,
    defaultValue: _ignoredDefault,
    onChange: inputOnChange,
    ...restInputProps
  } = inputProps as React.InputHTMLAttributes<HTMLInputElement>;
  const labelPosition = props.labelPosition ?? "float";
  const isFloatLabel = labelPosition === "float";
  const showExternalLabel = !isFloatLabel;
  const labelAlign = props.labelAlign ?? "start";
  const labelText = props.labelText ?? props.label ?? "";
  const placeholder = isFloatLabel
    ? props.placeholder ?? props.hintText ?? labelText
    : props.placeholder ?? props.hintText ?? "";
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const prefixRef = React.useRef<HTMLSpanElement | null>(null);
  const suffixRef = React.useRef<HTMLSpanElement | null>(null);
  const [prefixWidth, setPrefixWidth] = React.useState(0);
  const [suffixWidth, setSuffixWidth] = React.useState(0);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const initialState = React.useMemo<NumberState | null>(() => {
    const raw = props.externalValue ?? inputProps.value ?? inputProps.defaultValue ?? "";
    if ((raw === "" || raw == null) && emptyValue === "null") return null;
    return normalizeState(String(raw), decimals, allowNegative, decimalSep);
  }, [props.externalValue, inputProps.value, inputProps.defaultValue, emptyValue, decimals, allowNegative, decimalSep]);

  const [state, setState] = React.useState<NumberState | null>(initialState);
  const stateRef = React.useRef<NumberState | null>(initialState);
  const lastEmittedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const raw = props.externalValue ?? inputProps.value;
    if (raw === undefined) return;
    if (inputRef.current) {
      const isFocused = typeof document !== "undefined" && document.activeElement === inputRef.current;
      if (isFocused && lastEmittedRef.current === String(raw ?? "")) {
        return;
      }
    }
    if ((raw === "" || raw == null) && emptyValue === "null") {
      stateRef.current = null;
      setState(null);
      return;
    }
    const next = normalizeState(String(raw), decimals, allowNegative, decimalSep);
    stateRef.current = next;
    setState(next);
  }, [props.externalValue, inputProps.value, emptyValue, decimals, allowNegative, decimalSep]);

  // Locale change only affects formatting. State is locale-agnostic (digits + flags).

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
  }, [props.prefixText, props.suffixText, prefixWidth, suffixWidth]);

  const displayValue = stateToDisplay(state, decimals, decimalSep, groupSep);
  const isFilled = displayValue.length > 0;

  const runValidation = React.useCallback(
    (valueState: NumberState | null) => {
      const required = props.required ?? false;
      const numberValue = stateToNumber(valueState, decimals);
      const isZeroValue =
        valueState != null &&
        valueState.negative === false &&
        valueState.intDigits.replace(/^0+(?!$)/, "0") === "0" &&
        (decimals <= 0 || valueState.decDigits.replace(/0/g, "") === "");
      if (!valueState || numberValue === null || (emptyValue === "zero" && isZeroValue)) {
        if (required) {
          const message = props.requiredMessage ?? t(i18n, "components.inputs.required");
          setInternalError(message);
          props.onValidation?.(message);
          return;
        }
        setInternalError(null);
        props.onValidation?.(null);
        return;
      }
      if (props.minValue !== undefined && numberValue < props.minValue) {
        const message =
          props.minValueMessage ?? t(i18n, "components.inputs.number.min", { min: props.minValue });
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.maxValue !== undefined && numberValue > props.maxValue) {
        const message =
          props.maxValueMessage ?? t(i18n, "components.inputs.number.max", { max: props.maxValue });
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.validation) {
        const message = props.validation(stateToValue(valueState, decimals));
        setInternalError(message);
        props.onValidation?.(message ?? null);
        return;
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [props, i18n, decimals]
  );

  const commitState = React.useCallback(
    (next: NumberState | null) => {
      stateRef.current = next;
      setState(next);
      setHasInteracted(true);
      const value = stateToValue(next, decimals);
      lastEmittedRef.current = value;
      props.onExternalChange?.(value);
      props.onChange?.(value);
      if (inputOnChange) {
        inputOnChange({
          target: { value },
          currentTarget: { value }
        } as React.ChangeEvent<HTMLInputElement>);
      }
      if (props.validateOnBlur === false) {
        runValidation(next);
      }
    },
    [decimals, props, runValidation, inputOnChange]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.readOnly || props.enabled === false || inputProps.readOnly) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key;
    if (key === "Tab" || key === "ArrowLeft" || key === "ArrowRight" || key === "Home" || key === "End") {
      return;
    }

    event.preventDefault();

    if (key === "Backspace" || key === "Delete") {
      const current = stateRef.current;
      if (!current) {
        if (emptyValue === "zero") {
          commitState({ negative: false, intDigits: "0", decDigits: "", hasDecimal: false });
        }
        return;
      }
      if (current.hasDecimal && current.decDigits.length > 0) {
        commitState({ ...current, decDigits: current.decDigits.slice(0, -1) });
        return;
      }
      if (current.hasDecimal && current.decDigits.length === 0) {
        commitState({ ...current, hasDecimal: false });
        return;
      }
      const nextInt = current.intDigits.slice(0, -1);
      if (!nextInt) {
        if (emptyValue === "null") {
          commitState(null);
        } else {
          commitState({ ...current, intDigits: "0" });
        }
        return;
      }
      commitState({ ...current, intDigits: nextInt });
      return;
    }

    if ((key === "-" || key === "_") && allowNegative) {
      const base = stateRef.current ?? { negative: false, intDigits: "0", decDigits: "", hasDecimal: false };
      const next = base;
      commitState({ ...next, negative: !next.negative });
      return;
    }

    const isDecimalKey = key === decimalSep || key === "." || key === ",";
    if (isDecimalKey) {
      if (decimals <= 0) return;
      const next =
        stateRef.current ?? { negative: false, intDigits: "0", decDigits: "", hasDecimal: false };
      const decDigits = next.decDigits.length >= decimals ? "" : next.decDigits;
      commitState({ ...next, hasDecimal: true, decDigits });
      return;
    }

    if (/\d/.test(key)) {
      const next =
        stateRef.current ?? { negative: false, intDigits: "0", decDigits: "", hasDecimal: false };
      if (next.hasDecimal && decimals > 0 && next.decDigits.length < decimals) {
        commitState({ ...next, decDigits: `${next.decDigits}${key}` });
        return;
      }
      const intDigits = next.intDigits === "0" ? key : `${next.intDigits}${key}`;
      commitState({ ...next, intDigits });
      return;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readOnly || props.enabled === false || inputProps.readOnly) return;
    const parsed = normalizeState(event.currentTarget.value, decimals, allowNegative, decimalSep);
    commitState(parsed);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (props.readOnly || props.enabled === false || inputProps.readOnly) return;
    const text = event.clipboardData.getData("text");
    if (!text) return;
    event.preventDefault();
    const parsed = normalizeState(text, decimals, allowNegative, decimalSep);
    commitState(parsed);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if ((props.validateOnBlur ?? true) || hasInteracted) {
      runValidation(state);
    }
    inputProps.onBlur?.(event);
    props.onExit?.();
  };

  const handleFocus = () => {
    props.onEnter?.();
  };

  const handleClear = () => {
    if (!inputRef.current) return;
    const next = emptyValue === "null"
      ? null
      : { negative: false, intDigits: "0", decDigits: "", hasDecimal: false };
    commitState(next);
    if (inputRef.current) {
      inputRef.current.value = stateToDisplay(next, decimals, decimalSep, groupSep);
      setCaretToEnd(inputRef.current);
    }
    props.onClear?.();
  };

  React.useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = displayValue;
    setCaretToEnd(inputRef.current);
  }, [displayValue]);

  const isDisabled = props.enabled === false || props.readOnly || inputProps.readOnly;
  const canShowClear = (props.clearButton ?? true) && !isDisabled;
  const iconButtonsCount = props.iconButtons?.length ?? 0;
  const hasSuffix = canShowClear || iconButtonsCount > 0;
  const paddingLeft = props.prefixIcon ? "pl-10" : "px-3";
  const paddingRight = hasSuffix ? "pr-10" : "pr-3";
  const placeholderClass = isFloatLabel ? "placeholder-transparent" : "placeholder:text-foreground/50";
  const baseClass =
    `peer h-11 w-full rounded-md text-sm focus:outline-none text-right ${placeholderClass}`;
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
    "py-2",
    "leading-[1.2]"
  ].join(" ");

  let resolvedBorderRadius: string | undefined;
  if (props.borderRadius !== undefined) {
    resolvedBorderRadius =
      typeof props.borderRadius === "number"
        ? `${props.borderRadius}px`
        : props.borderRadius;
  }

  const prefixPaddingStyle = props.prefixText
    ? `calc(${prefixWidth}px + 0.75rem${props.prefixIcon ? " + 0.75rem" : ""})`
    : undefined;
  const iconButtonsPadding = iconButtonsCount > 0 ? `${iconButtonsCount * 1.5}rem` : "0rem";
  const baseRightPadding = canShowClear ? "2rem" : "0.75rem";
  const suffixPaddingStyle = props.suffixText
    ? `calc(${suffixWidth}px + ${baseRightPadding} + ${iconButtonsPadding})`
    : hasSuffix
      ? `calc(${baseRightPadding} + ${iconButtonsPadding})`
      : undefined;
  const clearRightStyle = props.suffixText && suffixWidth
    ? `${suffixWidth}px`
    : undefined;
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
        {props.prefixText ? (
          <span
            ref={prefixRef}
            className="pointer-events-none absolute left-0 top-0 z-10 flex h-11 items-center rounded-l-md border border-border bg-muted/40 px-3 text-xs leading-none text-foreground/70"
          >
            {props.prefixText}
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
            ...(props.prefixText ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0 } : {}),
            ...(props.suffixText ? { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 } : {}),
            ...(inputProps.style ?? {})
          }}
          inputMode={props.textInputType ?? "decimal"}
          readOnly={props.readOnly}
          disabled={props.enabled === false}
          {...restInputProps}
          ref={mergeRefs(inputRef, (inputProps as { ref?: React.Ref<HTMLInputElement> })?.ref)}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        {props.suffixText ? (
          <span
            ref={suffixRef}
            className="pointer-events-none absolute right-0 top-0 z-10 flex h-11 items-center rounded-r-md border border-border bg-muted/40 px-3 text-xs leading-none text-foreground/70"
          >
            {props.suffixText}
          </span>
        ) : null}
        {isFloatLabel ? (
          <label
            htmlFor={props.id}
            className={[
              "absolute bg-white px-1 transition-all",
              isFilled
                ? "-top-2 left-3 text-xs"
                : `top-3 text-sm ${props.prefixIcon ? "left-10" : "left-3"}`,
              hasError
                ? "text-[hsl(var(--destructive))]"
                : isFilled
                  ? "text-[hsl(var(--primary))]"
                  : "text-foreground/60",
              hasError
                ? "peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-[hsl(var(--destructive))]"
                : "peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]",
              props.labelClassName ?? ""
            ].join(" ")}
            style={prefixPaddingStyle ? { left: prefixPaddingStyle } : undefined}
          >
            <span>{labelText}</span>
            {props.required ? (
              <span className="ml-1 text-[hsl(var(--destructive))]" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}
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
                aria-label={t(i18n, "components.actions.clear")}
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
              <span>{labelText}</span>
              {props.required ? (
                <span className="ml-1 text-[hsl(var(--destructive))]" aria-hidden="true">
                  *
                </span>
              ) : null}
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
          <span>{labelText}</span>
          {props.required ? (
            <span className="ml-1 text-[hsl(var(--destructive))]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div className={showExternalLabel ? "mt-1" : undefined}>
        {fieldNode}
      </div>
    </div>
  );
}

export function SgInputNumber(props: SgInputNumberProps) {
  const { control, name, register, rules, ...rest } = props;

  if (name && register) {
    const reg = register(name, rules);
    return (
      <SgInputNumberBase
        {...rest}
        onExternalChange={(value) => {
          reg.onChange({ target: { name, value } });
        }}
        inputProps={{
          ...rest.inputProps,
          name,
          ref: mergeRefs(reg.ref, (rest.inputProps as { ref?: React.Ref<HTMLInputElement> })?.ref),
          onBlur: (event) => {
            reg.onBlur(event);
            rest.inputProps?.onBlur?.(event);
          }
        }}
      />
    );
  }

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
          <SgInputNumberBase
            {...rest}
            externalValue={field.value}
            onExternalChange={(value) => field.onChange(value)}
            error={rest.error ?? fieldState.error?.message}
            inputProps={{
              ...rest.inputProps,
              onBlur: (event) => {
                field.onBlur();
                rest.inputProps?.onBlur?.(event);
              }
            }}
          />
        )}
      />
    );
  }

  return <SgInputNumberBase {...rest} />;
}
