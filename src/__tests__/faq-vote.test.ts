import { describe, test, expect } from "bun:test";
import { NextRequest } from "next/server";
import {
  validateVoteRequest,
  POST,
  GET,
} from "../app/api/faq/vote/route";

// Tests for validateVoteRequest

describe("validateVoteRequest", () => {
  test("rejects non-object body", () => {
    const result = validateVoteRequest("invalid");
    expect(result).toEqual({ valid: false, error: "Invalid request body" });
  });

  test("rejects missing faqId", () => {
    const result = validateVoteRequest({ isHelpful: true });
    expect(result).toEqual({ valid: false, error: "Invalid FAQ ID" });
  });

  test("rejects non-boolean vote", () => {
    const result = validateVoteRequest({ faqId: 1, isHelpful: "yes" });
    expect(result).toEqual({ valid: false, error: "Invalid vote value" });
  });

  test("accepts valid request", () => {
    const result = validateVoteRequest({ faqId: 1, isHelpful: true });
    expect(result).toEqual({ valid: true });
  });
});

// Tests for POST handler

describe("POST /api/faq/vote", () => {
  const baseUrl = "http://localhost/api/faq/vote";

  test("returns 400 for non-object body", async () => {
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: "\"string\"",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "1.1.1.1",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Invalid request body");
  });

  test("returns 400 for invalid faqId type", async () => {
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify({ faqId: "1", isHelpful: true }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "1.1.1.2",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Invalid FAQ ID");
  });

  test("returns 400 for invalid isHelpful type", async () => {
    const req = new NextRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify({ faqId: 1, isHelpful: "yes" }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "1.1.1.3",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Invalid vote value");
  });
});

// Tests for GET handler

describe("GET /api/faq/vote", () => {
  const baseUrl = "http://localhost/api/faq/vote";

  test("returns 400 when faqId is missing", async () => {
    const req = new NextRequest(baseUrl, { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("FAQ ID is required");
  });

  test("returns 400 when faqId is not a number", async () => {
    const req = new NextRequest(`${baseUrl}?faqId=abc`, { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Invalid FAQ ID");
  });

  test("returns 404 when FAQ not found", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    const req = new NextRequest(`${baseUrl}?faqId=1`, { method: "GET" });
    const res = await GET(req);
    const json = (await res.json()) as { error?: string };

    expect(res.status).toBe(404);
    expect(json.error).toBe("FAQ not found");

    globalThis.fetch = originalFetch;
  });
});

