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

import { useAppStore } from '@/lib/store';
import { FamilyMember } from '@/types/db';
import { runQuery } from '@/lib/db';

export function useVault() {
  const { db, activeVault, isUnlocked, lockVault } = useAppStore();

  const getSettings = () => {
    if (!db) return {};
    try {
      const res = db.exec("SELECT * FROM settings");
      const settings: Record<string, string> = {};
      res[0]?.values.forEach((v: any[]) => {
        settings[v[0] as string] = v[1] as string;
      });
      return settings;
    } catch {
      return {};
    }
  };

  const getFamilyMembers = (): FamilyMember[] => {
    if (!db) return [];
    return runQuery<FamilyMember>(db, "SELECT * FROM family_members ORDER BY name ASC");
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
