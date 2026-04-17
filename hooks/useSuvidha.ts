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

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { runQuery } from '@/lib/db';
import { saveVault } from '@/lib/vault';
import { UtilityVendor, UtilityLog, UtilityPayment } from '@/types/db';

export function useSuvidha() {
  const { db, fileHandle, currentPin, isUnlocked } = useAppStore();
  const [tick, setTick] = useState(0);

  // --- Data Fetching ---
  const vendors = useMemo<UtilityVendor[]>(() => {
    if (!db || !isUnlocked) return [];
    return runQuery<UtilityVendor>(db, "SELECT * FROM utility_vendors WHERE is_active = 1 ORDER BY name ASC");
  }, [db, tick, isUnlocked]);

  const logs = useMemo<UtilityLog[]>(() => {
    if (!db || !isUnlocked) return [];
    return runQuery<UtilityLog>(db, "SELECT * FROM utility_logs ORDER BY date DESC");
  }, [db, tick, isUnlocked]);

  const payments = useMemo<UtilityPayment[]>(() => {
    if (!db || !isUnlocked) return [];
    return runQuery<UtilityPayment>(db, "SELECT * FROM utility_payments ORDER BY date DESC");
  }, [db, tick, isUnlocked]);

  const persist = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle);
    }
    setTick(t => t + 1);
  }, [db, fileHandle, currentPin]);

  // --- Vendor Actions ---
  const addVendor = useCallback((v: Omit<UtilityVendor, 'id' | 'created_at' | 'is_active'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO utility_vendors (id, name, type, rate_per_unit, billing_cycle_day, member_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
      [id, v.name, v.type, v.rate_per_unit, v.billing_cycle_day, v.member_id, now]
    );
    persist();
  }, [db, persist]);

  const archiveVendor = useCallback((id: string) => {
    if (!db) return;
    db.run("UPDATE utility_vendors SET is_active = 0 WHERE id = ?", [id]);
    persist();
  }, [db, persist]);

  // --- Logging Actions ---
  const logDaily = useCallback((vId: string, date: string, quantity: number, notes?: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // UPSERT style: delete if exists for this vendor/date combo
    db.run("DELETE FROM utility_logs WHERE vendor_id = ? AND date = ?", [vId, date]);
    
    db.run(
      "INSERT INTO utility_logs (id, vendor_id, date, quantity, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, vId, date, quantity, notes || null, now]
    );
    persist();
  }, [db, persist]);

  const deleteLog = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM utility_logs WHERE id = ?", [id]);
    persist();
  }, [db, persist]);

  // --- Payment Actions ---
  const recordPayment = useCallback((p: Omit<UtilityPayment, 'id' | 'created_at'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO utility_payments (id, vendor_id, amount, date, period_month, period_year, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, p.vendor_id, p.amount, p.date, p.period_month, p.period_year, p.notes || null, now]
    );
    persist();
  }, [db, persist]);

  // --- Advanced Analytics ---
  const getVendorStats = useCallback((vendorId: string, month: string, year: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return { totalQuantity: 0, cost: 0, logCount: 0 };

    const monthLogs = logs.filter(l => {
      const lDate = new Date(l.date);
      return l.vendor_id === vendorId && 
             (lDate.getMonth() + 1).toString().padStart(2, '0') === month && 
             lDate.getFullYear().toString() === year;
    });

    const totalQuantity = monthLogs.reduce((acc, curr) => acc + curr.quantity, 0);
    const cost = vendor.type === 'helper' 
                 ? (monthLogs.length > 0 ? vendor.rate_per_unit : 0) // Fixed salary if any log exists (active)
                 : totalQuantity * vendor.rate_per_unit;

    return {
      totalQuantity,
      cost,
      logCount: monthLogs.length,
      logs: monthLogs
    };
  }, [vendors, logs]);

  const getSummary = useCallback(() => {
    const now = new Date();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear().toString();

    let totalDue = 0;
    const stats: any = {};

    vendors.forEach(v => {
      const s = getVendorStats(v.id, m, y);
      stats[v.id] = s;
      
      // Check if paid already
      const isPaid = payments.some(p => p.vendor_id === v.id && p.period_month === m && p.period_year === y);
      if (!isPaid) totalDue += s.cost;
    });

    return {
      totalDue,
      vendorStats: stats,
      unpaidCount: vendors.filter(v => !payments.some(p => p.vendor_id === v.id && p.period_month === m && p.period_year === y)).length
    };
  }, [vendors, getVendorStats, payments]);

  return {
    vendors,
    logs,
    payments,
    addVendor,
    archiveVendor,
    logDaily,
    deleteLog,
    recordPayment,
    getVendorStats,
    getSummary,
    persist,
    tick
  };
}
