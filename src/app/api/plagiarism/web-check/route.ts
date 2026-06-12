import { NextResponse } from "next/server";

import { hasWebSearch } from "@/lib/api/server/env";
import { runWebPlagiarismScan } from "@/lib/api/server/plagiarism-web";

export async function POST(request: Request) {
  if (!hasWebSearch()) {
    return NextResponse.json(
      {
        error: "Online scan is temporarily unavailable.",
      },
      { status: 503 },
    );
  }

  let body: { text?: string };
  try {
    body = (await request.json()) as { text?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text || text.length < 80) {
    return NextResponse.json(
      { error: "Document text is too short for a web scan." },
      { status: 400 },
    );
  }

  try {
    const result = await runWebPlagiarismScan(text);
    return NextResponse.json({
      provider: result.provider,
      searchesRun: result.searchesRun,
      flags: result.flags,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Web scan failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
