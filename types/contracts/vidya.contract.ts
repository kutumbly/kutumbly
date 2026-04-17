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

import { 
  VidyaLearner, 
  VidyaSubject, 
  VidyaResource, 
  VidyaSession, 
  VidyaResourceType 
} from '../db';

/**
 * VIDYA HUB CONTRACT
 * Defines the public API for the Learning & Education module.
 */
export interface VidyaContract {
  // Learners
  learners: VidyaLearner[];
  addLearner: (
    name: string,
    institution: string,
    standard: string,
    board: string,
    goal: string,
    goal_deadline: string,
    family_member_id?: string
  ) => Promise<string | undefined> | string | undefined;
  editLearner: (id: string, updates: Partial<VidyaLearner>) => void;
  deleteLearner: (id: string) => void;

  // Subjects
  getSubjects: (learner_id: string) => VidyaSubject[];
  addSubject: (
    learner_id: string,
    name: string,
    category: string,
    color: string,
    target_score?: string
  ) => Promise<string | undefined> | string | undefined;
  editSubject: (id: string, updates: Partial<VidyaSubject>) => void;
  deleteSubject: (id: string) => void;

  // Resources
  getResources: (subject_id: string) => VidyaResource[];
  getAllResourcesForLearner: (learner_id: string) => VidyaResource[];
  addResource: (
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
  ) => Promise<string | undefined> | string | undefined;
  editResource: (id: string, updates: Partial<VidyaResource>) => void;
  toggleBookmark: (id: string, current: number) => void;
  toggleComplete: (id: string, current: number) => void;
  deleteResource: (id: string) => void;

  // Sessions
  getSessions: (learner_id: string, limit?: number) => VidyaSession[];
  logSession: (
    learner_id: string,
    duration_mins: number,
    subject_id?: string,
    notes?: string,
    mood?: VidyaSession['mood']
  ) => void;
  deleteSession: (id: string) => void;

  // Analytics
  getStats: (learner_id: string) => { totalMins: number; completedCount: number; resourceCount: number };
  getStreak: (learner_id: string) => number;
  getAnalytics: (learner_id: string) => Array<{ date: string; mins: number; label: string }>;
  getSubjectProgress: (subject_id: string) => number;
}
