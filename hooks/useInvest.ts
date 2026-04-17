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

import { Investment, InvestmentTransaction, InvestmentGoal } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { useMemo, useCallback, useState } from 'react';
import { saveVault } from '@/lib/vault';

export interface WealthProjection {
  year: number;
  estimatedValue: number;
}

export interface InvestData {
  investments: (Investment & { 
    isLTCG: boolean; 
    cagr: number;
    allocation: number;
  })[];
  goals: (InvestmentGoal & {
    current_progress: number;
    linked_count: number;
  })[];
  getTransactions: (investmentId: string) => InvestmentTransaction[];
  getWealthProjection: (years: number) => WealthProjection[];
  summary: {
    totalPrincipal: number;
    currentValue: number;
    profit: number;
    pnlPercent: number;
    monthlySIP: number;
    diversificationScore: number;
    goldWeightGrams: number;
    taxFreePotential: number; // Sum of PPF/SSY
  };
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  editInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  addTransaction: (tx: Omit<InvestmentTransaction, 'id' | 'created_at'>) => void;
  updateValuation: (investmentId: string, newValue: number, notes?: string) => void;
  
  // Goal CRUD
  addGoal: (goal: Omit<InvestmentGoal, 'id'>) => void;
  editGoal: (id: string, updates: Partial<InvestmentGoal>) => void;
  deleteGoal: (id: string) => void;
}

