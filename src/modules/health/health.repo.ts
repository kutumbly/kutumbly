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

  getAdvancedProfiles: (db: Database | null): HealthAdvancedProfile[] => {
    if (!db) return [];
    return runQuery<HealthAdvancedProfile>(db, "SELECT * FROM health_advanced_profiles");
  },

  createReading: (db: Database | null, r: Partial<HealthReading>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const activeDate = r.date || new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();
    db.run(
      "INSERT INTO health_readings (id, member_id, date, bp_systolic, bp_diastolic, blood_sugar, pulse, weight, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, r.member_id ?? null, activeDate, r.bp_systolic ?? null, r.bp_diastolic ?? null, r.blood_sugar ?? null, r.pulse ?? null, r.weight ?? null, r.notes ?? null, created_at]
    );
    return id;
  },

  updateReading: (db: Database | null, id: string, r: Partial<HealthReading>) => {
    if (!db) return;
    db.run(
      "UPDATE health_readings SET member_id = COALESCE(?, member_id), date = COALESCE(?, date), bp_systolic = COALESCE(?, bp_systolic), bp_diastolic = COALESCE(?, bp_diastolic), blood_sugar = COALESCE(?, blood_sugar), pulse = COALESCE(?, pulse), weight = COALESCE(?, weight), notes = COALESCE(?, notes) WHERE id = ?",
      [r.member_id ?? null, r.date ?? null, r.bp_systolic ?? null, r.bp_diastolic ?? null, r.blood_sugar ?? null, r.pulse ?? null, r.weight ?? null, r.notes ?? null, id]
    );
  },

  updateSOSProfile: (db: Database | null, p: Partial<HealthProfile>) => {
    if (!db || !p.member_id) return;
    const updated_at = new Date().toISOString();
    const existing = runQuery<HealthProfile>(db, "SELECT * FROM health_profiles WHERE member_id = ?", [p.member_id]);
    
    if (existing.length > 0) {
      db.run(
        `UPDATE health_profiles SET 
          blood_group = ?, allergies = ?, chronic_conditions = ?, 
          primary_doctor = ?, emergency_contact = ?, insurance_details = ?, 
          updated_at = ? 
        WHERE member_id = ?`,
        [p.blood_group ?? null, p.allergies ?? null, p.chronic_conditions ?? null, p.primary_doctor ?? null, p.emergency_contact ?? null, p.insurance_details ?? null, updated_at, p.member_id]
      );
    } else {
      const id = crypto.randomUUID();
      db.run(
        `INSERT INTO health_profiles (
          id, member_id, blood_group, allergies, chronic_conditions, 
          primary_doctor, emergency_contact, insurance_details, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, p.member_id, p.blood_group ?? null, p.allergies ?? null, p.chronic_conditions ?? null, p.primary_doctor ?? null, p.emergency_contact ?? null, p.insurance_details ?? null, updated_at]
      );
    }
  }
};
