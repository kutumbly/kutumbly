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

import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export function useVault() {
  const { db, activeVault, isUnlocked, lockVault } = useAppStore();

  const getSettings = () => {
    if (!db) return {};
    try {
      const res = db.exec("SELECT * FROM settings");
      const settings: Record<string, string> = {};
      res[0]?.values.forEach(v => {
        settings[v[0] as string] = v[1] as string;
      });
      return settings;
    } catch {
      return {};
    }
  };

  const getFamilyMembers = () => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM family_members");
      return res[0]?.values.map(v => ({
        id: v[0],
        name: v[1],
        role: v[2],
        dob: v[3],
        initials: v[4]
      })) || [];
    } catch {
      return [];
    }
  };

  return {
    db,
    activeVault,
    isUnlocked,
    lock: lockVault,
    getSettings,
    getFamilyMembers,
  };
}
