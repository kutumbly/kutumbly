/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { Transaction, CategoryBudget } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useMemo, useCallback, useState } from 'react';

export function useMoney(month?: string) {
  const { db, currentPin, fileHandle } = useAppStore();
  const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
  const [tick, setTick] = useState(0);

  const data = useMemo(() => {
    if (!db) return { txns: [], budgets: [], summary: { income: 0, expense: 0, balance: 0 } };

    // 1. Fetch Transactions for the month
    const txns = runQuery<Transaction>(db, `
      SELECT * FROM transactions 
      WHERE strftime('%Y-%m', date) = ? 
      ORDER BY date DESC
    `, [currentMonth]);

    // 2. Fetch Budgets for the month
    const budgets = runQuery<CategoryBudget>(db, `
      SELECT * FROM budgets WHERE month = ?
    `, [currentMonth]);
    
    // 3. Calculate Summary
    const income = txns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = txns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      txns,
      budgets,
      summary: {
        income,
        expense,
        balance: income - expense
      }
    };
  }, [db, currentMonth, tick]);

  const addTransaction = useCallback((type: 'income'|'expense', amount: number, category: string, description: string, date: string, member_id?: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    db.run(
      "INSERT INTO transactions (id, date, amount, type, category, description, member_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, date, amount, type, category, description, member_id || null, created_at]
    );

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const setCategoryBudget = useCallback((category: string, limit: number) => {
    if (!db) return;
    
    // Upsert logic for budget
    const existing = runQuery<CategoryBudget>(db, "SELECT * FROM budgets WHERE category = ? AND month = ?", [category, currentMonth]);
    
    if (existing.length > 0) {
      db.run("UPDATE budgets SET monthly_limit = ? WHERE id = ?", [limit, existing[0].id]);
    } else {
      const id = crypto.randomUUID();
      db.run("INSERT INTO budgets (id, category, monthly_limit, month) VALUES (?, ?, ?, ?)", [id, category, limit, currentMonth]);
    }

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentMonth, currentPin, fileHandle]);

  const deleteTransaction = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM transactions WHERE id = ?", [id]);
    
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { ...data, addTransaction, deleteTransaction, setCategoryBudget };
}
