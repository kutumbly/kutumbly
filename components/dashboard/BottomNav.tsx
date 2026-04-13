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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-xl border-t border-border-light shadow-[0_-5px_20px_rgba(0,0,0,0.05)]" />
      
      {/* Dynamic Thumb Nav Bar */}
      <nav className="relative flex justify-around items-center h-[72px] pb-safe px-2">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = lang === 'en' ? tab.labelEn : tab.labelHi;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all text-text-tertiary"
            >
              <div className={`relative p-2 rounded-2xl transition-all ${isActive ? 'text-gold bg-gold/10' : 'active:bg-bg-secondary'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                   <motion.div 
                     layoutId="active-pill"
                     className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full border-2 border-bg-primary"
                   />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-gold' : 'text-text-tertiary'}`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all text-text-tertiary"
        >
          <div className={`relative p-2 rounded-2xl transition-all ${isMoreActive ? 'text-gold bg-gold/5' : 'active:bg-bg-secondary'}`}>
            <LayoutGrid size={20} strokeWidth={isMoreActive ? 2.5 : 2} />
            {isMoreActive && (
               <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold/50 rounded-full border-2 border-bg-primary" />
            )}
          </div>
          <span className={`text-[8px] font-black uppercase tracking-widest ${isMoreActive ? 'text-gold' : 'text-text-tertiary'}`}>
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
