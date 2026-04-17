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

/**
 * HEALTH MODULE — REPOSITORY LAYER
 * ─────────────────────────────────────────────────────────────
 * ALL database SQL for the Health module lives here and ONLY here.
 * No component or service may call db.exec() — they go through this repo.
 * ─────────────────────────────────────────────────────────────
 */

import { runQuery, fetchOne, withTransaction } from '@/src/core/db';
import { saveVault } from '@/lib/vault';
import type {
  HealthReading,
  HealthMedication,
  HealthVaccination,
  HealthMedicalProfile,
  HealthAdvancedProfile,
  MedicalPrescription,
} from '@/types/contracts/health.contract';

export const healthRepo = {

  // ── Readings ─────────────────────────────────────────────
  getReadings(db: any, memberId: string): HealthReading[] {
    return runQuery<HealthReading>(db,
      'SELECT * FROM health_readings WHERE member_id = ? ORDER BY reading_date DESC',
      [memberId]
    );
  },

  insertReading(db: any, r: Omit<HealthReading, 'id' | 'created_at'>): string {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      'INSERT INTO health_readings (id, member_id, reading_date, weight, bp_systolic, bp_diastolic, blood_sugar, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, r.member_id, r.reading_date, r.weight ?? null, r.bp_systolic ?? null, r.bp_diastolic ?? null, r.blood_sugar ?? null, r.notes ?? null, now]
    );
    return id;
  },

  updateReading(db: any, id: string, r: Partial<HealthReading>): void {
    db.run(
      'UPDATE health_readings SET weight=?, bp_systolic=?, bp_diastolic=?, blood_sugar=?, notes=? WHERE id=?',
      [r.weight ?? null, r.bp_systolic ?? null, r.bp_diastolic ?? null, r.blood_sugar ?? null, r.notes ?? null, id]
    );
  },

  deleteReading(db: any, id: string): void {
    db.run('DELETE FROM health_readings WHERE id=?', [id]);
  },

  // ── Prescriptions ─────────────────────────────────────────
  getPrescriptions(db: any, memberId: string): MedicalPrescription[] {
    return runQuery<MedicalPrescription>(db,
      'SELECT * FROM medical_prescriptions WHERE member_id = ? ORDER BY created_at DESC',
      [memberId]
    );
  },

  insertPrescription(db: any, p: Omit<MedicalPrescription, 'id' | 'created_at'>): string {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      'INSERT INTO medical_prescriptions (id, member_id, doctor_name, generic_name, brand_name, medicine_type, dosage, schedule_code, meal_instruction, purpose, start_date, end_date, stock_remaining, notes, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [id, p.member_id, p.doctor_name ?? null, p.generic_name, p.brand_name ?? null, p.medicine_type, p.dosage ?? null, p.schedule_code, p.meal_instruction, p.purpose ?? null, p.start_date, p.end_date ?? null, p.stock_remaining ?? 0, p.notes ?? null, now]
    );
    return id;
  },

  stopPrescription(db: any, id: string): void {
    const today = new Date().toISOString().split('T')[0];
    db.run('UPDATE medical_prescriptions SET end_date = ? WHERE id = ?', [today, id]);
  },

  deletePrescription(db: any, id: string): void {
    db.run('DELETE FROM medical_prescriptions WHERE id=?', [id]);
  },

  // ── Medications (legacy) ──────────────────────────────────
  getMedications(db: any, memberId: string): HealthMedication[] {
    return runQuery<HealthMedication>(db,
      'SELECT * FROM medications WHERE member_id = ? ORDER BY created_at DESC',
      [memberId]
    );
  },

  insertMedication(db: any, m: Omit<HealthMedication, 'id' | 'created_at'>): string {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      'INSERT INTO medications (id, member_id, name, dosage, frequency, start_date, end_date, notes, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
      [id, m.member_id, m.name, m.dosage ?? null, m.frequency ?? null, m.start_date ?? null, m.end_date ?? null, m.notes ?? null, now]
    );
    return id;
  },

  stopMedication(db: any, id: string): void {
    const today = new Date().toISOString().split('T')[0];
    db.run('UPDATE medications SET end_date = ? WHERE id = ?', [today, id]);
  },

  deleteMedication(db: any, id: string): void {
    db.run('DELETE FROM medications WHERE id=?', [id]);
  },

  // ── Vaccinations ──────────────────────────────────────────
  getVaccinations(db: any, memberId: string): HealthVaccination[] {
    return runQuery<HealthVaccination>(db,
      'SELECT * FROM vaccinations WHERE member_id = ? ORDER BY date_given DESC',
      [memberId]
    );
  },

  insertVaccination(db: any, v: Omit<HealthVaccination, 'id' | 'created_at'>): string {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      'INSERT INTO vaccinations (id, member_id, vaccine_name, date_given, next_due, notes, created_at) VALUES (?,?,?,?,?,?,?)',
      [id, v.member_id, v.vaccine_name, v.date_given, v.next_due ?? null, v.notes ?? null, now]
    );
    return id;
  },

  deleteVaccination(db: any, id: string): void {
    db.run('DELETE FROM vaccinations WHERE id=?', [id]);
  },

  // ── Medical Profile ───────────────────────────────────────
  getMedicalProfile(db: any, memberId: string): HealthMedicalProfile | null {
    return fetchOne<HealthMedicalProfile>(db,
      'SELECT * FROM health_profiles WHERE member_id = ? LIMIT 1',
      [memberId]
    );
  },

  upsertMedicalProfile(db: any, memberId: string, profile: Partial<HealthMedicalProfile>): void {
    const existing = fetchOne<{ id: string }>(db, 'SELECT id FROM health_profiles WHERE member_id=?', [memberId]);
    const now = new Date().toISOString();
    if (existing) {
      db.run(
        'UPDATE health_profiles SET blood_group=?, allergies=?, chronic_conditions=?, emergency_contact=?, insurance_info=?, updated_at=? WHERE member_id=?',
        [profile.blood_group ?? null, profile.allergies ?? null, profile.chronic_conditions ?? null, profile.emergency_contact ?? null, profile.insurance_info ?? null, now, memberId]
      );
    } else {
      const id = crypto.randomUUID();
      db.run(
        'INSERT INTO health_profiles (id, member_id, blood_group, allergies, chronic_conditions, emergency_contact, insurance_info, updated_at) VALUES (?,?,?,?,?,?,?,?)',
        [id, memberId, profile.blood_group ?? null, profile.allergies ?? null, profile.chronic_conditions ?? null, profile.emergency_contact ?? null, profile.insurance_info ?? null, now]
      );
    }
  },

  // ── Advanced Ayurvedic Profile ────────────────────────────
  getAdvancedProfile(db: any, memberId: string): HealthAdvancedProfile | null {
    return fetchOne<HealthAdvancedProfile>(db,
      'SELECT * FROM health_advanced_profiles WHERE member_id=? LIMIT 1',
      [memberId]
    );
  },

  upsertAdvancedProfile(db: any, memberId: string, profile: Partial<HealthAdvancedProfile>): void {
    const existing = fetchOne<{ id: string }>(db, 'SELECT id FROM health_advanced_profiles WHERE member_id=?', [memberId]);
    const now = new Date().toISOString();
    if (existing) {
      db.run(
        'UPDATE health_advanced_profiles SET prakriti=?, agni=?, ahaar=?, current_regimen=?, updated_at=? WHERE member_id=?',
        [profile.prakriti ?? null, profile.agni ?? null, profile.ahaar ?? null, profile.current_regimen ?? null, now, memberId]
      );
    } else {
      const id = crypto.randomUUID();
      db.run(
        'INSERT INTO health_advanced_profiles (id, member_id, prakriti, agni, ahaar, current_regimen, updated_at) VALUES (?,?,?,?,?,?,?)',
        [id, memberId, profile.prakriti ?? null, profile.agni ?? null, profile.ahaar ?? null, profile.current_regimen ?? null, now]
      );
    }
  },

  // ── Persist ───────────────────────────────────────────────
  persist(db: any, currentPin: string | null, fileHandle: FileSystemFileHandle | null): void {
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
  },
};
