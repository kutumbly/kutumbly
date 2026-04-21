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
import { diaryRepo } from './diary.repo';
import { DiaryEntry } from '@/types/db';

/**
 * DIARY HUB (Memory & Journal)
 * Sealed module for preserving family history and daily thoughts.
 */
export function useDiary() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const entries = useMemo(() => diaryRepo.getEntries(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addEntry = useCallback((entry: any) => {
    const id = diaryRepo.createEntry(db, entry);
    commit();
  }, [db, commit]);

  const deleteEntry = useCallback((id: string) => {
    diaryRepo.deleteEntry(db, id);
    commit();
  }, [db, commit]);

  return {
    entries,
    addEntry,
    deleteEntry
  };
}
