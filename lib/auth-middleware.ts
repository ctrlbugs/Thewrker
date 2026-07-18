import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import { parseLocalToken } from "./local-staging";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export function authenticateRequest(
  request: NextRequest
): { user: any; error: null } | { user: null; error: string } {
  const token = getAuthToken(request);

  if (!token) {
    return { user: null, error: "No authentication token provided" };
  }

  const localUser = parseLocalToken(token);
  if (localUser) {
    return {
      user: {
        userId: localUser.id,
        email: localUser.email,
        role: localUser.role,
      },
      error: null,
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { user: null, error: "Invalid or expired token" };
  }

  return { user: payload, error: null };
}

