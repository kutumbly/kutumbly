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
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: "Privacy Policy | Kutumbly Sovereign OS",
  description: "Read our commitment to 100% offline privacy. At Kutumbly, your data never leaves your device. No cloud, no tracking, zero server-side storage.",
  openGraph: {
    title: "Privacy Policy — Kutumbly Sovereign OS",
    description: "Zero Cloud. Zero Tracking. 100% Local Privacy.",
  }
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
