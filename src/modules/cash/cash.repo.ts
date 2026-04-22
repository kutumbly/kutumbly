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
    const start = `${month}-01`;
    const end = `${month}-31`; // SQL date comparison handles this safely
    return runQuery<CashTransaction>(db, `
      SELECT * FROM cash_transactions 
      WHERE date >= ? AND date <= ?
      ORDER BY date DESC
    `, [start, end]);
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
  },

  // ── INVESTMENTS ────────────────────────────────────────────────────────
  getInvestments: (db: Database | null): any[] => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM cash_investments ORDER BY created_at DESC");
  },

  getInvestmentTransactions: (db: Database | null, investId: string): any[] => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM cash_investment_txs WHERE investment_id = ? ORDER BY date DESC", [investId]);
  },

  createInvestment: async (db: Database | null, inv: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    await mutateVault(
      db,
      "INSERT INTO cash_investments (id, name, type, principal, current_value, start_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, inv.name, inv.type, inv.principal, inv.current_value, inv.start_date, inv.notes, new Date().toISOString()]
    );
    return id;
  },

  deleteInvestment: async (db: Database | null, id: string) => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM cash_investments WHERE id = ?", [id]);
  },

  createInvestmentTransaction: async (db: Database | null, tx: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    await mutateVault(
      db,
      "INSERT INTO cash_investment_txs (id, investment_id, type, amount, date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, tx.investment_id, tx.type, tx.amount, tx.date, tx.notes, new Date().toISOString()]
    );

    // Auto-update valuation if it's a valuation adjustment or lumpsum
    if (tx.type === 'valuation') {
      await mutateVault(db, "UPDATE cash_investments SET current_value = ? WHERE id = ?", [tx.amount, tx.investment_id]);
    } else if (tx.type === 'lumpsum' || tx.type === 'sip') {
      await mutateVault(db, "UPDATE cash_investments SET current_value = current_value + ?, principal = principal + ? WHERE id = ?", [tx.amount, tx.amount, tx.investment_id]);
    } else if (tx.type === 'withdrawal') {
       await mutateVault(db, "UPDATE cash_investments SET current_value = current_value - ? WHERE id = ?", [tx.amount, tx.investment_id]);
    }
  },

  // ── WEALTH GOALS ───────────────────────────────────────────────────────
  getGoals: (db: Database | null): any[] => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM cash_wealth_goals ORDER BY deadline ASC");
  },

  createGoal: async (db: Database | null, g: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    await mutateVault(
      db,
      "INSERT INTO cash_wealth_goals (id, name, target_amount, member_id, deadline, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, g.name, g.target_amount, g.member_id || null, g.deadline, g.category, new Date().toISOString()]
    );
    return id;
  },

  updateGoal: async (db: Database | null, id: string, g: any) => {
    if (!db) return;
    await mutateVault(
      db,
      "UPDATE cash_wealth_goals SET name = ?, target_amount = ?, member_id = ?, deadline = ?, category = ?, is_completed = ? WHERE id = ?",
      [g.name, g.target_amount, g.member_id || null, g.deadline, g.category, g.is_completed ? 1 : 0, id]
    );
  },

  deleteGoal: async (db: Database | null, id: string) => {
    if (!db) return;
    await mutateVault(db, "DELETE FROM cash_wealth_goals WHERE id = ?", [id]);
  }
};
