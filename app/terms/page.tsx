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

import { Metadata } from 'next';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: "Terms of Service | Kutumbly",
  description: "Read the usage terms for Kutumbly Sovereign OS. We prioritize local data sovereignty and non-custodial software ownership.",
  openGraph: {
    title: "Terms of Service — Kutumbly Sovereign OS",
    description: "Sovereign software ownership. Local data. Your terms.",
  }
};

export default function TermsPage() {
  return <TermsContent />;
}
