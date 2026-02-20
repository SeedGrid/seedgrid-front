"use client";

import React from "react";
import { Controller } from "react-hook-form";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormRegister
} from "react-hook-form";
import type { RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";

export type SgRatingSize = "sm" | "md" | "lg" | "xl";

export interface SgRatingProps {
  /** Unique identifier */
  id?: string;
  /** Label text */
  label?: string;
  /** Current rating value */
  value?: number;
  /** Number of stars */
  stars?: number;
  /** Enable half stars */
  allowHalf?: boolean;
  /** Show cancel button */
  cancel?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Read only mode */
  readOnly?: boolean;
  /** Size of the stars */
  size?: SgRatingSize;
  /** Custom class name */
  className?: string;
  /** Custom icon for filled state */
  onIcon?: React.ReactNode;
  /** Custom icon for empty state */
  offIcon?: React.ReactNode;
  /** Custom icon for cancel button */
  cancelIcon?: React.ReactNode;
  /** Color for filled stars */
  color?: string;
  /** Color for empty stars */
  emptyColor?: string;
  /** Show tooltips with value */
  showTooltip?: boolean;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Callback when hovering over stars */
  onHover?: (value: number | null) => void;
  /** React Hook Form integration */
  register?: UseFormRegister<FieldValues>;
  /** React Hook Form field name */
  name?: string;
  /** React Hook Form control */
  control?: any;
  /** Error message */
  error?: string;
  /** Required field */
  required?: boolean;
  /** Required message */
  requiredMessage?: string;
}

type SgRatingBaseProps = Omit<SgRatingProps, keyof RhfFieldProps>;

const STAR_SIZES: Record<SgRatingSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40
};

function StarIcon({ size, filled = false }: { size: number; filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CancelIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function ErrorText(props: { message?: string }) {
  if (!props.message) return null;
  return <p className="text-xs text-red-600">{props.message}</p>;
}

function SgRatingBase(props: SgRatingBaseProps) {
  const i18n = useComponentsI18n();
  const {
    id,
    label,
    value = 0,
    stars = 5,
    allowHalf = false,
    cancel = true,
    disabled = false,
    readOnly = false,
    size = "md",
    className = "",
    onIcon,
    offIcon,
    cancelIcon,
    color = "hsl(var(--primary))",
    emptyColor = "hsl(var(--muted-foreground))",
    showTooltip = false,
    onChange,
    onHover,
    error,
    required = false,
    requiredMessage
  } = props;

  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const [internalValue, setInternalValue] = React.useState<number>(value);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    if (disabled || readOnly) return;
    const newValue = allowHalf && isHalf ? starIndex + 0.5 : starIndex + 1;
    setInternalValue(newValue);
    onChange?.(newValue);

    // Validation
    if (required && newValue === 0) {
      const message = requiredMessage ?? t(i18n, "components.rating.required");
      setInternalError(message);
    } else {
      setInternalError(null);
    }
  };

  const handleStarHover = (starIndex: number, isHalf: boolean) => {
    if (disabled || readOnly) return;
    const newHoverValue = allowHalf && isHalf ? starIndex + 0.5 : starIndex + 1;
    setHoverValue(newHoverValue);
    onHover?.(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
    onHover?.(null);
  };

  const handleCancel = () => {
    if (disabled || readOnly) return;
    setInternalValue(0);
    onChange?.(0);

    if (required) {
      const message = requiredMessage ?? t(i18n, "components.rating.required");
      setInternalError(message);
    } else {
      setInternalError(null);
    }
  };

  const displayValue = hoverValue ?? internalValue;
  const starSize = STAR_SIZES[size];
  const isInteractive = !disabled && !readOnly;

  const getStarFillPercentage = (starIndex: number): number => {
    const starValue = starIndex + 1;
    if (displayValue >= starValue) return 100;
    if (displayValue > starIndex && displayValue < starValue) {
      return (displayValue - starIndex) * 100;
    }
    return 0;
  };

  return (
    <div className={`sg-rating ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <div
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: isInteractive ? "pointer" : "default"
        }}
      >
        {cancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={disabled || readOnly}
            className="mr-1 transition-opacity hover:opacity-80"
            style={{
              color: emptyColor,
              cursor: isInteractive ? "pointer" : "default"
            }}
            title={t(i18n, "components.rating.cancel")}
          >
            {cancelIcon ?? <CancelIcon size={starSize} />}
          </button>
        )}

        {Array.from({ length: stars }).map((_, index) => {
          const fillPercentage = getStarFillPercentage(index);
          const tooltipValue = showTooltip ? (hoverValue ?? internalValue) : null;

          return (
            <div
              key={index}
              className="relative inline-block"
              style={{ position: "relative" }}
            >
              {/* Tooltip */}
              {showTooltip && hoverValue !== null && Math.floor(hoverValue - 0.5) === index && (
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-xs text-white"
                  style={{ whiteSpace: "nowrap", zIndex: 10 }}
                >
                  {tooltipValue}
                </div>
              )}

              {/* Star container with two halves */}
              <div className="relative inline-flex" style={{ width: starSize, height: starSize }}>
                {/* Empty star background */}
                <div style={{ color: emptyColor, position: "absolute", top: 0, left: 0 }}>
                  {offIcon ?? <StarIcon size={starSize} filled={false} />}
                </div>

                {/* Filled star with clip-path */}
                <div
                  style={{
                    color: color,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                    transition: "clip-path 0.2s ease"
                  }}
                >
                  {onIcon ?? <StarIcon size={starSize} filled />}
                </div>

                {/* Clickable areas */}
                {allowHalf ? (
                  <>
                    {/* Left half */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "50%",
                        height: "100%",
                        cursor: isInteractive ? "pointer" : "default"
                      }}
                      onClick={() => handleStarClick(index, true)}
                      onMouseEnter={() => handleStarHover(index, true)}
                    />
                    {/* Right half */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "50%",
                        height: "100%",
                        cursor: isInteractive ? "pointer" : "default"
                      }}
                      onClick={() => handleStarClick(index, false)}
                      onMouseEnter={() => handleStarHover(index, false)}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: isInteractive ? "pointer" : "default"
                    }}
                    onClick={() => handleStarClick(index, false)}
                    onMouseEnter={() => handleStarHover(index, false)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ErrorText message={error ?? internalError ?? undefined} />
    </div>
  );
}

export function SgRating(props: SgRatingProps) {
  const { control, name, register, ...rest } = props;

  if (name && register) {
    return <SgRatingBase {...rest} />;
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
          <SgRatingBase
            {...rest}
            value={field.value ?? 0}
            onChange={(value) => {
              field.onChange(value);
              rest.onChange?.(value);
            }}
            error={rest.error ?? fieldState.error?.message}
          />
        )}
      />
    );
  }

  return <SgRatingBase {...rest} />;
}
