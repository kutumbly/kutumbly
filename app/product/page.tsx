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
import ProductContent from './ProductContent';

export const metadata: Metadata = {
  title: "The Sovereign OS Specs | Kutumbly",
  description: "Explore the technical architecture of India's first offline Family OS. Featuring 12 integrated hubs, AES-256 encryption, and zero cloud telemetry.",
  openGraph: {
    title: "Product Specifications — Kutumbly Sovereign OS",
    description: "Hardware-hardened privacy. 100% Offline. Zero Cloud.",
  }
};

export default function ProductPage() {
  return <ProductContent />;
}
