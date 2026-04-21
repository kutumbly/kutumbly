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

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { SanskritiRepository } from './sanskriti.repo';
import { DharmaProfile, VillageRoot, RitualLog } from './types';

export function useSanskriti() {
  const { db, fileHandle, currentPin } = useAppStore();
  const [tick, setTick] = useState(0);

  const profile = useMemo(() => SanskritiRepository.getProfile(db), [db, tick]);
  const roots = useMemo(() => SanskritiRepository.getVillageRoots(db), [db, tick]);
  const logs = useMemo(() => SanskritiRepository.getRitualLogs(db), [db, tick]);
  
  const loading = !db;

  // Persistence Helper
  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, fileHandle, currentPin]);

  /** 
   * Actions 
   */
  const updateProfile = useCallback((p: Partial<DharmaProfile>) => {
    SanskritiRepository.updateProfile(db, p);
    commit();
  }, [db, commit]);

  const addVillageRoot = useCallback((r: Omit<VillageRoot, 'id' | 'updated_at'>) => {
    SanskritiRepository.addVillageRoot(db, r);
    commit();
  }, [db, commit]);

  const updateVillageRoot = useCallback((id: string, r: Partial<VillageRoot>) => {
    SanskritiRepository.updateVillageRoot(db, id, r);
    commit();
  }, [db, commit]);

  const deleteVillageRoot = useCallback((id: string) => {
    SanskritiRepository.deleteVillageRoot(db, id);
    commit();
  }, [db, commit]);

  const logRitual = useCallback((l: Omit<RitualLog, 'id' | 'created_at'>) => {
    SanskritiRepository.addRitualLog(db, l);
    commit();
  }, [db, commit]);

  const deleteRitualLog = useCallback((id: string) => {
    SanskritiRepository.deleteRitualLog(db, id);
    commit();
  }, [db, commit]);

  return {
    profile,
    roots,
    logs,
    loading,
    actions: {
      updateProfile,
      addVillageRoot,
      updateVillageRoot,
      deleteVillageRoot,
      logRitual,
      deleteRitualLog
    }
  };
}
