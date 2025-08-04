"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";
import type { ContactForm as ContactFormType } from "@/types/strapi";
import type { ContactFormData, FormFieldConfig } from "@/types/contact";
import getValidationRules from "@/lib/contact/validation";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function ContactForm({
  title,
  subtitle,
  fields = [],
  submitButtonText = "Nachricht senden",
  successMessage = "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
}: ContactFormType) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = useRef<HCaptcha>(null);
  const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  const onSubmit = async (data: ContactFormData) => {
    if (hcaptchaSiteKey && !captchaToken) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const payload = { ...data, captchaToken };
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact message");
      }

      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setCaptchaToken(null);
      hcaptchaRef.current?.resetCaptcha();
    }
  };

  return (
    <section className="section-padding bg-healthcare-background">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {(title || subtitle) && (
            <div className="text-center mb-16">
              {title && (
                <h2 className="text-healthcare-primary mb-6">{title}</h2>
              )}
              {subtitle && (
                <p className="text-xl text-healthcare-text-muted max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {submitStatus === "success" ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold text-healthcare-primary mb-4">
                  Erfolgreich gesendet!
                </h3>
                <p className="text-healthcare-text-muted mb-8">
                  {successMessage}
                </p>
                <button type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="btn-primary"
                >
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field) => {
                  const fieldConfig = {
                    ...field,
                    name: field.name as keyof ContactFormData,
                    required: field.required ?? false,
                  } as FormFieldConfig;
                  const rules = getValidationRules(
                    fieldConfig,
                  ) as RegisterOptions<ContactFormData, keyof ContactFormData>;
                  const error = errors[fieldConfig.name];
                  const baseClasses =
                    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent";
                  const className = `${baseClasses} ${error ? "border-red-500 focus:ring-red-500" : "border-healthcare-border focus:ring-healthcare-primary-light"}`;
                  return (
                    <div key={field.id}>
                      <label
                        htmlFor={fieldConfig.name}
                        className="block text-sm font-medium text-healthcare-primary mb-2"
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          id={fieldConfig.name}
                          placeholder={field.placeholder}
                          rows={4}
                          className={className}
                          {...register(fieldConfig.name, rules)}
                        />
                      ) : field.type === "select" ? (
                        <Controller
                          name={fieldConfig.name}
                          control={control}
                          defaultValue=""
                          rules={rules}
                          render={({ field: ctrl }) => (
                            <select
                              {...ctrl}
                              id={fieldConfig.name}
                              className={className}
                              value={ctrl.value as string}
                            >
                              <option value="">Bitte wählen...</option>
                              {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      ) : (
                        <input
                          type={field.type}
                          id={fieldConfig.name}
                          placeholder={field.placeholder}
                          className={className}
                          {...register(fieldConfig.name, rules)}
                        />
                      )}
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message as string}
                        </p>
                      )}
                    </div>
                  );
                })}

                {hcaptchaSiteKey && (
                  <HCaptcha
                    sitekey={hcaptchaSiteKey}
                    onVerify={setCaptchaToken}
                    onExpire={() => setCaptchaToken(null)}
                    ref={hcaptchaRef}
                  />
                )}
                <button
                  type="submit"
                  disabled={
                    isSubmitting || (hcaptchaSiteKey ? !captchaToken : false)
                  }
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {submitButtonText}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
