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

import { Investment, InvestmentTransaction } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { useMemo, useCallback, useState } from 'react';
import { saveVault } from '@/lib/vault';

export interface InvestData {
  investments: Investment[];
  getTransactions: (investmentId: string) => InvestmentTransaction[];
  summary: {
    totalPrincipal: number;
    currentValue: number;
    profit: number;
    pnlPercent: number;
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
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return useMemo<InvestData>(() => {
    const emptyState = { 
      investments: [], 
      getTransactions: () => [],
      summary: { totalPrincipal: 0, currentValue: 0, profit: 0, pnlPercent: 0 },
      addInvestment: () => {},
      addTransaction: () => {},
      updateValuation: () => {}
    };

    if (!db) return emptyState;

    try {
      const investments = runQuery<Investment>(db, "SELECT * FROM investments ORDER BY current_value DESC");
      // Calculate true principal from transactions
      
      const transactions = runQuery<InvestmentTransaction>(db, "SELECT * FROM investment_transactions ORDER BY date DESC");

      const enrichedInvestments = investments.map(inv => {
        const invTx = transactions.filter(t => t.investment_id === inv.id);
        const calculatedPrincipal = invTx.reduce((sum, t) => {
          if (t.type === 'sip' || t.type === 'lumpsum') return sum + t.amount;
          if (t.type === 'withdrawal') return sum - t.amount;
          return sum; // valuation doesn't affect principal
        }, 0);
        return { ...inv, principal: calculatedPrincipal > 0 ? calculatedPrincipal : inv.principal };
      });

      const totalPrincipal = enrichedInvestments.reduce((acc, i) => acc + i.principal, 0);
      const currentValue = enrichedInvestments.reduce((acc, i) => acc + i.current_value, 0);
      const profit = currentValue - totalPrincipal;
      const pnlPercent = totalPrincipal > 0 ? (profit / totalPrincipal) * 100 : 0;

      const getTransactions = (investmentId: string) => {
        return transactions.filter(t => t.investment_id === investmentId);
      };

      const addInvestment = (inv: Omit<Investment, 'id' | 'created_at'>) => {
        const id = crypto.randomUUID();
        db.run(
          `INSERT INTO investments (id, name, type, principal, current_value, units, monthly_sip, start_date, maturity_date, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, inv.name, inv.type, inv.principal, inv.current_value, inv.units || null, inv.monthly_sip || null, inv.start_date, inv.maturity_date || null, inv.notes || null]
        );
        
        // Auto-add initial transaction if principal > 0
        if (inv.principal > 0) {
          db.run(
            `INSERT INTO investment_transactions (id, investment_id, type, amount, date, notes, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), id, 'lumpsum', inv.principal, inv.start_date, 'Initial Investment', new Date().toISOString()]
          );
        }
        persist();
      };

      const addTransaction = (tx: Omit<InvestmentTransaction, 'id' | 'created_at'>) => {
        db.run(
          `INSERT INTO investment_transactions (id, investment_id, type, amount, date, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), tx.investment_id, tx.type, tx.amount, tx.date, tx.notes || null, new Date().toISOString()]
        );
        persist();
      };

      const updateValuation = (investmentId: string, newValue: number, notes?: string) => {
        db.run("UPDATE investments SET current_value = ? WHERE id = ?", [newValue, investmentId]);
        
        db.run(
          `INSERT INTO investment_transactions (id, investment_id, type, amount, date, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), investmentId, 'valuation', newValue, new Date().toISOString(), notes || 'Valuation Update', new Date().toISOString()]
        );
        persist();
      };

      return {
        investments: enrichedInvestments,
        getTransactions,
        summary: {
          totalPrincipal,
          currentValue,
          profit,
          pnlPercent
        },
        addInvestment,
        addTransaction,
        updateValuation
      };
    } catch (e) {
      console.error("useInvest err:", e);
      return emptyState;
    }
  }, [db, tick, persist]);
}
