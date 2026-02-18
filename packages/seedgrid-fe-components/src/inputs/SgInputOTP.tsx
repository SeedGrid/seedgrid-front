"use client";

import React from "react";
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

type SlotKind = "alphanumeric" | "digit";

type MaskSlotToken = {
  type: "slot";
  slotIndex: number;
  slotKind: SlotKind;
};

type MaskSeparatorToken = {
  type: "separator";
  value: string;
};

type MaskToken = MaskSlotToken | MaskSeparatorToken;

const DEFAULT_MASK = "999999";
const DIGIT_RE = /^[0-9]$/;
const ALPHANUMERIC_RE = /^[A-Za-z0-9]$/;

export type SgInputOTPRef = {
  focus: (slotIndex?: number) => void;
  clear: () => void;
  getRawValue: () => string;
  getMaskedValue: () => string;
};

export type SgInputOTPProps = {
  id: string;
  label?: string;
  hintText?: string;
  mask?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
  className?: string;
  groupClassName?: string;
  slotClassName?: string;
  separatorClassName?: string;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue"
  > & {
    ref?: React.Ref<HTMLInputElement>;
  };
  width?: number | string;
  enabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  requiredMessage?: string;
  validation?: (rawValue: string, maskedValue: string) => string | null;
  validateOnBlur?: boolean;
  onValidation?: (message: string | null) => void;
  onChange?: (maskedValue: string) => void;
  onRawChange?: (rawValue: string) => void;
  onComplete?: (value: string) => void;
  onEnter?: () => void;
  onExit?: () => void;
  onClear?: () => void;
  register?: UseFormRegister<FieldValues>;
  rules?: RegisterOptions<FieldValues>;
} & RhfFieldProps;

type SgInputOTPBaseProps = Omit<SgInputOTPProps, keyof RhfFieldProps | "register" | "rules"> & {
  name?: string;
  onFieldChange?: (rawValue: string) => void;
  onFieldBlur?: (rawValue: string) => void;
  hiddenFieldRef?: React.Ref<HTMLInputElement>;
};

function normalizeExternalValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return String(value);
}

function toCssSize(value: number | string | undefined) {
  if (value === undefined) return "fit-content";
  return typeof value === "number" ? `${value}px` : value;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
        continue;
      }
      if (typeof ref === "object" && "current" in ref) {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

function buildMask(source: string) {
  const tokens: MaskToken[] = [];
  const slots: MaskSlotToken[] = [];
  let nextSlotIndex = 0;

  for (const char of source) {
    if (char === "#" || char === "9") {
      const slot: MaskSlotToken = {
        type: "slot",
        slotIndex: nextSlotIndex,
        slotKind: char === "#" ? "alphanumeric" : "digit"
      };
      tokens.push(slot);
      slots.push(slot);
      nextSlotIndex += 1;
    } else {
      tokens.push({ type: "separator", value: char });
    }
  }

  return { tokens, slots };
}

function parseMask(mask?: string) {
  const source = mask && mask.length > 0 ? mask : DEFAULT_MASK;
  const parsed = buildMask(source);
  if (parsed.slots.length > 0) return parsed;
  return buildMask(DEFAULT_MASK);
}

function buildEmptySlotValues(slots: ReadonlyArray<MaskSlotToken>) {
  return Array.from({ length: slots.length }, () => "");
}

function isAcceptedChar(slot: MaskSlotToken, char: string) {
  if (char.length !== 1) return false;
  if (slot.slotKind === "digit") return DIGIT_RE.test(char);
  return ALPHANUMERIC_RE.test(char);
}

function textToSlotValues(text: string, slots: ReadonlyArray<MaskSlotToken>) {
  const next = buildEmptySlotValues(slots);
  let nextSlotIndex = 0;

  for (const char of text) {
    if (nextSlotIndex >= slots.length) break;
    const slot = slots[nextSlotIndex];
    if (!slot) break;
    if (!isAcceptedChar(slot, char)) continue;
    next[nextSlotIndex] = char;
    nextSlotIndex += 1;
  }

  return next;
}

function slotValuesToRaw(slotValues: ReadonlyArray<string>) {
  return slotValues.join("");
}

function hasRemainingSlotBeforeLastFilled(
  tokens: ReadonlyArray<MaskToken>,
  tokenIndex: number,
  lastFilledSlotIndex: number
) {
  for (let index = tokenIndex + 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token || token.type !== "slot") continue;
    return token.slotIndex <= lastFilledSlotIndex;
  }
  return false;
}

