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
import { VidyaLearner, VidyaSubject, VidyaResource, VidyaSession } from '@/types/db';

/**
 * VIDYA HUB REPOSITORY
 * Pure SQL operations for Learning and Education management.
 */

export const vidyaRepo = {
  getLearners: (db: Database | null): VidyaLearner[] => {
    if (!db) return [];
    return runQuery<VidyaLearner>(db, "SELECT * FROM vidya_learners WHERE is_active = 1 ORDER BY name ASC");
  },

  getSubjects: (db: Database | null, learner_id: string): VidyaSubject[] => {
    if (!db) return [];
    return runQuery<VidyaSubject>(db, "SELECT * FROM vidya_subjects WHERE learner_id = ? ORDER BY name ASC", [learner_id]);
  },

  getResources: (db: Database | null, subject_id: string): VidyaResource[] => {
    if (!db) return [];
    return runQuery<VidyaResource>(
      db,
      "SELECT * FROM vidya_resources WHERE subject_id = ? ORDER BY is_bookmarked DESC, created_at DESC",
      [subject_id]
    );
  },

  createLearner: async (db: Database | null, l: any) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const initials = l.name.trim().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
    await mutateVault(
      db,
      `INSERT INTO vidya_learners (id, name, family_member_id, institution, standard, board, avatar_initials, goal, goal_deadline, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [id, l.name.trim(), l.family_member_id || null, l.institution || null, l.standard || null, l.board || null, initials, l.goal || null, l.goal_deadline || null, new Date().toISOString()]
    );
    return id;
  },

  recordSession: async (db: Database | null, s: any) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const date = new Date().toISOString().split('T')[0];
    await mutateVault(
      db,
      `INSERT INTO vidya_sessions (id, learner_id, subject_id, date, duration_mins, notes, mood, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, s.learner_id, s.subject_id || null, date, s.duration_mins, s.notes || null, s.mood || 'neutral', new Date().toISOString()]
    );
    return id;
  },

  getSessions: (db: Database | null, learner_id: string, limit = 30): VidyaSession[] => {
    if (!db) return [];
    return runQuery<VidyaSession>(
      db,
      "SELECT * FROM vidya_sessions WHERE learner_id = ? ORDER BY date DESC LIMIT ?",
      [learner_id, limit]
    );
  },

  updateResourceStatus: async (db: Database | null, id: string, field: 'is_bookmarked' | 'is_completed', value: number) => {
    if (!db) return;
    await mutateVault(db, `UPDATE vidya_resources SET ${field} = ? WHERE id = ?`, [value, id]);
  },

  updateLearner: async (db: Database | null, id: string, updates: any) => {
    if (!db) return;
    await mutateVault(
      db,
      "UPDATE vidya_learners SET name = ?, institution = ?, standard = ?, board = ?, goal = ?, goal_deadline = ? WHERE id = ?",
      [updates.name, updates.institution, updates.standard, updates.board, updates.goal, updates.goal_deadline, id]
    );
  }
};
