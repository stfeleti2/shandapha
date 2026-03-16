import { ShandaphaProvider } from "@shandapha/react";
import { defaultBrandKit } from "@shandapha/tokens";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const displayFont = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Shandapha Control Plane",
  description:
    "Governance, workspaces, billing, approvals, drift visibility, and audit foundations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <body>
        <ShandaphaProvider
          brandKit={{ ...defaultBrandKit, font: "var(--font-body)" }}
          initialPack="normal"
          initialMode="dark"
          planId="business"
        >
          {children}
        </ShandaphaProvider>
      </body>
    </html>
  );
}
