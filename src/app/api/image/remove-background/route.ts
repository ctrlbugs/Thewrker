import { NextResponse } from "next/server";

import { hasRemoveBg } from "@/lib/api/server/env";
import { removeBackgroundWithApi } from "@/lib/api/server/remove-bg";

export async function POST(request: Request) {
  if (!hasRemoveBg()) {
    return NextResponse.json(
      {
        error: "Background removal is temporarily unavailable. Please try again.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload an image in the 'file' field." }, { status: 400 });
  }

  try {
    const blob = await removeBackgroundWithApi(file);
    return new NextResponse(blob, {
      headers: {
        "Content-Type": blob.type || "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Background removal failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
