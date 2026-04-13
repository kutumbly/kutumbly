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

import { VidyaLearner, VidyaSubject, VidyaResource, VidyaSession, VidyaResourceType } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { useMemo, useCallback, useState } from 'react';

/** Extract YouTube video ID from any standard YouTube URL */
export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
  } catch {}
  return null;
}

/** Auto-generate YouTube thumbnail URL from video URL */
export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function useVidya() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const persist = () => {
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  };

  /* ── LEARNERS ────────────────────────────────────────────── */
  const learners = useMemo<VidyaLearner[]>(() => {
    return runQuery<VidyaLearner>(db, "SELECT * FROM vidya_learners WHERE is_active = 1 ORDER BY name ASC");
  }, [db, tick]);

  const addLearner = useCallback((
    name: string,
    institution: string,
    standard: string,
    board: string,
    goal: string,
    goal_deadline: string,
    family_member_id?: string
  ) => {
    if (!db || !name.trim()) return;
    const id = crypto.randomUUID();
    const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    db.run(
      `INSERT INTO vidya_learners (id, name, family_member_id, institution, standard, board, avatar_initials, goal, goal_deadline, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [id, name.trim(), family_member_id || null, institution || null, standard || null, board || null, initials, goal || null, goal_deadline || null, new Date().toISOString()]
    );
    persist();
    return id;
  }, [db, currentPin, fileHandle]);

  /* ── SUBJECTS ────────────────────────────────────────────── */
  const getSubjects = useCallback((learner_id: string): VidyaSubject[] => {
    return runQuery<VidyaSubject>(db, "SELECT * FROM vidya_subjects WHERE learner_id = ? ORDER BY name ASC", [learner_id]);
  }, [db, tick]);

  const addSubject = useCallback((
    learner_id: string,
    name: string,
    category: string,
    color: string,
    target_score?: string
  ) => {
    if (!db || !name.trim()) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO vidya_subjects (id, learner_id, name, category, color, target_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, learner_id, name.trim(), category || 'General', color || '#c9971c', target_score || null, new Date().toISOString()]
    );
    persist();
    return id;
  }, [db, currentPin, fileHandle]);

  /* ── RESOURCES ───────────────────────────────────────────── */
  const getResources = useCallback((subject_id: string): VidyaResource[] => {
    return runQuery<VidyaResource>(
      db,
      "SELECT * FROM vidya_resources WHERE subject_id = ? ORDER BY is_bookmarked DESC, created_at DESC",
      [subject_id]
    );
  }, [db, tick]);

  const getAllResourcesForLearner = useCallback((learner_id: string): VidyaResource[] => {
    return runQuery<VidyaResource>(
      db,
      "SELECT * FROM vidya_resources WHERE learner_id = ? ORDER BY is_bookmarked DESC, created_at DESC",
      [learner_id]
    );
  }, [db, tick]);

  const addResource = useCallback((
    subject_id: string,
    learner_id: string,
    title: string,
    resource_type: VidyaResourceType,
    url: string,
    chapter?: string,
    lesson?: string,
    description?: string,
    duration_mins?: number,
    difficulty?: 'easy' | 'medium' | 'hard'
  ) => {
    if (!db || !title.trim()) return;
    const id = crypto.randomUUID();

    // Auto-extract YouTube thumbnail
    let thumbnail_url: string | null = null;
    if (resource_type === 'youtube' && url) {
      thumbnail_url = getYouTubeThumbnail(url);
    }

    db.run(
      `INSERT INTO vidya_resources
        (id, subject_id, learner_id, title, resource_type, url, thumbnail_url, description, chapter, lesson, is_bookmarked, is_completed, difficulty, duration_mins, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)`,
      [
        id, subject_id, learner_id, title.trim(), resource_type,
        url || null, thumbnail_url, description || null,
        chapter || null, lesson || null,
        difficulty || 'medium', duration_mins || null,
        new Date().toISOString()
      ]
    );
    persist();
    return id;
  }, [db, currentPin, fileHandle]);

  const toggleBookmark = useCallback((id: string, current: number) => {
    if (!db) return;
    db.run("UPDATE vidya_resources SET is_bookmarked = ? WHERE id = ?", [current ? 0 : 1, id]);
    persist();
  }, [db, currentPin, fileHandle]);

  const toggleComplete = useCallback((id: string, current: number) => {
    if (!db) return;
    db.run("UPDATE vidya_resources SET is_completed = ? WHERE id = ?", [current ? 0 : 1, id]);
    persist();
  }, [db, currentPin, fileHandle]);

  const deleteResource = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM vidya_resources WHERE id = ?", [id]);
    persist();
  }, [db, currentPin, fileHandle]);

  /* ── SESSIONS ────────────────────────────────────────────── */
  const getSessions = useCallback((learner_id: string, limit = 30): VidyaSession[] => {
    return runQuery<VidyaSession>(
      db,
      "SELECT * FROM vidya_sessions WHERE learner_id = ? ORDER BY date DESC LIMIT ?",
      [learner_id, limit]
    );
  }, [db, tick]);

  const logSession = useCallback((
    learner_id: string,
    duration_mins: number,
    subject_id?: string,
    notes?: string,
    mood?: VidyaSession['mood']
  ) => {
    if (!db || !learner_id) return;
    const id = crypto.randomUUID();
    const date = new Date().toISOString().split('T')[0];
    db.run(
      `INSERT INTO vidya_sessions (id, learner_id, subject_id, date, duration_mins, notes, mood, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, learner_id, subject_id || null, date, duration_mins, notes || null, mood || 'neutral', new Date().toISOString()]
    );
    persist();
  }, [db, currentPin, fileHandle]);

  /* ── STATS ───────────────────────────────────────────────── */
  const getStats = useCallback((learner_id: string) => {
    if (!db) return { totalMins: 0, weekMins: 0, subjectCount: 0, resourceCount: 0, completedCount: 0 };

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStr = weekAgo.toISOString().split('T')[0];

    const totalRes = db.exec("SELECT SUM(duration_mins) FROM vidya_sessions WHERE learner_id = ?", [learner_id]);
    const weekRes  = db.exec("SELECT SUM(duration_mins) FROM vidya_sessions WHERE learner_id = ? AND date >= ?", [learner_id, weekStr]);
    const subjRes  = db.exec("SELECT COUNT(*) FROM vidya_subjects WHERE learner_id = ?", [learner_id]);
    const rscRes   = db.exec("SELECT COUNT(*) FROM vidya_resources WHERE learner_id = ?", [learner_id]);
    const doneRes  = db.exec("SELECT COUNT(*) FROM vidya_resources WHERE learner_id = ? AND is_completed = 1", [learner_id]);

    return {
      totalMins:      Number(totalRes[0]?.values?.[0]?.[0] || 0),
      weekMins:       Number(weekRes[0]?.values?.[0]?.[0] || 0),
      subjectCount:   Number(subjRes[0]?.values?.[0]?.[0] || 0),
      resourceCount:  Number(rscRes[0]?.values?.[0]?.[0] || 0),
      completedCount: Number(doneRes[0]?.values?.[0]?.[0] || 0),
    };
  }, [db, tick]);

  return {
    learners,
    addLearner,
    getSubjects,
    addSubject,
    getResources,
    getAllResourcesForLearner,
    addResource,
    toggleBookmark,
    toggleComplete,
    deleteResource,
    getSessions,
    logSession,
    getStats,
  };
}
