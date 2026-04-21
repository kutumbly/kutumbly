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

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Language } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGE_MAP: Record<Language, { name: string; native: string }> = {
  en: { name: "English", native: "English" },
  hi: { name: "Hindi", native: "हिन्दी" },
  mr: { name: "Marathi", native: "मराठी" },
  gu: { name: "Gujarati", native: "ગુજરાતી" },
  pa: { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  ta: { name: "Tamil", native: "தமிழ்" },
  bho: { name: "Bhojpuri", native: "भोजपुरी" },
  kn: { name: "Kannada", native: "ಕನ್ನಡ" },
  te: { name: "Telugu", native: "తెలుగు" },
  ne: { name: "Nepali", native: "नेपाली" },
  bn: { name: "Bengali", native: "বাংলা" },
  mni: { name: "Manipuri", native: "মৈতৈলোন" },
};

export default function LanguageSelector() {
  const { lang, setLang } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, right: 0 });

  // Update position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      
      if (isMobile) {
        // On mobile, position above the button if it's near the bottom, 
        // but typically selectors are in headers, so we set it below.
        setCoords({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      } else {
        setCoords({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (l: Language) => {
    setLang(l);
    setIsOpen(false);
  };

  const currentLang = LANGUAGE_MAP[lang] || LANGUAGE_MAP.en;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-light bg-bg-secondary/50 backdrop-blur-md hover:bg-bg-secondary transition-all active:scale-95 group"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-text-tertiary group-hover:text-gold transition-colors" />
        <span className="text-xs font-medium text-text-primary hidden sm:inline">
          {currentLang.native}
        </span>
        <ChevronDown className={`w-3 h-3 text-text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="rounded-2xl border border-border-light bg-bg-secondary/95 backdrop-blur-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            right: `${coords.right}px`,
            width: '14rem', // w-56
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: 9999,
          }}
        >
          <div className="grid grid-cols-1 gap-1">
            {(Object.keys(LANGUAGE_MAP) as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleSelect(l)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all group ${
                  lang === l 
                    ? 'bg-gold/10 text-gold' 
                    : 'hover:bg-bg-primary text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold leading-tight">{LANGUAGE_MAP[l].native}</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-widest">{LANGUAGE_MAP[l].name}</span>
                </div>
                {lang === l && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
