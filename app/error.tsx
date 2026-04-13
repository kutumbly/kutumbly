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

"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log only in dev; never ship console.log to prod without a guard
    if (process.env.NODE_ENV === "development") {
      console.error("[Kutumbly Vault Error]", error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-bg-tertiary px-6 py-20 text-center relative overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Ambient red blob for danger context */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #991B1B 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 bg-bg-primary border border-border-light rounded-[2.5rem] p-12 md:p-16 max-w-lg w-full shadow-2xl shadow-black/[0.04]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-bg-primary border border-border-light rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-black/[0.04]">
            <Image src="/favicon.svg" alt="Kutumbly" width={36} height={36} />
          </div>
        </div>

        {/* Error badge */}
        <div className="inline-flex items-center gap-2 text-[9px] font-black text-text-danger uppercase tracking-[0.4em] mb-6 bg-bg-danger/30 px-4 py-2 rounded-full border border-text-danger/10">
          <span className="w-1.5 h-1.5 rounded-full bg-text-danger animate-pulse" />
          Runtime Exception
        </div>

        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-3">
          Kuch Gad Badh Ho Gayi
        </h1>
        <p className="text-[13px] font-bold text-text-secondary leading-relaxed mb-4 max-w-xs mx-auto">
          An unexpected error has occurred inside the Sovereign OS. Your data remains safe — it never left your device.
        </p>

        {/* Error details — dev only */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mb-8 bg-bg-secondary border border-border-light rounded-2xl p-5 text-left">
            <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-2">
              Debug Output
            </div>
            <code className="text-[11px] text-text-danger font-mono leading-relaxed break-all">
              {error.message}
            </code>
            {error.digest && (
              <div className="mt-2 text-[9px] font-black text-text-tertiary opacity-60 uppercase tracking-widest">
                Digest: {error.digest}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border-light mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="h-12 px-8 bg-gold-text text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-gold/10"
          >
            Phir Koshish Karein
          </button>
          <Link
            href="/"
            className="h-12 px-8 bg-bg-primary border border-border-light text-text-primary font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:border-gold transition-colors"
          >
            Ghar Wapas
          </Link>
        </div>

        <p className="mt-10 text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-50">
          Kutumbly Sovereign OS · Zero Cloud · Bharat
        </p>
      </div>
    </div>
  );
}
