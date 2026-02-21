"use client";

import React from "react";
import { UseFormRegister, FieldValues, Controller } from "react-hook-form";
import { SgGroupBox, type SgGroupBoxProps } from "../layout/SgGroupBox";
import { t, useComponentsI18n } from "../i18n";

export type SgRadioGroupOrientation = "horizontal" | "vertical";

export interface SgRadioGroupOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SgRadioGroupProps {
  id?: string;
  title?: string;
  source: SgRadioGroupOption[];
  value?: string | number;
  orientation?: SgRadioGroupOrientation;
  iconOnly?: boolean;
  showCancel?: boolean;
  cancelLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string | number | null) => void;

  // React Hook Form props
  name?: string;
  control?: any;
  register?: UseFormRegister<FieldValues>;
  error?: string;

  // Styling
  className?: string;
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
    iconOnly = false,
    showCancel = false,
    cancelLabel,
    disabled = false,
    readOnly = false,
    required = false,
    onChange,
    name,
    control,
    register,
    error,
    className = "",
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

  const handleChange = (newValue: string | number | null) => {
    if (disabled || readOnly) return;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const renderRadioOption = (option: SgRadioGroupOption, index: number) => {
    const isSelected = currentValue === option.value;
    const isDisabled = disabled || option.disabled;

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
          name={name || id}
          value={option.value}
          checked={isSelected}
          disabled={isDisabled || readOnly}
          onChange={() => handleChange(option.value)}
          className="w-4 h-4 text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
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

  const renderCancelOption = () => {
    if (!showCancel) return null;

    const isSelected = currentValue === null;

    return (
      <label
        className={`
          inline-flex items-center gap-2 cursor-pointer select-none
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${readOnly ? "cursor-default" : ""}
          ${optionClassName}
        `}
      >
        <input
          type="radio"
          name={name || id}
          checked={isSelected}
          disabled={disabled || readOnly}
          onChange={() => handleChange(null)}
          className="w-4 h-4 text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
        />
        {!iconOnly && (
          <span className="text-sm text-[rgb(var(--sg-text))]">
            {cancelLabel || t(i18n, "components.radiogroup.cancel")}
          </span>
        )}
      </label>
    );
  };

  const content = (
    <div className={className}>
      <SgGroupBox
        {...groupBoxProps}
        title={resolvedGroupBoxTitle || " "}
        className={groupBoxProps.className || ""}
      >
        <div
          className={`
            flex gap-4
            ${orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"}
          `}
        >
          {source.map((option, index) => renderRadioOption(option, index))}
          {renderCancelOption()}
        </div>
      </SgGroupBox>

      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );

  // React Hook Form integration
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? t(i18n, "components.inputs.required") : false }}
        render={({ field, fieldState }) => (
          <SgRadioGroup
            {...props}
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              onChange?.(val);
            }}
            error={fieldState.error?.message}
            control={undefined}
          />
        )}
      />
    );
  }

  if (register && name) {
    const registration = register(name, {
      required: required ? t(i18n, "components.inputs.required") : false
    });

    return (
      <div className={className}>
        <SgGroupBox {...groupBoxProps} title={resolvedGroupBoxTitle || " "}>
          <div
            className={`
              flex gap-4
              ${orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"}
            `}
          >
            {source.map((option, index) => {
              const isSelected = currentValue === option.value;
              const isDisabled = disabled || option.disabled;

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
                    {...registration}
                    value={option.value}
                    checked={isSelected}
                    disabled={isDisabled || readOnly}
                    onChange={(e) => {
                      registration.onChange(e);
                      handleChange(option.value);
                    }}
                    className="w-4 h-4 text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
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
            })}
            {renderCancelOption()}
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
