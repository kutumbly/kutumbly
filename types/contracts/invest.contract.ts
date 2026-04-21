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

import { Investment, InvestmentTransaction, InvestmentGoal } from '../db';

/**
 * INVEST HUB CONTRACT
 * Defines the public API for the Wealth & Portfolio module.
 */
export interface InvestContract {
  // Holdings
  investments: Investment[];
  summary: {
    currentValue: number;
    investedPrincipal: number;
    gainLoss: number;
    gainLossPercentage: number;
    taxFreePotential: number; // 80C
    goldWeightGrams: number;
    monthlySIP: number;
  };
  addInvestment: (investment: Omit<Investment, 'id' | 'created_at' | 'updated_at'>) => void;
  editInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;

  // Transactions / Ledger
  addTransaction: (tx: Omit<InvestmentTransaction, 'id' | 'created_at'>) => void;
  getTransactions: (investment_id: string) => InvestmentTransaction[];
  updateValuation: (investment_id: string, newValue: number, notes?: string) => void;

  // Goals
  goals: InvestmentGoal[];
  addGoal: (goal: Omit<InvestmentGoal, 'id' | 'created_at' | 'current_progress'>) => void;
  editGoal: (id: string, updates: Partial<InvestmentGoal>) => void;
  deleteGoal: (id: string) => void;

  // Analytics
  getWealthProjection: (years: number) => Array<{ year: number; estimatedValue: number }>;
}
