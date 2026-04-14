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

import React from 'react';
import SovereignMediaBridge from '@/components/common/SovereignMediaBridge';

/**
 * Advanced Rich Content Parser — Sovereign Edition
 * ───────────────────────────────────────────────
 * Detects URLs and separates them into:
 * 1. In-line text links (preserves reading flow)
 * 2. Appendix Media Cards (rich visual context at the bottom)
 */
export function parseRichContent(text: string) {
  if (!text) return null;
  
  // URL Detection Regex
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Collect all unique URLs for the appendix
  const urls: string[] = Array.from(text.matchAll(urlRegex)).map(match => match[0]);
  const uniqueUrls = Array.from(new Set(urls));
  
  const textContent = text.split('\n').map((para, i) => {
    if (!para.trim()) return <br key={i} />;
    
    // Split paragraph by URL to handle in-line link rendering
    const parts = para.split(urlRegex);
    
    return (
      <div key={i} className="rich-content-paragraph mb-2">
        {parts.map((part, pi) => {
          if (part.match(urlRegex)) {
            return (
              <a 
                key={pi} 
                href={part} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold hover:underline underline-offset-4 decoration-gold/30 font-black"
              >
                {part.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
              </a>
            );
          }
          return <span key={pi}>{part}</span>;
        })}
      </div>
    );
  });

  return (
    <div className="sovereign-rich-content">
      {/* ── Primary Text Flow ────────── */}
      <div className="rich-text-body">
        {textContent}
      </div>

      {/* ── Media Appendix ────────── */}
      {uniqueUrls.length > 0 && (
        <div className="media-appendix mt-8 space-y-4 pt-6 border-t border-border-light/20">
          <div className="flex items-center gap-3 mb-4 opacity-40">
            <div className="h-px flex-1 bg-border-light"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-text-tertiary">Media Bridge</span>
            <div className="h-px flex-1 bg-border-light"></div>
          </div>
          {uniqueUrls.map((url, idx) => (
            <SovereignMediaBridge key={idx} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}
