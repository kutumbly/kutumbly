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
    // Swipe down >= 80px velocity or 120px drag to dismiss
    if (info.offset.y > 120 || info.velocity.y > 400) {
      onClose();
    }
  };

  const drawerTitle =
    lang === 'bho' ? 'सभे मॉड्यूल' :
    lang === 'hi'  ? 'सारे मॉड्यूल' :
    lang === 'mr'  ? 'सर्व मॉड्यूल्स' :
    lang === 'gu'  ? 'બધા મોડ્યૂલ' :
    lang === 'pa'  ? 'ਸਾਰੇ ਮੌਡਿਊਲ' :
    lang === 'ta'  ? 'அனைத்து தொகுதிகள்' :
    'Sovereign Modules';

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer — swipe-to-dismiss enabled */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 400 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 bg-bg-primary rounded-t-[28px] z-[70] border-t border-border-light shadow-2xl max-h-[88vh] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-border-medium rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 border-b border-border-light/40">
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight">{drawerTitle}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mt-0.5">
                  Kutumbly OS · All Modules
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modules drawer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-secondary text-text-tertiary hover:text-text-primary active:scale-90 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modules Grid — scrollable */}
            <div className="px-5 pt-4 pb-4 overflow-y-auto overscroll-contain scroller-hide flex-1">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const label = t(`NAV_${tab.id.toUpperCase()}`);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        onClose();
                      }}
                      aria-label={label}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex flex-col items-center gap-2.5 p-3.5 rounded-2xl transition-all border active:scale-95 ${
                        isActive
                          ? 'bg-gold/8 border-gold/40 text-gold shadow-[0_0_16px_rgba(201,151,28,0.12)]'
                          : 'bg-bg-secondary border-transparent text-text-secondary active:bg-bg-tertiary'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${
                        isActive ? 'bg-gold text-white shadow-md shadow-gold/20' : 'bg-bg-primary text-text-tertiary shadow-sm'
                      }`}>
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className="text-[10px] font-bold text-center leading-tight line-clamp-2">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border-light/40 text-center">
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
