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

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { cashRepo } from './cash.repo';
import { CashTransaction } from '@/types/db';

/**
 * CASH HUB (Money & Expense Management)
 * Sealed module for household financial tracking and budgeting.
 */
export function useCash(month?: string) {
  const { db } = useAppStore();
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

  const addTransaction = useCallback(async (tx: Omit<CashTransaction, 'id' | 'created_at'>) => {
    await cashRepo.createTransaction(db, tx);
    setTick(t => t + 1);
  }, [db]);

  const editTransaction = useCallback(async (id: string, updates: Partial<CashTransaction>) => {
    await cashRepo.updateTransaction(db, id, updates);
    setTick(t => t + 1);
  }, [db]);

  const deleteTransaction = useCallback(async (id: string) => {
    await cashRepo.deleteTransaction(db, id);
    setTick(t => t + 1);
  }, [db]);

  const setCategoryBudget = useCallback(async (category: string, limit: number) => {
    await cashRepo.upsertBudget(db, category, limit, currentMonth);
    setTick(t => t + 1);
  }, [db, currentMonth]);

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
