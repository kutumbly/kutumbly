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

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glow?: 'gold' | 'red' | 'green' | 'blue' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const glowMap = {
  gold:  'hover:border-gold/40 hover:shadow-gold/10',
  red:   'hover:border-red-400/40 hover:shadow-red-500/10',
  green: 'hover:border-green-400/40 hover:shadow-green-500/10',
  blue:  'hover:border-blue-400/40 hover:shadow-blue-500/10',
  none:  '',
};

const padMap = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
  xl:   'p-10',
};

export default function GlassCard({
  children,
  className = '',
  onClick,
  hover = false,
  glow = 'none',
  padding = 'md',
}: GlassCardProps) {
  const base = [
    'bg-bg-primary border border-border-light rounded-[2rem]',
    'shadow-xl shadow-black/[0.025]',
    'transition-all duration-200',
    padMap[padding],
    hover || onClick ? [
      'cursor-pointer',
      'hover:shadow-2xl hover:shadow-black/[0.04]',
      '-translate-y-0 hover:-translate-y-0.5',
      glowMap[glow] || glowMap.none,
    ].join(' ') : '',
    className,
  ].filter(Boolean).join(' ');

  if (onClick || hover) {
    return (
      <motion.div
        onClick={onClick}
        whileTap={{ scale: 0.99 }}
        className={base}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
