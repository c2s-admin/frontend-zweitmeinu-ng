import { strapiClient } from "./client";
import type {
  ContactAPIResponse,
  ContactFormData,
  CaptchaConfig,
} from "@/types/contact";

export async function submitContactMessage(
  data: ContactFormData & Record<string, unknown>,
): Promise<ContactAPIResponse> {
  return strapiClient.post<ContactAPIResponse, { data: typeof data }>(
    "/contact-messages",
    { data },
  );
}

export async function getCaptchaConfig(): Promise<{ data: CaptchaConfig }> {
  return strapiClient.get<{ data: CaptchaConfig }>(
    "/contact-messages/captcha-config",
  );
}
