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
import { SewakMember, SewakPayment, SewakAttendance } from '@/types/db';

/**
 * SEWAK HUB REPOSITORY
 * Pure SQL operations for Domestic Staff and Payroll (Vetan) management.
 */

export const sewakRepo = {
  getMembers: (db: Database | null, activeOnly = true): SewakMember[] => {
    if (!db) return [];
    const query = activeOnly 
      ? "SELECT *, monthly_salary AS salary FROM sewak_members WHERE is_active = 1 ORDER BY name ASC" 
      : "SELECT *, monthly_salary AS salary FROM sewak_members ORDER BY name ASC";
    return runQuery<SewakMember>(db, query);
  },

  getAdvances: (db: Database | null): any[] => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM sewak_advances ORDER BY date DESC");
  },

  getWelfare: (db: Database | null): any[] => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM sewak_welfare ORDER BY event_date DESC");
  },

  getDocuments: (db: Database | null): any[] => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM sewak_documents ORDER BY doc_type ASC");
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
      "INSERT INTO sewak_members (id, name, role, monthly_salary, join_date, phone, emergency_contact, shift_timing, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)",
      [id, member.name, member.role, member.monthly_salary, join_date, member.phone, member.emergency_contact, member.shift_timing]
    );
    return id;
  },

  archiveMember: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("UPDATE sewak_members SET is_active = 0 WHERE id = ?", [id]);
  },
  
  deleteMember: (db: Database | null, id: string) => {
    if (!db) return;
    // Hybrid Strategy: Hard delete means purge EVERYTHING.
    db.run("DELETE FROM sewak_attendance WHERE sewak_id = ?", [id]);
    db.run("DELETE FROM sewak_payments WHERE sewak_id = ?", [id]);
    db.run("DELETE FROM sewak_advances WHERE sewak_id = ?", [id]);
    db.run("DELETE FROM sewak_welfare WHERE sewak_id = ?", [id]);
    db.run("DELETE FROM sewak_documents WHERE sewak_id = ?", [id]);
    db.run("DELETE FROM sewak_members WHERE id = ?", [id]);
  },

  updateAdvance: (db: Database | null, sewak_id: string, amount: number) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const date = new Date().toISOString().split('T')[0];
    db.run(
       "INSERT INTO sewak_advances (id, sewak_id, amount, date, reason, status) VALUES (?, ?, ?, ?, ?, ?)",
       [id, sewak_id, amount, date, 'Manual Advance Issue', 'ACTIVE']
    );
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
      
      const adv_id = crypto.randomUUID();
      db.run(
        "INSERT INTO sewak_advances (id, sewak_id, amount, date, reason, status) VALUES (?, ?, ?, ?, ?, ?)",
        [adv_id, payment.sewak_id, -payment.advance, paid_on, `Khata auto-recovery against Vetan ${payment.month}`, 'RECOVERED']
      );
    }
  },

  createWelfare: (db: Database | null, data: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      "INSERT INTO sewak_welfare (id, sewak_id, welfare_type, amount, event_date, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [id, data.sewak_id, data.welfare_type, data.amount, data.event_date, data.notes]
    );
    return id;
  },

  createDocument: (db: Database | null, data: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      "INSERT INTO sewak_documents (id, sewak_id, doc_type, vault_ref, expiry_date, verification_status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, data.sewak_id, data.doc_type, data.vault_ref, data.expiry_date, data.verification_status || 'PENDING']
    );
    return id;
  },

  updateKYCStatus: (db: Database | null, id: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED') => {
    if (!db) return;
    db.run("UPDATE sewak_members SET kyc_status = ? WHERE id = ?", [status, id]);
  }
};
