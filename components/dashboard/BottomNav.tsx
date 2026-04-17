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
import { motion, AnimatePresence } from 'framer-motion';
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

// Robust label that never shows raw NAV_* strings
function useTabLabel(t: (k: string) => string, id: string): string {
  const key = `NAV_${id.toUpperCase()}`;
  const translated = t(key);
  if (translated === key) return id.charAt(0).toUpperCase() + id.slice(1);
  return translated;
}

export default function BottomNav({ tabs, activeTab, onTabChange, lang }: BottomNavProps) {
  const t = useTranslation(lang as Language);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const visibleTabs = tabs.slice(0, 4);
  const overflowTabs = tabs.slice(4);
  const isMoreActive = !visibleTabs.find(tab => tab.id === activeTab);
  const overflowActive = overflowTabs.find(tab => tab.id === activeTab);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-bg-primary/92 backdrop-blur-2xl border-t border-border-light/60 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]" />

      {/* Nav Bar */}
      <nav className="relative flex justify-around items-stretch h-[var(--nav-height,72px)] px-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = useTabLabel(t, tab.id);

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 py-2 min-w-[48px] outline-none"
            >
              {/* Icon Container */}
              <div className="relative flex items-center justify-center w-12 h-[30px]">
                <div className={`flex items-center justify-center w-11 h-[30px] rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gold/12'
                    : ''
                }`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.75}
                    className={`transition-colors duration-200 ${isActive ? 'text-gold' : 'text-text-tertiary'}`}
                  />
                </div>
                {/* Active dot */}
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-gold rounded-full shadow-[0_0_8px_rgba(201,151,28,0.6)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>

              {/* Label */}
              <span className={`text-[9px] font-black uppercase tracking-[0.12em] leading-none mt-1.5 max-w-[52px] truncate text-center transition-colors duration-200 ${
                isActive ? 'text-gold' : 'text-text-tertiary/60'
              }`}>
                {label}
              </span>
            </motion.button>
          );
        })}

        {/* More Button */}
        <motion.button
          onClick={() => setIsDrawerOpen(true)}
          aria-label={t('MORE')}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="flex flex-col items-center justify-center flex-1 gap-0.5 py-2 min-w-[48px] outline-none"
        >
          <div className="relative flex items-center justify-center w-12 h-[30px]">
            <div className={`flex items-center justify-center w-11 h-[30px] rounded-full transition-all duration-200 ${
              isMoreActive ? 'bg-gold/12' : ''
            }`}>
              <LayoutGrid
                size={22}
                strokeWidth={isMoreActive ? 2.5 : 1.75}
                className={`transition-colors duration-200 ${isMoreActive ? 'text-gold' : 'text-text-tertiary'}`}
              />
            </div>
            {/* Badge: overflow module is active */}
            {overflowActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gold rounded-full border-2 border-bg-primary shadow-[0_0_6px_rgba(201,151,28,0.5)]"
              />
            )}
            {isMoreActive && (
              <motion.span
                layoutId="bottom-nav-indicator"
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-gold rounded-full shadow-[0_0_8px_rgba(201,151,28,0.6)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.12em] leading-none mt-1.5 transition-colors duration-200 ${
            isMoreActive ? 'text-gold' : 'text-text-tertiary/60'
          }`}>
            {t('MORE')}
          </span>
        </motion.button>
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
