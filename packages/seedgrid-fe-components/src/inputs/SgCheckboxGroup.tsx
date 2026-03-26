"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { SgGroupBox, type SgGroupBoxProps } from "../layout/SgGroupBox";
import { t, useComponentsI18n } from "../i18n";
import { mergeRequiredRule, resolveFieldError, type RhfFieldProps } from "../rhf";

export type SgCheckboxGroupOrientation = "horizontal" | "vertical";
export type SgCheckboxGroupSelectionStyle = "checkbox" | "highlight";

export interface SgCheckboxGroupOption {
  label: string;
  value: string | number;
  checked?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type SgCheckboxGroupRef = {
  getChecked: () => (string | number)[];
  setChecked: (values: (string | number)[]) => void;
  checkAll: () => void;
  clearAll: () => void;
};

export interface SgCheckboxGroupProps extends RhfFieldProps {
  id?: string;
  title?: string;
  source: SgCheckboxGroupOption[];
  value?: (string | number)[];
  orientation?: SgCheckboxGroupOrientation;
  selectionStyle?: SgCheckboxGroupSelectionStyle;
  iconOnly?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: (string | number)[]) => void;

  // Check all
  showCheckAll?: boolean;
  checkAllLabel?: string;
  checkAllIcon?: React.ReactNode;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  optionClassName?: string;
  groupBoxProps?: Omit<Partial<SgGroupBoxProps>, "children" | "title"> & { title?: string };
}

function deriveInitialValue(source: SgCheckboxGroupOption[]): (string | number)[] {
  return source.filter((opt) => opt.checked).map((opt) => opt.value);
}

