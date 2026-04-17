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
import { Investment, InvestmentTransaction, InvestmentGoal } from '@/types/db';

/**
 * INVEST HUB REPOSITORY
 * Pure SQL operations for Wealth, Mutual Funds, Gold, and Goal tracking.
 */

export const investRepo = {
  getInvestments: (db: Database | null): Investment[] => {
    if (!db) return [];
    return runQuery<Investment>(db, "SELECT * FROM investments ORDER BY current_value DESC");
  },

  getTransactions: (db: Database | null): InvestmentTransaction[] => {
    if (!db) return [];
    return runQuery<InvestmentTransaction>(db, "SELECT * FROM investment_transactions ORDER BY date DESC");
  },

  getGoals: (db: Database | null): InvestmentGoal[] => {
    if (!db) return [];
    return runQuery<InvestmentGoal>(db, "SELECT * FROM invest_goals ORDER BY deadline ASC");
  },

  createInvestment: (db: Database | null, inv: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO investments (id, member_id, goal_id, name, type, principal, current_value, units, monthly_sip, start_date, maturity_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, inv.member_id, inv.goal_id, inv.name, inv.type, inv.principal, inv.current_value, inv.units, inv.monthly_sip, inv.start_date, inv.maturity_date, inv.notes]
    );
    if (inv.principal > 0) {
      db.run(`INSERT INTO investment_transactions (id, investment_id, type, amount, date, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), id, 'lumpsum', inv.principal, inv.start_date, new Date().toISOString()]);
    }
    return id;
  },

  updateValuation: (db: Database | null, id: string, newValue: number, notes?: string) => {
    if (!db) return;
    db.run("UPDATE investments SET current_value = ? WHERE id = ?", [newValue, id]);
    db.run(`INSERT INTO investment_transactions (id, investment_id, type, amount, date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), id, 'valuation', newValue, new Date().toISOString().split('T')[0], notes || null, new Date().toISOString()]);
  },

  createGoal: (db: Database | null, goal: any) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO invest_goals (id, name, target_amount, member_id, deadline, category, is_completed, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, goal.name, goal.target_amount, goal.member_id, goal.deadline, goal.category, 0, new Date().toISOString()]
    );
    return id;
  }
};
