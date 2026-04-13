/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
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
import { useMemo, useCallback, useState } from 'react';

export function useMoney(month?: string) {
  const { db, currentPin, fileHandle } = useAppStore();
  const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
  const [tick, setTick] = useState(0);

  const data = useMemo(() => {
    if (!db) return { txns: [], summary: { income: 0, expense: 0, balance: 0 } };

    try {
      // 1. Fetch Transactions for the month
      const txnRes = db.exec(`
        SELECT * FROM transactions 
        WHERE strftime('%Y-%m', date) = ? 
        ORDER BY date DESC
      `, [currentMonth]);
      
      const txns = txnRes[0]?.values.map(v => ({
        id: v[0],
        date: v[1],
        amount: Number(v[2]),
        type: v[3],
        category: v[4],
        description: v[5],
        member_id: v[6]
      })) || [];

      // 2. Calculate Summary
      const summaryRes = db.exec(`
        SELECT
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
        FROM transactions 
        WHERE strftime('%Y-%m', date) = ?
      `, [currentMonth]);

      const income = Number(summaryRes[0]?.values[0][0]) || 0;
      const expense = Number(summaryRes[0]?.values[0][1]) || 0;

      return {
        txns,
        summary: {
          income,
          expense,
          balance: income - expense
        }
      };
    } catch (e) {
      return { txns: [], summary: { income: 0, expense: 0, balance: 0 } };
    }
  }, [db, currentMonth, tick]);

  const addTransaction = useCallback((type: 'income'|'expense', amount: number, category: string, description: string, date: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    db.run(
      "INSERT INTO transactions (id, date, amount, type, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, date, amount, type, category, description, created_at]
    );

    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deleteTransaction = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM transactions WHERE id = ?", [id]);
    
    if (fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { ...data, addTransaction, deleteTransaction };
}
