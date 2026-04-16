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

import { Investment, InvestmentTransaction } from '@/types/db';
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
  getTransactions: (investmentId: string) => InvestmentTransaction[];
  getWealthProjection: (years: number) => WealthProjection[];
  summary: {
    totalPrincipal: number;
    currentValue: number;
    profit: number;
    pnlPercent: number;
    monthlySIP: number;
    diversificationScore: number; // 0-100 based on asset mix
  };
  addInvestment: (investment: Omit<Investment, 'id' | 'created_at'>) => void;
  addTransaction: (tx: Omit<InvestmentTransaction, 'id' | 'created_at'>) => void;
  updateValuation: (investmentId: string, newValue: number, notes?: string) => void;
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
      getTransactions: () => [],
      getWealthProjection: () => [],
      summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0, monthlySIP: 0, diversificationScore: 0 },
      addInvestment: () => {},
      addTransaction: () => {},
      updateValuation: () => {}
    };

    if (!db) return emptyState;

    try {
      const investments = runQuery<Investment>(db, "SELECT * FROM investments ORDER BY current_value DESC");
      const transactions = runQuery<InvestmentTransaction>(db, "SELECT * FROM investment_transactions ORDER BY date DESC");

      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const enriched = investments.map(inv => {
        const invTx = transactions.filter(t => t.investment_id === inv.id);
        
        // Calculate Principal
        const principal = invTx.reduce((sum, t) => {
          if (t.type === 'sip' || t.type === 'lumpsum') return sum + t.amount;
          if (t.type === 'withdrawal') return sum - t.amount;
          return sum;
        }, 0);

        // Tax Status: LTCG (>1 year for Mutual Funds/Stocks, >2-3 for others)
        // Simple logic: If start_date is older than 1 year
        const startDate = new Date(inv.start_date);
        const isLTCG = startDate < oneYearAgo;

        // Simple CAGR calculation
        const yearsDiff = Math.max(0.1, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const cagr = principal > 0 ? (Math.pow(inv.current_value / principal, 1 / yearsDiff) - 1) * 100 : 0;

        return { 
          ...inv, 
          principal: principal || inv.principal, 
          isLTCG, 
          cagr: Number(cagr.toFixed(2)),
          allocation: 0 // Will calculate later
        };
      });

      const totalValue = enriched.reduce((acc, i) => acc + i.current_value, 0);
      const totalPrincipal = enriched.reduce((acc, i) => acc + i.principal, 0);
      const monthlySIP = enriched.reduce((acc, i) => acc + (Number(i.monthly_sip) || 0), 0);

      // Final enrichment with allocation
      const finalInvestments = enriched.map(i => ({
        ...i,
        allocation: totalValue > 0 ? (i.current_value / totalValue) * 100 : 0
      }));

      // Wealth Projection Engine
      const getWealthProjection = (years: number): WealthProjection[] => {
        const result: WealthProjection[] = [];
        let runningTotal = totalValue;
        const annualReturn = 0.12; // 12% conservative average for India
        const annualSIP = monthlySIP * 12;

        for (let y = 1; y <= years; y++) {
          // Future Value of current holdings + Future Value of periodic SIPs
          runningTotal = (runningTotal * (1 + annualReturn)) + (annualSIP * (1 + annualReturn));
          result.push({ year: now.getFullYear() + y, estimatedValue: Math.round(runningTotal) });
        }
        return result;
      };

      // Diversification Score (Simplified: Reward variety in categories)
      const categories = new Set(finalInvestments.map(i => i.type));
      const diversificationScore = Math.min(100, categories.size * 25);

      return {
        investments: finalInvestments,
        getTransactions: (id) => transactions.filter(t => t.investment_id === id),
        getWealthProjection,
        summary: {
          totalPrincipal,
          currentValue: totalValue,
          profit: totalValue - totalPrincipal,
          pnlPercent: totalPrincipal > 0 ? ((totalValue - totalPrincipal) / totalPrincipal) * 100 : 0,
          monthlySIP,
          diversificationScore
        },
        addInvestment: (inv) => {
          const id = crypto.randomUUID();
          db.run(
            `INSERT INTO investments (id, name, type, principal, current_value, units, monthly_sip, start_date, maturity_date, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, inv.name, inv.type, inv.principal, inv.current_value, inv.units, inv.monthly_sip, inv.start_date, inv.maturity_date, inv.notes]
          );
          if (inv.principal > 0) {
            db.run(`INSERT INTO investment_transactions (id, investment_id, type, amount, date, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
              [crypto.randomUUID(), id, 'lumpsum', inv.principal, inv.start_date, new Date().toISOString()]);
          }
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
        }
      };
    } catch (e) {
      console.error("Wealth error:", e);
      return emptyState;
    }
  }, [db, tick, persist]);
}

