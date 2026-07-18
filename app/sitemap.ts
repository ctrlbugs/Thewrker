import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://www.thewrker.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/login`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/workspace`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/explore`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.75 },
    { url: `${siteUrl}/talent`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/recruiter`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
