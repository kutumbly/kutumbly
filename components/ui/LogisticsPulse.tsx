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
import { motion } from 'framer-motion';

export default function LogisticsPulse() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 4 Corner Markers */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-2xl" />

      {/* Scanning Line */}
      <motion.div 
        animate={{ y: ["0%", "400%", "0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_15px_rgba(212,175,55,1)]"
      />

      {/* Overlay darkening with slight opacity in center */}
      <div className="absolute inset-0 border-[4rem] border-black/40 backdrop-blur-[2px]" />
    </div>
  );
}
