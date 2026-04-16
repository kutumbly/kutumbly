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

import React, { useState } from 'react';
import { LucideIcon, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import MoreModulesDrawer from './MoreModulesDrawer';
import { useTranslation, Language } from '@/lib/i18n';

interface TabItem {
  id: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  lang: string;
}

export default function BottomNav({ tabs, activeTab, onTabChange, lang }: BottomNavProps) {
  const t = useTranslation(lang as Language);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Show first 4 tabs + "More" — always visible primary modules
  const visibleTabs = tabs.slice(0, 4);
  const overflowTabs = tabs.slice(4);
  const isMoreActive = !visibleTabs.find(t => t.id === activeTab);
  // Has unread/active module in overflow
  const overflowActive = overflowTabs.find(t => t.id === activeTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-primary/95 backdrop-blur-xl border-t border-border-light shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Dynamic Thumb Nav Bar */}
      <nav className="relative flex justify-around items-stretch h-[var(--nav-height,72px)] px-2">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = t(`NAV_${tab.id.toUpperCase()}`);

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center flex-1 gap-1 py-2 min-w-[48px] outline-none transition-all"
            >
              <div className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-gold bg-gold/8 scale-105'
                  : 'text-text-tertiary active:scale-90 active:bg-bg-secondary'
              }`}>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.75} />
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full shadow-[0_0_6px_rgba(201,151,28,0.5)]"
                  />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.15em] leading-none max-w-[48px] truncate text-center transition-colors ${
                isActive ? 'text-gold' : 'text-text-tertiary'
              }`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* More Button — shows gold pulse when overflow module is active */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          aria-label={t('MORE')}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-2 min-w-[48px] outline-none"
        >
          <div className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 ${
            isMoreActive
              ? 'text-gold bg-gold/8 scale-105'
              : 'text-text-tertiary active:scale-90 active:bg-bg-secondary'
          }`}>
            <LayoutGrid size={21} strokeWidth={isMoreActive ? 2.5 : 1.75} />
            {/* Badge shows when an overflow tab is active */}
            {overflowActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gold rounded-full border-2 border-bg-primary shadow-[0_0_6px_rgba(201,151,28,0.5)]"
              />
            )}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] leading-none transition-colors ${
            isMoreActive ? 'text-gold' : 'text-text-tertiary'
          }`}>
            {t('MORE')}
          </span>
        </button>
      </nav>

      {/* Modules Drawer */}
      <MoreModulesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        lang={lang}
      />
    </div>
  );
}
