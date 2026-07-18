import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import {
  authenticateLocal,
  createLocalToken,
  isLocalStaging,
} from "@/lib/local-staging";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Local staging — no database required
    if (isLocalStaging()) {
      const localUser = authenticateLocal(email, password);
      if (!localUser) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          message: "Login successful (local staging)",
          mode: "local",
          user: localUser,
          accessToken: createLocalToken(localUser),
        },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
        accessToken,
      },
      { status: 200 }
    );

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
