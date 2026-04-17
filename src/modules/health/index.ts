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
 * HEALTH MODULE — PUBLIC INDEX (API SURFACE)
 * ─────────────────────────────────────────────────────────────
 * This is the ONLY file other parts of the app may import from.
 * If it's not exported here, it's internal and private.
 *
 * Usage:
 *   import { useHealth } from '@/src/modules/health';
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { eventBus } from '@/src/core/events/bus';
import { healthRepo } from './health.repo';
import type {
  HealthReading,
  HealthMedication,
  HealthVaccination,
  HealthMedicalProfile,
  HealthAdvancedProfile,
  MedicalPrescription,
} from '@/types/contracts/health.contract';

// Re-export public types from this module's surface
export type {
  HealthReading,
  HealthMedication,
  HealthVaccination,
  HealthMedicalProfile,
  HealthAdvancedProfile,
  MedicalPrescription,
};

export function useHealth(memberId: string) {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const bump = () => setTick(t => t + 1);

  // ── Queries (reactive via tick) ───────────────────────────
  const readings = useMemo(() =>
    memberId ? healthRepo.getReadings(db, memberId) : [],
    [db, memberId, tick]
  );

  const medications = useMemo(() =>
    memberId ? healthRepo.getMedications(db, memberId) : [],
    [db, memberId, tick]
  );

  const prescriptions = useMemo(() =>
    memberId ? healthRepo.getPrescriptions(db, memberId) : [],
    [db, memberId, tick]
  );

  const vaccinations = useMemo(() =>
    memberId ? healthRepo.getVaccinations(db, memberId) : [],
    [db, memberId, tick]
  );

  const medicalProfiles = useMemo(() =>
    memberId ? (healthRepo.getMedicalProfile(db, memberId) ? [healthRepo.getMedicalProfile(db, memberId)!] : []) : [],
    [db, memberId, tick]
  );

  const advancedProfiles = useMemo(() =>
    memberId ? (healthRepo.getAdvancedProfile(db, memberId) ? [healthRepo.getAdvancedProfile(db, memberId)!] : []) : [],
    [db, memberId, tick]
  );

  // ── Mutations ─────────────────────────────────────────────
  const addReading = useCallback((r: Omit<HealthReading, 'id' | 'created_at'>) => {
    if (!db || !memberId) return;
    healthRepo.insertReading(db, r);
    healthRepo.persist(db, currentPin, fileHandle);
    eventBus.emit('health.reading.added', { memberId, type: 'general', value: 0 });
    bump();
  }, [db, memberId, currentPin, fileHandle]);

  const editReading = useCallback((id: string, r: Partial<HealthReading>) => {
    if (!db) return;
    healthRepo.updateReading(db, id, r);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const deleteReading = useCallback((id: string) => {
    if (!db) return;
    healthRepo.deleteReading(db, id);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const addMedication = useCallback((m: Omit<HealthMedication, 'id' | 'created_at'>) => {
    if (!db || !memberId) return;
    healthRepo.insertMedication(db, m);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, memberId, currentPin, fileHandle]);

  const stopMedication = useCallback((id: string) => {
    if (!db) return;
    healthRepo.stopMedication(db, id);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const deleteMedication = useCallback((id: string) => {
    if (!db) return;
    healthRepo.deleteMedication(db, id);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const addPrescription = useCallback((p: Omit<MedicalPrescription, 'id' | 'created_at'>) => {
    if (!db || !memberId) return;
    healthRepo.insertPrescription(db, p);
    healthRepo.persist(db, currentPin, fileHandle);
    eventBus.emit('health.rx.added', { memberId, genericName: p.generic_name });
    bump();
  }, [db, memberId, currentPin, fileHandle]);

  const stopPrescription = useCallback((id: string) => {
    if (!db) return;
    healthRepo.stopPrescription(db, id);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const deletePrescription = useCallback((id: string) => {
    if (!db) return;
    healthRepo.deletePrescription(db, id);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const addVaccination = useCallback((v: Omit<HealthVaccination, 'id' | 'created_at'>) => {
    if (!db || !memberId) return;
    healthRepo.insertVaccination(db, v);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, memberId, currentPin, fileHandle]);

  const deleteVaccination = useCallback((id: string) => {
    if (!db) return;
    healthRepo.deleteVaccination(db, id);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, currentPin, fileHandle]);

  const updateMedicalProfile = useCallback((profile: Partial<HealthMedicalProfile>) => {
    if (!db || !memberId) return;
    healthRepo.upsertMedicalProfile(db, memberId, profile);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, memberId, currentPin, fileHandle]);

  const updateAdvancedProfile = useCallback((profile: Partial<HealthAdvancedProfile>) => {
    if (!db || !memberId) return;
    healthRepo.upsertAdvancedProfile(db, memberId, profile);
    healthRepo.persist(db, currentPin, fileHandle);
    bump();
  }, [db, memberId, currentPin, fileHandle]);

  return {
    readings,
    medications,
    prescriptions,
    vaccinations,
    medicalProfiles,
    advancedProfiles,
    addReading, editReading, deleteReading,
    addMedication, stopMedication, deleteMedication,
    addPrescription, stopPrescription, deletePrescription,
    addVaccination, deleteVaccination,
    updateMedicalProfile,
    updateAdvancedProfile,
  };
}
