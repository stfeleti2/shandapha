import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
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
  title: "Shandapha Sandbox",
  description:
    "Interactive sandbox for packs, templates, states, and modernization previews.",
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
          initialMode="light"
          planId="business"
        >
          <div
            data-slot="layout"
            className="relative z-10 flex min-h-svh flex-col bg-background"
          >
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </div>
        </ShandaphaProvider>
      </body>
    </html>
  );
}
