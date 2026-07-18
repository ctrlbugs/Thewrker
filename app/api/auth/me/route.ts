import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, getAuthToken } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { isLocalStaging, parseLocalToken } from "@/lib/local-staging";

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    const localUser = parseLocalToken(token);

    if (localUser && isLocalStaging()) {
      return NextResponse.json({ user: localUser, mode: "local" }, { status: 200 });
    }

    // Allow local tokens even if flag flipped mid-session during frontend work
    if (localUser) {
      return NextResponse.json({ user: localUser, mode: "local" }, { status: 200 });
    }

    const auth = authenticateRequest(request);

    if (auth.error || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    if (isLocalStaging()) {
      return NextResponse.json(
        {
          user: {
            id: auth.user.userId,
            email: auth.user.email,
            firstName: "Local",
            lastName: "User",
            role: auth.user.role,
            profileImage: null,
            isVerified: true,
            createdAt: new Date().toISOString(),
          },
          mode: "local",
        },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
