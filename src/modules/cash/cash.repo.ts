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
import { mutateVault } from '@/lib/vault';
import { CashTransaction, CashBudget } from '@/types/db';

/**
 * CASH HUB REPOSITORY
 * Pure SQL operations for cash and Budget management.
 */

export const cashRepo = {
  getTransactions: (db: Database | null, month: string): CashTransaction[] => {
    if (!db) return [];
    return runQuery<CashTransaction>(db, `
      SELECT * FROM cash_transactions 
      WHERE strftime('%Y-%m', date) = ? 
      ORDER BY date DESC
    `, [month]);
  },

  getBudgets: (db: Database | null, month: string): CashBudget[] => {
    if (!db) return [];
    return runQuery<CashBudget>(db, `
      SELECT * FROM cash_budgets WHERE month = ?
    `, [month]);
  },

  createTransaction: async (db: Database | null, tx: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    await mutateVault(
      db,
      "INSERT INTO cash_transactions (id, date, amount, type, category, description, member_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, tx.date, tx.amount, tx.type, tx.category, tx.description, tx.member_id || null, created_at]
    );
    return id;
  },

  updateTransaction: async (db: Database | null, id: string, tx: any) => {
    if (!db) return;
    await mutateVault(
      db,
      "UPDATE cash_transactions SET date = ?, amount = ?, type = ?, category = ?, description = ?, member_id = ? WHERE id = ?",
      [tx.date, tx.amount, tx.type, tx.category, tx.description, tx.member_id || null, id]
    );
  },

  deleteTransaction: async (db: Database | null, id: string) => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM cash_transactions WHERE id = ?", [id]);
  },

  upsertBudget: async (db: Database | null, category: string, limit: number, month: string) => {
    if (!db) return;
    const existing = runQuery<CashBudget>(db, "SELECT * FROM cash_budgets WHERE category = ? AND month = ?", [category, month]);
    if (existing.length > 0) {
      await mutateVault(db, "UPDATE cash_budgets SET monthly_limit = ? WHERE id = ?", [limit, existing[0].id]);
    } else {
      const id = crypto.randomUUID();
      await mutateVault(db, "INSERT INTO cash_budgets (id, category, monthly_limit, month) VALUES (?, ?, ?, ?)", [id, category, limit, month]);
    }
  }
};
