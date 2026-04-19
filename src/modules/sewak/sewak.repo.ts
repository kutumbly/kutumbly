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
import { SewakMember, SewakPayment, SewakAttendance } from '@/types/db';

/**
 * SEWAK HUB REPOSITORY
 * Pure SQL operations for Domestic Staff and Payroll (Vetan) management.
 */

export const sewakRepo = {
  getMembers: (db: Database | null): SewakMember[] => {
    if (!db) return [];
    return runQuery<SewakMember>(db, "SELECT *, monthly_salary AS salary FROM sewak_members ORDER BY name ASC");
  },

  getPayments: (db: Database | null, limit = 50): SewakPayment[] => {
    if (!db) return [];
    return runQuery<SewakPayment>(db, "SELECT * FROM sewak_payments ORDER BY paid_on DESC LIMIT ?", [limit]);
  },

  getAttendance: (db: Database | null, limit = 200): SewakAttendance[] => {
    if (!db) return [];
    return runQuery<SewakAttendance>(db, "SELECT * FROM sewak_attendance ORDER BY date DESC LIMIT ?", [limit]);
  },

  createMember: (db: Database | null, member: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const join_date = new Date().toISOString().split('T')[0];
    db.run(
      "INSERT INTO sewak_members (id, name, role, monthly_salary, join_date, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [id, member.name, member.role, member.monthly_salary, join_date, member.phone]
    );
    return id;
  },

  deleteMember: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("DELETE FROM sewak_members WHERE id = ?", [id]);
  },

  updateAdvance: (db: Database | null, sewak_id: string, amount: number) => {
    if (!db) return;
    db.run("UPDATE sewak_members SET advance_balance = MAX(0, advance_balance + ?) WHERE id = ?", [amount, sewak_id]);
  },

  recordAttendance: (db: Database | null, sewak_id: string, date: string, status: string, notes = "") => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run("DELETE FROM sewak_attendance WHERE sewak_id = ? AND date = ?", [sewak_id, date]);
    db.run("INSERT INTO sewak_attendance (id, sewak_id, date, status, notes) VALUES (?, ?, ?, ?, ?)", [id, sewak_id, date, status, notes]);
  },

  recordPayment: (db: Database | null, payment: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const paid_on = new Date().toISOString().split('T')[0];
    db.run(
      "INSERT INTO sewak_payments (id, sewak_id, month, gross, deductions, net, paid_on, advance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, payment.sewak_id, payment.month, payment.gross, payment.deductions, payment.net, paid_on, payment.advance]
    );
    if (payment.advance > 0) {
      db.run("UPDATE sewak_members SET advance_balance = MAX(0, advance_balance - ?) WHERE id = ?", [payment.advance, payment.sewak_id]);
    }
  }
};
