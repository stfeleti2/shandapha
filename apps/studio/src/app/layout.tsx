import { ShandaphaProvider } from "@shandapha/react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/globals.css";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Shandapha Studio",
  description:
    "Wizard, exports, workspaces, billing, and usage on a shared generator core.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <ShandaphaProvider initialPack="normal" planId="premium">
          {children}
        </ShandaphaProvider>
      </body>
    </html>
  );
}
