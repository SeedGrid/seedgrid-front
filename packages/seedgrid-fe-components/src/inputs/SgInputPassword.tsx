"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { buildCommonPasswordSet } from "../commons/common-passwords";
import { t, useComponentsI18n } from "../i18n";

export type SgInputPasswordProps = Omit<
  SgInputTextProps,
  "type" | "error" | "validation" | "required" | "requiredMessage" | "validateOnBlur"
> & {
  error?: string;
  onValidation?: (message: string | null) => void;
  required?: boolean;
  requiredMessage?: string;
  validateOnBlur?: boolean;
  hidePassword?: boolean;
  maxLength?: number;
  validation?: (value: string) => string | null;
  createNewPasswordButton?: boolean;
  showStrengthBar?: boolean;
  commonPasswordCheck?: boolean;
  commonPasswordMessage?: string;
  commonPasswordList?: string[];
  upperRequired?: boolean;
  lowerRequired?: boolean;
  numberRequired?: boolean;
  specialCharacterRequired?: boolean;
  prohibitsRepeatedCharactersInSequence?: boolean;
  prohibitsSequentialAscCharacters?: boolean;
  prohibitsSequentialDescCharacters?: boolean;
  minSize?: number;
};

export function SgInputPassword(props: Readonly<SgInputPasswordProps>) {
  const i18n = useComponentsI18n();
  const {
    inputProps,
    onValidation,
    required,
    requiredMessage,
    validateOnBlur,
    error,
    onClear,
    hidePassword,
    maxLength,
    validation,
    createNewPasswordButton = false,
    showStrengthBar = true,
    commonPasswordCheck = true,
    commonPasswordMessage,
    commonPasswordList,
    onChange,
    upperRequired = true,
    lowerRequired = true,
    numberRequired = true,
    specialCharacterRequired = true,
    prohibitsRepeatedCharactersInSequence = true,
    prohibitsSequentialAscCharacters = true,
    prohibitsSequentialDescCharacters = true,
    minSize = 8,
    ...rest
  } = props;
  const resolvedCommonPasswordMessage =
    commonPasswordMessage ?? t(i18n, "components.password.common");
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [isHidden, setIsHidden] = React.useState(hidePassword ?? true);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const [unmetRequirements, setUnmetRequirements] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const commonPasswordSet = React.useMemo(() => {
    if (!commonPasswordCheck) return null;
    return buildCommonPasswordSet(commonPasswordList);
  }, [commonPasswordCheck, commonPasswordList]);

  const isCommonPassword = React.useCallback(
    (value: string) => {
      if (!commonPasswordSet) return false;
      const normalized = value.trim().toLowerCase();
      if (!normalized) return false;
      if (commonPasswordSet.has(normalized)) return true;
      const simplified = normalized.replace(/[^a-z0-9]/g, "");
      if (!simplified) return false;
      return commonPasswordSet.has(simplified);
    },
    [commonPasswordSet]
  );

  const getUnmetRequirements = React.useCallback(
    (value: string) => {
      const unmet: string[] = [];
      if (value.length < minSize) {
        unmet.push(t(i18n, "components.password.minSize", { min: minSize }));
      }
      if (upperRequired && !/[A-Z]/.test(value)) {
        unmet.push(t(i18n, "components.password.upper"));
      }
      if (lowerRequired && !/[a-z]/.test(value)) {
        unmet.push(t(i18n, "components.password.lower"));
      }
      if (numberRequired && !/[0-9]/.test(value)) {
        unmet.push(t(i18n, "components.password.number"));
      }
      if (specialCharacterRequired && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
        unmet.push(t(i18n, "components.password.special"));
      }
      if (prohibitsRepeatedCharactersInSequence && /(.)\1/.test(value)) {
        unmet.push(t(i18n, "components.password.noRepeat"));
      }
      if (prohibitsSequentialAscCharacters && hasSequentialCharacters(value, 3, "asc")) {
        unmet.push(t(i18n, "components.password.noSeqAsc"));
      }
      if (prohibitsSequentialDescCharacters && hasSequentialCharacters(value, 3, "desc")) {
        unmet.push(t(i18n, "components.password.noSeqDesc"));
      }
      return unmet;
    },
    [
      i18n,
      lowerRequired,
      minSize,
      numberRequired,
      prohibitsRepeatedCharactersInSequence,
      prohibitsSequentialAscCharacters,
      prohibitsSequentialDescCharacters,
      specialCharacterRequired,
      upperRequired
    ]
  );

  const strengthScore = React.useMemo(() => {
    const totalChecks = [
      minSize,
      upperRequired,
      lowerRequired,
      numberRequired,
      specialCharacterRequired,
      prohibitsRepeatedCharactersInSequence,
      prohibitsSequentialAscCharacters,
      prohibitsSequentialDescCharacters
    ];
    const activeChecks = totalChecks.filter((v) => v !== false).length;
    if (activeChecks === 0) return 0;
    return activeChecks - unmetRequirements.length;
  }, [
    lowerRequired,
    minSize,
    numberRequired,
    prohibitsRepeatedCharactersInSequence,
    specialCharacterRequired,
    upperRequired,
    unmetRequirements.length
  ]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-destructive";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-amber-500";
    if (score === 4) return "bg-yellow-400";
    return "bg-green-500";
  };

  const generatePassword = React.useCallback(() => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
    const requiredGroups: string[] = [];
    if (upperRequired) requiredGroups.push(upper);
    if (lowerRequired) requiredGroups.push(lower);
    if (numberRequired) requiredGroups.push(numbers);
    if (specialCharacterRequired) requiredGroups.push(specials);

    const pool =
      (upperRequired ? upper : "") +
      (lowerRequired ? lower : "") +
      (numberRequired ? numbers : "") +
      (specialCharacterRequired ? specials : "") ||
      upper + lower + numbers;

    const targetLength = Math.max(minSize, maxLength ?? minSize);
    const randomInt = (max: number) => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return (array[0] ?? 0) % max;
    };
    const pick = (set: string) => set[randomInt(set.length)] ?? "";
    const shuffle = (arr: string[]) => {
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = randomInt(i + 1);
        const left = arr[i] ?? "";
        const right = arr[j] ?? "";
        arr[i] = right;
        arr[j] = left;
      }
      return arr;
    };

    let candidate = "";
    let attempts = 0;
    while (attempts < 50) {
      attempts += 1;
      const chars: string[] = [];
      requiredGroups.forEach((group) => {
        chars.push(pick(group));
      });
      while (chars.length < targetLength) {
        chars.push(pick(pool));
      }
      candidate = shuffle(chars).join("");
      const unmet = getUnmetRequirements(candidate);
      if (unmet.length === 0) break;
    }
    return candidate;
  }, [
    getUnmetRequirements,
    lowerRequired,
    maxLength,
    minSize,
    numberRequired,
    specialCharacterRequired,
    upperRequired
  ]);

  const runValidation = React.useCallback(
    (value: string) => {
      if (!value && !required) {
        setInternalError(null);
        onValidation?.(null);
        setUnmetRequirements([]);
        return;
      }
      if (!value && required) {
        const message = requiredMessage ?? t(i18n, "components.inputs.required");
        setInternalError(message);
        onValidation?.(message);
        setUnmetRequirements([]);
        return;
      }
      const unmet = getUnmetRequirements(value);
      const isCommon = commonPasswordCheck ? isCommonPassword(value) : false;
      if (isCommon) {
        unmet.push(resolvedCommonPasswordMessage);
      }
      const customMessage = validation?.(value) ?? null;
      const combined = customMessage ? [...unmet, customMessage] : unmet;
      setUnmetRequirements(combined);
      const message: string | null = combined.length > 0 ? (combined[0] ?? null) : null;
      setInternalError(message);
      onValidation?.(message);
    },
    [
      commonPasswordCheck,
      getUnmetRequirements,
      i18n,
      isCommonPassword,
      onValidation,
      required,
      requiredMessage,
      resolvedCommonPasswordMessage,
      validation
    ]
  );

  const mergedInputProps: (React.InputHTMLAttributes<HTMLInputElement> & {
    "data-sg-password"?: string;
    ref?: React.Ref<HTMLInputElement>;
  }) = {
    ...inputProps,
    "data-sg-password": "true",
    onChange: (event) => {
      setHasInteracted(true);
      runValidation(event.currentTarget.value);
      inputProps?.onChange?.(event);
    },
    onBlur: (event) => {
      if ((validateOnBlur ?? true) || hasInteracted) {
        runValidation(event.currentTarget.value);
      }
      inputProps?.onBlur?.(event);
    },
    ref: undefined
  };

  const setRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    const ref = (inputProps as { ref?: React.Ref<HTMLInputElement> })?.ref;
    if (!ref) return;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref && typeof ref === "object" && "current" in ref) {
      (ref as { current: HTMLInputElement | null }).current = node;
    }
  };

  const applyValue = (value: string) => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
    const event = {
      target: inputRef.current ?? { value },
      currentTarget: inputRef.current ?? { value }
    } as React.ChangeEvent<HTMLInputElement>;
    mergedInputProps.onChange?.(event);
    onChange?.(value);
  };

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setIsHidden((prev) => !prev)}
      className="rounded p-1 text-foreground/60 hover:text-foreground"
      aria-label={isHidden ? t(i18n, "components.password.show") : t(i18n, "components.password.hide")}
    >
      {isHidden ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a20.4 20.4 0 0 1 5.06-6.88" />
          <path d="M1 1l22 22" />
          <path d="M9.9 4.24A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a20.3 20.3 0 0 1-3.44 4.65" />
          <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
        </svg>
      )}
    </button>
  );

  const generateIcon = createNewPasswordButton ? (
    <button
      type="button"
      onClick={() => {
        const next = generatePassword();
        applyValue(next);
      }}
      className="rounded p-1 text-foreground/60 hover:text-foreground"
      aria-label={t(i18n, "components.password.generate")}
      title={t(i18n, "components.password.generate")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 3v6h6" />
      </svg>
    </button>
  ) : null;

  return (
    <>
      <style>{`
        [data-sg-password]::-ms-reveal,
        [data-sg-password]::-ms-clear {
          display: none;
        }
      `}</style>
      <SgInputText
        {...rest}
        type={isHidden ? "password" : "text"}
        maxLength={maxLength ?? 15}
        error={error ?? internalError ?? undefined}
        onClear={() => {
          setInternalError(null);
          onValidation?.(null);
          onClear?.();
        }}
        inputProps={{ ...mergedInputProps, ref: setRef }}
        iconButtons={[toggleIcon, ...(generateIcon ? [generateIcon] : []), ...(props.iconButtons ?? [])]}
      />
      <div className="mt-2">
        {showStrengthBar ? (
          <div className="mb-2 flex h-1 w-full gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`h-full flex-1 rounded-full transition-all duration-300 ease-out ${
                  index < Math.min(5, strengthScore) ? getStrengthColor(strengthScore) : "bg-border"
                }`}
              />
            ))}
          </div>
        ) : null}
        {(() => {
          const unique = Array.from(
            new Set(
              unmetRequirements.filter((req) => req !== resolvedCommonPasswordMessage && req !== internalError)
            )
          );
          return unique.length > 0 ? (
            <ul className="space-y-1 text-xs text-destructive">
              {unique.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          ) : null;
        })()}
      </div>
    </>
  );
}

function hasSequentialCharacters(value: string, minLength: number, direction: "asc" | "desc") {
  const normalized = value.toLowerCase();
  const sequences = ["abcdefghijklmnopqrstuvwxyz", "0123456789"];
  for (const seq of sequences) {
    for (let i = 0; i <= seq.length - minLength; i += 1) {
      const part = seq.slice(i, i + minLength);
      const pattern = direction === "asc" ? part : part.split("").reverse().join("");
      if (normalized.includes(pattern)) {
        return true;
      }
    }
  }
  return false;
}
