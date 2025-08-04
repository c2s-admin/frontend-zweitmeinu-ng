import { describe, test, expect } from "bun:test";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const runApiTests = process.env.RUN_API_TESTS === "true";

interface TestCase {
  query: string;
  expectedTerms?: string[];
  fuzzyTest?: boolean;
}

const testCases: TestCase[] = [
  { query: "herz", expectedTerms: ["herz", "herzinfarkt", "bypass", "stent"] },
  { query: "kardio", expectedTerms: ["kardio", "kardiologie"] },
  { query: "bypass", expectedTerms: ["bypass", "herzbypass"] },
  { query: "stent", expectedTerms: ["stent", "koronarstent"] },
  { query: "krebs", expectedTerms: ["krebs", "karzinom", "tumor"] },
  { query: "chemo", expectedTerms: ["chemo", "chemotherapie"] },
  { query: "gallen", expectedTerms: ["gallenblase", "gallenstein"] },
  { query: "niere", expectedTerms: ["niere", "nieren", "dialyse"] },
  { query: "intensiv", expectedTerms: ["intensiv", "intensivstation"] },
  { query: "zweitmeinung", expectedTerms: ["zweitmeinung", "gutachten"] },
  { query: "herzi", fuzzyTest: true },
  { query: "kreb", fuzzyTest: true },
  { query: "gall", fuzzyTest: true },
];

(runApiTests ? describe : describe.skip)("FAQ Auto-Complete API", () => {
  test.each<TestCase>(testCases)(
    "returns expected suggestions for %s",
    async ({ query, expectedTerms, fuzzyTest }: TestCase) => {
      const response = await fetch(
        `${BASE_URL}/api/faq/autocomplete?q=${encodeURIComponent(query)}&limit=10`,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      expect(response.ok).toBe(true);
      const data: any = await response.json();

      if (fuzzyTest) {
        expect(data.totalSuggestions).toBeGreaterThan(0);
        return;
      }

      const suggestions = (data.suggestions as { text: string }[]).map((s) =>
        s.text.toLowerCase(),
      );
      expectedTerms?.forEach((term) => {
        expect(suggestions.some((s) => s.includes(term.toLowerCase()))).toBe(
          true,
        );
      });
    },
  );
});
