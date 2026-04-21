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

import { X } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useTranslation, Language } from '@/lib/i18n';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface TabItem {
  id: string;
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

function getLabel(t: (k: string) => string, id: string): string {
  const key = `NAV_${id.toUpperCase()}`;
  const translated = t(key);
  if (translated === key) return id.charAt(0).toUpperCase() + id.slice(1);
  return translated;
}

export default function MoreModulesDrawer({
  isOpen,
  onClose,
  tabs,
  activeTab,
  onTabChange,
  lang,
}: MoreModulesDrawerProps) {
  const t = useTranslation(lang as Language);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 400) {
      onClose();
    }
  };

  const drawerTitle = t('MORE') === 'MORE' ? 'All Modules' : t('MORE');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="fixed bottom-0 left-0 right-0 bg-bg-primary rounded-t-[32px] z-[70] border-t border-border-light/50 shadow-[0_-20px_60px_rgba(0,0,0,0.18)] max-h-[90vh] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3.5 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-9 h-1 bg-border-medium/60 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3.5 flex-shrink-0 border-b border-border-light/40">
              <div>
                <h3 className="text-[17px] font-black text-text-primary tracking-tight">
                  Sovereign Modules
                </h3>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-text-tertiary/60 mt-0.5">
                  Kutumbly OS · {tabs.length} Modules
                </p>
              </div>
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.88 }}
                aria-label="Close modules drawer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-secondary border border-border-light text-text-tertiary hover:text-text-primary hover:border-border-medium transition-all"
              >
                <X size={17} />
              </motion.button>
            </div>

            {/* Modules Grid */}
            <div className="px-4 pt-4 pb-4 overflow-y-auto overscroll-contain scroller-hide flex-1">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const label = getLabel(t, tab.id);

                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        onClose();
                      }}
                      whileTap={{ scale: 0.92 }}
                      aria-label={label}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-gradient-to-br from-gold/15 to-amber-500/10 border-gold/30 shadow-[0_4px_20px_rgba(201,151,28,0.15)]'
                          : 'bg-bg-secondary border-transparent hover:border-border-light active:bg-bg-tertiary'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-12 h-12 rounded-[14px] shadow-sm transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-gold to-amber-600 text-white shadow-md shadow-gold/30'
                          : 'bg-bg-primary text-text-tertiary border border-border-light'
                      }`}>
                        <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className={`text-[10px] font-bold text-center leading-tight line-clamp-2 transition-colors ${
                        isActive ? 'text-gold font-black' : 'text-text-secondary'
                      }`}>
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border-light/30 text-center">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary opacity-30">
                  Zero Cloud · Privacy First · Bharat
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
