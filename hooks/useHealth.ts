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

import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { useMemo, useCallback, useState } from 'react';

export function useHealth() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const readings = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM health_readings ORDER BY date DESC LIMIT 100");
      return res[0]?.values.map(v => ({
        id: v[0],
        member_id: v[1],
        date: v[2],
        bp_systolic: Number(v[3]),
        bp_diastolic: Number(v[4]),
        blood_sugar: Number(v[5]),
        pulse: Number(v[6]),
        weight: Number(v[7]),
        notes: v[8],
        created_at: v[9],
      })) || [];
    } catch {
      return [];
    }
  }, [db, tick]);

  const medications = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM medications ORDER BY start_date DESC");
      return res[0]?.values.map(v => ({
        id: v[0],
        member_id: v[1],
        name: v[2],
        dosage: v[3],
        frequency: v[4],
        start_date: v[5],
        end_date: v[6],
      })) || [];
    } catch {
      return [];
    }
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

  return { readings, addReading };
}
