import { NextResponse } from "next/server";

import {
  hasGoogleCse,
  hasOcrSpace,
  hasOpenAi,
  hasRemoveBg,
  hasSerpApi,
  hasWebSearch,
} from "@/lib/api/server/env";

export async function GET() {
  return NextResponse.json({
    "google-cse": hasGoogleCse(),
    serpapi: hasSerpApi(),
    "ocr-space": hasOcrSpace(),
    "remove-bg": hasRemoveBg(),
    openai: hasOpenAi(),
    webSearch: hasWebSearch(),
  });
}
