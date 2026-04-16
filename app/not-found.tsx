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

import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Kutumbly Sovereign OS",
  description: "This path does not exist within the Kutumbly Sovereign OS. Return to the Aangan.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-bg-tertiary px-6 py-20 text-center relative overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Ambient bokeh blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #c9971c 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #c9971c 0%, transparent 70%)" }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 bg-bg-primary border border-border-light rounded-[2.5rem] p-12 md:p-16 max-w-lg w-full shadow-2xl shadow-black/[0.04]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-bg-primary border border-border-light rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-black/[0.04]">
            <Image src="/favicon.svg" alt="Kutumbly" width={36} height={36} style={{ height: 'auto' }} />
          </div>
        </div>

        {/* Error Code */}
        <div className="text-[9px] font-black text-gold uppercase tracking-[0.5em] mb-4">
          Sovereign Error · Code 404
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tighter leading-none mb-6">
          4<span className="text-gold">0</span>4
        </h1>

        <h2 className="text-xl font-black text-text-primary tracking-tight mb-3">
          Yeh Raasta Nahi Mila
        </h2>
        <p className="text-[13px] font-bold text-text-secondary leading-relaxed mb-10 max-w-xs mx-auto">
          The page you're looking for does not exist in the Kutumbly Sovereign OS.
          It may have moved, been removed, or never existed.
        </p>

        {/* Divider */}
        <div className="border-t border-border-light mb-10" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="h-12 px-8 bg-gold-text text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-gold/10"
          >
            ← Ghar Wapas
          </Link>
          <Link
            href="/os"
            className="h-12 px-8 bg-bg-primary border border-border-light text-text-primary font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:border-gold transition-colors"
          >
            Open OS
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-50">
          Kutumbly Sovereign OS · Zero Cloud · Bharat
        </p>
      </div>
    </div>
  );
}
