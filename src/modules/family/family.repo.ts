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
import { FamilyMember } from '@/types/db';
import { runQuery } from '@/lib/db';

/**
 * Family/Identity logic repository using @/core/db
 */
export const familyRepo = {
  getMembers: (db: Database | null): FamilyMember[] => {
    return runQuery<FamilyMember>(db, "SELECT * FROM family_members ORDER BY name ASC");
  },

  getSettings: (db: Database | null): Record<string, string> => {
    if (!db) return {};
    try {
      const res = db.exec("SELECT * FROM settings");
      const settings: Record<string, string> = {};
      res[0]?.values.forEach((v: any[]) => {
        settings[v[0] as string] = v[1] as string;
      });
      return settings;
    } catch {
      return {};
    }
  },

  updateMember: (db: Database | null, id: string, data: Partial<FamilyMember>) => {
    if (!db) return;
    const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(data), id];
    db.run(`UPDATE family_members SET ${sets} WHERE id = ?`, vals);
  }
};
