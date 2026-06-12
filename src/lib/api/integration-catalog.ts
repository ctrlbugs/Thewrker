export interface ApiIntegration {
  id: string;
  name: string;
  purpose: string;
  usedBy: string[];
  envKeys: { key: string; label: string }[];
  signupUrl: string;
  docsUrl: string;
  freeTier: string;
}

export const API_INTEGRATIONS: ApiIntegration[] = [
  {
    id: "google-cse",
    name: "Google Custom Search JSON API",
    purpose: "Search the web for matching phrases during plagiarism checks.",
    usedBy: ["AI Studio — Plagiarism Checker"],
    envKeys: [
      { key: "GOOGLE_CSE_API_KEY", label: "API Key" },
      { key: "GOOGLE_CSE_CX", label: "Search Engine ID (cx)" },
    ],
    signupUrl: "https://console.cloud.google.com/apis/credentials",
    docsUrl: "https://developers.google.com/custom-search/v1/overview",
    freeTier: "100 search queries per day",
  },
  {
    id: "serpapi",
    name: "SerpAPI",
    purpose: "Fallback web search for plagiarism scanning when Google CSE is not configured.",
    usedBy: ["AI Studio — Plagiarism Checker", "CareerOS — Opportunity Agent"],
    envKeys: [{ key: "SERPAPI_API_KEY", label: "API Key" }],
    signupUrl: "https://serpapi.com/users/sign_up",
    docsUrl: "https://serpapi.com/search-api",
    freeTier: "100 searches per month",
  },
  {
    id: "ocr-space",
    name: "OCR.space API",
    purpose: "Extract text from scanned PDFs and image-based documents.",
    usedBy: ["AI Studio — Plagiarism Checker", "Document text extraction"],
    envKeys: [{ key: "OCR_SPACE_API_KEY", label: "API Key" }],
    signupUrl: "https://ocr.space/ocrapi",
    docsUrl: "https://ocr.space/OCRAPI",
    freeTier: "25,000 requests per month",
  },
  {
    id: "remove-bg",
    name: "remove.bg API",
    purpose: "Optional cloud background removal (faster than browser AI on first run).",
    usedBy: ["Image Studio — Remove Background"],
    envKeys: [{ key: "REMOVE_BG_API_KEY", label: "API Key" }],
    signupUrl: "https://www.remove.bg/api",
    docsUrl: "https://www.remove.bg/api#remove-background",
    freeTier: "50 preview API calls per month",
  },
  {
    id: "openai",
    name: "OpenAI API",
    purpose: "AI resume analysis, cover letters, interview prep, job fit scoring, and career insights in CareerOS.",
    usedBy: [
      "CareerOS — Resume Lab",
      "CareerOS — Cover Letter Studio",
      "CareerOS — Interview Prep",
      "CareerOS — Application Tracker",
      "CareerOS — Career Insights",
    ],
    envKeys: [
      { key: "OPENAI_API_KEY", label: "API Key" },
      { key: "OPENAI_MODEL", label: "Model (optional, default gpt-4o-mini)" },
    ],
    signupUrl: "https://platform.openai.com/api-keys",
    docsUrl: "https://platform.openai.com/docs/api-reference/chat",
    freeTier: "Pay-as-you-go — gpt-4o-mini is low cost per request",
  },
];

export function getIntegrationById(id: string): ApiIntegration | undefined {
  return API_INTEGRATIONS.find((item) => item.id === id);
}
