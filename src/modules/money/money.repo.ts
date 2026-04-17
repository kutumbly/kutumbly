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
import { Transaction, CategoryBudget } from '@/types/db';

/**
 * CASH HUB REPOSITORY
 * Pure SQL operations for Money and Budget management.
 */

export const moneyRepo = {
  getTransactions: (db: Database | null, month: string): Transaction[] => {
    if (!db) return [];
    return runQuery<Transaction>(db, `
      SELECT * FROM transactions 
      WHERE strftime('%Y-%m', date) = ? 
      ORDER BY date DESC
    `, [month]);
  },

  getBudgets: (db: Database | null, month: string): CategoryBudget[] => {
    if (!db) return [];
    return runQuery<CategoryBudget>(db, `
      SELECT * FROM budgets WHERE month = ?
    `, [month]);
  },

  createTransaction: (db: Database | null, tx: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    db.run(
      "INSERT INTO transactions (id, date, amount, type, category, description, member_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, tx.date, tx.amount, tx.type, tx.category, tx.description, tx.member_id || null, created_at]
    );
    return id;
  },

  updateTransaction: (db: Database | null, id: string, tx: any) => {
    if (!db) return;
    db.run(
      "UPDATE transactions SET date = ?, amount = ?, type = ?, category = ?, description = ?, member_id = ? WHERE id = ?",
      [tx.date, tx.amount, tx.type, tx.category, tx.description, tx.member_id || null, id]
    );
  },

  deleteTransaction: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("DELETE FROM transactions WHERE id = ?", [id]);
  },

  upsertBudget: (db: Database | null, category: string, limit: number, month: string) => {
    if (!db) return;
    const existing = runQuery<CategoryBudget>(db, "SELECT * FROM budgets WHERE category = ? AND month = ?", [category, month]);
    if (existing.length > 0) {
      db.run("UPDATE budgets SET monthly_limit = ? WHERE id = ?", [limit, existing[0].id]);
    } else {
      const id = crypto.randomUUID();
      db.run("INSERT INTO budgets (id, category, monthly_limit, month) VALUES (?, ?, ?, ?)", [id, category, limit, month]);
    }
  }
};
