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

import { DiaryEntry } from '../db';

/**
 * DIARY HUB CONTRACT
 * Defines the public API for the Secure Journaling module.
 */
export interface DiaryContract {
  entries: DiaryEntry[];
  addEntry: (payload: {
    title?: string;
    subtitle?: string;
    content: string;
    tags?: string;
    weather?: string;
    location?: string;
    mood_label?: string;
    is_locked?: boolean;
  }) => void;
  deleteEntry: (id: string) => void;
}
