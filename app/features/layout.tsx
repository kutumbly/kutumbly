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

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sovereign Features",
  description: "Deep-dive into Kutumbly's technical architecture. Built for absolute privacy with local-first encryption, P2P sync, and offline-forever reliability.",
  openGraph: {
    title: "Kutumbly — Sovereign Technical Features",
    description: "Explore the air-gapped, encrypted, and local-first architecture built for Indian families.",
  }
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
