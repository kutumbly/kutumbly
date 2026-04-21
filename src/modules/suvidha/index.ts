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
import { mutateVault } from '@/lib/vault';
import { suvidhaRepo } from './suvidha.repo';

/**
 * SUVIDHA HUB (Utility & Services)
 * Sealed module for managing daily tallies, payments, and vendors (Milk, Maid, Newspaper, etc.).
 */
export function useSuvidha() {
  const { db } = useAppStore();
  const [tick, setTick] = useState(0);

  const vendors = useMemo(() => suvidhaRepo.getVendors(db), [db, tick]);
  const logs = useMemo(() => suvidhaRepo.getLogs(db), [db, tick]);
  const payments = useMemo(() => suvidhaRepo.getPayments(db), [db, tick]);

  const addVendor = useCallback(async (v: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    await mutateVault(db, `INSERT INTO suvidha_vendors (id, name, type, rate_per_unit, billing_cycle_day, member_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, v.name, v.type, v.rate_per_unit, v.billing_cycle_day, v.member_id ?? null]);
    setTick(t => t + 1);
  }, [db]);

  const logDaily = useCallback(async (vId: string, date: string, quantity: number, notes?: string) => {
    if (!db) return;
    const existing = suvidhaRepo.getLogByVendorDate(db, vId, date);
    if (existing) {
      await mutateVault(db, `UPDATE suvidha_logs SET quantity = ?, notes = ? WHERE id = ?`,
        [quantity, notes ?? null, existing.id]);
    } else {
      const id = crypto.randomUUID();
      await mutateVault(db, `INSERT INTO suvidha_logs (id, vendor_id, date, quantity, notes) VALUES (?, ?, ?, ?, ?)`,
        [id, vId, date, quantity, notes ?? null]);
    }
    setTick(t => t + 1);
  }, [db]);

  const recordPayment = useCallback(async (p: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    await mutateVault(db, `INSERT INTO suvidha_payments (id, vendor_id, amount, period_month, period_year, paid_on) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, p.vendor_id, p.amount, p.period_month, p.period_year, p.paid_on]);
    setTick(t => t + 1);
  }, [db]);

  const archiveVendor = useCallback(async (id: string) => {
    if (!db) return;
    await mutateVault(db, `UPDATE suvidha_vendors SET is_active = 0 WHERE id = ?`, [id]);
    setTick(t => t + 1);
  }, [db]);

  const getVendorStats = useCallback((vendorId: string, month: string, year: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return { totalQuantity: 0, cost: 0, logCount: 0, logs: [] };

    const monthLogs = logs.filter(l => {
      const lDate = new Date(l.date);
      return l.vendor_id === vendorId && 
             (lDate.getMonth() + 1).toString().padStart(2, '0') === month && 
             lDate.getFullYear().toString() === year;
    });

    const totalQuantity = monthLogs.reduce((acc, curr) => acc + curr.quantity, 0);
    const cost = vendor.type === 'helper' 
                 ? (monthLogs.length > 0 ? (vendor.rate_per_unit || 0) : 0)
                 : totalQuantity * (vendor.rate_per_unit || 0);

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
    logDaily,
    recordPayment,
    archiveVendor,
    getVendorStats,
    getSummary
  };
}
