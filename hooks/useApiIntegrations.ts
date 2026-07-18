"use client";

/** Local staging stub — optional external APIs are offline */
export function useApiIntegrations() {
  return {
    status: {
      ready: false,
      ocr: false,
      backgroundRemoval: false,
      plagiarism: false,
      webSearch: false,
      "remove-bg": false,
    } as Record<string, boolean>,
    refresh: async () => undefined,
  };
}
