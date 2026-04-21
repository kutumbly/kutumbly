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

/**
 * SUVIDHA MODULE — PUBLIC CONTRACT
 */
export interface SuvidhaVendor {
  id: string;
  name: string;
  service_type: string;
  contact?: string | null;
  rate_per_unit: number;
  unit_label: string;
  billing_cycle: 'daily' | 'monthly' | 'per_visit';
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface SuvidhaLog {
  id: string;
  vendor_id: string;
  date: string;
  quantity: number;
  amount: number;
  note?: string | null;
  created_at?: string;
}
