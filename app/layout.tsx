import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const siteUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    : process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.thewrker.com";

/** Cache-bust so browsers pick up the latest brand favicon */
const iconVersion = "v4";

const keywords = [
  "TheWrker",
  "thewrker",
  "theworker",
  "the worker",
  "workspace",
  "the workspace",
  "digital work",
  "digital workspace",
  "job search",
  "job searching",
  "remote work",
  "remote jobs",
  "career platform",
  "freelancer workspace",
  "organization workspace",
  "hire remote talent",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TheWrker — The Future of Workspace and Job Searching Made Simple",
    template: "%s | TheWrker",
  },
  description:
    "TheWrker is the digital workspace and job search platform for professionals and organisations. One place to work, collaborate, and land your next opportunity — The future of Workspace and Job Searching Made Simple.",
  keywords,
  applicationName: "TheWrker",
  authors: [{ name: "TheWrker", url: siteUrl }],
  creator: "TheWrker",
  publisher: "TheWrker",
  category: "Business",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "TheWrker",
    title: "TheWrker — The Future of Workspace and Job Searching Made Simple",
    description:
      "One workspace for digital work and job searching. Sign in, join your organisation, and grow your career on TheWrker.",
    images: [
      {
        url: "/logo/og.png",
        width: 1200,
        height: 630,
        alt: "theWRKER — The Future of Workspace and Job Searching Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheWrker — Workspace & Job Searching Made Simple",
    description:
      "The future of Workspace and Job Searching Made Simple. Digital work, career tools, and organisation workspaces — thewrker.com",
    images: ["/logo/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: `/icons/favicon-32.png?${iconVersion}`, type: "image/png", sizes: "32x32" },
      { url: `/icons/favicon-16.png?${iconVersion}`, type: "image/png", sizes: "16x16" },
      { url: `/favicon.png?${iconVersion}`, type: "image/png", sizes: "32x32" },
      { url: `/favicon.ico?${iconVersion}`, sizes: "any" },
      { url: `/icons/icon-192.png?${iconVersion}`, type: "image/png", sizes: "192x192" },
    ],
    apple: [
      {
        // No query string — iOS Safari can ignore or mishandle apple-touch-icon URLs with params
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/logo/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [`/icons/favicon-32.png?${iconVersion}`],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#21386B",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "TheWrker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "TheWrker",
      alternateName: ["thewrker", "theworker", "The Worker", "The Workspace"],
      url: siteUrl,
      logo: `${siteUrl}/logo/logo-dark.png`,
      description:
        "TheWrker is a digital workspace and job search platform for professionals, freelancers, and organisations.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "TheWrker",
      description:
        "The future of Workspace and Job Searching Made Simple. Find digital work, manage your workspace, and grow your career.",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/jobs?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "TheWrker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description:
        "Workspace and job searching platform for digital work, organisation teams, and career growth.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href={`/icons/favicon-32.png?${iconVersion}`}
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href={`/icons/favicon-16.png?${iconVersion}`}
          type="image/png"
          sizes="16x16"
        />
        <link rel="shortcut icon" href={`/favicon.ico?${iconVersion}`} />
        <link rel="icon" href={`/favicon.ico?${iconVersion}`} sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/logo/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#21386B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="TheWrker" />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
