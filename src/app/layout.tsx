import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rene Marino — Product Manager, AI & API Platforms",
  description:
    "Rene Marino builds the platforms AI agents run on. Product manager for AI and API infrastructure, former full-stack engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Funnel+Sans:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112,400..500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
