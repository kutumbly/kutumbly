/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Bengali, Noto_Sans_Gujarati, Noto_Sans_Gurmukhi, Noto_Sans_Tamil, Noto_Sans_Kannada, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";
import LanguageContextWrapper from "@/components/ui/LanguageContextWrapper";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const notoDevanagari = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-devanagari' 
});

const notoBengali = Noto_Sans_Bengali({ 
  subsets: ["bengali"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-bengali' 
});

const notoGujarati = Noto_Sans_Gujarati({ 
  subsets: ["gujarati"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-gujarati' 
});

const notoGurmukhi = Noto_Sans_Gurmukhi({ 
  subsets: ["gurmukhi"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-gurmukhi' 
});

const notoTamil = Noto_Sans_Tamil({ 
  subsets: ["tamil"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-tamil' 
});

const notoKannada = Noto_Sans_Kannada({ 
  subsets: ["kannada"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-kannada' 
});

const notoTelugu = Noto_Sans_Telugu({ 
  subsets: ["telugu"], 
  weight: ["400", "500", "700", "900"],
  variable: '--font-noto-telugu' 
});

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Kutumbly — Your Family's Digital Ghar",
  description: "Secure, local-first Sovereign OS for Indian families. Zero cloud, absolute privacy, and total data ownership.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kutumbly",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`
      ${inter.variable} 
      ${notoDevanagari.variable} 
      ${notoBengali.variable} 
      ${notoGujarati.variable} 
      ${notoGurmukhi.variable} 
      ${notoTamil.variable} 
      ${notoKannada.variable} 
        ${notoTelugu.variable}
    `}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <LanguageContextWrapper>
          {children}
        </LanguageContextWrapper>
      </body>
    </html>
  );
}
