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

"use client";

import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { HealthReading, Medication } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useMemo, useCallback, useState } from 'react';

export function useHealth() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const readings = useMemo<HealthReading[]>(() => {
    return runQuery<HealthReading>(db, "SELECT * FROM health_readings ORDER BY date DESC LIMIT 100");
  }, [db, tick]);

  const medications = useMemo<Medication[]>(() => {
    return runQuery<Medication>(db, "SELECT * FROM medications ORDER BY start_date DESC");
  }, [db, tick]);

  const addReading = useCallback((member_id: string, bp_sys: number, bp_dia: number, sugar: number, pulse: number, weight: number, notes: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const date = new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();
    
    db.run(
      "INSERT INTO health_readings (id, member_id, date, bp_systolic, bp_diastolic, blood_sugar, pulse, weight, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, member_id, date, bp_sys, bp_dia, sugar, pulse, weight, notes, created_at]
    );

    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { readings, medications, addReading };
}
