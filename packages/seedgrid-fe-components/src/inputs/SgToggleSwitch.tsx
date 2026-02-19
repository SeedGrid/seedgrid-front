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

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "on" || normalized === "yes";
  }
  return fallback;
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

function ErrorText(props: { id?: string; message?: string }) {
  if (!props.message) return null;
  return (
    <p id={props.id} data-sg-error className="text-xs text-red-600">
      {props.message}
    </p>
  );
}

export type SgToggleSwitchProps = {
  id: string;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  switchClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  width?: number | string;
  enabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  requiredMessage?: string;
  validateOnBlur?: boolean;
  validation?: (checked: boolean) => string | null;
  onValidation?: (message: string | null) => void;
  onChange?: (checked: boolean) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  };
  register?: UseFormRegister<FieldValues>;
  rules?: RegisterOptions<FieldValues>;
} & RhfFieldProps;

type SgToggleSwitchBaseProps = Omit<SgToggleSwitchProps, keyof RhfFieldProps>;

function mergeInputPropsWithField(
  inputProps: React.InputHTMLAttributes<HTMLInputElement> | undefined,
  field: ControllerRenderProps<FieldValues, string>
) {
  return {
    ...inputProps,
    checked: toBoolean(field.value, false),
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(event.currentTarget.checked);
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

function SgToggleSwitchBase(props: Readonly<SgToggleSwitchBaseProps>) {
  const i18n = useComponentsI18n();
  const inputProps = props.inputProps ?? {};
  const {
    checked: inputChecked,
    defaultChecked: inputDefaultChecked,
    onChange: inputOnChange,
    onBlur: inputOnBlur,
    onClick: inputOnClick,
    disabled: inputDisabled,
    readOnly: inputReadOnly,
    className: inputClassName,
    ref: inputRef,
    style: inputStyle,
    ...restInputProps
  } = inputProps;

  const isControlled = props.checked !== undefined || inputChecked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState<boolean>(() =>
    toBoolean(props.defaultChecked ?? inputDefaultChecked, false)
  );
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const inputNodeRef = React.useRef<HTMLInputElement | null>(null);
  const errorId = `${props.id}-error`;

  const checked = isControlled ? toBoolean(props.checked ?? inputChecked, false) : internalChecked;
  const isReadOnly = Boolean(props.readOnly ?? inputReadOnly);
  const isDisabled = props.enabled === false || Boolean(inputDisabled);

  const setRefs = React.useMemo(
    () =>
      mergeRefs<HTMLInputElement>(
        (node) => {
          inputNodeRef.current = node;
        },
        inputRef
      ),
    [inputRef]
  );

  React.useEffect(() => {
    if (isControlled) return;
    const domChecked = inputNodeRef.current?.checked ?? false;
    setInternalChecked((prev) => (prev === domChecked ? prev : domChecked));
  }, [isControlled]);

  const runValidation = React.useCallback(
    (nextChecked: boolean) => {
      if ((props.required ?? false) && !nextChecked) {
        const message = props.requiredMessage ?? t(i18n, "components.inputs.required");
        setInternalError(message);
        props.onValidation?.(message);
        return;
      }
      if (props.validation) {
        const message = props.validation(nextChecked);
        setInternalError(message);
        props.onValidation?.(message ?? null);
        return;
      }
      setInternalError(null);
      props.onValidation?.(null);
    },
    [i18n, props]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      event.preventDefault();
      event.currentTarget.checked = checked;
      return;
    }
    const nextChecked = event.currentTarget.checked;
    if (!isControlled) setInternalChecked(nextChecked);
    setHasInteracted(true);
    if (props.validateOnBlur === false) {
      runValidation(nextChecked);
    }
    inputOnChange?.(event);
    props.onChange?.(nextChecked);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if ((props.validateOnBlur ?? true) || hasInteracted) {
      runValidation(event.currentTarget.checked);
    }
    inputOnBlur?.(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      event.preventDefault();
      return;
    }
    inputOnClick?.(event);
  };

  const hasError = Boolean(props.error ?? internalError);
  const resolvedBorderRadius = 9999;
  const switchWidth = props.width
    ? typeof props.width === "number"
      ? `${props.width}px`
      : props.width
    : undefined;

  return (
    <div className={cn("space-y-1", props.className)} style={switchWidth ? { width: switchWidth } : undefined}>
      <label
        htmlFor={props.id}
        className={cn(
          "inline-flex items-start gap-3 select-none",
          isDisabled
            ? "cursor-not-allowed opacity-70"
            : isReadOnly
              ? "cursor-default"
              : "cursor-pointer"
        )}
      >
        <input
          id={props.id}
          type="checkbox"
          role="switch"
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          aria-label={props.label ? undefined : props.id}
          checked={isControlled ? checked : undefined}
          defaultChecked={isControlled ? undefined : toBoolean(props.defaultChecked ?? inputDefaultChecked, false)}
          disabled={isDisabled}
          readOnly={isReadOnly}
          {...restInputProps}
          className={cn("peer sr-only", inputClassName)}
          style={inputStyle}
          ref={setRefs}
          onChange={handleChange}
          onBlur={handleBlur}
          onClick={handleClick}
        />
        <span className={cn("relative inline-flex h-6 w-11 items-center", props.switchClassName)}>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full border transition-colors duration-200",
              checked
                ? hasError
                  ? "border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.2)]"
                  : "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]"
                : hasError
                  ? "border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.05)]"
                  : "border-border bg-muted",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[hsl(var(--primary)/0.25)]",
              hasError ? "peer-focus-visible:ring-[hsl(var(--destructive)/0.25)]" : undefined,
              props.trackClassName
            )}
            style={{ borderRadius: resolvedBorderRadius }}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none relative z-10 inline-flex size-5 items-center justify-center rounded-full bg-white text-[11px] text-foreground/70 shadow-sm transition-transform duration-200",
              checked ? "translate-x-5" : "translate-x-0",
              props.thumbClassName
            )}
          >
            {checked ? props.onIcon ?? null : props.offIcon ?? null}
          </span>
        </span>
        {props.label ? (
          <span className={cn("pt-0.5 text-sm text-foreground", props.labelClassName)}>
            {props.label}
            {props.required ? <span className="ml-1 text-[hsl(var(--destructive))]">*</span> : null}
            {props.description ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">{props.description}</span>
            ) : null}
          </span>
        ) : null}
      </label>
      <ErrorText id={errorId} message={props.error ?? internalError ?? undefined} />
    </div>
  );
}

export function SgToggleSwitch(props: Readonly<SgToggleSwitchProps>) {
  const { control, name, register, rules, ...rest } = props;

  if (name && register) {
    const reg = register(name, rules);
    return (
      <SgToggleSwitchBase
        {...rest}
        inputProps={{
          ...rest.inputProps,
          name,
          onChange: (event) => {
            reg.onChange(event);
            rest.inputProps?.onChange?.(event);
          },
          onBlur: (event) => {
            reg.onBlur(event);
            rest.inputProps?.onBlur?.(event);
          },
          ref: mergeRefs(
            reg.ref,
            (rest.inputProps as { ref?: React.Ref<HTMLInputElement> })?.ref
          )
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
          <SgToggleSwitchBase
            {...rest}
            error={rest.error ?? fieldState.error?.message}
            inputProps={mergeInputPropsWithField(rest.inputProps, field)}
          />
        )}
      />
    );
  }

  return <SgToggleSwitchBase {...rest} />;
}

export const SgSwitch = SgToggleSwitch;
export type SgSwitchProps = SgToggleSwitchProps;