export function useInvest(): InvestData {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const persist = useCallback(() => {
    if (db && currentPin && fileHandle) {
      saveVault(db, currentPin, fileHandle).catch(() => {});
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return useMemo<InvestData>(() => {
    const emptyState: InvestData = { 
      investments: [], 
      goals: [],
      getTransactions: () => [],
      getWealthProjection: () => [],
      summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0, monthlySIP: 0, diversificationScore: 0, goldWeightGrams: 0, taxFreePotential: 0 },
      addInvestment: () => {},
      editInvestment: () => {},
      deleteInvestment: () => {},
      addTransaction: () => {},
      updateValuation: () => {},
      addGoal: () => {},
      editGoal: () => {},
      deleteGoal: () => {}
    };

    if (!db) return emptyState;

    try {
      const investments = runQuery<Investment>(db, "SELECT * FROM investments ORDER BY current_value DESC");
      const transactions = runQuery<InvestmentTransaction>(db, "SELECT * FROM investment_transactions ORDER BY date DESC");
      const goals = runQuery<InvestmentGoal>(db, "SELECT * FROM invest_goals ORDER BY deadline ASC");

      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const enrichedInvestments = investments.map(inv => {
        const invTx = transactions.filter(t => t.investment_id === inv.id);
        
        const principal = invTx.reduce((sum, t) => {
          if (t.type === 'sip' || t.type === 'lumpsum') return sum + t.amount;
          if (t.type === 'withdrawal') return sum - t.amount;
          return sum;
        }, 0);

        const startDate = new Date(inv.start_date);
        const isLTCG = startDate < oneYearAgo;
        const yearsDiff = Math.max(0.1, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const cagr = principal > 0 ? (Math.pow(inv.current_value / principal, 1 / yearsDiff) - 1) * 100 : 0;

        return { 
          ...inv, 
          principal: principal || inv.principal, 
          isLTCG, 
          cagr: Number(cagr.toFixed(2)),
          allocation: 0
        };
      });

      const totalValue = enrichedInvestments.reduce((acc, i) => acc + i.current_value, 0);
      const totalPrincipal = enrichedInvestments.reduce((acc, i) => acc + i.principal, 0);
      const monthlySIP = enrichedInvestments.reduce((acc, i) => acc + (Number(i.monthly_sip) || 0), 0);
      const preciousWeight = enrichedInvestments.reduce((acc, i) => {
        if (i.type.toLowerCase().includes('gold')) return acc + (Number(i.units) || 0);
        return acc;
      }, 0);
      const taxFreePotential = enrichedInvestments.reduce((acc, i) => {
        const t = i.type.toUpperCase();
        if (t === 'PPF' || t === 'SSY' || t.includes('TAX FREE')) return acc + i.current_value;
        return acc;
      }, 0);

      const finalInvestments = enrichedInvestments.map(i => ({
        ...i,
        allocation: totalValue > 0 ? (i.current_value / totalValue) * 100 : 0
      }));

      // Enrich Goals
      const finalGoals = goals.map(g => {
        const linkedInvs = finalInvestments.filter(i => i.goal_id === g.id);
        const currentProgress = linkedInvs.reduce((sum, i) => sum + i.current_value, 0);
        return {
          ...g,
          current_progress: currentProgress,
          linked_count: linkedInvs.length
        };
      });

      const getWealthProjection = (years: number): WealthProjection[] => {
        const result: WealthProjection[] = [];
        let runningTotal = totalValue;
        const annualReturn = 0.12; 
        const annualSIP = monthlySIP * 12;

        for (let y = 1; y <= years; y++) {
          runningTotal = (runningTotal * (1 + annualReturn)) + (annualSIP * (1 + annualReturn));
          result.push({ year: now.getFullYear() + y, estimatedValue: Math.round(runningTotal) });
        }
        return result;
      };

      const categories = new Set(finalInvestments.map(i => i.type));
      const diversificationScore = Math.min(100, categories.size * 25);

      return {
        investments: finalInvestments,
        goals: finalGoals,
        getTransactions: (id) => transactions.filter(t => t.investment_id === id),
        getWealthProjection,
        summary: {
          totalPrincipal,
          currentValue: totalValue,
          profit: totalValue - totalPrincipal,
          pnlPercent: totalPrincipal > 0 ? ((totalValue - totalPrincipal) / totalPrincipal) * 100 : 0,
          monthlySIP,
          diversificationScore,
          goldWeightGrams: preciousWeight,
          taxFreePotential
        },
        addInvestment: (inv) => {
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
          persist();
        },
        editInvestment: (id, updates) => {
          const keys = Object.keys(updates);
          if (keys.length === 0) return;
          const setClause = keys.map(k => `${k} = ?`).join(', ');
          const values = Object.values(updates);
          db.run(`UPDATE investments SET ${setClause} WHERE id = ?`, [...values, id]);
          persist();
        },
        deleteInvestment: (id) => {
          db.run("DELETE FROM investment_transactions WHERE investment_id = ?", [id]);
          db.run("DELETE FROM investments WHERE id = ?", [id]);
          persist();
        },
        addTransaction: (tx) => {
          db.run(`INSERT INTO investment_transactions (id, investment_id, type, amount, date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), tx.investment_id, tx.type, tx.amount, tx.date, tx.notes, new Date().toISOString()]);
          persist();
        },
        updateValuation: (id, val, notes) => {
          db.run("UPDATE investments SET current_value = ? WHERE id = ?", [val, id]);
          db.run(`INSERT INTO investment_transactions (id, investment_id, type, amount, date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), id, 'valuation', val, new Date().toISOString().split('T')[0], notes, new Date().toISOString()]);
          persist();
        },
        addGoal: (goal) => {
          const id = crypto.randomUUID();
          db.run(
            `INSERT INTO invest_goals (id, name, target_amount, member_id, deadline, category, is_completed, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, goal.name, goal.target_amount, goal.member_id, goal.deadline, goal.category, 0, new Date().toISOString()]
          );
          persist();
        },
        editGoal: (id, updates) => {
          const keys = Object.keys(updates);
          if (keys.length === 0) return;
          const setClause = keys.map(k => `${k} = ?`).join(', ');
          const values = Object.values(updates);
          db.run(`UPDATE invest_goals SET ${setClause} WHERE id = ?`, [...values, id]);
          persist();
        },
        deleteGoal: (id) => {
          db.run("UPDATE investments SET goal_id = NULL WHERE goal_id = ?", [id]);
          db.run("DELETE FROM invest_goals WHERE id = ?", [id]);
          persist();
        }
      };
    } catch (e) {
      console.error("Wealth error:", e);
      return emptyState;
    }
  }, [db, tick, persist]);
}
