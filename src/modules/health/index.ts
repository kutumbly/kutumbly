/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
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

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { healthRepo } from './health.repo';
import {
  HealthReading, Medication, HealthProfile,
  Vaccination, HealthPrescription, HealthAdvancedProfile
} from '@/types/db';

/**
 * HEALTH HUB (Family Wellness & SOS)
 * Sealed module for medical records, vital tracking, and emergency info.
 */
export function useHealth() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const readings         = useMemo(() => healthRepo.getReadings(db),         [db, tick]);
  const medications      = useMemo(() => healthRepo.getMedications(db),      [db, tick]);
  const vaccinations     = useMemo(() => healthRepo.getVaccinations(db),     [db, tick]);
  const prescriptions    = useMemo(() => healthRepo.getPrescriptions(db),    [db, tick]);
  const healthProfiles   = useMemo(() => healthRepo.getHealthProfiles(db),   [db, tick]);
  const advancedProfiles = useMemo(() => healthRepo.getAdvancedProfiles(db), [db, tick]);

  /** Persist then re-render */
  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // ── Vitals ──────────────────────────────────────────────────────────────
  const addReading = useCallback((r: Partial<HealthReading>) => {
    healthRepo.createReading(db, r);
    commit();
  }, [db, commit]);

  const editReading = useCallback((id: string, r: Partial<HealthReading>) => {
    healthRepo.updateReading(db, id, r);
    commit();
  }, [db, commit]);

  const deleteReading = useCallback((id: string) => {
    db?.run('DELETE FROM health_readings WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Medications ─────────────────────────────────────────────────────────
  const addMedication = useCallback((m: Partial<Medication>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO health_medications (id, member_id, name, dosage, frequency, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, m.member_id ?? null, m.name ?? '', m.dosage ?? null, m.frequency ?? null,
       m.start_date ?? new Date().toISOString().split('T')[0], m.end_date ?? null]
    );
    commit();
  }, [db, commit]);

  const stopMedication = useCallback((id: string) => {
    db?.run(
      'UPDATE health_medications SET end_date = ? WHERE id = ?',
      [new Date().toISOString().split('T')[0], id]
    );
    commit();
  }, [db, commit]);

  const deleteMedication = useCallback((id: string) => {
    db?.run('DELETE FROM health_medications WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Vaccinations ─────────────────────────────────────────────────────────
  const addVaccination = useCallback((v: Partial<Vaccination>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO health_vaccinations (id, member_id, name, date, provider, next_due_date, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, v.member_id ?? null, v.name ?? '', v.date ?? null,
       v.provider ?? null, v.next_due_date ?? null, v.notes ?? null, new Date().toISOString()]
    );
    commit();
  }, [db, commit]);

  const deleteVaccination = useCallback((id: string) => {
    db?.run('DELETE FROM health_vaccinations WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Prescriptions ────────────────────────────────────────────────────────
  const addPrescription = useCallback((p: Partial<HealthPrescription>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO health_prescriptions
         (id, member_id, doctor_name, generic_name, brand_name, medicine_type,
          dosage, schedule_code, meal_instruction, purpose, start_date, end_date,
          stock_remaining, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, p.member_id ?? null, p.doctor_name ?? null, p.generic_name ?? '',
       p.brand_name ?? null, p.medicine_type ?? 'Tablet', p.dosage ?? null,
       p.schedule_code ?? '1-0-1', p.meal_instruction ?? 'PC', p.purpose ?? null,
       p.start_date ?? new Date().toISOString().split('T')[0], p.end_date ?? null,
       p.stock_remaining ?? 0, p.notes ?? null, new Date().toISOString()]
    );
    commit();
  }, [db, commit]);

  const stopPrescription = useCallback((id: string) => {
    db?.run(
      'UPDATE health_prescriptions SET end_date = ? WHERE id = ?',
      [new Date().toISOString().split('T')[0], id]
    );
    commit();
  }, [db, commit]);

  const deletePrescription = useCallback((id: string) => {
    db?.run('DELETE FROM health_prescriptions WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Profiles ─────────────────────────────────────────────────────────────
  const updateHealthProfile = useCallback((p: Partial<HealthProfile>) => {
    healthRepo.updateSOSProfile(db, p);
    commit();
  }, [db, commit]);

  const updateAdvancedProfile = useCallback((ap: Partial<HealthAdvancedProfile>) => {
    if (!db || !ap.member_id) return;
    const updated_at = new Date().toISOString();
    db.run(
      `INSERT INTO health_advanced_profiles
         (member_id, prakriti, agni, diet, surgical_history, family_history, current_treatment, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(member_id) DO UPDATE SET
         prakriti=excluded.prakriti, agni=excluded.agni, diet=excluded.diet,
         surgical_history=excluded.surgical_history, family_history=excluded.family_history,
         current_treatment=excluded.current_treatment, updated_at=excluded.updated_at`,
      [ap.member_id, ap.prakriti ?? null, ap.agni ?? null, ap.diet ?? null,
       ap.surgical_history ?? null, ap.family_history ?? null,
       ap.current_treatment ?? null, updated_at]
    );
    commit();
  }, [db, commit]);

  return {
    readings, medications, vaccinations, prescriptions,
    healthProfiles, advancedProfiles,
    addReading, editReading, deleteReading,
    addMedication, stopMedication, deleteMedication,
    addVaccination, deleteVaccination,
    addPrescription, stopPrescription, deletePrescription,
    updateHealthProfile, updateAdvancedProfile,
  };
}
