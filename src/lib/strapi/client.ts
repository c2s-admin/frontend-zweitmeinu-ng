import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { Sentry } from "@/lib/sentry.server";

class StrapiAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "StrapiAPIError";
  }
}

export class StrapiClient {
  private baseUrl: string;
  private maxRetries = 3;
  private baseDelay = 200; // ms

  constructor() {
    this.baseUrl = env.STRAPI_API_URL || env.NEXT_PUBLIC_STRAPI_URL;
  }

  private async request<T>(
    url: string,
    init: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
    attempt = 0,
  ): Promise<T> {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        throw new StrapiAPIError(
          `API Error: ${response.status} - ${response.statusText}`,
          response.status,
        );
      }
      return (await response.json()) as T;
    } catch (error) {
      logger.error({ err: error }, "Strapi API Error");
      Sentry.captureException(error);
      if (attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * this.baseDelay;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(url, init, attempt + 1);
      }
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>(
            (acc, [key, value]) => {
              if (value !== undefined) acc[key] = String(value);
              return acc;
            },
            {},
          ),
        ).toString()}`
      : "";
    const url = `${this.baseUrl}${endpoint}${queryString}`;
    return this.request<T>(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // Cache für 60 Sekunden
        tags: ["strapi"], // Cache tag für revalidation
      },
    });
  }

  async post<T, B extends Record<string, unknown>>(
    endpoint: string,
    body?: B,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.request<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * Helper method to build populate parameters for nested relationships
   */
  buildPopulateParams(fields: string[]): Record<string, string> {
    const params: Record<string, string> = {};

    fields.forEach((field, index) => {
      params[`populate[${index}]`] = field;
    });

    return params;
  }

  /**
   * Helper method to build filter parameters for site-specific queries
   * NOTE: This Strapi instance uses a different data structure without 'sites' relation
   */
  buildSiteFilter(
    additionalFilters?: Record<string, unknown>,
  ): Record<string, unknown> {
    const filters: Record<string, unknown> = {
      // Note: Based on exploration, this Strapi doesn't use site filtering on pages
      // Pages are already filtered by the specific site setup
    };

    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        filters[key] = value;
      });
    }

    return filters;
  }
}

export const strapiClient = new StrapiClient();
