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

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { healthRepo } from './health.repo';
import { HealthReading, Medication, HealthProfile, Vaccination, HealthPrescription, HealthAdvancedProfile } from '@/types/db';

/**
 * HEALTH HUB (Family Wellness & SOS)
 * Sealed module for medical records, vital tracking, and emergency info.
 */
export function useHealth() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const readings = useMemo(() => healthRepo.getReadings(db), [db, tick]);
  const medications = useMemo(() => healthRepo.getMedications(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addReading = useCallback((r: any) => {
    const id = healthRepo.createReading(db, r);
    commit();
  }, [db, commit]);

  const editReading = useCallback((id: string, r: any) => {
    healthRepo.updateReading(db, id, r);
    commit();
  }, [db, commit]);

  const updateHealthProfile = useCallback((p: any) => {
    healthRepo.updateSOSProfile(db, p);
    commit();
  }, [db, commit]);

  return {
    readings,
    medications,
    vaccinations: [] as Vaccination[], 
    prescriptions: [] as HealthPrescription[],
    healthProfiles: [] as HealthProfile[],
    advancedProfiles: [] as HealthAdvancedProfile[],
    addReading,
    editReading,
    updateHealthProfile,
    deleteReading: (id: any) => { db?.run("DELETE FROM health_readings WHERE id = ?", [id]); commit(); },
    addMedication: (m: any) => { /* implementation */ commit(); },
    stopMedication: (id: any) => { /* implementation */ commit(); },
    deleteMedication: (id: any) => { /* implementation */ commit(); },
    addVaccination: (v: any) => { /* implementation */ commit(); },
    deleteVaccination: (id: any) => { /* implementation */ commit(); },
    addPrescription: (p: any) => { /* implementation */ commit(); },
    stopPrescription: (id: any) => { /* implementation */ commit(); },
    deletePrescription: (id: any) => { /* implementation */ commit(); },
    updateAdvancedProfile: (ap: any) => { /* implementation */ commit(); }
  };
}
