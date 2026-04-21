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

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Manifesto",
  description: "Read the Kutumbly Privacy Manifest. 100% Zero Cloud, Local-First, and Encrypted at rest. Your family data never leaves your device.",
  openGraph: {
    title: "Kutumbly — Privacy Manifesto",
    description: "Zero Cloud. Total Privacy. No accounts, no servers, no trackers.",
  }
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
