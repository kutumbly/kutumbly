/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { vidyaRepo } from './vidya.repo';
import { VidyaLearner, VidyaSubject, VidyaResource, VidyaSession, VidyaResourceType } from '@/types/db';
import { runQuery } from '@/core/db';

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

/**
 * VIDYA HUB (Learning & Education)
 * Sealed module for managing students, subjects, and study resources.
 */
export function useVidya() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const learners = useMemo(() => vidyaRepo.getLearners(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addLearner = useCallback((l: Omit<VidyaLearner, 'id' | 'is_active' | 'created_at' | 'avatar_initials'>) => {
    const id = vidyaRepo.createLearner(db, l);
    commit();
  }, [db, commit]);

  const getSubjects = useCallback((learner_id: string) => vidyaRepo.getSubjects(db, learner_id), [db, tick]);
  
  const addSubject = useCallback((learner_id: string, s: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO vidya_subjects (id, learner_id, name, category, color, target_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, learner_id, s.name.trim(), s.category || 'General', s.color || '#c9971c', s.target_score || null, new Date().toISOString()]
    );
    commit();
  }, [db, commit]);

  const getResources = useCallback((subject_id: string) => vidyaRepo.getResources(db, subject_id), [db, tick]);

  const addResource = useCallback((subject_id: string, learner_id: string, r: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    let thumbnail_url = null;
    if (r.resource_type === 'youtube' && r.url) thumbnail_url = getYouTubeThumbnail(r.url);

    db.run(
      `INSERT INTO vidya_resources
        (id, subject_id, learner_id, title, resource_type, url, thumbnail_url, description, chapter, lesson, is_bookmarked, is_completed, difficulty, duration_mins, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)`,
      [id, subject_id, learner_id, r.title.trim(), r.resource_type, r.url || null, thumbnail_url, r.description || null, r.chapter || null, r.lesson || null, r.difficulty || 'medium', r.duration_mins || null, new Date().toISOString()]
    );
    commit();
  }, [db, commit]);

  const logSession = useCallback((learner_id: string, s: any) => {
    vidyaRepo.recordSession(db, { ...s, learner_id });
    commit();
  }, [db, commit]);

  const getStats = useCallback((learner_id: string) => {
    if (!db) return { totalMins: 0, completedCount: 0, resourceCount: 0 };
    const sessionRes = db.exec("SELECT SUM(duration_mins) FROM vidya_sessions WHERE learner_id = ?", [learner_id]);
    const completedRes = db.exec("SELECT COUNT(*) FROM vidya_resources WHERE learner_id = ? AND is_completed = 1", [learner_id]);
    const resourceRes = db.exec("SELECT COUNT(*) FROM vidya_resources WHERE learner_id = ?", [learner_id]);

    return {
      totalMins: Number(sessionRes[0]?.values?.[0]?.[0] || 0),
      completedCount: Number(completedRes[0]?.values?.[0]?.[0] || 0),
      resourceCount: Number(resourceRes[0]?.values?.[0]?.[0] || 0)
    };
  }, [db, tick]);

  const getStreak = useCallback((learner_id: string): number => {
    if (!db) return 0;
    const res = db.exec("SELECT DISTINCT date FROM vidya_sessions WHERE learner_id = ? ORDER BY date DESC", [learner_id]);
    if (!res[0]?.values?.length) return 0;
    const dates = res[0].values.map((v: any) => v[0] as string);
    let streak = 0;
    const expectedDate = new Date();
    const toDateStr = (d: Date) => d.toISOString().split('T')[0];
    if (dates[0] !== toDateStr(expectedDate)) {
      expectedDate.setDate(expectedDate.getDate() - 1);
      if (dates[0] !== toDateStr(expectedDate)) return 0;
    }
    for (const dStr of dates) {
      if (dStr === toDateStr(expectedDate)) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else break;
    }
    return streak;
  }, [db, tick]);

  return {
    learners,
    addLearner,
    getSubjects,
    addSubject,
    getResources,
    addResource,
    logSession,
    getStats,
    getStreak,
    deleteLearner: (id: any) => { db?.run("UPDATE vidya_learners SET is_active = 0 WHERE id = ?", [id]); commit(); },
    toggleBookmark: (id: any, curr: any) => { vidyaRepo.updateResourceStatus(db, id, 'is_bookmarked', curr ? 0 : 1); commit(); },
    toggleComplete: (id: any, curr: any) => { vidyaRepo.updateResourceStatus(db, id, 'is_completed', curr ? 0 : 1); commit(); },


    editLearner: (id: string, updates: any) => {
      vidyaRepo.updateLearner(db, id, updates);
      commit();
    },
    editSubject: (id: string, updates: any) => {
      if (!db) return;
      db.run(
        "UPDATE vidya_subjects SET name = ?, category = ?, color = ?, target_score = ? WHERE id = ?",
        [updates.name, updates.category, updates.color, updates.target_score, id]
      );
      commit();
    },
    editResource: (id: string, r: any) => {
      if (!db) return;
      let thumbnail_url = undefined;
      if (r.resource_type === 'youtube' && r.url) thumbnail_url = getYouTubeThumbnail(r.url);
      
      db.run(
        `UPDATE vidya_resources SET 
          title = ?, resource_type = ?, url = ?, thumbnail_url = COALESCE(?, thumbnail_url), 
          description = ?, chapter = ?, lesson = ?, difficulty = ?, duration_mins = ? 
        WHERE id = ?`,
        [r.title, r.resource_type, r.url, thumbnail_url, r.description, r.chapter, r.lesson, r.difficulty, r.duration_mins, id]
      );
      commit();
    },
    deleteSubject: (id: string) => {
      db?.run("DELETE FROM vidya_subjects WHERE id = ?", [id]);
      commit();
    },
    deleteResource: (id: string) => {
      db?.run("DELETE FROM vidya_resources WHERE id = ?", [id]);
      commit();
    },
    getAnalytics: (learner_id: string) => {
      if (!db) return [];
      const res = db.exec(`
        SELECT date, SUM(duration_mins) 
        FROM vidya_sessions 
        WHERE learner_id = ? 
        GROUP BY date 
        ORDER BY date DESC LIMIT 7
      `, [learner_id]);
      
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const raw = res[0]?.values || [];
      return raw.map((v: any) => ({
        label: weekdays[new Date(v[0]).getDay()],
        mins: Number(v[1])
      })).reverse();
    },
    getSubjectProgress: (subject_id: string) => {
      if (!db) return 0;
      const res = db.exec("SELECT COUNT(*), SUM(is_completed) FROM vidya_resources WHERE subject_id = ?", [subject_id]);
      const total = Number(res[0]?.values?.[0]?.[0] || 0);
      const done = Number(res[0]?.values?.[0]?.[1] || 0);
      return total ? Math.round((done / total) * 100) : 0;
    },
  };
}


