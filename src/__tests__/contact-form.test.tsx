import { describe, expect, test } from "bun:test";
import { getValidationRules } from "@/lib/contact/validation";
import type { FormFieldConfig } from "@/types/contact";

describe("getValidationRules", () => {
  test("generates required rule when field is required", () => {
    const field: FormFieldConfig = {
      name: "firstName",
      label: "Vorname",
      type: "text",
      required: true,
    };
    const rules = getValidationRules(field);
    expect(rules.required).toBe("Dieses Feld ist erforderlich.");
  });

  test("includes minLength, maxLength and pattern rules", () => {
    const field: FormFieldConfig = {
      name: "email",
      label: "Email",
      type: "email",
      required: false,
      validation: {
        minLength: 5,
        maxLength: 10,
        pattern: /^[a-z]+$/,
      },
    };
    const rules = getValidationRules(field);
    expect(rules.minLength).toEqual({
      value: 5,
      message: "Mindestens 5 Zeichen.",
    });
    expect(rules.maxLength).toEqual({
      value: 10,
      message: "Maximal 10 Zeichen.",
    });
    expect(rules.pattern).toEqual({
      value: /^[a-z]+$/,
      message: "Ungültiges Format.",
    });
  });
});
