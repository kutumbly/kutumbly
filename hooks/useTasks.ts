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
import { saveVault } from '@/lib/vault';
import { useMemo, useCallback } from 'react';

export function useTasks() {
  const { db, currentPin, fileHandle } = useAppStore();

  const tasks = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec(`
        SELECT * FROM tasks 
        ORDER BY 
          CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
          due_date ASC
      `);
      return res[0]?.values.map(v => ({
        id: v[0],
        title: v[1],
        description: v[2],
        priority: v[3],
        status: v[4],
        assigned_to: v[5],
        due_date: v[6],
        created_at: v[7],
        completed_at: v[8]
      })) || [];
    } catch {
      return [];
    }
  }, [db]);

  const toggleTask = useCallback((id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    const completedAt = newStatus === 'done' ? new Date().toISOString() : null;
    db.run(
      "UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",
      [newStatus, completedAt, id]
    );
    // Persist to file if handle and pin are available
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
  }, [db, currentPin, fileHandle]);

  return { tasks, toggleTask };
}
