const INTERNAL_HINT =
  /api[_\s-]?key|openai|serpapi|ocr|remove\.bg|\.env|not configured|google cse|custom search/i;

export function toUserFacingError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const message = error instanceof Error ? error.message : String(error);
  if (INTERNAL_HINT.test(message)) return fallback;
  return message || fallback;
}

export function sanitizeApiErrorMessage(message: string, fallback = "Something went wrong. Please try again."): string {
  if (INTERNAL_HINT.test(message)) return fallback;
  return message;
}
