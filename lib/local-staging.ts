export type LocalStagingUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "TALENT" | "TRAINEE" | "RECRUITER" | "ADMIN";
  profileImage: string | null;
  isVerified: boolean;
  createdAt: string;
};

type LocalAccount = {
  email: string;
  password: string;
  user: LocalStagingUser;
};

/** No backend/DB required when true */
export const isLocalStaging = () =>
  process.env.NEXT_PUBLIC_LOCAL_STAGING === "true" ||
  process.env.LOCAL_STAGING === "true";

export const LOCAL_ACCOUNTS: LocalAccount[] = [
  {
    email: "user@thewrker.com",
    password: "user123",
    user: {
      id: "local-user-1",
      email: "user@thewrker.com",
      firstName: "Demo",
      lastName: "User",
      role: "TALENT",
      profileImage: null,
      isVerified: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  },
  {
    email: "admin@thewrker.com",
    password: "admin123",
    user: {
      id: "local-admin-1",
      email: "admin@thewrker.com",
      firstName: "Admin",
      lastName: "TheWrker",
      role: "ADMIN",
      profileImage: null,
      isVerified: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  },
];

const TOKEN_PREFIX = "local.";

function encodePayload(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }
  const base64 = btoa(unescape(encodeURIComponent(value)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodePayload(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return decodeURIComponent(escape(atob(padded + pad)));
}

export function authenticateLocal(
  email: string,
  password: string
): LocalStagingUser | null {
  const account = LOCAL_ACCOUNTS.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password
  );
  return account?.user ?? null;
}

export function createLocalToken(user: LocalStagingUser): string {
  return `${TOKEN_PREFIX}${encodePayload(JSON.stringify(user))}`;
}

export function parseLocalToken(token: string | null | undefined): LocalStagingUser | null {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  try {
    return JSON.parse(decodePayload(token.slice(TOKEN_PREFIX.length))) as LocalStagingUser;
  } catch {
    return null;
  }
}

export function isLocalToken(token: string | null | undefined): boolean {
  return Boolean(token?.startsWith(TOKEN_PREFIX));
}
