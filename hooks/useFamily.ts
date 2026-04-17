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
import { runQuery } from '@/lib/db';
import { FamilyMember } from '@/types/db';
import { useMemo } from 'react';

export function useFamily() {
  const { db, isUnlocked } = useAppStore();

  return useMemo<FamilyMember[]>(() => {
    if (!db || !isUnlocked) return [];
    try {
      return runQuery<FamilyMember>(db, "SELECT * FROM family_members ORDER BY name ASC");
    } catch (e) {
      console.error("Failed to fetch family members:", e);
      return [];
    }
  }, [db, isUnlocked]);
}
