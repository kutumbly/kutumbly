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
    await suvidhaRepo.createVendor(db, v);
    setTick(t => t + 1);
  }, [db]);

  const logDaily = useCallback(async (vId: string, date: string, quantity: number, unit?: string, notes?: string) => {
    if (!db) return;
    await suvidhaRepo.recordDailyLog(db, vId, date, quantity, unit, notes);
    setTick(t => t + 1);
  }, [db]);

  const recordPayment = useCallback(async (p: any) => {
    if (!db) return;
    await suvidhaRepo.recordPayment(db, p);
    setTick(t => t + 1);
  }, [db]);

  const archiveVendor = useCallback(async (id: string) => {
    if (!db) return;
    await suvidhaRepo.archiveVendor(db, id);
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
