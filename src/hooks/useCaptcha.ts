"use client";

import { useEffect, useState } from "react";
import type { CaptchaConfig } from "@/types/contact";

export async function fetchCaptchaConfig(): Promise<CaptchaConfig> {
  const response = await fetch("/api/contact-messages/captcha-config");
  if (!response.ok) {
    throw new Error("Failed to fetch CAPTCHA config");
  }
  const result = await response.json();
  return result.data;
}

export function useCaptcha() {
  const [config, setConfig] = useState<CaptchaConfig | null>(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCaptchaConfig()
      .then(setConfig)
      .finally(() => setIsLoading(false));
  }, []);

  const resetCaptcha = () => {
    setToken("");
    if (config?.provider === "hcaptcha" && window.hcaptcha) {
      window.hcaptcha.reset();
    } else if (config?.provider === "recaptcha" && window.grecaptcha) {
      window.grecaptcha.reset();
    }
  };

  return {
    config,
    token,
    setToken,
    isLoading,
    resetCaptcha,
    isEnabled: config?.enabled ?? false,
  };
}

declare global {
  interface Window {
    hcaptcha?: { reset: () => void };
    grecaptcha?: { reset: () => void };
  }
}

