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
import { 
  HealthReading, Vaccination, 
  HealthProfile, HealthPrescription 
} from '@/types/db';

/**
 * HEALTH HUB REPOSITORY
 * Pure SQL operations for Health, Medication, and Medical History.
 */

export const healthRepo = {
  getReadings: (db: Database | null): HealthReading[] => {
    if (!db) return [];
    return runQuery<HealthReading>(db, "SELECT * FROM health_readings ORDER BY date DESC, created_at DESC LIMIT 100");
  },

  getVaccinations: (db: Database | null): Vaccination[] => {
    if (!db) return [];
    return runQuery<Vaccination>(db, "SELECT * FROM health_vaccinations ORDER BY date DESC");
  },

  getPrescriptions: (db: Database | null): HealthPrescription[] => {
    if (!db) return [];
    return runQuery<HealthPrescription>(db, "SELECT * FROM health_prescriptions ORDER BY start_date DESC");
  },

  getHealthProfiles: (db: Database | null): HealthProfile[] => {
    if (!db) return [];
    return runQuery<HealthProfile>(db, "SELECT * FROM health_profiles");
  },

  getHealthProfileByMember: (db: Database | null, memberId: string): HealthProfile | null => {
    if (!db) return null;
    const rows = runQuery<HealthProfile>(db, "SELECT * FROM health_profiles WHERE member_id = ? LIMIT 1", [memberId]);
    return rows[0] || null;
  },

  createReading: async (db: Database | null, r: Partial<HealthReading>) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const activeDate = r.date || new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();
    await mutateVault(
      db,
      "INSERT INTO health_readings (id, member_id, date, bp_systolic, bp_diastolic, blood_sugar, pulse, weight, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, r.member_id ?? null, activeDate, r.bp_systolic ?? null, r.bp_diastolic ?? null, r.blood_sugar ?? null, r.pulse ?? null, r.weight ?? null, r.notes ?? null, created_at]
    );
    return id;
  },

  updateReading: async (db: Database | null, id: string, r: Partial<HealthReading>) => {
    if (!db) return;
    await mutateVault(
      db,
      "UPDATE health_readings SET member_id = COALESCE(?, member_id), date = COALESCE(?, date), bp_systolic = COALESCE(?, bp_systolic), bp_diastolic = COALESCE(?, bp_diastolic), blood_sugar = COALESCE(?, blood_sugar), pulse = COALESCE(?, pulse), weight = COALESCE(?, weight), notes = COALESCE(?, notes) WHERE id = ?",
      [r.member_id ?? null, r.date ?? null, r.bp_systolic ?? null, r.bp_diastolic ?? null, r.blood_sugar ?? null, r.pulse ?? null, r.weight ?? null, r.notes ?? null, id]
    );
  },

  updateHealthProfile: async (db: Database | null, p: Partial<HealthProfile>) => {
    if (!db || !p.member_id) return;
    const updated_at = new Date().toISOString();
    const existing = runQuery<HealthProfile>(db, "SELECT * FROM health_profiles WHERE member_id = ?", [p.member_id]);
    
    if (existing.length > 0) {
      const setChunks: string[] = [];
      const params: any[] = [];
      
      Object.entries(p).forEach(([key, val]) => {
        if (key !== 'member_id' && val !== undefined) {
          setChunks.push(`${key} = ?`);
          params.push(val);
        }
      });
      
      if (setChunks.length === 0) return;
      
      setChunks.push("updated_at = ?");
      params.push(updated_at);
      params.push(p.member_id);
      
      await mutateVault(
        db,
        `UPDATE health_profiles SET ${setChunks.join(', ')} WHERE member_id = ?`,
        params
      );
    } else {
      const columns = ['member_id', 'updated_at'];
      const values: any[] = [p.member_id, updated_at];
      
      Object.entries(p).forEach(([key, val]) => {
        if (key !== 'member_id' && val !== undefined) {
          columns.push(key);
          values.push(val);
        }
      });
      
      const placeholders = columns.map(() => '?').join(', ');
      await mutateVault(
        db,
        `INSERT INTO health_profiles (${columns.join(', ')}) VALUES (${placeholders})`,
        values
      );
    }
  },

  createPrescription: async (db: Database | null, p: Partial<HealthPrescription>) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const created_at = new Date().toISOString();
    await mutateVault(
      db,
      `INSERT INTO health_prescriptions (
        id, member_id, doctor_name, generic_name, brand_name, medicine_type, 
        dosage, schedule_code, meal_instruction, purpose, start_date, end_date, 
        stock_remaining, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, p.member_id || 'unknown', p.doctor_name ?? null, p.generic_name || 'Unknown', p.brand_name ?? null, p.medicine_type || 'Tablet',
        p.dosage ?? null, p.schedule_code || '1-0-1', p.meal_instruction ?? null, p.purpose ?? null, 
        p.start_date || new Date().toISOString().split('T')[0], p.end_date ?? null, p.stock_remaining ?? 0, p.notes ?? null, created_at
      ]
    );
    return id;
  }
};
