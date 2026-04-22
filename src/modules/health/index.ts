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
import { saveVault, mutateVault } from '@/lib/vault';
import { healthRepo } from './health.repo';
import {
  HealthReading, HealthProfile,
  Vaccination, HealthPrescription
} from '@/types/db';

/**
 * HEALTH HUB (Family Wellness & SOS)
 * Sealed module for medical records, vital tracking, and emergency info.
 */
export function useHealth() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const readings      = useMemo(() => healthRepo.getReadings(db),      [db, tick]);
  const vaccinations  = useMemo(() => healthRepo.getVaccinations(db),  [db, tick]);
  const prescriptions = useMemo(() => healthRepo.getPrescriptions(db), [db, tick]);
  const profiles      = useMemo(() => healthRepo.getHealthProfiles(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // ── Vitals ──────────────────────────────────────────────────────────────
  const addReading = useCallback(async (r: Partial<HealthReading>) => {
    await healthRepo.createReading(db, r);
    commit();
  }, [db, commit]);

  const editReading = useCallback(async (id: string, r: Partial<HealthReading>) => {
    await healthRepo.updateReading(db, id, r);
    commit();
  }, [db, commit]);

  const deleteReading = useCallback(async (id: string) => {
    if (!db) return;
    await mutateVault(db, 'DELETE FROM health_readings WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Vaccinations ─────────────────────────────────────────────────────────
  const addVaccination = useCallback(async (v: Partial<Vaccination>) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    await mutateVault(
      db,
      `INSERT INTO health_vaccinations (id, member_id, name, date, provider, next_due_date, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, v.member_id ?? null, v.name ?? '', v.date ?? null,
       v.provider ?? null, v.next_due_date ?? null, v.notes ?? null, new Date().toISOString()]
    );
    commit();
  }, [db, commit]);

  const deleteVaccination = useCallback(async (id: string) => {
    if (!db) return;
    await mutateVault(db, 'DELETE FROM health_vaccinations WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Prescriptions ────────────────────────────────────────────────────────
  const addPrescription = useCallback(async (p: Partial<HealthPrescription>) => {
    await healthRepo.createPrescription(db, p);
    commit();
  }, [db, commit]);

  const stopPrescription = useCallback(async (id: string) => {
    if (!db) return;
    await mutateVault(
      db,
      'UPDATE health_prescriptions SET end_date = ? WHERE id = ?',
      [new Date().toISOString().split('T')[0], id]
    );
    commit();
  }, [db, commit]);

  const deletePrescription = useCallback(async (id: string) => {
    if (!db) return;
    await mutateVault(db, 'DELETE FROM health_prescriptions WHERE id = ?', [id]);
    commit();
  }, [db, commit]);

  // ── Profiles ─────────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (p: Partial<HealthProfile>) => {
    await healthRepo.updateHealthProfile(db, p);
    commit();
  }, [db, commit]);

  return {
    readings, vaccinations, prescriptions,
    profiles,
    addReading, editReading, deleteReading,
    addVaccination, deleteVaccination,
    addPrescription, stopPrescription, deletePrescription,
    updateProfile,
  };
}