function slotValuesToMasked(tokens: ReadonlyArray<MaskToken>, slotValues: ReadonlyArray<string>) {
  let lastFilledSlotIndex = -1;
  for (let index = slotValues.length - 1; index >= 0; index -= 1) {
    const value = slotValues[index];
    if (!value) continue;
    lastFilledSlotIndex = index;
    break;
  }

  if (lastFilledSlotIndex < 0) return "";

  let masked = "";
  let hasWrittenAnySlot = false;

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
    const token = tokens[tokenIndex];
    if (!token) continue;

    if (token.type === "separator") {
      if (!hasWrittenAnySlot) continue;
      if (!hasRemainingSlotBeforeLastFilled(tokens, tokenIndex, lastFilledSlotIndex)) continue;
      masked += token.value;
      continue;
    }

    if (token.slotIndex > lastFilledSlotIndex) break;
    const value = slotValues[token.slotIndex] ?? "";
    if (!value) continue;
    masked += value;
    hasWrittenAnySlot = true;
  }

  return masked;
}

function areSlotValuesEqual(
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>
) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if ((left[index] ?? "") !== (right[index] ?? "")) return false;
  }
  return true;
}

function clampIndex(index: number, slotCount: number) {
  if (slotCount <= 0) return 0;
  if (index < 0) return 0;
  if (index > slotCount - 1) return slotCount - 1;
  return index;
}

