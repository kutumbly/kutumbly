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

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { utsavRepo } from './utsav.repo';
import { UtsavEvent, UtsavShagun } from '@/types/db';
import { useUtsavEngine } from './engine';
import { useScanner } from './scanner';

export { useUtsavEngine, useScanner };


/**
 * UTSAV HUB (Nevata Management)
 * The Sovereign family event and shagun (gift) ledger.
 */
export function useUtsav() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const stats = useMemo(() => utsavRepo.getStats(db), [db, tick]);
  const events = useMemo(() => utsavRepo.getEvents(db), [db, tick]);
  const familyLedger = useMemo(() => utsavRepo.getFamilyLedger(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addEvent = useCallback((event: Omit<UtsavEvent, 'id' | 'created_at' | 'status'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    const newEvent: UtsavEvent = {
        ...event,
        id,
        status: 'pending',
        created_at
    };

    utsavRepo.createEvent(db, newEvent);
    commit();
  }, [db, commit]);

  const addShagun = useCallback((shagun: Omit<UtsavShagun, 'id' | 'created_at' | 'is_confirmed'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    const newShagun: UtsavShagun = {
        ...shagun,
        id,
        is_confirmed: true,
        created_at
    };

    utsavRepo.createShagun(db, newShagun);
    
    // Auto-update family ledger
    const ev = events.find(e => e.id === shagun.event_id);
    if (ev) {
        utsavRepo.updateFamilyLedger(db, ev.family_name, shagun.amount, shagun.direction === 'given' ? 'given' : 'received');
    }

    commit();
  }, [db, events, commit]);

  const updateStatus = useCallback((id: string, status: string) => {
    utsavRepo.updateEventStatus(db, id, status);
    commit();
  }, [db, commit]);

  const getShagunList = useCallback((eventId: string) => {
    return utsavRepo.getShagunForEvent(db, eventId);
  }, [db]);

  const getDebtInfo = useCallback((familyName: string) => {
    return utsavRepo.getHistoricalDebt(db, familyName);
  }, [db]);

  return {
    events,
    stats,
    familyLedger,
    addEvent,
    addShagun,
    updateStatus,
    getShagunList,
    getDebtInfo
  };
}
