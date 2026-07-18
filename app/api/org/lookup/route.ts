import { NextRequest, NextResponse } from "next/server";

function toSlug(value: string) {
  const trimmed = value.trim().toLowerCase();
  // Prefer email domain for workspace hints: name@company.com → company
  if (trimmed.includes("@")) {
    const domain = trimmed.split("@")[1] || "";
    const root = domain.split(".")[0] || "";
    return root.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  }

  return trimmed
    .replace(/^https?:\/\//, "")
    .replace(/\.thewrker\.com.*$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Organisation workspace lookup (stub).
 * Future: resolve org by slug or email domain from the database.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = String(body?.query || "").trim();
    const slug = String(body?.slug || toSlug(query));

    if (!slug) {
      return NextResponse.json(
        { error: "Organisation name or email is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ready: false,
      found: true,
      slug,
      name: slug
        .split("-")
        .filter(Boolean)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      workspaceUrl: `/workspace/${slug}`,
      message:
        "Org lookup stub resolved a workspace slug. Connect Prisma Organisation model to validate real tenants.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to look up organisation" },
      { status: 500 }
    );
  }
}
