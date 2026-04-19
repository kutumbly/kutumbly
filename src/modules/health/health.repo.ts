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

import { Database } from 'sql.js';
import { runQuery } from '@/lib/db';
import { 
  HealthReading, Medication, Vaccination, 
  HealthProfile, HealthAdvancedProfile, HealthPrescription 
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

  getMedications: (db: Database | null): Medication[] => {
    if (!db) return [];
    return runQuery<Medication>(db, "SELECT * FROM health_medications ORDER BY start_date DESC");
  },

  createReading: (db: Database | null, r: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const activeDate = r.date || new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();
    db.run(
      "INSERT INTO health_readings (id, member_id, date, bp_systolic, bp_diastolic, blood_sugar, pulse, weight, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, r.member_id, activeDate, r.bp_sys, r.bp_dia, r.sugar, r.pulse, r.weight, r.notes, created_at]
    );
    return id;
  },

  updateReading: (db: Database | null, id: string, r: any) => {
    if (!db) return;
    const now = new Date().toISOString();
    db.run(
      `UPDATE health_readings SET 
        bp_systolic = ?, bp_diastolic = ?, blood_sugar = ?, 
        pulse = ?, weight = ?, notes = ?, date = ?, 
        created_at = ? 
      WHERE id = ?`,
      [r.bp_sys, r.bp_dia, r.sugar, r.pulse, r.weight, r.notes, r.date, now, id]
    );
  },

  updateSOSProfile: (db: Database | null, p: any) => {
    if (!db) return;
    const updated_at = new Date().toISOString();
    const existing = runQuery<HealthProfile>(db, "SELECT * FROM health_profiles WHERE member_id = ?", [p.member_id]);
    
    if (existing.length > 0) {
      db.run(
        `UPDATE health_profiles SET 
          blood_group = ?, allergies = ?, chronic_conditions = ?, 
          primary_doctor = ?, emergency_contact = ?, insurance_details = ?, 
          updated_at = ? 
        WHERE member_id = ?`,
        [p.bloodGroup, p.allergies, p.chronic, p.doctor, p.emergencyContact, p.insurance, updated_at, p.member_id]
      );
    } else {
      const id = crypto.randomUUID();
      db.run(
        `INSERT INTO health_profiles (
          id, member_id, blood_group, allergies, chronic_conditions, 
          primary_doctor, emergency_contact, insurance_details, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, p.member_id, p.bloodGroup, p.allergies, p.chronic, p.doctor, p.emergencyContact, p.insurance, updated_at]
      );
    }
  }
};
