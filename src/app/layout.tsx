import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rene Marino — Product Manager, AI & API Platforms",
  description:
    "Rene Marino builds the platforms AI agents run on. Product manager for AI and API infrastructure, former full-stack engineer.",
  keywords: ["technical product manager", "AI product manager", "MCP", "API platform", "Orange County"],
  openGraph: {
    type: "profile",
    title: "Rene Marino — Product Manager, AI & API Platforms",
    description: "Rene Marino builds the platforms AI agents run on.",
    url: siteUrl,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rene Marino",
  jobTitle: "Technical Product Manager, AI & API Platforms",
  url: siteUrl,
  sameAs: ["https://www.linkedin.com/in/rene-marino-597b2665/", "https://github.com/thewaffle99"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Orange County",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Funnel+Sans:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112,400..500&display=swap"
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
