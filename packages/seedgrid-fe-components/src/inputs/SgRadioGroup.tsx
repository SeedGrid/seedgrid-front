"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { SgGroupBox, type SgGroupBoxProps } from "../layout/SgGroupBox";
import { t, useComponentsI18n } from "../i18n";
import { mergeRequiredRule, resolveFieldError, type RhfFieldProps } from "../rhf";

export type SgRadioGroupOrientation = "horizontal" | "vertical";
export type SgRadioGroupSelectionStyle = "radio" | "highlight";

export interface SgRadioGroupOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SgRadioGroupProps extends RhfFieldProps {
  id?: string;
  title?: string;
  source: SgRadioGroupOption[];
  value?: string | number;
  orientation?: SgRadioGroupOrientation;
  selectionStyle?: SgRadioGroupSelectionStyle;
  iconOnly?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string | number | null) => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  optionClassName?: string;
  groupBoxProps?: Omit<Partial<SgGroupBoxProps>, "children" | "title"> & { title?: string };
}

export function SgRadioGroup(props: SgRadioGroupProps) {
  const i18n = useComponentsI18n();

  const {
    id,
    title,
    source,
    value: controlledValue,
    orientation = "vertical",
    selectionStyle = "radio",
    iconOnly = false,
    disabled = false,
    readOnly = false,
    required = false,
    onChange,
    name,
    control,
    register,
    rules,
    error,
    className = "",
    style,
    optionClassName = "",
    groupBoxProps = {}
  } = props;

  const resolvedGroupBoxTitle = (() => {
    const baseTitle = groupBoxProps.title ?? title ?? "";
    if (!required || !baseTitle.trim()) return baseTitle;
    return baseTitle.includes("*") ? baseTitle : `${baseTitle} *`;
  })();

  const [internalValue, setInternalValue] = React.useState<string | number | null>(
    controlledValue ?? null
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const isHighlightSelection = selectionStyle === "highlight";

  const handleChange = (newValue: string | number | null) => {
    if (disabled || readOnly) return;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const renderRadioOption = (
    option: SgRadioGroupOption,
    index: number,
    registration?: { name?: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }
  ) => {
    const isSelected = currentValue === option.value;
    const isDisabled = disabled || option.disabled;
    const inputClassName = isHighlightSelection
      ? "sr-only"
      : "w-4 h-4 text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed";

    if (isHighlightSelection) {
      return (
        <label
          key={`${option.value}-${index}`}
          className={`
            flex items-center gap-2 border px-3 py-2 transition-all duration-150 select-none
            ${orientation === "vertical" ? "w-full -mt-px rounded-none first:mt-0 first:rounded-t-md last:rounded-b-md" : "inline-flex rounded-md"}
            ${iconOnly ? "justify-center" : ""}
            ${isSelected
              ? "relative z-10 translate-y-px rounded-md border-[rgb(var(--sg-primary-300))] bg-[rgb(var(--sg-primary-100))] ring-1 ring-[rgb(var(--sg-primary-200))] shadow-[inset_0_2px_4px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(15,23,42,0.08)]"
              : "border-[rgb(var(--sg-primary-200))] bg-[rgb(var(--sg-primary-50))] shadow-[0_2px_0_rgba(148,163,184,0.32),0_6px_10px_rgba(15,23,42,0.07)]"}
            ${isDisabled
              ? "cursor-not-allowed opacity-50"
              : readOnly
              ? "cursor-default"
              : `cursor-pointer ${isSelected ? "hover:bg-[rgb(var(--sg-primary-200))]" : "hover:-translate-y-px hover:bg-[rgb(var(--sg-primary-100))] hover:shadow-[0_3px_0_rgba(148,163,184,0.32),0_10px_14px_rgba(15,23,42,0.1)]"}`}
            focus-within:outline-none
            focus-within:ring-2
            focus-within:ring-[rgb(var(--sg-ring))]
            ${optionClassName}
          `}
        >
          <input
            type="radio"
            {...(registration ? registration : { name: name || id })}
            value={option.value}
            checked={isSelected}
            disabled={isDisabled || readOnly}
            onChange={(event) => {
              if (registration) registration.onChange(event);
              handleChange(option.value);
            }}
            className={inputClassName}
          />
          {option.icon ? (
            <span
              className={`
                flex items-center justify-center transition-transform duration-150
                ${isSelected ? "scale-110" : "scale-100"}
              `}
            >
              {option.icon}
            </span>
          ) : null}
          {!iconOnly ? (
            <span
              className={`
                text-[rgb(var(--sg-text))] transition-[font-size] duration-150
                ${isSelected ? "text-[15px] font-medium" : "text-sm"}
              `}
            >
              {option.label}
            </span>
          ) : null}
        </label>
      );
    }

    return (
      <label
        key={`${option.value}-${index}`}
        className={`
          inline-flex items-center gap-2 cursor-pointer select-none
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${readOnly ? "cursor-default" : ""}
          ${optionClassName}
        `}
      >
        <input
          type="radio"
          {...(registration ? registration : { name: name || id })}
          value={option.value}
          checked={isSelected}
          disabled={isDisabled || readOnly}
          onChange={(event) => {
            if (registration) registration.onChange(event);
            handleChange(option.value);
          }}
          className={inputClassName}
        />
        {option.icon && (
          <span className="flex items-center justify-center">
            {option.icon}
          </span>
        )}
        {!iconOnly && (
          <span className="text-sm text-[rgb(var(--sg-text))]">
            {option.label}
          </span>
        )}
      </label>
    );
  };

  const content = (
    <div className={className} style={style}>
      <SgGroupBox
        {...groupBoxProps}
        title={resolvedGroupBoxTitle || " "}
        className={groupBoxProps.className || ""}
      >
        <div
          className={`
            flex ${isHighlightSelection ? "gap-0" : "gap-4"}
            ${orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"}
          `}
          role="radiogroup"
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          aria-required={required || undefined}
        >
          {source.map((option, index) => renderRadioOption(option, index))}
        </div>
      </SgGroupBox>

      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );

  const resolvedRules = mergeRequiredRule(
    rules,
    required,
    t(i18n, "components.inputs.required")
  );

  // React Hook Form integration
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={resolvedRules}
        render={({ field, fieldState }) => (
          <SgRadioGroup
            {...props}
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              onChange?.(val);
            }}
            error={resolveFieldError(error, fieldState.error?.message)}
            control={undefined}
          />
        )}
      />
    );
  }

  if (register && name) {
    const registration = register(name, resolvedRules);

    return (
      <div className={className} style={style}>
        <SgGroupBox {...groupBoxProps} title={resolvedGroupBoxTitle || " "}>
          <div
            className={`
              flex ${isHighlightSelection ? "gap-0" : "gap-4"}
              ${orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"}
            `}
            role="radiogroup"
            aria-disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            aria-required={required || undefined}
          >
            {source.map((option, index) => renderRadioOption(option, index, registration))}
          </div>
        </SgGroupBox>

        {error && (
          <div className="mt-1 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  }

  return content;
}
