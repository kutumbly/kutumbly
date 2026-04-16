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
import { saveVault } from '@/lib/vault';
import { FamilyTask } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useMemo, useCallback, useState } from 'react';

export function useTasks() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const tasks = useMemo<FamilyTask[]>(() => {
    return runQuery<FamilyTask>(db, `
      SELECT * FROM tasks 
      ORDER BY 
        CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        due_date ASC
    `);
  }, [db, tick]);

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
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addTask = useCallback((task: Omit<FamilyTask, 'id' | 'created_at' | 'status'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    db.run(
      `INSERT INTO tasks (id, title, description, priority, status, category, assigned_to, due_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, task.title, task.description || null, task.priority, 'pending', task.category || 'Home', task.assigned_to, task.due_date || null, created_at]
    );

    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deleteTask = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM tasks WHERE id = ?", [id]);
    
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { tasks, toggleTask, addTask, deleteTask };
}
