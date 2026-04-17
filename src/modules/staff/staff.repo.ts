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
import { StaffMember, SalaryPayment, AttendanceRecord } from '@/types/db';

/**
 * SEWAK HUB REPOSITORY
 * Pure SQL operations for Domestic Staff and Payroll (Vetan) management.
 */

export const staffRepo = {
  getMembers: (db: Database | null): StaffMember[] => {
    if (!db) return [];
    return runQuery<StaffMember>(db, "SELECT *, monthly_salary AS salary FROM staff_members ORDER BY name ASC");
  },

  getPayments: (db: Database | null, limit = 50): SalaryPayment[] => {
    if (!db) return [];
    return runQuery<SalaryPayment>(db, "SELECT * FROM salary_payments ORDER BY paid_on DESC LIMIT ?", [limit]);
  },

  getAttendance: (db: Database | null, limit = 200): AttendanceRecord[] => {
    if (!db) return [];
    return runQuery<AttendanceRecord>(db, "SELECT * FROM attendance ORDER BY date DESC LIMIT ?", [limit]);
  },

  createMember: (db: Database | null, member: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const join_date = new Date().toISOString().split('T')[0];
    db.run(
      "INSERT INTO staff_members (id, name, role, monthly_salary, join_date, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [id, member.name, member.role, member.monthly_salary, join_date, member.phone]
    );
    return id;
  },

  deleteMember: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("DELETE FROM staff_members WHERE id = ?", [id]);
  },

  updateAdvance: (db: Database | null, staff_id: string, amount: number) => {
    if (!db) return;
    db.run("UPDATE staff_members SET advance_balance = MAX(0, advance_balance + ?) WHERE id = ?", [amount, staff_id]);
  },

  recordAttendance: (db: Database | null, staff_id: string, date: string, status: string, notes = "") => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run("DELETE FROM attendance WHERE staff_id = ? AND date = ?", [staff_id, date]);
    db.run("INSERT INTO attendance (id, staff_id, date, status, notes) VALUES (?, ?, ?, ?, ?)", [id, staff_id, date, status, notes]);
  },

  recordPayment: (db: Database | null, payment: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const paid_on = new Date().toISOString().split('T')[0];
    db.run(
      "INSERT INTO salary_payments (id, staff_id, month, gross, deductions, net, paid_on, advance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, payment.staff_id, payment.month, payment.gross, payment.deductions, payment.net, paid_on, payment.advance]
    );
    if (payment.advance > 0) {
      db.run("UPDATE staff_members SET advance_balance = MAX(0, advance_balance - ?) WHERE id = ?", [payment.advance, payment.staff_id]);
    }
  }
};
