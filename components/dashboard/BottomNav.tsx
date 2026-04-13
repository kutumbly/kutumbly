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
import { LucideIcon, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import MoreModulesDrawer from './MoreModulesDrawer';

interface TabItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  lang: 'en' | 'hi';
}

export default function BottomNav({ tabs, activeTab, onTabChange, lang }: BottomNavProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Show first 4 tabs + "More"
  const visibleTabs = tabs.slice(0, 4);
  const isMoreActive = !visibleTabs.find(t => t.id === activeTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border-light shadow-[0_-8px_30px_rgba(0,0,0,0.03)] pb-safe">
      
      {/* Dynamic Thumb Nav Bar */}
      <nav className="relative flex justify-around items-center h-20 px-4">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = lang === 'en' ? tab.labelEn : tab.labelHi;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all outline-none"
            >
              <div className={`relative p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'text-gold bg-gold/5 scale-110' : 'text-text-tertiary active:scale-90 opacity-60'}`}>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                {isActive && (
                   <motion.div 
                     layoutId="bottom-nav-dot"
                     className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_rgba(201,151,28,0.4)]"
                   />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${isActive ? 'text-gold-text' : 'text-text-tertiary'}`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all outline-none"
        >
          <div className={`relative p-2.5 rounded-2xl transition-all duration-300 ${isMoreActive ? 'text-gold bg-gold/5 animate-pulse' : 'text-text-tertiary'}`}>
            <LayoutGrid size={20} strokeWidth={isMoreActive ? 3 : 2} />
          </div>
          <span className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none ${isMoreActive ? 'text-gold-text' : 'text-text-tertiary'}`}>
            {lang === 'en' ? 'More' : 'Aur'}
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
