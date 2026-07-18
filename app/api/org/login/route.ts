import { NextRequest, NextResponse } from "next/server";

/**
 * Organisation manager / HoD login (stub).
 * Future: authenticate against org membership + role (MANAGER, HOD, ADMIN).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, email, password } = body || {};

    if (!slug || !email || !password) {
      return NextResponse.json(
        { error: "Workspace, email, and password are required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ready: false,
        slug,
        email,
        accessToken: null,
        refreshToken: null,
        redirectUrl: `/workspace/${slug}/dashboard`,
        message:
          "Organisation login endpoint is ready. Connect org membership auth to issue tokens.",
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in to organisation workspace" },
      { status: 500 }
    );
  }
}
