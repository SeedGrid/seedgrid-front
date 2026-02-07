"use client";

import React from "react";

export type SgInputSelectProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  options: Array<{ value: string; label: string }>;
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement>;
  alwaysFloat?: boolean;
};

function ErrorText(props: { message?: string }) {
  if (!props.message) return null;
  return <p data-sg-error className="text-xs text-red-600">{props.message}</p>;
}

export function SgInputSelect(props: SgInputSelectProps) {
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
        (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
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
            className="pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-white px-1 text-[11px] font-medium leading-none text-foreground/70"
          >
            {props.label}
          </label>
        ) : null}
        <select
          id={props.id}
          className={
            props.className ??
            "peer h-11 w-full rounded-md border border-border bg-white px-3 pt-4 text-sm shadow-sm focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]"
          }
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
        {alwaysFloat ? (
          <label htmlFor={props.id} className="sr-only">
            {props.label}
          </label>
        ) : (
          <label
            htmlFor={props.id}
            className={[
              "absolute left-3 bg-white px-1 transition-all",
              isFilled ? "-top-2 text-xs text-[hsl(var(--primary))]" : "top-3 text-sm text-foreground/60",
              "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[hsl(var(--primary))]"
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




