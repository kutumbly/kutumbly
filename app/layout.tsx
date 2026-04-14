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
import { Inter, Inter_Tight, Noto_Sans_Devanagari, Noto_Sans_Bengali, Noto_Sans_Gujarati, Noto_Sans_Gurmukhi, Noto_Sans_Tamil, Noto_Sans_Kannada, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";
import LanguageContextWrapper from "@/components/ui/LanguageContextWrapper";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: '--font-inter-tight',
  display: 'swap',
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
  metadataBase: new URL('https://kutumbly.com'),
  title: {
    default: "Kutumbly — The Sovereign Family Operating System",
    template: "%s | Kutumbly Sovereign OS"
  },
  description: "Secure, local-first Sovereign OS for the modern Indian family. Zero cloud, absolute privacy, and total data ownership through AES-256 encrypted vaults.",
  keywords: ["Sovereign OS", "Family OS", "Local-first", "Privacy", "Encrypted Vaults", "Indian Family Tech", "Data Sovereignty", "Zero Cloud"],
  authors: [{ name: "Jawahar R. Mallah", url: "https://kutumbly.com" }],
  creator: "AITDL Network — Sovereign Division",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kutumbly.com",
    title: "Kutumbly — The Sovereign Family Operating System",
    description: "Your life, locked in your control. The world's first local-first, zero-cloud OS for families.",
    siteName: "Kutumbly Sovereign OS",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Kutumbly Sovereign OS - Memory, Not Code."
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kutumbly — The Sovereign Family Operating System",
    description: "Zero Cloud. Local First. Encrypted. Offline Forever.",
    images: ["/og-image.png"],
    creator: "@kutumbly",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kutumbly",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      ${interTight.variable}
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
