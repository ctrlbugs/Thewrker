import "server-only";

import { getEnv, hasOpenAi as envHasOpenAi } from "./env";

export function hasOpenAi(): boolean {
  return envHasOpenAi();
}

export function getOpenAiModel(): string {
  return getEnv("OPENAI_MODEL") ?? "gpt-4o-mini";
}

export async function chatCompletion(options: {
  system: string;
  user: string;
  json?: boolean;
  temperature?: number;
}): Promise<string> {
  const apiKey = getEnv("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OpenAI is not configured. Add OPENAI_API_KEY to .env.local");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      temperature: options.temperature ?? 0.6,
      messages: [
        { role: "system", content: options.system },
        { role: "user", content: options.user },
      ],
      ...(options.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}

export function parseJsonResponse<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("Could not parse AI response. Try again.");
  }
}
