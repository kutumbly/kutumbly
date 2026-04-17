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

import { runQuery } from "@/lib/db";
import { DharmaProfile, VillageRoot, RitualLog } from "./types";

export const SanskritiRepository = {
  /**
   * DHARMA PROFILE
   */
  getProfile(db: any): DharmaProfile | null {
    if (!db) return null;
    const rows = runQuery(db, 'SELECT * FROM sanskriti_dharma_profile LIMIT 1');
    if (!rows || rows.length === 0) return null;
    
    const row = rows[0] as any;
    return {
      ...row,
      upadevyas: row.upadevyas ? JSON.parse(row.upadevyas) : [],
    } as DharmaProfile;
  },

  updateProfile(db: any, profile: Partial<DharmaProfile>): void {
    if (!db) return;
    const existing = this.getProfile(db);
    const now = new Date().toISOString();
    
    if (!existing) {
      const id = crypto.randomUUID();
      db.run(
        `INSERT INTO sanskriti_dharma_profile (
          id, gotra, pravar, kuldevta, kuldevi, kulguru, shaakha, veda, upadevyas, is_locked, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          profile.gotra || null,
          profile.pravar || null,
          profile.kuldevta || null,
          profile.kuldevi || null,
          profile.kulguru || null,
          profile.shaakha || null,
          profile.veda || null,
          JSON.stringify(profile.upadevyas || []),
          profile.is_locked || 0,
          now
        ]
      );
    } else {
      const updates: string[] = [];
      const params: any[] = [];
      
      Object.entries(profile).forEach(([key, value]) => {
        if (key === 'id') return;
        updates.push(`${key} = ?`);
        params.push(key === 'upadevyas' ? JSON.stringify(value) : value);
      });
      
      updates.push(`updated_at = ?`);
      params.push(now);
      params.push(existing.id);

      db.run(
        `UPDATE sanskriti_dharma_profile SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }
  },

  /**
   * VILLAGE ROOTS
   */
  getVillageRoots(db: any): VillageRoot[] {
    if (!db) return [];
    return runQuery(db, 'SELECT * FROM sanskriti_village_roots ORDER BY village_name ASC') as VillageRoot[];
  },

  addVillageRoot(db: any, root: Omit<VillageRoot, 'id' | 'updated_at'>): void {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      `INSERT INTO sanskriti_village_roots (
        id, village_name, district, state, gramdevi_name, gramdevi_rituals, sthan_address, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, root.village_name, root.district, root.state, 
        root.gramdevi_name, root.gramdevi_rituals, root.sthan_address, root.notes, now
      ]
    );
  },

  updateVillageRoot(db: any, id: string, root: Partial<VillageRoot>): void {
    if (!db) return;
    const updates: string[] = [];
    const params: any[] = [];
    const now = new Date().toISOString();

    Object.entries(root).forEach(([key, value]) => {
      if (key === 'id') return;
      updates.push(`${key} = ?`);
      params.push(value);
    });

    updates.push(`updated_at = ?`);
    params.push(now);
    params.push(id);

    db.run(`UPDATE sanskriti_village_roots SET ${updates.join(', ')} WHERE id = ?`, params);
  },

  deleteVillageRoot(db: any, id: string): void {
    if (!db) return;
    db.run('DELETE FROM sanskriti_village_roots WHERE id = ?', [id]);
  },

  /**
   * RITUAL LOGS
   */
  getRitualLogs(db: any): RitualLog[] {
    if (!db) return [];
    return runQuery(db, 'SELECT * FROM sanskriti_ritual_logs ORDER BY date DESC, created_at DESC') as RitualLog[];
  },

  addRitualLog(db: any, log: Omit<RitualLog, 'id' | 'created_at'>): void {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      `INSERT INTO sanskriti_ritual_logs (
        id, date, type, name, performer_id, sankalpa_text, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, log.date, log.type, log.name, log.performer_id, log.sankalpa_text, log.notes, now
      ]
    );
  },

  deleteRitualLog(db: any, id: string): void {
    if (!db) return;
    db.run('DELETE FROM sanskriti_ritual_logs WHERE id = ?', [id]);
  }
};
