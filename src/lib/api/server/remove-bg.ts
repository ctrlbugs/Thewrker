import "server-only";

import { getEnv, hasRemoveBg } from "./env";

export async function removeBackgroundWithApi(file: File): Promise<Blob> {
  if (!hasRemoveBg()) {
    throw new Error("remove.bg API is not configured. Add REMOVE_BG_API_KEY to .env.local");
  }

  const apiKey = getEnv("REMOVE_BG_API_KEY")!;
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`remove.bg failed (${response.status}): ${errorText.slice(0, 120)}`);
  }

  return response.blob();
}
