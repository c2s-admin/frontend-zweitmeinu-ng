import { strapiClient } from "./client";
import type { ContactAPIResponse, ContactFormData } from "@/types/contact";

export async function submitContactMessage(
  data: ContactFormData & Record<string, unknown>,
): Promise<ContactAPIResponse> {
  return strapiClient.post<ContactAPIResponse, { data: typeof data }>(
    "/contact-messages",
    { data },
  );
}
