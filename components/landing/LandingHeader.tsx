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

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function LandingHeader() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { label: t('landing.header.nav.product') || "Product", href: "/product" },
    { label: t('landing.header.nav.modules') || "Modules", href: "/#modules" },
    { label: t('landing.header.nav.security') || "Security", href: "/#privacy" },
    { label: t('landing.header.nav.founders') || "Founders", href: "/founders" },
    { label: t('landing.header.nav.contact') || "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism bar */}
      <div className="mx-4 mt-4">
        <div className="bg-white/80 backdrop-blur-2xl border border-border-light/80 rounded-2xl shadow-lg shadow-black/[0.04] px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-gold/30 transition-shadow">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-text-primary tracking-tight font-inter-tight">Kutumbly</span>
              <div className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.3em] leading-none opacity-70 -mt-0.5">
                {t('landing.hero.tagline') || "Sovereign OS"}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-xs font-black text-text-secondary hover:text-text-primary uppercase tracking-widest transition-colors rounded-xl hover:bg-clinical"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/os"
              className="flex items-center gap-2 h-10 px-6 bg-text-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gold transition-all shadow-sm active:scale-95"
            >
              {t('landing.header.open_os') || "Open OS"} <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-clinical transition-colors text-text-secondary"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-white/95 backdrop-blur-2xl border border-border-light rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-sm font-black text-text-secondary hover:text-text-primary hover:bg-clinical rounded-xl transition-all uppercase tracking-widest"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-border-medium" />
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border-light mt-2 space-y-3">
                  <div className="flex justify-center p-2">
                    <LanguageSwitcher />
                  </div>
                  <Link
                    href="/os"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full h-14 bg-text-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gold transition-all"
                  >
                    {t('landing.header.open_os')} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
