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
  title: "Technical Manifesto",
  description: "A deep-dive into the Sovereign OS architecture. Unvarnished technical specifications for the modern Indian family's digital legacy.",
  openGraph: {
    title: "Kutumbly — Technical Manifesto",
    description: "Encryption protocols, local persistence, and agentic family coordination specs.",
  }
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
