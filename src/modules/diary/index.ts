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
 * SOVEREIGN JOURNAL (Reflections, Activities & Milestones)
 * The digital chronicle of family life. Encrypted and Local-First.
 */
export function useDiary() {
  const { db } = useAppStore();
  const [tick, setTick] = useState(0);

  // Memoized query results
  const entries = useMemo(() => diaryRepo.getEntries(db), [db, tick]);

  /**
   * Add a new entry to the chronicle.
   * Automatically triggers vault persistence.
   */
  const addEntry = useCallback(async (entry: Partial<DiaryEntry>) => {
    if (!db) return;
    await diaryRepo.createEntry(db, entry);
    setTick(t => t + 1);
  }, [db]);

  /**
   * Remove an entry.
   */
  const deleteEntry = useCallback(async (id: string) => {
    if (!db) return;
    await diaryRepo.deleteEntry(db, id);
    setTick(t => t + 1);
  }, [db]);

  return {
    entries,
    addEntry,
    deleteEntry,
    refresh: () => setTick(t => t + 1)
  };
}
