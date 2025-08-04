import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export class StrapiClient {
  private baseUrl: string;
  private siteId = "zweitmeinu-ng"; // Updated with real site identifier

  constructor() {
    this.baseUrl = env.STRAPI_API_URL || env.NEXT_PUBLIC_STRAPI_URL;
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
          {}),
        ).toString()}`
      : "";
    const url = `${this.baseUrl}${endpoint}${queryString}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 60, // Cache für 60 Sekunden
          tags: ["strapi"], // Cache tag für revalidation
        },
      });

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error({ err: error }, "Strapi API Error");
      throw error;
    }
  }

  async post<T, B extends Record<string, unknown>>(
    endpoint: string,
    body?: B,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      logger.error({ err: error }, "Strapi API Error");
      throw error;
    }
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
