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

export function useStaff() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const staff = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM staff_members ORDER BY name ASC");
      return res[0]?.values.map(v => ({
        id: v[0],
        name: v[1],
        role: v[2],
        salary: Number(v[3]),
        join_date: v[4],
        phone: v[5],
      })) || [];
    } catch { return []; }
  }, [db, tick]);

  const payments = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM salary_payments ORDER BY paid_on DESC LIMIT 50");
      return res[0]?.values.map(v => ({
        id: v[0],
        staff_id: v[1],
        month: v[2],
        gross: Number(v[3]),
        deductions: Number(v[4]),
        net: Number(v[5]),
        paid_on: v[6],
        advance: Number(v[7]),
      })) || [];
    } catch { return []; }
  }, [db, tick]);

  const attendance = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM attendance ORDER BY date DESC LIMIT 200");
      return res[0]?.values.map(v => ({
        id: v[0],
        staff_id: v[1],
        date: v[2],
        status: v[3],
        notes: v[4],
      })) || [];
    } catch { return []; }
  }, [db, tick]);

  const addStaff = useCallback((name: string, role: string, monthly_salary: number, phone: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const join_date = new Date().toISOString().split('T')[0];
    
    db.run(
      "INSERT INTO staff_members (id, name, role, monthly_salary, join_date, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, role, monthly_salary, join_date, phone]
    );

    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const removeStaff = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM staff_members WHERE id = ?", [id]);
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const paySalary = useCallback((staff_id: string, month: string, gross: number, net: number, advance: number) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const paid_on = new Date().toISOString().split('T')[0];
    db.run(
      "INSERT INTO salary_payments (id, staff_id, month, gross, deductions, net, paid_on, advance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, staff_id, month, gross, gross - net, net, paid_on, advance]
    );
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { staff, payments, attendance, addStaff, removeStaff, paySalary };
}