const SgInputOTPBase = React.forwardRef<SgInputOTPRef, SgInputOTPBaseProps>(function SgInputOTPBase(
  props,
  ref
) {
  const i18n = useComponentsI18n();
  const {
    id,
    label,
    hintText,
    mask,
    value,
    defaultValue,
    error,
    className,
    groupClassName,
    slotClassName,
    separatorClassName,
    inputProps,
    width,
    enabled = true,
    readOnly = false,
    required = false,
    requiredMessage,
    validation,
    validateOnBlur = true,
    onValidation,
    onChange,
    onRawChange,
    onComplete,
    onEnter,
    onExit,
    onClear,
    name,
    onFieldChange,
    onFieldBlur,
    hiddenFieldRef
  } = props;

  const parsedMask = React.useMemo(() => parseMask(mask), [mask]);
  const tokens = parsedMask.tokens;
  const slots = parsedMask.slots;
  const slotCount = slots.length;

  const makeSlotValues = React.useCallback(
    (text: string) => textToSlotValues(text, slots),
    [slots]
  );

  const [slotValues, setSlotValues] = React.useState<string[]>(() => {
    const seeded = normalizeExternalValue(value ?? defaultValue ?? "");
    return makeSlotValues(seeded);
  });

  const slotValuesRef = React.useRef(slotValues);
  const slotRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const hiddenInputRef = React.useRef<HTMLInputElement | null>(null);
  const hasInteractedRef = React.useRef(false);
  const focusWithinRef = React.useRef(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const {
    ref: inputRef,
    className: inputClassName,
    onChange: onSlotInputChange,
    onPaste: onSlotInputPaste,
    onKeyDown: onSlotInputKeyDown,
    onFocus: onSlotInputFocus,
    onBlur: onSlotInputBlur,
    autoComplete: slotAutoComplete,
    inputMode: slotInputMode,
    pattern: slotPattern,
    disabled: inputDisabled,
    readOnly: inputReadOnly,
    autoFocus: slotAutoFocus,
    ...restSlotInputProps
  } = inputProps ?? {};

  React.useEffect(() => {
    slotValuesRef.current = slotValues;
  }, [slotValues]);

  React.useEffect(() => {
    if (slotRefs.current.length <= slotCount) return;
    slotRefs.current = slotRefs.current.slice(0, slotCount);
  }, [slotCount]);

  React.useEffect(() => {
    if (value === undefined) return;
    const next = makeSlotValues(normalizeExternalValue(value));
    setSlotValues((prev) => (areSlotValuesEqual(prev, next) ? prev : next));
  }, [makeSlotValues, value]);

  React.useEffect(() => {
    if (value !== undefined) return;
    setSlotValues((prev) => {
      const next = makeSlotValues(slotValuesToRaw(prev));
      return areSlotValuesEqual(prev, next) ? prev : next;
    });
  }, [makeSlotValues, value]);

  const focusSlot = React.useCallback(
    (requestedIndex: number) => {
      const nextIndex = clampIndex(requestedIndex, slotCount);
      const node = slotRefs.current[nextIndex];
      if (!node) return;
      node.focus();
      node.select();
    },
    [slotCount]
  );

  const runValidation = React.useCallback(
    (rawValue: string, maskedValue: string) => {
      if (!rawValue && required) {
        const message = requiredMessage ?? t(i18n, "components.inputs.required");
        setInternalError(message);
        onValidation?.(message);
        return message;
      }

      if (validation) {
        const message = validation(rawValue, maskedValue);
        setInternalError(message);
        onValidation?.(message ?? null);
        return message ?? null;
      }

      setInternalError(null);
      onValidation?.(null);
      return null;
    },
    [i18n, onValidation, required, requiredMessage, validation]
  );

  const commitSlotValues = React.useCallback(
    (nextSlotValues: string[], options?: { focusIndex?: number; triggerValidation?: boolean }) => {
      const previousRawValue = slotValuesToRaw(slotValuesRef.current);
      const nextRawValue = slotValuesToRaw(nextSlotValues);
      const nextMaskedValue = slotValuesToMasked(tokens, nextSlotValues);

      hasInteractedRef.current = true;
      slotValuesRef.current = nextSlotValues;
      setSlotValues(nextSlotValues);

      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = nextRawValue;
      }

      onChange?.(nextMaskedValue);
      onRawChange?.(nextRawValue);
      onFieldChange?.(nextRawValue);

      const shouldValidateNow = options?.triggerValidation ?? !validateOnBlur;
      if (shouldValidateNow) {
        runValidation(nextRawValue, nextMaskedValue);
      }

      const isComplete = nextSlotValues.length > 0 && nextSlotValues.every((part) => part.length === 1);
      if (isComplete) {
        onComplete?.(nextMaskedValue);
      }

      if (previousRawValue.length > 0 && nextRawValue.length === 0) {
        onClear?.();
      }

      if (options?.focusIndex === undefined) return;
      const nextFocusIndex = clampIndex(options.focusIndex, slotCount);
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => focusSlot(nextFocusIndex));
        return;
      }
      focusSlot(nextFocusIndex);
    },
    [
      focusSlot,
      onChange,
      onClear,
      onComplete,
      onFieldChange,
      onRawChange,
      runValidation,
      slotCount,
      tokens,
      validateOnBlur
    ]
  );

  const applyTextFrom = React.useCallback(
    (startSlotIndex: number, text: string, replaceTail: boolean) => {
      if (!text) return;
      const next = [...slotValuesRef.current];
      const boundedStart = clampIndex(startSlotIndex, slotCount);

      if (replaceTail) {
        for (let index = boundedStart; index < next.length; index += 1) {
          next[index] = "";
        }
      }

      let pointer = boundedStart;
      for (const char of text) {
        if (pointer >= slots.length) break;
        const slot = slots[pointer];
        if (!slot) break;
        if (!isAcceptedChar(slot, char)) continue;
        next[pointer] = char;
        pointer += 1;
      }

      const focusIndex = clampIndex(pointer, slotCount);
      commitSlotValues(next, { focusIndex });
    },
    [commitSlotValues, slotCount, slots]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      focus: (slotIndex = 0) => {
        focusSlot(slotIndex);
      },
      clear: () => {
        commitSlotValues(buildEmptySlotValues(slots), {
          focusIndex: 0,
          triggerValidation: !validateOnBlur
        });
      },
      getRawValue: () => slotValuesToRaw(slotValuesRef.current),
      getMaskedValue: () => slotValuesToMasked(tokens, slotValuesRef.current)
    }),
    [commitSlotValues, focusSlot, slots, tokens, validateOnBlur]
  );

  const handleGroupFocusCapture = React.useCallback(() => {
    if (focusWithinRef.current) return;
    focusWithinRef.current = true;
    onEnter?.();
  }, [onEnter]);

  const handleGroupBlurCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && event.currentTarget.contains(nextTarget)) return;

      focusWithinRef.current = false;
      const nextRawValue = slotValuesToRaw(slotValuesRef.current);
      const nextMaskedValue = slotValuesToMasked(tokens, slotValuesRef.current);

      if (validateOnBlur || hasInteractedRef.current) {
        runValidation(nextRawValue, nextMaskedValue);
      }

      onExit?.();
      onFieldBlur?.(nextRawValue);
    },
    [onExit, onFieldBlur, runValidation, tokens, validateOnBlur]
  );

  const handleSlotChange = React.useCallback(
    (slotIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      onSlotInputChange?.(event);
      if (event.defaultPrevented) return;

      const slot = slots[slotIndex];
      if (!slot) return;

      const typed = event.currentTarget.value ?? "";
      if (!typed) {
        const next = [...slotValuesRef.current];
        next[slotIndex] = "";
        commitSlotValues(next, { focusIndex: slotIndex });
        return;
      }

      if (typed.length > 1) {
        applyTextFrom(slotIndex, typed, true);
        return;
      }

      const nextChar = typed.slice(-1);
      if (!isAcceptedChar(slot, nextChar)) {
        event.currentTarget.value = slotValuesRef.current[slotIndex] ?? "";
        return;
      }

      const next = [...slotValuesRef.current];
      next[slotIndex] = nextChar;
      commitSlotValues(next, { focusIndex: slotIndex + 1 });
    },
    [applyTextFrom, commitSlotValues, onSlotInputChange, slots]
  );

  const handleSlotPaste = React.useCallback(
    (slotIndex: number, event: React.ClipboardEvent<HTMLInputElement>) => {
      onSlotInputPaste?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      const pasted = event.clipboardData.getData("text") ?? "";
      if (!pasted) return;
      applyTextFrom(slotIndex, pasted, true);
    },
    [applyTextFrom, onSlotInputPaste]
  );

  const handleSlotKeyDown = React.useCallback(
    (slotIndex: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      onSlotInputKeyDown?.(event);
      if (event.defaultPrevented) return;

      const slot = slots[slotIndex];
      if (!slot) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusSlot(slotIndex - 1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusSlot(slotIndex + 1);
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        const next = [...slotValuesRef.current];
        const currentValue = next[slotIndex] ?? "";

        if (currentValue) {
          next[slotIndex] = "";
          commitSlotValues(next, { focusIndex: slotIndex });
          return;
        }

        if (slotIndex === 0) return;
        next[slotIndex - 1] = "";
        commitSlotValues(next, { focusIndex: slotIndex - 1 });
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        const next = [...slotValuesRef.current];
        next[slotIndex] = "";
        commitSlotValues(next, { focusIndex: slotIndex });
        return;
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (!isAcceptedChar(slot, event.key)) {
          event.preventDefault();
        }
      }
    },
    [commitSlotValues, focusSlot, onSlotInputKeyDown, slots]
  );

  const hasError = Boolean(error ?? internalError);
  const resolvedError = error ?? internalError ?? undefined;
  const isDisabled = enabled === false || Boolean(inputDisabled);
  const isReadOnly = readOnly || Boolean(inputReadOnly);
  const mergedSlotClass = [
    "h-12 w-11 border bg-white px-0 text-center text-base font-medium shadow-sm outline-none transition-all",
    hasError
      ? "border-[hsl(var(--destructive))] focus:border-[hsl(var(--destructive))] focus:ring-2 focus:ring-[hsl(var(--destructive)/0.25)]"
      : "border-border focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]",
    "disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-foreground/40",
    "read-only:cursor-default read-only:bg-muted/30",
    inputClassName ?? "",
    slotClassName ?? ""
  ]
    .filter(Boolean)
    .join(" ");

  const setHiddenInputRef = React.useMemo(
    () => mergeRefs<HTMLInputElement>(hiddenFieldRef, hiddenInputRef),
    [hiddenFieldRef]
  );

  const setSlotRef = React.useCallback(
    (slotIndex: number, node: HTMLInputElement | null) => {
      slotRefs.current[slotIndex] = node;
      if (slotIndex !== 0) return;

      if (!inputRef) return;
      if (typeof inputRef === "function") {
        inputRef(node);
        return;
      }

      if (typeof inputRef === "object" && "current" in inputRef) {
        (inputRef as { current: HTMLInputElement | null }).current = node;
      }
    },
    [inputRef]
  );

  const labelText = label ?? "";
  const firstSlotId = `${id}-slot-0`;

  return (
    <div className={className} style={{ width: toCssSize(width) }}>
      {labelText ? (
        <label htmlFor={firstSlotId} className="mb-2 block text-sm font-medium text-foreground/80">
          {labelText}
          {required ? (
            <span className="ml-1 text-[hsl(var(--destructive))]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div
        className={groupClassName ?? "inline-flex items-center gap-2"}
        onFocusCapture={handleGroupFocusCapture}
        onBlurCapture={handleGroupBlurCapture}
        role="group"
        aria-label={labelText || id}
        aria-invalid={hasError || undefined}
      >
        {tokens.map((token, tokenIndex) => {
          if (token.type === "separator") {
            return (
              <span
                key={`${id}-separator-${tokenIndex}`}
                className={
                  separatorClassName ??
                  "select-none px-1 text-lg font-semibold leading-none text-foreground/60"
                }
                aria-hidden="true"
              >
                {token.value}
              </span>
            );
          }

          const slotIndex = token.slotIndex;
          const slotValue = slotValues[slotIndex] ?? "";
          const computedInputMode =
            token.slotKind === "digit" ? "numeric" : slotInputMode ?? "text";
          const computedPattern =
            token.slotKind === "digit"
              ? "[0-9]*"
              : slotPattern ?? "[A-Za-z0-9]*";

          const slotShapeClass =
            slotCount === 1
              ? "rounded-2xl"
              : slotIndex === 0
                ? "rounded-l-2xl rounded-r-md"
                : slotIndex === slotCount - 1
                  ? "rounded-r-2xl rounded-l-md"
                  : "rounded-md";

          return (
            <input
              {...restSlotInputProps}
              key={`${id}-slot-${slotIndex}`}
              id={`${id}-slot-${slotIndex}`}
              type="text"
              value={slotValue}
              maxLength={1}
              autoComplete={slotIndex === 0 ? slotAutoComplete ?? "one-time-code" : "off"}
              autoFocus={slotIndex === 0 ? slotAutoFocus : false}
              inputMode={computedInputMode}
              pattern={computedPattern}
              className={`${mergedSlotClass} ${slotShapeClass}`}
              disabled={isDisabled}
              readOnly={isReadOnly}
              aria-label={labelText ? `${labelText} ${slotIndex + 1}` : `OTP ${slotIndex + 1}`}
              ref={(node) => setSlotRef(slotIndex, node)}
              onFocus={(event) => {
                event.currentTarget.select();
                onSlotInputFocus?.(event);
              }}
              onBlur={(event) => {
                onSlotInputBlur?.(event);
              }}
              onChange={(event) => handleSlotChange(slotIndex, event)}
              onPaste={(event) => handleSlotPaste(slotIndex, event)}
              onKeyDown={(event) => handleSlotKeyDown(slotIndex, event)}
            />
          );
        })}
      </div>

      {hintText ? <p className="mt-2 text-sm text-muted-foreground">{hintText}</p> : null}
      {resolvedError ? <p data-sg-error className="mt-1 text-xs text-red-600">{resolvedError}</p> : null}

      <input
        id={`${id}-value`}
        type="hidden"
        name={name}
        value={slotValuesToRaw(slotValues)}
        ref={setHiddenInputRef}
        readOnly
        aria-hidden="true"
      />
    </div>
  );
});

function createSyntheticChangeEvent(
  name: string,
  value: string
): React.ChangeEvent<HTMLInputElement> {
  const target = { name, value } as EventTarget & HTMLInputElement;
  return {
    target,
    currentTarget: target
  } as React.ChangeEvent<HTMLInputElement>;
}

function createSyntheticBlurEvent(
  name: string,
  value: string
): React.FocusEvent<HTMLInputElement> {
  const target = { name, value } as EventTarget & HTMLInputElement;
  return {
    target,
    currentTarget: target,
    relatedTarget: null
  } as React.FocusEvent<HTMLInputElement>;
}

export const SgInputOTP = React.forwardRef<SgInputOTPRef, SgInputOTPProps>(function SgInputOTP(
  props,
  ref
) {
  const { control, name, register, rules, ...rest } = props;

  if (name && register) {
    const registration = register(name, rules);
    return (
      <SgInputOTPBase
        {...rest}
        ref={ref}
        name={name}
        hiddenFieldRef={registration.ref}
        onFieldChange={(rawValue) => {
          registration.onChange(createSyntheticChangeEvent(name, rawValue));
        }}
        onFieldBlur={(rawValue) => {
          registration.onBlur(createSyntheticBlurEvent(name, rawValue));
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
          <SgInputOTPBase
            {...rest}
            ref={ref}
            name={name}
            value={normalizeExternalValue(field.value)}
            error={rest.error ?? fieldState.error?.message}
            hiddenFieldRef={field.ref}
            onFieldChange={(rawValue) => {
              field.onChange(rawValue);
            }}
            onFieldBlur={() => {
              field.onBlur();
            }}
          />
        )}
      />
    );
  }

  return <SgInputOTPBase {...rest} ref={ref} name={name} />;
});
