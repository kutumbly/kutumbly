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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutGrid } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
}

interface MoreModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  lang: string;
}

export default function MoreModulesDrawer({ 
  isOpen, 
  onClose, 
  tabs, 
  activeTab, 
  onTabChange, 
  lang 
}: MoreModulesDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-bg-primary rounded-t-[32px] z-[70] border-t border-border-light shadow-2xl pb-safe max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center p-3 flex-shrink-0">
              <div className="w-12 h-1.5 bg-border-light rounded-full" />
            </div>

            <div className="px-6 pt-2 pb-8 overflow-y-auto scroller-hide flex-1">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-bg-primary py-1 z-10">
                <div>
                   <h3 className="text-xl font-bold text-text-primary">
                     {lang === 'en' ? 'Sovereign Modules' : 'Saare Modules'}
                   </h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mt-1">
                     Kutumbly OS v2.0
                   </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-bg-secondary text-text-tertiary hover:text-text-primary active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-3 gap-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const label = lang === 'en' ? tab.labelEn : tab.labelHi;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        onClose();
                      }}
                      className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all border-2 ${
                        isActive 
                          ? 'bg-gold/5 border-gold text-gold shadow-[0_0_20px_rgba(201,151,28,0.1)]' 
                          : 'bg-bg-secondary border-transparent text-text-secondary active:bg-bg-tertiary'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-gold text-white' : 'bg-bg-primary text-text-tertiary shadow-sm'}`}>
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className="text-[10px] font-bold text-center leading-tight">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-border-light/50 text-center">
                 <div className="text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary opacity-40">
                   Kutumbly Sovereign OS · Privacy First
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
