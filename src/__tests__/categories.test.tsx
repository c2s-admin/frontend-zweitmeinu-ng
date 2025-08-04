import { describe, test, expect } from "bun:test";

const BASE_URL =
  process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "";
const runApiTests = process.env.RUN_API_TESTS === "true";

const categorySlugs: string[] = [
  "zweitmeinung-kardiologie",
  "zweitmeinung-onkologie",
  "allgemeine-fragen-zur-zweitmeinung",
];

(runApiTests ? describe : describe.skip)("FAQ Category Relations", () => {
  test("FAQs include populated categories", async () => {
    const response = await fetch(
      `${BASE_URL}/faqs?populate=category&pagination[limit]=10`,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    expect(response.ok).toBe(true);
    const data: any = await response.json();
    (data.data as { category?: { slug?: string } }[] | undefined)?.forEach(
      (faq) => {
        expect(faq.category && faq.category.slug).toBeTruthy();
      },
    );
  });

  test("FAQ categories endpoint returns data", async () => {
    const response = await fetch(`${BASE_URL}/faq-categories?sort=order:asc`, {
      headers: { "Content-Type": "application/json" },
    });

    expect(response.ok).toBe(true);
    const data: any = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
  });

  test.each<string>(categorySlugs)(
    "filtering by category %s",
    async (slug: string) => {
      const response = await fetch(
        `${BASE_URL}/faqs?filters[category][slug][$eq]=${slug}&populate=category&pagination[limit]=5`,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      expect(response.ok).toBe(true);
    },
  );
});
