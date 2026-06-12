import { NextResponse } from "next/server";

import { hasOcrSpace } from "@/lib/api/server/env";
import { extractTextWithOcr } from "@/lib/api/server/ocr";

export async function POST(request: Request) {
  if (!hasOcrSpace()) {
    return NextResponse.json(
      {
        error: "Document reading is temporarily unavailable for this file.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a file in the 'file' field." }, { status: 400 });
  }

  try {
    const text = await extractTextWithOcr(file);
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OCR extraction failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
