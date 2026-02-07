"use client";

import React from "react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import type { RhfFieldProps } from "../rhf";

export type SgInputSelectProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  options: Array<{ value: string; label: string }>;
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement>;
  alwaysFloat?: boolean;
} & RhfFieldProps;

type SgInputSelectBaseProps = Omit<SgInputSelectProps, keyof RhfFieldProps>;

function ErrorText(props: { message?: string }) {
  if (!props.message) return null;
  return <p data-sg-error className="text-xs text-red-600">{props.message}</p>;
}

function mergeSelectPropsWithField(
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement> | undefined,
  field: ControllerRenderProps<FieldValues, string>
) {
  const resolvedValue =
    typeof field.value === "string" || typeof field.value === "number" || Array.isArray(field.value)
      ? field.value
      : field.value == null
        ? ""
        : String(field.value);

  return {
    ...selectProps,
    value: resolvedValue,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      field.onChange(event);
      selectProps?.onChange?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLSelectElement>) => {
      field.onBlur();
      selectProps?.onBlur?.(event);
    },
    ref: (node: HTMLSelectElement | null) => {
      field.ref(node);
      const ref = (selectProps as { ref?: React.Ref<HTMLSelectElement> })?.ref;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as { current: HTMLSelectElement | null }).current = node;
      }
    }
  };
}

function SgInputSelectBase(props: SgInputSelectBaseProps) {
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  const [isFilled, setIsFilled] = React.useState<boolean>(() => {
    const value = props.selectProps.value ?? props.selectProps.defaultValue ?? "";
    return String(value).length > 0;
  });

  React.useEffect(() => {
    const next = (selectRef.current?.value ?? "").length > 0;
    if (next !== isFilled) setIsFilled(next);
  });

  React.useEffect(() => {
    if (props.selectProps.value === undefined) return;
    setIsFilled(String(props.selectProps.value ?? "").length > 0);
  }, [props.selectProps.value]);

  const setRefs = React.useCallback(
    (node: HTMLSelectElement | null) => {
      selectRef.current = node;
      const ref = (props.selectProps as { ref?: React.Ref<HTMLSelectElement> }).ref;
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object") {
        (ref as { current: HTMLSelectElement | null }).current = node;
      }
    },
    [props.selectProps]
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    props.selectProps.onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
    setIsFilled(event.currentTarget.value.length > 0);
    props.selectProps.onBlur?.(event);
  };

  const alwaysFloat = props.alwaysFloat ?? ((props.selectProps as { [key: string]: unknown })?.["data-floating"] === "always");

  return (
    <div>
      <div className="relative">
        {alwaysFloat ? (
          <label
            htmlFor={props.id}
            className={[
              "pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-1 text-[11px] font-medium leading-none",
              props.error ? "text-[hsl(var(--destructive))]" : "text-foreground/70"
            ].join(" ")}
          >
            {props.label}
          </label>
        ) : null}
        {(() => {
          const hasError = Boolean(props.error);
          const baseClass =
            "peer h-11 w-full rounded-md bg-white px-3 pt-4 text-sm shadow-sm focus:outline-none";
          const borderClass = hasError
            ? "border border-[hsl(var(--destructive))] focus:border-[hsl(var(--destructive))] focus:ring-2 focus:ring-[hsl(var(--destructive)/0.25)]"
            : "border border-border focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]";
          const resolvedClassName = props.className ?? [baseClass, borderClass].join(" ");
          return (
            <select
          id={props.id}
          className={resolvedClassName}
          {...props.selectProps}
          ref={setRefs}
          onChange={handleChange}
          onBlur={handleBlur}
            >
              <option value="">Selecione</option>
              {props.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })()}
        {alwaysFloat ? (
          <label htmlFor={props.id} className="sr-only">
            {props.label}
          </label>
        ) : (
          <label
            htmlFor={props.id}
            className={[
              "absolute left-3 bg-white px-1 transition-all",
              isFilled ? "-top-2 text-xs" : "top-3 text-sm",
              props.error ? "text-[hsl(var(--destructive))]" : isFilled ? "text-[hsl(var(--primary))]" : "text-foreground/60",
              props.error
                ? "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[hsl(var(--destructive))]"
                : "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]"
            ].join(" ")}
          >
            {props.label}
          </label>
        )}
      </div>
      <ErrorText message={props.error} />
    </div>
  );
}

export function SgInputSelect(props: SgInputSelectProps) {
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
          <SgInputSelectBase
            {...rest}
            error={rest.error ?? fieldState.error?.message}
            selectProps={mergeSelectPropsWithField(rest.selectProps, field)}
          />
        )}
      />
    );
  }
  return <SgInputSelectBase {...rest} />;
}
