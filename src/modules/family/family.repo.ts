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
import { mutateVault } from '@/lib/vault';

/**
 * Family/Identity logic repository using @/core/db
 */
export const familyRepo = {
  getMembers: (db: Database | null): FamilyMember[] => {
    return runQuery<FamilyMember>(db, "SELECT * FROM family_members ORDER BY name ASC");
  },

  getSettings: (db: Database | null): Record<string, string> => {
    if (!db) return {};
    const res = runQuery<{key: string; value: string}>(db, "SELECT * FROM settings");
    const settings: Record<string, string> = {};
    res.forEach(item => {
      settings[item.key] = item.value;
    });
    return settings;
  },

  createMember: async (db: Database | null, member: Omit<FamilyMember, 'id' | 'is_active'>) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    await mutateVault(
      db,
      "INSERT INTO family_members (id, name, role, dob, avatar_initials, is_active) VALUES (?, ?, ?, ?, ?, 1)",
      [id, member.name, member.role || null, member.dob || null, member.avatar_initials || member.name[0].toUpperCase()]
    );
    return id;
  },

  updateMember: async (db: Database | null, id: string, data: Partial<FamilyMember>) => {
    if (!db) return;
    const sets = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(data), id];
    await mutateVault(db, `UPDATE family_members SET ${sets} WHERE id = ?`, vals);
  },

  deleteMember: async (db: Database | null, id: string) => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM family_members WHERE id = ?", [id]);
  }
};
