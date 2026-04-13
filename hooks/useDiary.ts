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
    return runQuery<DiaryEntry>(db, "SELECT * FROM diary_entries ORDER BY date DESC, created_at DESC");
  }, [db, tick]);

  const addEntry = useCallback((payload: Pick<DiaryEntry, 'title'|'subtitle'|'content'|'tags'|'weather'|'location'> & { mood_label?: string, is_locked?: boolean }) => {
    if (!db || !payload.content.trim()) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const date = new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();

    db.run(
      "INSERT INTO diary_entries (id, date, content, mood, mood_label, title, subtitle, tags, weather, location, is_locked, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        date, 
        payload.content.trim(), 
        null, // Optional numeric mood could be added later
        payload.mood_label || null, 
        payload.title || null, 
        payload.subtitle || null, 
        payload.tags || null, 
        payload.weather || null, 
        payload.location || null, 
        payload.is_locked ? 1 : 0, 
        created_at
      ]
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
