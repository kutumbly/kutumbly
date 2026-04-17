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

"use client";

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Shield, Mail, Globe } from 'lucide-react';

const HUB_LINKS = [
  { name: "Cash Hub", href: "/os" },
  { name: "Invest Hub", href: "/os" },
  { name: "Health Hub", href: "/os" },
  { name: "Vidya Hub", href: "/os" },
  { name: "Sanskriti Hub", href: "/os" },
  { name: "Saman Hub", href: "/os" },
  { name: "Utsav Hub", href: "/os" },
  { name: "Sewak Hub", href: "/os" },
  { name: "Suvidha Hub", href: "/os" },
  { name: "Tasks Hub", href: "/os" },
  { name: "Diary Hub", href: "/os" },
  { name: "Family Hub", href: "/os" },
];

const COMPANY_LINKS = [
  { name: "Product", href: "/product" },
  { name: "Founders", href: "/founders" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Use", href: "/terms" },
];

export default function LandingFooter() {
  const { lang } = useAppStore();
  const t = useTranslation(lang);

  return (
    <footer className="bg-bg-primary border-t border-border-light">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-sm">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="text-xl font-black text-text-primary tracking-tight font-inter-tight">
                  Kutumbly
                </span>
              </div>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] opacity-70">
                India's Family Sovereign OS
              </p>
            </div>

            <p className="text-sm text-text-secondary font-medium leading-relaxed opacity-80">
              One encrypted .kutumb file. <br />
              12 sovereign family hubs. <br />
              Zero cloud. Zero compromise.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                <Mail size={12} className="text-gold" />
                kutumbly@outlook.com
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                <Globe size={12} className="text-gold" />
                kutumbly.com
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-clinical border border-border-light rounded-xl w-fit shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-text-success animate-pulse" />
              <span className="text-[8px] font-black text-text-success uppercase tracking-widest">v1.0 · Sovereign</span>
            </div>
          </div>

          {/* Hubs column — 2 sub-cols */}
          <div className="md:col-span-2">
            <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-6 opacity-70">
              Sovereign Hubs
            </div>
            <div className="grid grid-cols-2 gap-2">
              {HUB_LINKS.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-gold transition-colors py-1.5 group"
                >
                  <div className="w-1 h-1 rounded-full bg-border-medium group-hover:bg-gold transition-colors" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company column */}
          <div>
            <div className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-6 opacity-70">
              Company
            </div>
            <div className="space-y-2">
              {COMPANY_LINKS.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-gold transition-colors py-1.5 group"
                >
                  <div className="w-1 h-1 rounded-full bg-border-medium group-hover:bg-gold transition-colors" />
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 p-5 bg-clinical border border-border-light rounded-2xl">
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-2">Built By</div>
              <div className="text-sm font-black text-text-primary font-inter-tight">Jawahar R. M.</div>
              <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-70 mt-1">
                AITDL Network · Sovereign Division
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-light/60 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">
            {t('footer.copyright') || "© 2026 Kutumbly.com — All Rights Reserved"}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">
              {t('footer.built_by') || "Built with ❤️ for Indian Families"}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-[9px] font-black text-gold-text uppercase tracking-widest">"Memory, Not Code."</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
