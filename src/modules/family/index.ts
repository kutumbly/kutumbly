/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { familyRepo } from './family.repo';
import { FamilyMember } from '@/types/db';

/**
 * FAMILY HUB (Identity & Settings)
 * Sealed module for managing family members and sovereign system settings.
 */
export function useFamily() {
  const { db, currentPin, fileHandle, isUnlocked } = useAppStore();
  const [tick, setTick] = useState(0);

  const familyMembers = useMemo(() => {
    if (!isUnlocked) return [];
    return familyRepo.getMembers(db);
  }, [db, isUnlocked, tick]);

  const settings = useMemo(() => {
    if (!isUnlocked) return {};
    return familyRepo.getSettings(db);
  }, [db, isUnlocked, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return {
    familyMembers,
    settings,
    getFamilyMembers: () => familyMembers,
    getSettings: () => settings,
    refresh: () => setTick(t => t + 1)
  };
}