// Internal component — plain function, no forwardRef, safe for self-reference inside Controller
function SgCheckboxGroupBase(
  props: SgCheckboxGroupProps,
  imperativeRef?: React.ForwardedRef<SgCheckboxGroupRef>
) {
  const i18n = useComponentsI18n();

  const {
    id,
    title,
    source,
    value: controlledValue,
    orientation = "vertical",
    selectionStyle = "checkbox",
    iconOnly = false,
    disabled = false,
    readOnly = false,
    required = false,
    onChange,
    showCheckAll = false,
    checkAllLabel,
    checkAllIcon,
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

  const resolvedCheckAllLabel = checkAllLabel ?? t(i18n, "components.checkboxgroup.checkAll") ?? "Selecionar todos";

  const resolvedGroupBoxTitle = (() => {
    const baseTitle = groupBoxProps.title ?? title ?? "";
    if (!required || !baseTitle.trim()) return baseTitle;
    return baseTitle.includes("*") ? baseTitle : `${baseTitle} *`;
  })();

  const [internalValue, setInternalValue] = React.useState<(string | number)[]>(
    () => controlledValue ?? deriveInitialValue(source)
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const isHighlightSelection = selectionStyle === "highlight";

  const handleChange = (optionValue: string | number) => {
    if (disabled || readOnly) return;

    const next = currentValue.includes(optionValue)
      ? currentValue.filter((v) => v !== optionValue)
      : [...currentValue, optionValue];

    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleCheckAll = () => {
    if (disabled || readOnly) return;
    const enabledValues = source.filter((opt) => !opt.disabled).map((opt) => opt.value);
    const next = currentValue.length === enabledValues.length ? [] : enabledValues;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  React.useImperativeHandle(imperativeRef, () => ({
    getChecked: () => currentValue,
    setChecked: (values) => {
      if (!isControlled) setInternalValue(values);
      onChange?.(values);
    },
    checkAll: () => {
      const enabledValues = source.filter((opt) => !opt.disabled).map((opt) => opt.value);
      if (!isControlled) setInternalValue(enabledValues);
      onChange?.(enabledValues);
    },
    clearAll: () => {
      if (!isControlled) setInternalValue([]);
      onChange?.([]);
    }
  }));

  // Check all state
  const enabledValues = source.filter((opt) => !opt.disabled).map((opt) => opt.value);
  const checkedEnabledCount = enabledValues.filter((v) => currentValue.includes(v)).length;
  const allChecked = enabledValues.length > 0 && checkedEnabledCount === enabledValues.length;
  const someChecked = checkedEnabledCount > 0 && !allChecked;

  const checkAllRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (checkAllRef.current) {
      checkAllRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  const renderOption = (option: SgCheckboxGroupOption, index: number) => {
    const isSelected = currentValue.includes(option.value);
    const isDisabled = disabled || option.disabled;
    const inputClassName = isHighlightSelection
      ? "sr-only"
      : "w-4 h-4 rounded text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed";

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
            type="checkbox"
            name={name || id}
            value={option.value}
            checked={isSelected}
            disabled={isDisabled || readOnly}
            onChange={() => handleChange(option.value)}
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
          type="checkbox"
          name={name || id}
          value={option.value}
          checked={isSelected}
          disabled={isDisabled || readOnly}
          onChange={() => handleChange(option.value)}
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

  const checkAllNode = showCheckAll ? (
    <div className={`${isHighlightSelection ? "px-3 pt-1 pb-2" : "pb-2"}`}>
      <label
        className={`
          inline-flex items-center gap-2 select-none font-medium
          ${disabled ? "opacity-50 cursor-not-allowed" : readOnly ? "cursor-default" : "cursor-pointer"}
        `}
      >
        <input
          ref={checkAllRef}
          type="checkbox"
          checked={allChecked}
          disabled={disabled || readOnly}
          onChange={handleCheckAll}
          className="w-4 h-4 rounded text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
        />
        {checkAllIcon ? (
          <span className="flex items-center justify-center">{checkAllIcon}</span>
        ) : null}
        <span className="text-sm text-[rgb(var(--sg-text))]">{resolvedCheckAllLabel}</span>
      </label>
      <hr className="mt-2 border-[rgb(var(--sg-border))]" />
    </div>
  ) : null;

  const resolvedRules = mergeRequiredRule(
    rules,
    required,
    t(i18n, "components.inputs.required")
  );

  const groupContent = (
    <>
      {checkAllNode}
      <div
        className={`
          flex ${isHighlightSelection ? "gap-0" : "gap-4"}
          ${orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"}
        `}
        role="group"
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-required={required || undefined}
      >
        {source.map((option, index) => renderOption(option, index))}
      </div>
    </>
  );

  // React Hook Form — Controller
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={resolvedRules}
        render={({ field, fieldState }) =>
          SgCheckboxGroupBase(
            {
              ...props,
              value: field.value ?? [],
              onChange: (val) => {
                field.onChange(val);
                onChange?.(val);
              },
              error: resolveFieldError(error, fieldState.error?.message),
              control: undefined
            },
            undefined
          )
        }
      />
    );
  }

  // React Hook Form — register
  if (register && name) {
    const registration = register(name, resolvedRules);

    return (
      <div className={className} style={style}>
        <SgGroupBox {...groupBoxProps} title={resolvedGroupBoxTitle || " "}>
          {checkAllNode}
          <div
            className={`
              flex ${isHighlightSelection ? "gap-0" : "gap-4"}
              ${orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"}
              ${showCheckAll && !isHighlightSelection ? "mt-1" : ""}
            `}
            role="group"
            aria-disabled={disabled || undefined}
            aria-readonly={readOnly || undefined}
            aria-required={required || undefined}
          >
            {source.map((option, index) => {
              const isSelected = currentValue.includes(option.value);
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
                    type="checkbox"
                    {...registration}
                    value={option.value}
                    checked={isSelected}
                    disabled={isDisabled || readOnly}
                    onChange={(event) => {
                      registration.onChange(event);
                      handleChange(option.value);
                    }}
                    className="w-4 h-4 rounded text-[rgb(var(--sg-primary-500))] border-[rgb(var(--sg-border))] focus:ring-[rgb(var(--sg-ring))] focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {option.icon && (
                    <span className="flex items-center justify-center">{option.icon}</span>
                  )}
                  {!iconOnly && (
                    <span className="text-sm text-[rgb(var(--sg-text))]">{option.label}</span>
                  )}
                </label>
              );
            })}
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

  return (
    <div className={className} style={style}>
      <SgGroupBox
        {...groupBoxProps}
        title={resolvedGroupBoxTitle || " "}
        className={groupBoxProps.className || ""}
      >
        {groupContent}
      </SgGroupBox>

      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

export const SgCheckboxGroup = React.forwardRef<SgCheckboxGroupRef, SgCheckboxGroupProps>(
  (props, ref) => SgCheckboxGroupBase(props, ref)
);
