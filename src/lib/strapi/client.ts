export class StrapiClient {
  private baseUrl: string;
  private siteId = "zweitmeinu-ng"; // Updated with real site identifier

  constructor() {
    this.baseUrl =
      process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
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
      console.error("Strapi API Error:", error);
      throw error;
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Strapi API Error:", error);
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
    additionalFilters?: Record<string, any>,
  ): Record<string, any> {
    const filters: Record<string, any> = {
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
