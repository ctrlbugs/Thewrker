import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["TRAINEE", "TALENT", "RECRUITER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role as "TRAINEE" | "TALENT" | "RECRUITER",
      },
    });

    // Create profile for TRAINEE and TALENT
    if (role === "TRAINEE" || role === "TALENT") {
      await prisma.profile.create({
        data: {
          userId: user.id,
          skillScores: {},
          availability: {},
        },
      });
    }

    // Generate tokens for auto-login
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
        accessToken,
      },
      { status: 201 }
    );

    // Set refresh token as HTTP-only cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
