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
import { investRepo } from './invest.repo';
import { Investment, InvestmentTransaction, InvestmentGoal } from '@/types/db';

/**
 * INVEST HUB (Wealth & Prosperity)
 * Sealed module for managing portfolio, gold, mutual funds, and long-term goals.
 */
export function useInvest() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const rawInvestments = useMemo(() => investRepo.getInvestments(db), [db, tick]);
  const rawTransactions = useMemo(() => investRepo.getTransactions(db), [db, tick]);
  const rawGoals = useMemo(() => investRepo.getGoals(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // Comprehensive Wealth Analysis Logic
  const processedData = useMemo(() => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const enriched = rawInvestments.map(inv => {
      const txs = rawTransactions.filter(t => t.investment_id === inv.id);
      const principal = txs.reduce((sum, t) => {
        if (t.type === 'sip' || t.type === 'lumpsum') return sum + t.amount;
        if (t.type === 'withdrawal') return sum - t.amount;
        return sum;
      }, 0) || inv.principal;

      const startDate = new Date(inv.start_date);
      const yearsDiff = Math.max(0.1, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      const cagr = principal > 0 ? (Math.pow(inv.current_value / principal, 1 / yearsDiff) - 1) * 100 : 0;

      return {
        ...inv,
        principal,
        isLTCG: startDate < oneYearAgo,
        cagr: Number(cagr.toFixed(2)),
        allocation: 0
      };
    });

    const totalValue = enriched.reduce((acc, i) => acc + i.current_value, 0);
    const totalPrincipal = enriched.reduce((acc, i) => acc + i.principal, 0);
    const monthlySIP = enriched.reduce((acc, i) => acc + (Number(i.monthly_sip) || 0), 0);

    const finalInvestments = enriched.map(i => ({
      ...i,
      allocation: totalValue > 0 ? (i.current_value / totalValue) * 100 : 0
    }));

    const finalGoals = rawGoals.map(g => {
      const linked = finalInvestments.filter(i => i.goal_id === g.id);
      const progress = linked.reduce((sum, i) => sum + i.current_value, 0);
      return { ...g, current_progress: progress, linked_count: linked.length };
    });

    return {
      investments: finalInvestments,
      goals: finalGoals,
      summary: {
        totalPrincipal,
        currentValue: totalValue,
        profit: totalValue - totalPrincipal,
        pnlPercent: totalPrincipal > 0 ? ((totalValue - totalPrincipal) / totalPrincipal) * 100 : 0,
        monthlySIP,
        diversificationScore: Math.min(100, new Set(enriched.map(i => i.type)).size * 25),
        goldWeightGrams: enriched.reduce((acc, i) => i.type.toLowerCase().includes('gold') ? acc + (Number(i.units) || 0) : acc, 0),
        taxFreePotential: enriched.reduce((acc, i) => ['PPF', 'SSY'].includes(i.type.toUpperCase()) ? acc + i.current_value : acc, 0)
      }
    };
  }, [rawInvestments, rawTransactions, rawGoals]);

  const addInvestment = useCallback((inv: any) => {
    const id = investRepo.createInvestment(db, inv);
    commit();
  }, [db, commit]);

  const updateValuation = useCallback((id: string, val: number, notes?: string) => {
    investRepo.updateValuation(db, id, val, notes);
    commit();
  }, [db, commit]);

  const addGoal = useCallback((goal: any) => {
    investRepo.createGoal(db, goal);
    commit();
  }, [db, commit]);

  return {
    ...processedData,
    addInvestment,
    updateValuation,
    addGoal,
    getTransactions: (id: any) => rawTransactions.filter((t: any) => t.investment_id === id),
    getWealthProjection: (years: any) => {
      const result = [];
      let runningTotal = processedData.summary.currentValue;
      const annualSIP = processedData.summary.monthlySIP * 12;
      for (let y = 1; y <= years; y++) {
        runningTotal = (runningTotal * 1.12) + (annualSIP * 1.12);
        result.push({ year: new Date().getFullYear() + y, estimatedValue: Math.round(runningTotal) });
      }
      return result;
    },
    editInvestment: (id: any, updates: any) => { /* implementation */ commit(); },
    deleteInvestment: (id: any) => { /* implementation */ commit(); },
    addTransaction: (tx: any) => { /* implementation */ commit(); },
    editGoal: (id: any, updates: any) => { /* implementation */ commit(); },
    deleteGoal: (id: any) => { /* implementation */ commit(); }
  };
}
