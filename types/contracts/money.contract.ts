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

/**
 * MONEY MODULE — PUBLIC CONTRACT
 */
export interface MoneyTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string | null;
  date: string;
  payment_method?: string | null;
  tags?: string | null;
  created_at?: string;
}

export interface MoneyBudget {
  id: string;
  category: string;
  limit_amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  created_at?: string;
}
