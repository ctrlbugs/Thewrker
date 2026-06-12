import "server-only";

export function getEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function hasGoogleCse(): boolean {
  return Boolean(getEnv("GOOGLE_CSE_API_KEY") && getEnv("GOOGLE_CSE_CX"));
}

export function hasSerpApi(): boolean {
  return Boolean(getEnv("SERPAPI_API_KEY"));
}

export function hasOcrSpace(): boolean {
  return Boolean(getEnv("OCR_SPACE_API_KEY"));
}

export function hasRemoveBg(): boolean {
  return Boolean(getEnv("REMOVE_BG_API_KEY"));
}

export function hasWebSearch(): boolean {
  return hasGoogleCse() || hasSerpApi();
}

export function hasOpenAi(): boolean {
  return Boolean(getEnv("OPENAI_API_KEY"));
}
