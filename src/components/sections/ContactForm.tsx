"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";
import type { ContactForm as ContactFormType } from "@/types/strapi";
import type { ContactFormData, FormFieldConfig } from "@/types/contact";
import getValidationRules from "@/lib/contact/validation";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const onSubmit = async (data: ContactFormData) => {
    if (recaptchaSiteKey && !captchaToken) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage(null);
    try {
      const payload = { ...data, captchaToken };
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.";
        if (response.status === 429) {
          message = "Zu viele Anfragen. Bitte versuchen Sie es später erneut.";
        } else {
          try {
            const errorData = await response.json();
            if (
              response.status === 400 &&
              typeof errorData.error === "string" &&
              errorData.error.toLowerCase().includes("captcha")
            ) {
              message = "Captcha-Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.";
            }
          } catch {}
        }
        throw new Error(message);
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : null);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
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

                {errorMessage && (
                  <div className="text-red-600 text-center">{errorMessage}</div>
                )}

                {recaptchaSiteKey && (
                  <ReCAPTCHA
                    sitekey={recaptchaSiteKey}
                    onChange={setCaptchaToken}
                    onExpired={() => setCaptchaToken(null)}
                    ref={recaptchaRef}
                  />
                )}
                <button
                  type="submit"
                  disabled={
                    isSubmitting || (recaptchaSiteKey ? !captchaToken : false)
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
