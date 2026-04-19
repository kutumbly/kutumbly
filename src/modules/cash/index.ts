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

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { cashRepo } from './cash.repo';
import { CashTransaction } from '@/types/db';

/**
 * CASH HUB (Money & Expense Management)
 * Sealed module for household financial tracking and budgeting.
 */
export function useCash(month?: string) {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);
  const currentMonth = month || new Date().toISOString().slice(0, 7);

  const txns = useMemo(() => cashRepo.getTransactions(db, currentMonth), [db, currentMonth, tick]);
  const budgets = useMemo(() => cashRepo.getBudgets(db, currentMonth), [db, currentMonth, tick]);

  const summary = useMemo(() => {
    const income = txns.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    return {
        income,
        expense,
        balance: income - expense
    };
  }, [txns]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addTransaction = useCallback((tx: Omit<CashTransaction, 'id' | 'created_at'>) => {
    const id = cashRepo.createTransaction(db, tx);
    commit();
  }, [db, commit]);

  const editTransaction = useCallback((id: string, updates: Partial<CashTransaction>) => {
    cashRepo.updateTransaction(db, id, updates);
    commit();
  }, [db, commit]);

  const deleteTransaction = useCallback((id: string) => {
    cashRepo.deleteTransaction(db, id);
    commit();
  }, [db, commit]);

  const setCategoryBudget = useCallback((category: string, limit: number) => {
    cashRepo.upsertBudget(db, category, limit, currentMonth);
    commit();
  }, [db, currentMonth, commit]);

  return {
    txns,
    budgets,
    summary,
    addTransaction,
    editTransaction,
    deleteTransaction,
    setCategoryBudget
  };
}
