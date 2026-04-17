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

import { Database } from 'sql.js';
import { runQuery } from '@/lib/db';
import { UtilityVendor, UtilityLog, UtilityPayment } from '@/types/db';

/**
 * SUVIDHA HUB REPOSITORY
 * Pure SQL operations for Utility, Daily Tally, and Vendor management.
 */

export const suvidhaRepo = {
  getVendors: (db: Database | null): UtilityVendor[] => {
    if (!db) return [];
    return runQuery<UtilityVendor>(db, "SELECT * FROM utility_vendors WHERE is_active = 1 ORDER BY name ASC");
  },

  getLogs: (db: Database | null): UtilityLog[] => {
    if (!db) return [];
    return runQuery<UtilityLog>(db, "SELECT * FROM utility_logs ORDER BY date DESC");
  },

  getPayments: (db: Database | null): UtilityPayment[] => {
    if (!db) return [];
    return runQuery<UtilityPayment>(db, "SELECT * FROM utility_payments ORDER BY date DESC");
  },

  createVendor: (db: Database | null, v: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO utility_vendors (id, name, type, rate_per_unit, billing_cycle_day, member_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
      [id, v.name, v.type, v.rate_per_unit, v.billing_cycle_day, v.member_id, now]
    );
    return id;
  },

  recordDailyLog: (db: Database | null, vId: string, date: string, quantity: number, notes?: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run("DELETE FROM utility_logs WHERE vendor_id = ? AND date = ?", [vId, date]);
    db.run(
      "INSERT INTO utility_logs (id, vendor_id, date, quantity, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, vId, date, quantity, notes || null, now]
    );
    return id;
  },

  recordPayment: (db: Database | null, p: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO utility_payments (id, vendor_id, amount, date, period_month, period_year, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, p.vendor_id, p.amount, p.date, p.period_month, p.period_year, p.notes || null, now]
    );
    return id;
  },

  archiveVendor: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("UPDATE utility_vendors SET is_active = 0 WHERE id = ?", [id]);
  }
};
