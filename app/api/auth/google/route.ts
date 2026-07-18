import { NextRequest, NextResponse } from "next/server";

/**
 * Google OAuth entrypoint (stub).
 * Wire to your OAuth provider when backend auth is ready.
 *
 * Expected future response:
 * { redirectUrl: "https://accounts.google.com/..." }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const intent = body?.intent || "user_login";
    const slug = body?.slug;

    return NextResponse.json(
      {
        ready: false,
        provider: "google",
        intent,
        slug: slug || null,
        message:
          "Google OAuth endpoint is ready for integration. Configure GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to enable redirects.",
        redirectUrl: null,
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to start Google authentication" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ready: false,
    provider: "google",
    message: "Use POST /api/auth/google to start the OAuth flow.",
  });
}
