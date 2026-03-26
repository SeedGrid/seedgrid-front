import type {
  Control,
  FieldValues,
  RegisterOptions,
  UseFormRegister
} from "react-hook-form";

export type RhfFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name?: string;
  control?: Control<TFieldValues>;
  register?: UseFormRegister<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  error?: string;
};

export function resolveFieldError(...errors: Array<string | null | undefined>): string | undefined {
  for (const error of errors) {
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }
  return undefined;
}

export function mergeRequiredRule<TFieldValues extends FieldValues = FieldValues>(
  rules: RegisterOptions<TFieldValues> | undefined,
  required: boolean | undefined,
  message: string
): RegisterOptions<TFieldValues> | undefined {
  if (!required) return rules;
  if (!rules) return { required: message };
  if (rules.required === undefined || rules.required === false) {
    return { ...rules, required: message };
  }
  return rules;
}
