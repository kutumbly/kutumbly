/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
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
import Script from "next/script";
import "./globals.css";
import LanguageContextWrapper from "@/components/ui/LanguageContextWrapper";
import SchemaOrg from "@/components/seo/SchemaOrg";

export { metadata, viewport } from "@/components/seo/metadata";

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
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PX8TLBG7');`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PX8TLBG7"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <SchemaOrg />
        <LanguageContextWrapper>
          {children}
        </LanguageContextWrapper>
      </body>
    </html>
  );
}
