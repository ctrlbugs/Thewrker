import "server-only";

import { getEnv, hasGoogleCse, hasSerpApi } from "./env";

export interface WebSearchHit {
  title: string;
  url: string;
  snippet: string;
}

export interface WebSearchResult {
  provider: "google-cse" | "serpapi";
  query: string;
  hits: WebSearchHit[];
}

async function searchGoogleCse(query: string): Promise<WebSearchHit[]> {
  const apiKey = getEnv("GOOGLE_CSE_API_KEY");
  const cx = getEnv("GOOGLE_CSE_CX");
  if (!apiKey || !cx) return [];

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "5");

  const response = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Google search failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    items?: { title?: string; link?: string; snippet?: string }[];
  };

  return (data.items ?? []).map((item) => ({
    title: item.title ?? "Untitled",
    url: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
}

async function searchSerpApi(query: string): Promise<WebSearchHit[]> {
  const apiKey = getEnv("SERPAPI_API_KEY");
  if (!apiKey) return [];

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("num", "5");

  const response = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`SerpAPI search failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    organic_results?: { title?: string; link?: string; snippet?: string }[];
  };

  return (data.organic_results ?? []).map((item) => ({
    title: item.title ?? "Untitled",
    url: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
}

export async function searchWeb(query: string): Promise<WebSearchResult | null> {
  // SerpAPI first: new Google Programmable Search engines (2026+) are site-only,
  // not full-web — SerpAPI is better for plagiarism phrase matching.
  if (hasSerpApi()) {
    const hits = await searchSerpApi(query);
    return { provider: "serpapi", query, hits };
  }

  if (hasGoogleCse()) {
    const hits = await searchGoogleCse(query);
    return { provider: "google-cse", query, hits };
  }

  return null;
}
