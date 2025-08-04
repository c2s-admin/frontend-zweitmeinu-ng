import type { RegisterOptions } from "react-hook-form";
import type { FormFieldConfig } from "@/types/contact";

/**
 * Generates react-hook-form validation rules based on field configuration.
 */
export function getValidationRules(field: FormFieldConfig): RegisterOptions {
  const rules: RegisterOptions = {};

  if (field.required) {
    rules.required = "Dieses Feld ist erforderlich.";
  }

  if (field.validation?.minLength) {
    rules.minLength = {
      value: field.validation.minLength,
      message: `Mindestens ${field.validation.minLength} Zeichen.`,
    };
  }

  if (field.validation?.maxLength) {
    rules.maxLength = {
      value: field.validation.maxLength,
      message: `Maximal ${field.validation.maxLength} Zeichen.`,
    };
  }

  if (field.validation?.pattern) {
    rules.pattern = {
      value: field.validation.pattern,
      message: "Ungültiges Format.",
    };
  }

  return rules;
}

export default getValidationRules;
