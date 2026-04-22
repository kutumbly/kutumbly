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

import { Database } from 'sql.js';
import { runQuery } from '@/lib/db';
import { mutateVault } from '@/lib/vault';
import { DiaryEntry } from '@/types/db';

/**
 * DIARY HUB REPOSITORY
 * Pure SQL operations for Journaling and Memory management.
 */

export const diaryRepo = {
  getEntries: (db: Database | null): DiaryEntry[] => {
    if (!db) return [];
    return runQuery<DiaryEntry>(db, "SELECT * FROM diary_entries ORDER BY date DESC, created_at DESC");
  },

  createEntry: async (db: Database | null, entry: any) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const date = new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();

    await mutateVault(
      db,
      "INSERT INTO diary_entries (id, date, content, mood, mood_label, title, subtitle, tags, weather, location, is_locked, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        date, 
        entry.content.trim(), 
        null, 
        entry.mood_label || null, 
        entry.title || null, 
        entry.subtitle || null, 
        entry.tags || null, 
        entry.weather || null, 
        entry.location || null, 
        entry.is_locked ? 1 : 0, 
        created_at
      ]
    );
    return id;
  },

  deleteEntry: async (db: Database | null, id: string) => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM diary_entries WHERE id = ?", [id]);
  }
};
