import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAPPERPOT — AI-Native Digital Studio",
  description:
    "Papperpot is an AI-native digital studio that designs, automates and ships intelligent products at the speed of thought.",
  openGraph: {
    title: "PAPPERPOT — AI-Native Digital Studio",
    description:
      "We design, automate, and ship intelligent products at the speed of thought.",
    siteName: "Papperpot",
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
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700,800&f[]=satoshi@400,500,700&f[]=space-mono@400,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="is-loading">{children}</body>
    </html>
  );
}
