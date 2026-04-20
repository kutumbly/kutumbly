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
  const vaccinations = useMemo(() => healthRepo.getVaccinations(db), [db, tick]);
  const prescriptions = useMemo(() => healthRepo.getPrescriptions(db), [db, tick]);
  const healthProfiles = useMemo(() => healthRepo.getHealthProfiles(db), [db, tick]);
  const advancedProfiles = useMemo(() => healthRepo.getAdvancedProfiles(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addReading = useCallback((r: Partial<HealthReading>) => {
    healthRepo.createReading(db, r);
    commit();
  }, [db, commit]);

  const editReading = useCallback((id: string, r: Partial<HealthReading>) => {
    healthRepo.updateReading(db, id, r);
    commit();
  }, [db, commit]);

  const updateHealthProfile = useCallback((p: Partial<HealthProfile>) => {
    healthRepo.updateSOSProfile(db, p);
    commit();
  }, [db, commit]);

  return {
    readings,
    medications,
    vaccinations, 
    prescriptions,
    healthProfiles,
    advancedProfiles,
    addReading,
    editReading,
    updateHealthProfile,
    deleteReading: (id: string) => { db?.run("DELETE FROM health_readings WHERE id = ?", [id]); commit(); },
    addMedication: (m: Partial<Medication>) => { /* implementation */ commit(); },
    stopMedication: (id: string) => { /* implementation */ commit(); },
    deleteMedication: (id: string) => { /* implementation */ commit(); },
    addVaccination: (v: Partial<Vaccination>) => { /* implementation */ commit(); },
    deleteVaccination: (id: string) => { /* implementation */ commit(); },
    addPrescription: (p: Partial<HealthPrescription>) => { /* implementation */ commit(); },
    stopPrescription: (id: string) => { /* implementation */ commit(); },
    deletePrescription: (id: string) => { /* implementation */ commit(); },
    updateAdvancedProfile: (ap: Partial<HealthAdvancedProfile>) => { /* implementation */ commit(); }
  };
}
