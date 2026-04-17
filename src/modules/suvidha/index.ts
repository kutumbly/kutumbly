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
import { suvidhaRepo } from './suvidha.repo';

/**
 * SUVIDHA HUB (Utility & Services)
 * Sealed module for managing daily tallies, payments, and vendors (Milk, Maid, Newspaper, etc.).
 */
export function useSuvidha() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const vendors = useMemo(() => suvidhaRepo.getVendors(db), [db, tick]);
  const logs = useMemo(() => suvidhaRepo.getLogs(db), [db, tick]);
  const payments = useMemo(() => suvidhaRepo.getPayments(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addVendor = useCallback((v: any) => {
    const id = suvidhaRepo.createVendor(db, v);
    commit();
  }, [db, commit]);

  const logDaily = useCallback((vId: string, date: string, quantity: number, notes?: string) => {
    suvidhaRepo.recordDailyLog(db, vId, date, quantity, notes);
    commit();
  }, [db, commit]);

  const recordPayment = useCallback((p: any) => {
    suvidhaRepo.recordPayment(db, p);
    commit();
  }, [db, commit]);

  const archiveVendor = useCallback((id: string) => {
    suvidhaRepo.archiveVendor(db, id);
    commit();
  }, [db, commit]);

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
