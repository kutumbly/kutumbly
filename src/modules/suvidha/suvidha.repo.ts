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

import { Database } from 'sql.js';
import { runQuery } from '@/lib/db';
import { SuvidhaVendor, SuvidhaLog, SuvidhaPayment } from '@/types/db';

/**
 * SUVIDHA HUB REPOSITORY
 * Pure SQL operations for Utility, Daily Tally, and Vendor management.
 */

export const suvidhaRepo = {
  getVendors: (db: Database | null): SuvidhaVendor[] => {
    if (!db) return [];
    return runQuery<SuvidhaVendor>(db, "SELECT * FROM suvidha_vendors WHERE is_active = 1 ORDER BY name ASC");
  },

  getLogs: (db: Database | null): SuvidhaLog[] => {
    if (!db) return [];
    return runQuery<SuvidhaLog>(db, "SELECT * FROM suvidha_logs ORDER BY date DESC");
  },

  getLogByVendorDate: (db: Database | null, vendorId: string, date: string): SuvidhaLog | null => {
    if (!db) return null;
    const rows = runQuery<SuvidhaLog>(db, "SELECT * FROM suvidha_logs WHERE vendor_id = ? AND date = ? LIMIT 1", [vendorId, date]);
    return rows[0] ?? null;
  },

  getPayments: (db: Database | null): SuvidhaPayment[] => {
    if (!db) return [];
    return runQuery<SuvidhaPayment>(db, "SELECT * FROM suvidha_payments ORDER BY date DESC");
  },

  createVendor: (db: Database | null, v: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO suvidha_vendors (id, name, type, rate_per_unit, billing_cycle_day, member_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
      [id, v.name, v.type, v.rate_per_unit, v.billing_cycle_day, v.member_id, now]
    );
    return id;
  },

  recordDailyLog: (db: Database | null, vId: string, date: string, quantity: number, notes?: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run("DELETE FROM suvidha_logs WHERE vendor_id = ? AND date = ?", [vId, date]);
    db.run(
      "INSERT INTO suvidha_logs (id, vendor_id, date, quantity, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, vId, date, quantity, notes || null, now]
    );
    return id;
  },

  recordPayment: (db: Database | null, p: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.run(
      "INSERT INTO suvidha_payments (id, vendor_id, amount, date, period_month, period_year, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, p.vendor_id, p.amount, p.date, p.period_month, p.period_year, p.notes || null, now]
    );
    return id;
  },

  archiveVendor: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("UPDATE suvidha_vendors SET is_active = 0 WHERE id = ?", [id]);
  }
};
