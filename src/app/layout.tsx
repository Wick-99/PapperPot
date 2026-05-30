import type { Metadata, Viewport } from "next";
import { FontStylesheetActivator } from "@/components/FontStylesheetActivator";
import "./globals.css";

const fontStylesheetHref =
  "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700,800&f[]=satoshi@400,500,700&f[]=space-mono@400,700&display=swap";

export const metadata: Metadata = {
  title: "PAPERPOT — AI-Native Digital Studio",
  description:
    "Paperpot is an AI-native digital studio that designs, automates and ships intelligent products at the speed of thought.",
  openGraph: {
    title: "PAPERPOT — AI-Native Digital Studio",
    description:
      "We design, automate, and ship intelligent products at the speed of thought.",
    siteName: "Paperpot",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="preload" href={fontStylesheetHref} as="style" />
        <link
          href={fontStylesheetHref}
          rel="stylesheet"
          media="print"
          data-fontshare-stylesheet
        />
        <noscript>
          <link href={fontStylesheetHref} rel="stylesheet" />
        </noscript>
      </head>
      <body className="is-loading">
        <FontStylesheetActivator />
        {children}
      </body>
    </html>
  );
}
