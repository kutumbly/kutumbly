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

export function parseRichContent(text: string) {
  if (!text) return null;
  
  // URL Detection Regex
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.split('\n').map((para, i) => {
    if (!para.trim()) return <br key={i} />;
    
    const parts = para.split(urlRegex);
    
    return (
      <div key={i} className="rich-content-paragraph">
        {parts.map((part, pi) => {
          if (part.match(urlRegex)) {
            return <SovereignMediaBridge key={pi} url={part} />;
          }
          return <span key={pi}>{part}</span>;
        })}
      </div>
    );
  });
}
