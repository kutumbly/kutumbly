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
import { FamilyTask } from '@/types/db';
import { runQuery } from '@/lib/db';

/**
 * Tasks logic repository using @/core/db
 */
export const tasksRepo = {
  getTasks: (db: Database | null): FamilyTask[] => {
    return runQuery<FamilyTask>(db, `
      SELECT * FROM tasks 
      ORDER BY 
        CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        due_date ASC
    `);
  },

  createTask: (db: Database | null, task: Omit<FamilyTask, 'id' | 'created_at' | 'status'>): string => {
    if (!db) return '';
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    db.run(
      `INSERT INTO tasks (id, title, description, priority, status, category, assigned_to, due_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, task.title, task.description || null, task.priority, 'pending', task.category || 'Home', task.assigned_to, task.due_date || null, created_at]
    );
    return id;
  },

  updateStatus: (db: Database | null, id: string, newStatus: string) => {
    if (!db) return;
    const completedAt = newStatus === 'done' ? new Date().toISOString() : null;
    db.run(
      "UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",
      [newStatus, completedAt, id]
    );
  },

  deleteTask: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("DELETE FROM tasks WHERE id = ?", [id]);
  }
};
