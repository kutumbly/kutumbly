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

import { DiaryEntry } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { useMemo, useCallback, useState } from 'react';

export function useDiary() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const entries = useMemo<DiaryEntry[]>(() => {
    return runQuery<DiaryEntry>(db, "SELECT * FROM diary_entries ORDER BY date DESC");
  }, [db, tick]);

  const addEntry = useCallback((content: string, mood_label?: string) => {
    if (!db || !content.trim()) return;
    const id = crypto.randomUUID();
    const date = new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();

    db.run(
      "INSERT INTO diary_entries (id, date, content, mood_label, created_at) VALUES (?, ?, ?, ?, ?)",
      [id, date, content.trim(), mood_label || null, created_at]
    );

    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deleteEntry = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM diary_entries WHERE id = ?", [id]);
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { entries, addEntry, deleteEntry };
}
